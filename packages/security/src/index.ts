/**
 * Magic MCP Security Package
 * Security scanning and vulnerability detection
 */

export { CodeScanner } from './scanners/code-scanner.js';
export { SecurityScanner } from './scanners/security-scanner.js';

// Re-export types from shared
export type {
  SecurityFinding,
  SecurityScanResult,
  SecuritySeverity,
  VulnerabilityCategory,
  SecurityPolicy,
  ComplianceFramework,
  ComplianceRequirement,
  AuditLogEntry,
} from '@magic-mcp/shared';
