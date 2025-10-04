"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogEntrySchema = exports.SecurityPolicySchema = exports.ComplianceRequirementSchema = exports.ComplianceFramework = exports.SecurityScanResultSchema = exports.SecurityFindingSchema = exports.VulnerabilityCategory = exports.SecuritySeverity = void 0;
const zod_1 = require("zod");
/**
 * Security Types
 * Security scanning, vulnerability detection, and compliance
 */
// Severity Levels
var SecuritySeverity;
(function (SecuritySeverity) {
    SecuritySeverity["Critical"] = "critical";
    SecuritySeverity["High"] = "high";
    SecuritySeverity["Medium"] = "medium";
    SecuritySeverity["Low"] = "low";
    SecuritySeverity["Info"] = "info";
})(SecuritySeverity || (exports.SecuritySeverity = SecuritySeverity = {}));
// Vulnerability Categories
var VulnerabilityCategory;
(function (VulnerabilityCategory) {
    VulnerabilityCategory["PromptInjection"] = "prompt_injection";
    VulnerabilityCategory["SecretExposure"] = "secret_exposure";
    VulnerabilityCategory["OverPrivileged"] = "over_privileged";
    VulnerabilityCategory["InputValidation"] = "input_validation";
    VulnerabilityCategory["OutputSanitization"] = "output_sanitization";
    VulnerabilityCategory["RateLimiting"] = "rate_limiting";
    VulnerabilityCategory["Authentication"] = "authentication";
    VulnerabilityCategory["Authorization"] = "authorization";
    VulnerabilityCategory["DataExposure"] = "data_exposure";
    VulnerabilityCategory["DependencyVulnerability"] = "dependency_vulnerability";
    VulnerabilityCategory["CodeInjection"] = "code_injection";
    VulnerabilityCategory["PathTraversal"] = "path_traversal";
    VulnerabilityCategory["InsecureDeserialization"] = "insecure_deserialization";
})(VulnerabilityCategory || (exports.VulnerabilityCategory = VulnerabilityCategory = {}));
// Security Finding
exports.SecurityFindingSchema = zod_1.z.object({
    id: zod_1.z.string(),
    category: zod_1.z.nativeEnum(VulnerabilityCategory),
    severity: zod_1.z.nativeEnum(SecuritySeverity),
    title: zod_1.z.string(),
    description: zod_1.z.string(),
    location: zod_1.z.object({
        file: zod_1.z.string(),
        line: zod_1.z.number().int().positive().optional(),
        column: zod_1.z.number().int().positive().optional(),
        snippet: zod_1.z.string().optional(),
    }).optional(),
    cwe: zod_1.z.string().optional(), // Common Weakness Enumeration
    cve: zod_1.z.string().optional(), // Common Vulnerabilities and Exposures
    remediation: zod_1.z.string().optional(),
    references: zod_1.z.array(zod_1.z.string().url()).default([]),
    confidence: zod_1.z.enum(['high', 'medium', 'low']).default('medium'),
});
// Security Scan Result
exports.SecurityScanResultSchema = zod_1.z.object({
    timestamp: zod_1.z.date(),
    scanner: zod_1.z.string(),
    version: zod_1.z.string(),
    findings: zod_1.z.array(exports.SecurityFindingSchema),
    summary: zod_1.z.object({
        critical: zod_1.z.number().int().nonnegative(),
        high: zod_1.z.number().int().nonnegative(),
        medium: zod_1.z.number().int().nonnegative(),
        low: zod_1.z.number().int().nonnegative(),
        info: zod_1.z.number().int().nonnegative(),
    }),
    score: zod_1.z.number().min(0).max(100), // 0 = worst, 100 = best
    passed: zod_1.z.boolean(),
    duration: zod_1.z.number().positive(), // milliseconds
});
// Compliance Framework
var ComplianceFramework;
(function (ComplianceFramework) {
    ComplianceFramework["SOC2"] = "soc2";
    ComplianceFramework["HIPAA"] = "hipaa";
    ComplianceFramework["PCI_DSS"] = "pci_dss";
    ComplianceFramework["GDPR"] = "gdpr";
    ComplianceFramework["ISO27001"] = "iso27001";
    ComplianceFramework["NIST"] = "nist";
})(ComplianceFramework || (exports.ComplianceFramework = ComplianceFramework = {}));
// Compliance Requirement
exports.ComplianceRequirementSchema = zod_1.z.object({
    id: zod_1.z.string(),
    framework: zod_1.z.nativeEnum(ComplianceFramework),
    control: zod_1.z.string(),
    description: zod_1.z.string(),
    implemented: zod_1.z.boolean(),
    evidence: zod_1.z.array(zod_1.z.string()).optional(),
    notes: zod_1.z.string().optional(),
});
// Security Policy
exports.SecurityPolicySchema = zod_1.z.object({
    allowedEndpoints: zod_1.z.array(zod_1.z.string().url()).optional(),
    blockedEndpoints: zod_1.z.array(zod_1.z.string().url()).optional(),
    requireApprovalFor: zod_1.z.array(zod_1.z.string()).default([]), // Tool names requiring approval
    secretsPolicy: zod_1.z.object({
        allowSecretsInLogs: zod_1.z.boolean().default(false),
        requireVaultStorage: zod_1.z.boolean().default(true),
        rotationPeriodDays: zod_1.z.number().int().positive().optional(),
    }).optional(),
    rateLimit: zod_1.z.object({
        enabled: zod_1.z.boolean().default(true),
        requestsPerMinute: zod_1.z.number().int().positive().default(60),
        burstSize: zod_1.z.number().int().positive().default(10),
    }).optional(),
    ipWhitelist: zod_1.z.array(zod_1.z.string()).optional(),
    ipBlacklist: zod_1.z.array(zod_1.z.string()).optional(),
    minimumTlsVersion: zod_1.z.enum(['1.2', '1.3']).default('1.2'),
    dataRetentionDays: zod_1.z.number().int().positive().default(90),
});
// Audit Log Entry
exports.AuditLogEntrySchema = zod_1.z.object({
    id: zod_1.z.string(),
    timestamp: zod_1.z.date(),
    actor: zod_1.z.object({
        id: zod_1.z.string(),
        type: zod_1.z.enum(['user', 'service', 'system']),
        name: zod_1.z.string().optional(),
        ip: zod_1.z.string().optional(),
    }),
    action: zod_1.z.string(),
    resource: zod_1.z.object({
        type: zod_1.z.string(),
        id: zod_1.z.string(),
        name: zod_1.z.string().optional(),
    }),
    result: zod_1.z.enum(['success', 'failure', 'denied']),
    metadata: zod_1.z.record(zod_1.z.unknown()).optional(),
    severity: zod_1.z.enum(['low', 'medium', 'high', 'critical']).default('low'),
});
//# sourceMappingURL=security.js.map