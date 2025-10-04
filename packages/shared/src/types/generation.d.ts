import { z } from 'zod';
/**
 * Code Generation Types
 * AI-powered MCP code generation
 */
export declare enum TargetLanguage {
    TypeScript = "typescript",
    Python = "python",
    Go = "go"
}
export declare enum GenerationStrategy {
    Direct = "direct",// Direct API mapping
    Grouped = "grouped",// Group by tags/resources
    Optimized = "optimized"
}
export declare enum CodeQualityLevel {
    Basic = "basic",// Minimal code, fast generation
    Standard = "standard",// Good practices, moderate generation time
    Premium = "premium"
}
export declare const GenerationOptionsSchema: z.ZodObject<{
    language: z.ZodDefault<z.ZodNativeEnum<typeof TargetLanguage>>;
    strategy: z.ZodDefault<z.ZodNativeEnum<typeof GenerationStrategy>>;
    quality: z.ZodDefault<z.ZodNativeEnum<typeof CodeQualityLevel>>;
    includeTests: z.ZodDefault<z.ZodBoolean>;
    includeDocs: z.ZodDefault<z.ZodBoolean>;
    includeExamples: z.ZodDefault<z.ZodBoolean>;
    securityHardening: z.ZodDefault<z.ZodBoolean>;
    validateInput: z.ZodDefault<z.ZodBoolean>;
    sanitizeOutput: z.ZodDefault<z.ZodBoolean>;
    errorHandling: z.ZodDefault<z.ZodEnum<["basic", "comprehensive"]>>;
    retryLogic: z.ZodDefault<z.ZodBoolean>;
    rateLimit: z.ZodDefault<z.ZodBoolean>;
    logging: z.ZodDefault<z.ZodEnum<["none", "basic", "detailed"]>>;
    aiEnhancement: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    rateLimit: boolean;
    language: TargetLanguage;
    strategy: GenerationStrategy;
    quality: CodeQualityLevel;
    includeTests: boolean;
    includeDocs: boolean;
    includeExamples: boolean;
    securityHardening: boolean;
    validateInput: boolean;
    sanitizeOutput: boolean;
    errorHandling: "basic" | "comprehensive";
    retryLogic: boolean;
    logging: "none" | "basic" | "detailed";
    aiEnhancement: boolean;
}, {
    rateLimit?: boolean | undefined;
    language?: TargetLanguage | undefined;
    strategy?: GenerationStrategy | undefined;
    quality?: CodeQualityLevel | undefined;
    includeTests?: boolean | undefined;
    includeDocs?: boolean | undefined;
    includeExamples?: boolean | undefined;
    securityHardening?: boolean | undefined;
    validateInput?: boolean | undefined;
    sanitizeOutput?: boolean | undefined;
    errorHandling?: "basic" | "comprehensive" | undefined;
    retryLogic?: boolean | undefined;
    logging?: "none" | "basic" | "detailed" | undefined;
    aiEnhancement?: boolean | undefined;
}>;
export type GenerationOptions = z.infer<typeof GenerationOptionsSchema>;
export declare const GeneratedFileSchema: z.ZodObject<{
    path: z.ZodString;
    content: z.ZodString;
    type: z.ZodEnum<["source", "test", "doc", "config", "deployment"]>;
    language: z.ZodOptional<z.ZodString>;
    size: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    path: string;
    type: "config" | "source" | "test" | "doc" | "deployment";
    content: string;
    size: number;
    language?: string | undefined;
}, {
    path: string;
    type: "config" | "source" | "test" | "doc" | "deployment";
    content: string;
    size: number;
    language?: string | undefined;
}>;
export type GeneratedFile = z.infer<typeof GeneratedFileSchema>;
export declare const GenerationResultSchema: z.ZodObject<{
    success: z.ZodBoolean;
    spec: z.ZodType<{
        config: {
            description: string;
            name: string;
            version: string;
            license?: string | undefined;
            author?: string | undefined;
            repository?: string | undefined;
            homepage?: string | undefined;
        };
        tools: {
            description: string;
            name: string;
            inputSchema: {
                type: "object";
                properties: Record<string, {
                    type: "string" | "number" | "boolean" | "object" | "array";
                    description: string;
                    name: string;
                    required: boolean;
                    default?: unknown;
                    enum?: string[] | undefined;
                    properties?: Record<string, unknown> | undefined;
                    items?: unknown;
                }>;
                required?: string[] | undefined;
            };
            handler?: string | undefined;
        }[];
        resources: {
            name: string;
            uri: string;
            description?: string | undefined;
            mimeType?: string | undefined;
        }[];
        prompts: {
            name: string;
            description?: string | undefined;
            arguments?: {
                name: string;
                required: boolean;
                description?: string | undefined;
            }[] | undefined;
        }[];
    }, z.ZodTypeDef, {
        config: {
            description: string;
            name: string;
            version: string;
            license?: string | undefined;
            author?: string | undefined;
            repository?: string | undefined;
            homepage?: string | undefined;
        };
        tools: {
            description: string;
            name: string;
            inputSchema: {
                type: "object";
                properties: Record<string, {
                    type: "string" | "number" | "boolean" | "object" | "array";
                    description: string;
                    name: string;
                    required: boolean;
                    default?: unknown;
                    enum?: string[] | undefined;
                    properties?: Record<string, unknown> | undefined;
                    items?: unknown;
                }>;
                required?: string[] | undefined;
            };
            handler?: string | undefined;
        }[];
        resources: {
            name: string;
            uri: string;
            description?: string | undefined;
            mimeType?: string | undefined;
        }[];
        prompts: {
            name: string;
            description?: string | undefined;
            arguments?: {
                name: string;
                required: boolean;
                description?: string | undefined;
            }[] | undefined;
        }[];
    }>;
    files: z.ZodArray<z.ZodObject<{
        path: z.ZodString;
        content: z.ZodString;
        type: z.ZodEnum<["source", "test", "doc", "config", "deployment"]>;
        language: z.ZodOptional<z.ZodString>;
        size: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        path: string;
        type: "config" | "source" | "test" | "doc" | "deployment";
        content: string;
        size: number;
        language?: string | undefined;
    }, {
        path: string;
        type: "config" | "source" | "test" | "doc" | "deployment";
        content: string;
        size: number;
        language?: string | undefined;
    }>, "many">;
    security: z.ZodOptional<z.ZodType<{
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
            category: import("./security.js").VulnerabilityCategory;
            severity: import("./security.js").SecuritySeverity;
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
    }, z.ZodTypeDef, {
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
            category: import("./security.js").VulnerabilityCategory;
            severity: import("./security.js").SecuritySeverity;
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
    }>>;
    warnings: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    errors: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    metadata: z.ZodObject<{
        generatedAt: z.ZodDate;
        generator: z.ZodString;
        version: z.ZodString;
        duration: z.ZodNumber;
        tokensUsed: z.ZodOptional<z.ZodNumber>;
        enhancementsApplied: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        version: string;
        duration: number;
        generatedAt: Date;
        generator: string;
        enhancementsApplied: string[];
        tokensUsed?: number | undefined;
    }, {
        version: string;
        duration: number;
        generatedAt: Date;
        generator: string;
        tokensUsed?: number | undefined;
        enhancementsApplied?: string[] | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    warnings: string[];
    errors: string[];
    success: boolean;
    metadata: {
        version: string;
        duration: number;
        generatedAt: Date;
        generator: string;
        enhancementsApplied: string[];
        tokensUsed?: number | undefined;
    };
    spec: {
        config: {
            description: string;
            name: string;
            version: string;
            license?: string | undefined;
            author?: string | undefined;
            repository?: string | undefined;
            homepage?: string | undefined;
        };
        tools: {
            description: string;
            name: string;
            inputSchema: {
                type: "object";
                properties: Record<string, {
                    type: "string" | "number" | "boolean" | "object" | "array";
                    description: string;
                    name: string;
                    required: boolean;
                    default?: unknown;
                    enum?: string[] | undefined;
                    properties?: Record<string, unknown> | undefined;
                    items?: unknown;
                }>;
                required?: string[] | undefined;
            };
            handler?: string | undefined;
        }[];
        resources: {
            name: string;
            uri: string;
            description?: string | undefined;
            mimeType?: string | undefined;
        }[];
        prompts: {
            name: string;
            description?: string | undefined;
            arguments?: {
                name: string;
                required: boolean;
                description?: string | undefined;
            }[] | undefined;
        }[];
    };
    files: {
        path: string;
        type: "config" | "source" | "test" | "doc" | "deployment";
        content: string;
        size: number;
        language?: string | undefined;
    }[];
    security?: {
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
            category: import("./security.js").VulnerabilityCategory;
            severity: import("./security.js").SecuritySeverity;
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
    } | undefined;
}, {
    success: boolean;
    metadata: {
        version: string;
        duration: number;
        generatedAt: Date;
        generator: string;
        tokensUsed?: number | undefined;
        enhancementsApplied?: string[] | undefined;
    };
    spec: {
        config: {
            description: string;
            name: string;
            version: string;
            license?: string | undefined;
            author?: string | undefined;
            repository?: string | undefined;
            homepage?: string | undefined;
        };
        tools: {
            description: string;
            name: string;
            inputSchema: {
                type: "object";
                properties: Record<string, {
                    type: "string" | "number" | "boolean" | "object" | "array";
                    description: string;
                    name: string;
                    required: boolean;
                    default?: unknown;
                    enum?: string[] | undefined;
                    properties?: Record<string, unknown> | undefined;
                    items?: unknown;
                }>;
                required?: string[] | undefined;
            };
            handler?: string | undefined;
        }[];
        resources: {
            name: string;
            uri: string;
            description?: string | undefined;
            mimeType?: string | undefined;
        }[];
        prompts: {
            name: string;
            description?: string | undefined;
            arguments?: {
                name: string;
                required: boolean;
                description?: string | undefined;
            }[] | undefined;
        }[];
    };
    files: {
        path: string;
        type: "config" | "source" | "test" | "doc" | "deployment";
        content: string;
        size: number;
        language?: string | undefined;
    }[];
    security?: {
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
            category: import("./security.js").VulnerabilityCategory;
            severity: import("./security.js").SecuritySeverity;
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
    } | undefined;
    warnings?: string[] | undefined;
    errors?: string[] | undefined;
}>;
export type GenerationResult = z.infer<typeof GenerationResultSchema>;
export declare const GenerationRequestSchema: z.ZodObject<{
    apiSchema: z.ZodType<{
        type: import("./api.js").APIType;
        tags: {
            name: string;
            description?: string | undefined;
        }[];
        version: string;
        info: {
            version: string;
            title: string;
            description?: string | undefined;
            termsOfService?: string | undefined;
            contact?: {
                name?: string | undefined;
                url?: string | undefined;
                email?: string | undefined;
            } | undefined;
            license?: {
                name: string;
                url?: string | undefined;
            } | undefined;
        };
        servers: {
            url: string;
            description?: string | undefined;
            variables?: Record<string, {
                default: string;
                description?: string | undefined;
                enum?: string[] | undefined;
            }> | undefined;
        }[];
        endpoints: {
            path: string;
            method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS" | "TRACE";
            tags: string[];
            parameters: {
                name: string;
                in: "path" | "query" | "header" | "cookie";
                required: boolean;
                schema: Record<string, unknown>;
                description?: string | undefined;
            }[];
            responses: Record<string, {
                description: string;
                content?: Record<string, unknown> | undefined;
            }>;
            deprecated: boolean;
            operationId?: string | undefined;
            summary?: string | undefined;
            description?: string | undefined;
            requestBody?: {
                required: boolean;
                content: Record<string, unknown>;
            } | undefined;
            security?: Record<string, string[]>[] | undefined;
        }[];
        authentication?: {
            type: "none" | "apiKey" | "bearer" | "oauth2" | "basic" | "digest" | "mutual_tls";
            config?: Record<string, unknown> | undefined;
        } | undefined;
        externalDocs?: {
            url: string;
            description?: string | undefined;
        } | undefined;
    }, z.ZodTypeDef, {
        type: import("./api.js").APIType;
        tags: {
            name: string;
            description?: string | undefined;
        }[];
        version: string;
        info: {
            version: string;
            title: string;
            description?: string | undefined;
            termsOfService?: string | undefined;
            contact?: {
                name?: string | undefined;
                url?: string | undefined;
                email?: string | undefined;
            } | undefined;
            license?: {
                name: string;
                url?: string | undefined;
            } | undefined;
        };
        servers: {
            url: string;
            description?: string | undefined;
            variables?: Record<string, {
                default: string;
                description?: string | undefined;
                enum?: string[] | undefined;
            }> | undefined;
        }[];
        endpoints: {
            path: string;
            method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS" | "TRACE";
            tags: string[];
            parameters: {
                name: string;
                in: "path" | "query" | "header" | "cookie";
                required: boolean;
                schema: Record<string, unknown>;
                description?: string | undefined;
            }[];
            responses: Record<string, {
                description: string;
                content?: Record<string, unknown> | undefined;
            }>;
            deprecated: boolean;
            operationId?: string | undefined;
            summary?: string | undefined;
            description?: string | undefined;
            requestBody?: {
                required: boolean;
                content: Record<string, unknown>;
            } | undefined;
            security?: Record<string, string[]>[] | undefined;
        }[];
        authentication?: {
            type: "none" | "apiKey" | "bearer" | "oauth2" | "basic" | "digest" | "mutual_tls";
            config?: Record<string, unknown> | undefined;
        } | undefined;
        externalDocs?: {
            url: string;
            description?: string | undefined;
        } | undefined;
    }>;
    options: z.ZodOptional<z.ZodObject<{
        language: z.ZodDefault<z.ZodNativeEnum<typeof TargetLanguage>>;
        strategy: z.ZodDefault<z.ZodNativeEnum<typeof GenerationStrategy>>;
        quality: z.ZodDefault<z.ZodNativeEnum<typeof CodeQualityLevel>>;
        includeTests: z.ZodDefault<z.ZodBoolean>;
        includeDocs: z.ZodDefault<z.ZodBoolean>;
        includeExamples: z.ZodDefault<z.ZodBoolean>;
        securityHardening: z.ZodDefault<z.ZodBoolean>;
        validateInput: z.ZodDefault<z.ZodBoolean>;
        sanitizeOutput: z.ZodDefault<z.ZodBoolean>;
        errorHandling: z.ZodDefault<z.ZodEnum<["basic", "comprehensive"]>>;
        retryLogic: z.ZodDefault<z.ZodBoolean>;
        rateLimit: z.ZodDefault<z.ZodBoolean>;
        logging: z.ZodDefault<z.ZodEnum<["none", "basic", "detailed"]>>;
        aiEnhancement: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        rateLimit: boolean;
        language: TargetLanguage;
        strategy: GenerationStrategy;
        quality: CodeQualityLevel;
        includeTests: boolean;
        includeDocs: boolean;
        includeExamples: boolean;
        securityHardening: boolean;
        validateInput: boolean;
        sanitizeOutput: boolean;
        errorHandling: "basic" | "comprehensive";
        retryLogic: boolean;
        logging: "none" | "basic" | "detailed";
        aiEnhancement: boolean;
    }, {
        rateLimit?: boolean | undefined;
        language?: TargetLanguage | undefined;
        strategy?: GenerationStrategy | undefined;
        quality?: CodeQualityLevel | undefined;
        includeTests?: boolean | undefined;
        includeDocs?: boolean | undefined;
        includeExamples?: boolean | undefined;
        securityHardening?: boolean | undefined;
        validateInput?: boolean | undefined;
        sanitizeOutput?: boolean | undefined;
        errorHandling?: "basic" | "comprehensive" | undefined;
        retryLogic?: boolean | undefined;
        logging?: "none" | "basic" | "detailed" | undefined;
        aiEnhancement?: boolean | undefined;
    }>>;
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    author: z.ZodOptional<z.ZodString>;
    version: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    version: string;
    apiSchema: {
        type: import("./api.js").APIType;
        tags: {
            name: string;
            description?: string | undefined;
        }[];
        version: string;
        info: {
            version: string;
            title: string;
            description?: string | undefined;
            termsOfService?: string | undefined;
            contact?: {
                name?: string | undefined;
                url?: string | undefined;
                email?: string | undefined;
            } | undefined;
            license?: {
                name: string;
                url?: string | undefined;
            } | undefined;
        };
        servers: {
            url: string;
            description?: string | undefined;
            variables?: Record<string, {
                default: string;
                description?: string | undefined;
                enum?: string[] | undefined;
            }> | undefined;
        }[];
        endpoints: {
            path: string;
            method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS" | "TRACE";
            tags: string[];
            parameters: {
                name: string;
                in: "path" | "query" | "header" | "cookie";
                required: boolean;
                schema: Record<string, unknown>;
                description?: string | undefined;
            }[];
            responses: Record<string, {
                description: string;
                content?: Record<string, unknown> | undefined;
            }>;
            deprecated: boolean;
            operationId?: string | undefined;
            summary?: string | undefined;
            description?: string | undefined;
            requestBody?: {
                required: boolean;
                content: Record<string, unknown>;
            } | undefined;
            security?: Record<string, string[]>[] | undefined;
        }[];
        authentication?: {
            type: "none" | "apiKey" | "bearer" | "oauth2" | "basic" | "digest" | "mutual_tls";
            config?: Record<string, unknown> | undefined;
        } | undefined;
        externalDocs?: {
            url: string;
            description?: string | undefined;
        } | undefined;
    };
    options?: {
        rateLimit: boolean;
        language: TargetLanguage;
        strategy: GenerationStrategy;
        quality: CodeQualityLevel;
        includeTests: boolean;
        includeDocs: boolean;
        includeExamples: boolean;
        securityHardening: boolean;
        validateInput: boolean;
        sanitizeOutput: boolean;
        errorHandling: "basic" | "comprehensive";
        retryLogic: boolean;
        logging: "none" | "basic" | "detailed";
        aiEnhancement: boolean;
    } | undefined;
    description?: string | undefined;
    name?: string | undefined;
    author?: string | undefined;
}, {
    apiSchema: {
        type: import("./api.js").APIType;
        tags: {
            name: string;
            description?: string | undefined;
        }[];
        version: string;
        info: {
            version: string;
            title: string;
            description?: string | undefined;
            termsOfService?: string | undefined;
            contact?: {
                name?: string | undefined;
                url?: string | undefined;
                email?: string | undefined;
            } | undefined;
            license?: {
                name: string;
                url?: string | undefined;
            } | undefined;
        };
        servers: {
            url: string;
            description?: string | undefined;
            variables?: Record<string, {
                default: string;
                description?: string | undefined;
                enum?: string[] | undefined;
            }> | undefined;
        }[];
        endpoints: {
            path: string;
            method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS" | "TRACE";
            tags: string[];
            parameters: {
                name: string;
                in: "path" | "query" | "header" | "cookie";
                required: boolean;
                schema: Record<string, unknown>;
                description?: string | undefined;
            }[];
            responses: Record<string, {
                description: string;
                content?: Record<string, unknown> | undefined;
            }>;
            deprecated: boolean;
            operationId?: string | undefined;
            summary?: string | undefined;
            description?: string | undefined;
            requestBody?: {
                required: boolean;
                content: Record<string, unknown>;
            } | undefined;
            security?: Record<string, string[]>[] | undefined;
        }[];
        authentication?: {
            type: "none" | "apiKey" | "bearer" | "oauth2" | "basic" | "digest" | "mutual_tls";
            config?: Record<string, unknown> | undefined;
        } | undefined;
        externalDocs?: {
            url: string;
            description?: string | undefined;
        } | undefined;
    };
    options?: {
        rateLimit?: boolean | undefined;
        language?: TargetLanguage | undefined;
        strategy?: GenerationStrategy | undefined;
        quality?: CodeQualityLevel | undefined;
        includeTests?: boolean | undefined;
        includeDocs?: boolean | undefined;
        includeExamples?: boolean | undefined;
        securityHardening?: boolean | undefined;
        validateInput?: boolean | undefined;
        sanitizeOutput?: boolean | undefined;
        errorHandling?: "basic" | "comprehensive" | undefined;
        retryLogic?: boolean | undefined;
        logging?: "none" | "basic" | "detailed" | undefined;
        aiEnhancement?: boolean | undefined;
    } | undefined;
    description?: string | undefined;
    name?: string | undefined;
    version?: string | undefined;
    author?: string | undefined;
}>;
export type GenerationRequest = z.infer<typeof GenerationRequestSchema>;
export declare enum AIEnhancementType {
    SchemaImprovement = "schema_improvement",// Improve API schema descriptions
    ErrorHandling = "error_handling",// Add better error handling
    InputValidation = "input_validation",// Enhance input validation
    SecurityHardening = "security_hardening",// Security improvements
    PerformanceOptimization = "performance_optimization",// Performance tweaks
    CodeOrganization = "code_organization"
}
export declare const AIEnhancementSchema: z.ZodObject<{
    type: z.ZodNativeEnum<typeof AIEnhancementType>;
    description: z.ZodString;
    before: z.ZodOptional<z.ZodString>;
    after: z.ZodOptional<z.ZodString>;
    confidence: z.ZodNumber;
    applied: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    type: AIEnhancementType;
    description: string;
    confidence: number;
    applied: boolean;
    before?: string | undefined;
    after?: string | undefined;
}, {
    type: AIEnhancementType;
    description: string;
    confidence: number;
    before?: string | undefined;
    after?: string | undefined;
    applied?: boolean | undefined;
}>;
export type AIEnhancement = z.infer<typeof AIEnhancementSchema>;
export declare const TemplateMetadataSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodString;
    category: z.ZodString;
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    language: z.ZodNativeEnum<typeof TargetLanguage>;
    apiType: z.ZodString;
    examples: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    usageCount: z.ZodDefault<z.ZodNumber>;
    rating: z.ZodOptional<z.ZodNumber>;
    verified: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    description: string;
    tags: string[];
    name: string;
    id: string;
    category: string;
    language: TargetLanguage;
    apiType: string;
    examples: string[];
    usageCount: number;
    verified: boolean;
    rating?: number | undefined;
}, {
    description: string;
    name: string;
    id: string;
    category: string;
    language: TargetLanguage;
    apiType: string;
    tags?: string[] | undefined;
    examples?: string[] | undefined;
    usageCount?: number | undefined;
    rating?: number | undefined;
    verified?: boolean | undefined;
}>;
export type TemplateMetadata = z.infer<typeof TemplateMetadataSchema>;
//# sourceMappingURL=generation.d.ts.map