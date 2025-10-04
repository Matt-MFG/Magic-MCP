import { z } from 'zod';
/**
 * Security Types
 * Security scanning, vulnerability detection, and compliance
 */
export declare enum SecuritySeverity {
    Critical = "critical",
    High = "high",
    Medium = "medium",
    Low = "low",
    Info = "info"
}
export declare enum VulnerabilityCategory {
    PromptInjection = "prompt_injection",
    SecretExposure = "secret_exposure",
    OverPrivileged = "over_privileged",
    InputValidation = "input_validation",
    OutputSanitization = "output_sanitization",
    RateLimiting = "rate_limiting",
    Authentication = "authentication",
    Authorization = "authorization",
    DataExposure = "data_exposure",
    DependencyVulnerability = "dependency_vulnerability",
    CodeInjection = "code_injection",
    PathTraversal = "path_traversal",
    InsecureDeserialization = "insecure_deserialization"
}
export declare const SecurityFindingSchema: z.ZodObject<{
    id: z.ZodString;
    category: z.ZodNativeEnum<typeof VulnerabilityCategory>;
    severity: z.ZodNativeEnum<typeof SecuritySeverity>;
    title: z.ZodString;
    description: z.ZodString;
    location: z.ZodOptional<z.ZodObject<{
        file: z.ZodString;
        line: z.ZodOptional<z.ZodNumber>;
        column: z.ZodOptional<z.ZodNumber>;
        snippet: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        file: string;
        line?: number | undefined;
        column?: number | undefined;
        snippet?: string | undefined;
    }, {
        file: string;
        line?: number | undefined;
        column?: number | undefined;
        snippet?: string | undefined;
    }>>;
    cwe: z.ZodOptional<z.ZodString>;
    cve: z.ZodOptional<z.ZodString>;
    remediation: z.ZodOptional<z.ZodString>;
    references: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    confidence: z.ZodDefault<z.ZodEnum<["high", "medium", "low"]>>;
}, "strip", z.ZodTypeAny, {
    description: string;
    title: string;
    id: string;
    category: VulnerabilityCategory;
    severity: SecuritySeverity;
    references: string[];
    confidence: "high" | "medium" | "low";
    location?: {
        file: string;
        line?: number | undefined;
        column?: number | undefined;
        snippet?: string | undefined;
    } | undefined;
    cwe?: string | undefined;
    cve?: string | undefined;
    remediation?: string | undefined;
}, {
    description: string;
    title: string;
    id: string;
    category: VulnerabilityCategory;
    severity: SecuritySeverity;
    location?: {
        file: string;
        line?: number | undefined;
        column?: number | undefined;
        snippet?: string | undefined;
    } | undefined;
    cwe?: string | undefined;
    cve?: string | undefined;
    remediation?: string | undefined;
    references?: string[] | undefined;
    confidence?: "high" | "medium" | "low" | undefined;
}>;
export type SecurityFinding = z.infer<typeof SecurityFindingSchema>;
export declare const SecurityScanResultSchema: z.ZodObject<{
    timestamp: z.ZodDate;
    scanner: z.ZodString;
    version: z.ZodString;
    findings: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        category: z.ZodNativeEnum<typeof VulnerabilityCategory>;
        severity: z.ZodNativeEnum<typeof SecuritySeverity>;
        title: z.ZodString;
        description: z.ZodString;
        location: z.ZodOptional<z.ZodObject<{
            file: z.ZodString;
            line: z.ZodOptional<z.ZodNumber>;
            column: z.ZodOptional<z.ZodNumber>;
            snippet: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            file: string;
            line?: number | undefined;
            column?: number | undefined;
            snippet?: string | undefined;
        }, {
            file: string;
            line?: number | undefined;
            column?: number | undefined;
            snippet?: string | undefined;
        }>>;
        cwe: z.ZodOptional<z.ZodString>;
        cve: z.ZodOptional<z.ZodString>;
        remediation: z.ZodOptional<z.ZodString>;
        references: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        confidence: z.ZodDefault<z.ZodEnum<["high", "medium", "low"]>>;
    }, "strip", z.ZodTypeAny, {
        description: string;
        title: string;
        id: string;
        category: VulnerabilityCategory;
        severity: SecuritySeverity;
        references: string[];
        confidence: "high" | "medium" | "low";
        location?: {
            file: string;
            line?: number | undefined;
            column?: number | undefined;
            snippet?: string | undefined;
        } | undefined;
        cwe?: string | undefined;
        cve?: string | undefined;
        remediation?: string | undefined;
    }, {
        description: string;
        title: string;
        id: string;
        category: VulnerabilityCategory;
        severity: SecuritySeverity;
        location?: {
            file: string;
            line?: number | undefined;
            column?: number | undefined;
            snippet?: string | undefined;
        } | undefined;
        cwe?: string | undefined;
        cve?: string | undefined;
        remediation?: string | undefined;
        references?: string[] | undefined;
        confidence?: "high" | "medium" | "low" | undefined;
    }>, "many">;
    summary: z.ZodObject<{
        critical: z.ZodNumber;
        high: z.ZodNumber;
        medium: z.ZodNumber;
        low: z.ZodNumber;
        info: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        info: number;
        critical: number;
        high: number;
        medium: number;
        low: number;
    }, {
        info: number;
        critical: number;
        high: number;
        medium: number;
        low: number;
    }>;
    score: z.ZodNumber;
    passed: z.ZodBoolean;
    duration: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    summary: {
        info: number;
        critical: number;
        high: number;
        medium: number;
        low: number;
    };
    version: string;
    timestamp: Date;
    scanner: string;
    findings: {
        description: string;
        title: string;
        id: string;
        category: VulnerabilityCategory;
        severity: SecuritySeverity;
        references: string[];
        confidence: "high" | "medium" | "low";
        location?: {
            file: string;
            line?: number | undefined;
            column?: number | undefined;
            snippet?: string | undefined;
        } | undefined;
        cwe?: string | undefined;
        cve?: string | undefined;
        remediation?: string | undefined;
    }[];
    score: number;
    passed: boolean;
    duration: number;
}, {
    summary: {
        info: number;
        critical: number;
        high: number;
        medium: number;
        low: number;
    };
    version: string;
    timestamp: Date;
    scanner: string;
    findings: {
        description: string;
        title: string;
        id: string;
        category: VulnerabilityCategory;
        severity: SecuritySeverity;
        location?: {
            file: string;
            line?: number | undefined;
            column?: number | undefined;
            snippet?: string | undefined;
        } | undefined;
        cwe?: string | undefined;
        cve?: string | undefined;
        remediation?: string | undefined;
        references?: string[] | undefined;
        confidence?: "high" | "medium" | "low" | undefined;
    }[];
    score: number;
    passed: boolean;
    duration: number;
}>;
export type SecurityScanResult = z.infer<typeof SecurityScanResultSchema>;
export declare enum ComplianceFramework {
    SOC2 = "soc2",
    HIPAA = "hipaa",
    PCI_DSS = "pci_dss",
    GDPR = "gdpr",
    ISO27001 = "iso27001",
    NIST = "nist"
}
export declare const ComplianceRequirementSchema: z.ZodObject<{
    id: z.ZodString;
    framework: z.ZodNativeEnum<typeof ComplianceFramework>;
    control: z.ZodString;
    description: z.ZodString;
    implemented: z.ZodBoolean;
    evidence: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    description: string;
    id: string;
    framework: ComplianceFramework;
    control: string;
    implemented: boolean;
    evidence?: string[] | undefined;
    notes?: string | undefined;
}, {
    description: string;
    id: string;
    framework: ComplianceFramework;
    control: string;
    implemented: boolean;
    evidence?: string[] | undefined;
    notes?: string | undefined;
}>;
export type ComplianceRequirement = z.infer<typeof ComplianceRequirementSchema>;
export declare const SecurityPolicySchema: z.ZodObject<{
    allowedEndpoints: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    blockedEndpoints: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    requireApprovalFor: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    secretsPolicy: z.ZodOptional<z.ZodObject<{
        allowSecretsInLogs: z.ZodDefault<z.ZodBoolean>;
        requireVaultStorage: z.ZodDefault<z.ZodBoolean>;
        rotationPeriodDays: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        allowSecretsInLogs: boolean;
        requireVaultStorage: boolean;
        rotationPeriodDays?: number | undefined;
    }, {
        allowSecretsInLogs?: boolean | undefined;
        requireVaultStorage?: boolean | undefined;
        rotationPeriodDays?: number | undefined;
    }>>;
    rateLimit: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        requestsPerMinute: z.ZodDefault<z.ZodNumber>;
        burstSize: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        requestsPerMinute: number;
        burstSize: number;
    }, {
        enabled?: boolean | undefined;
        requestsPerMinute?: number | undefined;
        burstSize?: number | undefined;
    }>>;
    ipWhitelist: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    ipBlacklist: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    minimumTlsVersion: z.ZodDefault<z.ZodEnum<["1.2", "1.3"]>>;
    dataRetentionDays: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    requireApprovalFor: string[];
    minimumTlsVersion: "1.2" | "1.3";
    dataRetentionDays: number;
    rateLimit?: {
        enabled: boolean;
        requestsPerMinute: number;
        burstSize: number;
    } | undefined;
    allowedEndpoints?: string[] | undefined;
    blockedEndpoints?: string[] | undefined;
    secretsPolicy?: {
        allowSecretsInLogs: boolean;
        requireVaultStorage: boolean;
        rotationPeriodDays?: number | undefined;
    } | undefined;
    ipWhitelist?: string[] | undefined;
    ipBlacklist?: string[] | undefined;
}, {
    rateLimit?: {
        enabled?: boolean | undefined;
        requestsPerMinute?: number | undefined;
        burstSize?: number | undefined;
    } | undefined;
    allowedEndpoints?: string[] | undefined;
    blockedEndpoints?: string[] | undefined;
    requireApprovalFor?: string[] | undefined;
    secretsPolicy?: {
        allowSecretsInLogs?: boolean | undefined;
        requireVaultStorage?: boolean | undefined;
        rotationPeriodDays?: number | undefined;
    } | undefined;
    ipWhitelist?: string[] | undefined;
    ipBlacklist?: string[] | undefined;
    minimumTlsVersion?: "1.2" | "1.3" | undefined;
    dataRetentionDays?: number | undefined;
}>;
export type SecurityPolicy = z.infer<typeof SecurityPolicySchema>;
export declare const AuditLogEntrySchema: z.ZodObject<{
    id: z.ZodString;
    timestamp: z.ZodDate;
    actor: z.ZodObject<{
        id: z.ZodString;
        type: z.ZodEnum<["user", "service", "system"]>;
        name: z.ZodOptional<z.ZodString>;
        ip: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: "user" | "service" | "system";
        id: string;
        name?: string | undefined;
        ip?: string | undefined;
    }, {
        type: "user" | "service" | "system";
        id: string;
        name?: string | undefined;
        ip?: string | undefined;
    }>;
    action: z.ZodString;
    resource: z.ZodObject<{
        type: z.ZodString;
        id: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: string;
        id: string;
        name?: string | undefined;
    }, {
        type: string;
        id: string;
        name?: string | undefined;
    }>;
    result: z.ZodEnum<["success", "failure", "denied"]>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    severity: z.ZodDefault<z.ZodEnum<["low", "medium", "high", "critical"]>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    severity: "critical" | "high" | "medium" | "low";
    timestamp: Date;
    actor: {
        type: "user" | "service" | "system";
        id: string;
        name?: string | undefined;
        ip?: string | undefined;
    };
    action: string;
    resource: {
        type: string;
        id: string;
        name?: string | undefined;
    };
    result: "success" | "failure" | "denied";
    metadata?: Record<string, unknown> | undefined;
}, {
    id: string;
    timestamp: Date;
    actor: {
        type: "user" | "service" | "system";
        id: string;
        name?: string | undefined;
        ip?: string | undefined;
    };
    action: string;
    resource: {
        type: string;
        id: string;
        name?: string | undefined;
    };
    result: "success" | "failure" | "denied";
    severity?: "critical" | "high" | "medium" | "low" | undefined;
    metadata?: Record<string, unknown> | undefined;
}>;
export type AuditLogEntry = z.infer<typeof AuditLogEntrySchema>;
//# sourceMappingURL=security.d.ts.map