import { z } from 'zod';

/**
 * Security Types
 * Security scanning, vulnerability detection, and compliance
 */

// Severity Levels
export enum SecuritySeverity {
  Critical = 'critical',
  High = 'high',
  Medium = 'medium',
  Low = 'low',
  Info = 'info',
}

// Vulnerability Categories
export enum VulnerabilityCategory {
  PromptInjection = 'prompt_injection',
  SecretExposure = 'secret_exposure',
  OverPrivileged = 'over_privileged',
  InputValidation = 'input_validation',
  OutputSanitization = 'output_sanitization',
  RateLimiting = 'rate_limiting',
  Authentication = 'authentication',
  Authorization = 'authorization',
  DataExposure = 'data_exposure',
  DependencyVulnerability = 'dependency_vulnerability',
  CodeInjection = 'code_injection',
  PathTraversal = 'path_traversal',
  InsecureDeserialization = 'insecure_deserialization',
}

// Security Finding
export const SecurityFindingSchema = z.object({
  id: z.string(),
  category: z.nativeEnum(VulnerabilityCategory),
  severity: z.nativeEnum(SecuritySeverity),
  title: z.string(),
  description: z.string(),
  location: z.object({
    file: z.string(),
    line: z.number().int().positive().optional(),
    column: z.number().int().positive().optional(),
    snippet: z.string().optional(),
  }).optional(),
  cwe: z.string().optional(), // Common Weakness Enumeration
  cve: z.string().optional(), // Common Vulnerabilities and Exposures
  remediation: z.string().optional(),
  references: z.array(z.string().url()).default([]),
  confidence: z.enum(['high', 'medium', 'low']).default('medium'),
});

export type SecurityFinding = z.infer<typeof SecurityFindingSchema>;

// Security Scan Result
export const SecurityScanResultSchema = z.object({
  timestamp: z.date(),
  scanner: z.string(),
  version: z.string(),
  findings: z.array(SecurityFindingSchema),
  summary: z.object({
    critical: z.number().int().nonnegative(),
    high: z.number().int().nonnegative(),
    medium: z.number().int().nonnegative(),
    low: z.number().int().nonnegative(),
    info: z.number().int().nonnegative(),
  }),
  score: z.number().min(0).max(100), // 0 = worst, 100 = best
  passed: z.boolean(),
  duration: z.number().positive(), // milliseconds
});

export type SecurityScanResult = z.infer<typeof SecurityScanResultSchema>;

// Compliance Framework
export enum ComplianceFramework {
  SOC2 = 'soc2',
  HIPAA = 'hipaa',
  PCI_DSS = 'pci_dss',
  GDPR = 'gdpr',
  ISO27001 = 'iso27001',
  NIST = 'nist',
}

// Compliance Requirement
export const ComplianceRequirementSchema = z.object({
  id: z.string(),
  framework: z.nativeEnum(ComplianceFramework),
  control: z.string(),
  description: z.string(),
  implemented: z.boolean(),
  evidence: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

export type ComplianceRequirement = z.infer<typeof ComplianceRequirementSchema>;

// Security Policy
export const SecurityPolicySchema = z.object({
  allowedEndpoints: z.array(z.string().url()).optional(),
  blockedEndpoints: z.array(z.string().url()).optional(),
  requireApprovalFor: z.array(z.string()).default([]), // Tool names requiring approval
  secretsPolicy: z.object({
    allowSecretsInLogs: z.boolean().default(false),
    requireVaultStorage: z.boolean().default(true),
    rotationPeriodDays: z.number().int().positive().optional(),
  }).optional(),
  rateLimit: z.object({
    enabled: z.boolean().default(true),
    requestsPerMinute: z.number().int().positive().default(60),
    burstSize: z.number().int().positive().default(10),
  }).optional(),
  ipWhitelist: z.array(z.string()).optional(),
  ipBlacklist: z.array(z.string()).optional(),
  minimumTlsVersion: z.enum(['1.2', '1.3']).default('1.2'),
  dataRetentionDays: z.number().int().positive().default(90),
});

export type SecurityPolicy = z.infer<typeof SecurityPolicySchema>;

// Audit Log Entry
export const AuditLogEntrySchema = z.object({
  id: z.string(),
  timestamp: z.date(),
  actor: z.object({
    id: z.string(),
    type: z.enum(['user', 'service', 'system']),
    name: z.string().optional(),
    ip: z.string().optional(),
  }),
  action: z.string(),
  resource: z.object({
    type: z.string(),
    id: z.string(),
    name: z.string().optional(),
  }),
  result: z.enum(['success', 'failure', 'denied']),
  metadata: z.record(z.unknown()).optional(),
  severity: z.enum(['low', 'medium', 'high', 'critical']).default('low'),
});

export type AuditLogEntry = z.infer<typeof AuditLogEntrySchema>;
