"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateMetadataSchema = exports.AIEnhancementSchema = exports.AIEnhancementType = exports.GenerationRequestSchema = exports.GenerationResultSchema = exports.GeneratedFileSchema = exports.GenerationOptionsSchema = exports.CodeQualityLevel = exports.GenerationStrategy = exports.TargetLanguage = void 0;
const zod_1 = require("zod");
/**
 * Code Generation Types
 * AI-powered MCP code generation
 */
// Target Language
var TargetLanguage;
(function (TargetLanguage) {
    TargetLanguage["TypeScript"] = "typescript";
    TargetLanguage["Python"] = "python";
    TargetLanguage["Go"] = "go";
})(TargetLanguage || (exports.TargetLanguage = TargetLanguage = {}));
// Generation Strategy
var GenerationStrategy;
(function (GenerationStrategy) {
    GenerationStrategy["Direct"] = "direct";
    GenerationStrategy["Grouped"] = "grouped";
    GenerationStrategy["Optimized"] = "optimized";
})(GenerationStrategy || (exports.GenerationStrategy = GenerationStrategy = {}));
// Code Quality Level
var CodeQualityLevel;
(function (CodeQualityLevel) {
    CodeQualityLevel["Basic"] = "basic";
    CodeQualityLevel["Standard"] = "standard";
    CodeQualityLevel["Premium"] = "premium";
})(CodeQualityLevel || (exports.CodeQualityLevel = CodeQualityLevel = {}));
// Generation Options
exports.GenerationOptionsSchema = zod_1.z.object({
    language: zod_1.z.nativeEnum(TargetLanguage).default(TargetLanguage.TypeScript),
    strategy: zod_1.z.nativeEnum(GenerationStrategy).default(GenerationStrategy.Optimized),
    quality: zod_1.z.nativeEnum(CodeQualityLevel).default(CodeQualityLevel.Standard),
    includeTests: zod_1.z.boolean().default(true),
    includeDocs: zod_1.z.boolean().default(true),
    includeExamples: zod_1.z.boolean().default(true),
    securityHardening: zod_1.z.boolean().default(true),
    validateInput: zod_1.z.boolean().default(true),
    sanitizeOutput: zod_1.z.boolean().default(true),
    errorHandling: zod_1.z.enum(['basic', 'comprehensive']).default('comprehensive'),
    retryLogic: zod_1.z.boolean().default(true),
    rateLimit: zod_1.z.boolean().default(true),
    logging: zod_1.z.enum(['none', 'basic', 'detailed']).default('detailed'),
    aiEnhancement: zod_1.z.boolean().default(true), // Use AI to improve schemas
});
// Generated File
exports.GeneratedFileSchema = zod_1.z.object({
    path: zod_1.z.string(),
    content: zod_1.z.string(),
    type: zod_1.z.enum(['source', 'test', 'doc', 'config', 'deployment']),
    language: zod_1.z.string().optional(),
    size: zod_1.z.number().int().nonnegative(),
});
// Generation Result
exports.GenerationResultSchema = zod_1.z.object({
    success: zod_1.z.boolean(),
    spec: zod_1.z.custom(),
    files: zod_1.z.array(exports.GeneratedFileSchema),
    security: zod_1.z.custom().optional(),
    warnings: zod_1.z.array(zod_1.z.string()).default([]),
    errors: zod_1.z.array(zod_1.z.string()).default([]),
    metadata: zod_1.z.object({
        generatedAt: zod_1.z.date(),
        generator: zod_1.z.string(),
        version: zod_1.z.string(),
        duration: zod_1.z.number().positive(), // milliseconds
        tokensUsed: zod_1.z.number().int().nonnegative().optional(), // AI tokens
        enhancementsApplied: zod_1.z.array(zod_1.z.string()).default([]),
    }),
});
// Generation Request
exports.GenerationRequestSchema = zod_1.z.object({
    apiSchema: zod_1.z.custom(),
    options: exports.GenerationOptionsSchema.optional(),
    name: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    author: zod_1.z.string().optional(),
    version: zod_1.z.string().default('1.0.0'),
});
// AI Enhancement Types
var AIEnhancementType;
(function (AIEnhancementType) {
    AIEnhancementType["SchemaImprovement"] = "schema_improvement";
    AIEnhancementType["ErrorHandling"] = "error_handling";
    AIEnhancementType["InputValidation"] = "input_validation";
    AIEnhancementType["SecurityHardening"] = "security_hardening";
    AIEnhancementType["PerformanceOptimization"] = "performance_optimization";
    AIEnhancementType["CodeOrganization"] = "code_organization";
})(AIEnhancementType || (exports.AIEnhancementType = AIEnhancementType = {}));
// AI Enhancement
exports.AIEnhancementSchema = zod_1.z.object({
    type: zod_1.z.nativeEnum(AIEnhancementType),
    description: zod_1.z.string(),
    before: zod_1.z.string().optional(),
    after: zod_1.z.string().optional(),
    confidence: zod_1.z.number().min(0).max(1), // 0 to 1
    applied: zod_1.z.boolean().default(false),
});
// Template Metadata
exports.TemplateMetadataSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    description: zod_1.z.string(),
    category: zod_1.z.string(), // e.g., "Payment", "CRM", "Analytics"
    tags: zod_1.z.array(zod_1.z.string()).default([]),
    language: zod_1.z.nativeEnum(TargetLanguage),
    apiType: zod_1.z.string(),
    examples: zod_1.z.array(zod_1.z.string()).default([]),
    usageCount: zod_1.z.number().int().nonnegative().default(0),
    rating: zod_1.z.number().min(0).max(5).optional(),
    verified: zod_1.z.boolean().default(false),
});
//# sourceMappingURL=generation.js.map