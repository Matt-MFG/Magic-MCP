import {
  SecurityFinding,
  SecuritySeverity,
  VulnerabilityCategory,
  logger,
} from '@magic-mcp/shared';

/**
 * Code Security Scanner
 * Scans generated code for security vulnerabilities
 */

export class CodeScanner {
  /**
   * Scan code for security issues
   */
  async scan(code: string, filename: string): Promise<SecurityFinding[]> {
    logger.debug('Scanning code for security issues', { filename });

    const findings: SecurityFinding[] = [];

    // Run all security checks
    findings.push(...this.checkPromptInjection(code, filename));
    findings.push(...this.checkSecretExposure(code, filename));
    findings.push(...this.checkInputValidation(code, filename));
    findings.push(...this.checkOutputSanitization(code, filename));
    findings.push(...this.checkAuthenticationIssues(code, filename));
    findings.push(...this.checkRateLimiting(code, filename));
    findings.push(...this.checkErrorHandling(code, filename));

    logger.info('Code scan completed', {
      filename,
      findingCount: findings.length,
      critical: findings.filter((f) => f.severity === SecuritySeverity.Critical).length,
    });

    return findings;
  }

  /**
   * Check for prompt injection vulnerabilities
   */
  private checkPromptInjection(code: string, filename: string): SecurityFinding[] {
    const findings: SecurityFinding[] = [];

    // Check for direct string concatenation with user input
    const unsafePatterns = [
      /`\${.*?params\[.*?\].*?}`/g, // Template literals with direct param injection
      /\+\s*params\[/g, // String concatenation with params
      /prompt\s*=.*?params/g, // Prompt assignment from params without sanitization
    ];

    for (const pattern of unsafePatterns) {
      const matches = code.matchAll(pattern);
      for (const match of matches) {
        const line = this.getLineNumber(code, match.index || 0);
        findings.push({
          id: `PROMPT_INJECTION_${line}`,
          category: VulnerabilityCategory.PromptInjection,
          severity: SecuritySeverity.High,
          title: 'Potential Prompt Injection Vulnerability',
          description:
            'User input is directly concatenated into strings without sanitization. This could allow prompt injection attacks.',
          location: {
            file: filename,
            line,
            snippet: match[0],
          },
          cwe: 'CWE-74',
          remediation:
            'Sanitize user input before using in prompts. Use parameterized queries or escape special characters.',
          references: [
            'https://owasp.org/www-community/attacks/Command_Injection',
          ],
          confidence: 'medium',
        });
      }
    }

    return findings;
  }

  /**
   * Check for secret exposure
   */
  private checkSecretExposure(code: string, filename: string): SecurityFinding[] {
    const findings: SecurityFinding[] = [];

    // Check for hardcoded secrets
    const secretPatterns = [
      { pattern: /apikey\s*=\s*['"][^'"]{20,}['"]/gi, name: 'API Key' },
      { pattern: /api[_-]?key\s*:\s*['"][^'"]{20,}['"]/gi, name: 'API Key' },
      { pattern: /password\s*=\s*['"][^'"]+['"]/gi, name: 'Password' },
      { pattern: /secret\s*=\s*['"][^'"]{20,}['"]/gi, name: 'Secret' },
      { pattern: /bearer\s+[a-zA-Z0-9_-]{20,}/gi, name: 'Bearer Token' },
      { pattern: /sk_live_[a-zA-Z0-9]{24,}/g, name: 'Stripe Secret Key' },
      { pattern: /AIza[a-zA-Z0-9_-]{35}/g, name: 'Google API Key' },
    ];

    for (const { pattern, name } of secretPatterns) {
      const matches = code.matchAll(pattern);
      for (const match of matches) {
        // Skip if it's using environment variables
        if (match[0].includes('process.env') || match[0].includes('CONFIG.')) {
          continue;
        }

        const line = this.getLineNumber(code, match.index || 0);
        findings.push({
          id: `SECRET_EXPOSURE_${line}`,
          category: VulnerabilityCategory.SecretExposure,
          severity: SecuritySeverity.Critical,
          title: `Hardcoded ${name} Detected`,
          description: `A ${name} appears to be hardcoded in the source code. This is a critical security vulnerability.`,
          location: {
            file: filename,
            line,
            snippet: '[REDACTED]',
          },
          cwe: 'CWE-798',
          remediation:
            'Remove hardcoded secrets and use environment variables or a secret management service.',
          references: [
            'https://owasp.org/www-community/vulnerabilities/Use_of_hard-coded_password',
          ],
          confidence: 'high',
        });
      }
    }

    // Check for secrets in logs
    const logPatterns = [
      /console\.log\([^)]*apikey/gi,
      /console\.log\([^)]*password/gi,
      /console\.log\([^)]*secret/gi,
      /console\.log\([^)]*token/gi,
      /logger\.[a-z]+\([^)]*apikey/gi,
    ];

    for (const pattern of logPatterns) {
      const matches = code.matchAll(pattern);
      for (const match of matches) {
        const line = this.getLineNumber(code, match.index || 0);
        findings.push({
          id: `SECRET_IN_LOGS_${line}`,
          category: VulnerabilityCategory.SecretExposure,
          severity: SecuritySeverity.High,
          title: 'Potential Secret Logging',
          description:
            'Sensitive data may be logged. This could expose secrets in log files.',
          location: {
            file: filename,
            line,
            snippet: match[0],
          },
          cwe: 'CWE-532',
          remediation: 'Avoid logging sensitive data. Use log redaction if necessary.',
          references: [],
          confidence: 'medium',
        });
      }
    }

    return findings;
  }

  /**
   * Check for missing input validation
   */
  private checkInputValidation(code: string, filename: string): SecurityFinding[] {
    const findings: SecurityFinding[] = [];

    // Check if using validation (zod, joi, etc.)
    const hasValidation =
      code.includes('.parse(') ||
      code.includes('.validate(') ||
      code.includes('Schema.') ||
      code.includes('z.object');

    if (!hasValidation) {
      findings.push({
        id: 'MISSING_INPUT_VALIDATION',
        category: VulnerabilityCategory.InputValidation,
        severity: SecuritySeverity.Medium,
        title: 'Missing Input Validation',
        description:
          'No input validation library detected. User input should be validated before processing.',
        location: {
          file: filename,
        },
        cwe: 'CWE-20',
        remediation:
          'Implement input validation using a library like Zod, Joi, or similar. Validate all user inputs.',
        references: ['https://owasp.org/www-community/controls/Input_Validation'],
        confidence: 'low',
      });
    }

    return findings;
  }

  /**
   * Check for output sanitization issues
   */
  private checkOutputSanitization(code: string, filename: string): SecurityFinding[] {
    const findings: SecurityFinding[] = [];

    // Check for eval or similar dangerous functions
    const dangerousPatterns = [
      { pattern: /\beval\s*\(/g, name: 'eval()' },
      { pattern: /new\s+Function\s*\(/g, name: 'new Function()' },
      { pattern: /setTimeout\s*\(\s*['"][^'"]*`/g, name: 'setTimeout with template' },
    ];

    for (const { pattern, name } of dangerousPatterns) {
      const matches = code.matchAll(pattern);
      for (const match of matches) {
        const line = this.getLineNumber(code, match.index || 0);
        findings.push({
          id: `DANGEROUS_FUNCTION_${line}`,
          category: VulnerabilityCategory.CodeInjection,
          severity: SecuritySeverity.Critical,
          title: `Dangerous Function: ${name}`,
          description: `Use of ${name} can lead to code injection vulnerabilities.`,
          location: {
            file: filename,
            line,
            snippet: match[0],
          },
          cwe: 'CWE-95',
          remediation: `Avoid using ${name}. Use safer alternatives.`,
          references: [],
          confidence: 'high',
        });
      }
    }

    return findings;
  }

  /**
   * Check for authentication issues
   */
  private checkAuthenticationIssues(code: string, filename: string): SecurityFinding[] {
    const findings: SecurityFinding[] = [];

    // Check if authentication is implemented
    const hasAuth =
      code.includes('Authorization') ||
      code.includes('authenticate') ||
      code.includes('apiKey') ||
      code.includes('bearer');

    const hasApiCalls = code.includes('fetch(') || code.includes('axios.') || code.includes('request(');

    if (hasApiCalls && !hasAuth) {
      findings.push({
        id: 'MISSING_AUTHENTICATION',
        category: VulnerabilityCategory.Authentication,
        severity: SecuritySeverity.Medium,
        title: 'Missing Authentication',
        description: 'API calls detected without apparent authentication mechanism.',
        location: {
          file: filename,
        },
        cwe: 'CWE-287',
        remediation: 'Implement proper authentication for API requests.',
        references: [],
        confidence: 'low',
      });
    }

    return findings;
  }

  /**
   * Check for rate limiting
   */
  private checkRateLimiting(code: string, filename: string): SecurityFinding[] {
    const findings: SecurityFinding[] = [];

    const hasRateLimiting =
      code.includes('rateLimit') ||
      code.includes('throttle') ||
      code.includes('rate-limit');

    const hasApiCalls = code.includes('fetch(') || code.includes('request(');

    if (hasApiCalls && !hasRateLimiting) {
      findings.push({
        id: 'MISSING_RATE_LIMITING',
        category: VulnerabilityCategory.RateLimiting,
        severity: SecuritySeverity.Low,
        title: 'Missing Rate Limiting',
        description: 'No rate limiting detected for API calls. This could lead to abuse.',
        location: {
          file: filename,
        },
        cwe: 'CWE-770',
        remediation: 'Implement rate limiting to prevent abuse and DoS attacks.',
        references: [],
        confidence: 'low',
      });
    }

    return findings;
  }

  /**
   * Check for proper error handling
   */
  private checkErrorHandling(code: string, filename: string): SecurityFinding[] {
    const findings: SecurityFinding[] = [];

    // Check for try-catch blocks
    const hasTryCatch = code.includes('try {') && code.includes('catch');

    // Check for async functions
    const hasAsync = code.includes('async ');

    if (hasAsync && !hasTryCatch) {
      findings.push({
        id: 'MISSING_ERROR_HANDLING',
        category: VulnerabilityCategory.CodeInjection,
        severity: SecuritySeverity.Low,
        title: 'Missing Error Handling',
        description:
          'Async functions detected without try-catch blocks. This could expose error details.',
        location: {
          file: filename,
        },
        cwe: 'CWE-755',
        remediation:
          'Add try-catch blocks to handle errors gracefully and avoid exposing sensitive information.',
        references: [],
        confidence: 'low',
      });
    }

    return findings;
  }

  /**
   * Get line number from character index
   */
  private getLineNumber(code: string, index: number): number {
    return code.substring(0, index).split('\n').length;
  }
}
