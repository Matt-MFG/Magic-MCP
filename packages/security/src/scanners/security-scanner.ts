import {
  SecurityScanResult,
  SecurityFinding,
  SecuritySeverity,
  GeneratedFile,
  logger,
} from '@magic-mcp/shared';

import { CodeScanner } from './code-scanner.js';

/**
 * Security Scanner
 * Orchestrates security scanning across all generated files
 */

export class SecurityScanner {
  private codeScanner: CodeScanner;

  constructor() {
    this.codeScanner = new CodeScanner();
  }

  /**
   * Scan all generated files for security issues
   */
  async scanFiles(files: GeneratedFile[]): Promise<SecurityScanResult> {
    const startTime = Date.now();
    logger.info('Starting security scan', { fileCount: files.length });

    const allFindings: SecurityFinding[] = [];

    // Scan each source file
    for (const file of files) {
      if (file.type === 'source') {
        const findings = await this.codeScanner.scan(file.content, file.path);
        allFindings.push(...findings);
      }
    }

    // Calculate summary
    const summary = this.calculateSummary(allFindings);

    // Calculate security score (0-100)
    const score = this.calculateScore(summary);

    // Determine if scan passed (no critical or high severity issues)
    const passed = summary.critical === 0 && summary.high === 0;

    const duration = Date.now() - startTime;

    logger.info('Security scan completed', {
      duration,
      findingCount: allFindings.length,
      score,
      passed,
    });

    return {
      timestamp: new Date(),
      scanner: '@magic-mcp/security',
      version: '0.1.0',
      findings: allFindings,
      summary,
      score,
      passed,
      duration,
    };
  }

  /**
   * Calculate summary statistics
   */
  private calculateSummary(findings: SecurityFinding[]): SecurityScanResult['summary'] {
    return {
      critical: findings.filter((f) => f.severity === SecuritySeverity.Critical).length,
      high: findings.filter((f) => f.severity === SecuritySeverity.High).length,
      medium: findings.filter((f) => f.severity === SecuritySeverity.Medium).length,
      low: findings.filter((f) => f.severity === SecuritySeverity.Low).length,
      info: findings.filter((f) => f.severity === SecuritySeverity.Info).length,
    };
  }

  /**
   * Calculate security score (0-100, higher is better)
   */
  private calculateScore(summary: SecurityScanResult['summary']): number {
    // Start with perfect score
    let score = 100;

    // Deduct points based on severity
    score -= summary.critical * 25; // Critical: -25 points each
    score -= summary.high * 10; // High: -10 points each
    score -= summary.medium * 3; // Medium: -3 points each
    score -= summary.low * 1; // Low: -1 point each
    // Info findings don't affect score

    // Clamp to 0-100 range
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Get recommended fixes for findings
   */
  getRecommendations(findings: SecurityFinding[]): string[] {
    const recommendations = new Set<string>();

    for (const finding of findings) {
      if (finding.remediation) {
        recommendations.add(finding.remediation);
      }
    }

    return Array.from(recommendations);
  }

  /**
   * Filter findings by severity
   */
  filterBySeverity(
    findings: SecurityFinding[],
    minSeverity: SecuritySeverity = SecuritySeverity.Low
  ): SecurityFinding[] {
    const severityOrder = [
      SecuritySeverity.Info,
      SecuritySeverity.Low,
      SecuritySeverity.Medium,
      SecuritySeverity.High,
      SecuritySeverity.Critical,
    ];

    const minIndex = severityOrder.indexOf(minSeverity);

    return findings.filter((f) => {
      const findingIndex = severityOrder.indexOf(f.severity);
      return findingIndex >= minIndex;
    });
  }
}
