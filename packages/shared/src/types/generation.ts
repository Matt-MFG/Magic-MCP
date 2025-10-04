import { z } from 'zod';

import type { APISchema } from './api.js';
import type { MCPServerSpec } from './mcp.js';
import type { SecurityScanResult } from './security.js';

/**
 * Code Generation Types
 * AI-powered MCP code generation
 */

// Target Language
export enum TargetLanguage {
  TypeScript = 'typescript',
  Python = 'python',
  Go = 'go',
}

// Generation Strategy
export enum GenerationStrategy {
  Direct = 'direct', // Direct API mapping
  Grouped = 'grouped', // Group by tags/resources
  Optimized = 'optimized', // AI-optimized organization
}

// Code Quality Level
export enum CodeQualityLevel {
  Basic = 'basic', // Minimal code, fast generation
  Standard = 'standard', // Good practices, moderate generation time
  Premium = 'premium', // Best practices, thorough generation
}

// Generation Options
export const GenerationOptionsSchema = z.object({
  language: z.nativeEnum(TargetLanguage).default(TargetLanguage.TypeScript),
  strategy: z.nativeEnum(GenerationStrategy).default(GenerationStrategy.Optimized),
  quality: z.nativeEnum(CodeQualityLevel).default(CodeQualityLevel.Standard),
  includeTests: z.boolean().default(true),
  includeDocs: z.boolean().default(true),
  includeExamples: z.boolean().default(true),
  securityHardening: z.boolean().default(true),
  validateInput: z.boolean().default(true),
  sanitizeOutput: z.boolean().default(true),
  errorHandling: z.enum(['basic', 'comprehensive']).default('comprehensive'),
  retryLogic: z.boolean().default(true),
  rateLimit: z.boolean().default(true),
  logging: z.enum(['none', 'basic', 'detailed']).default('detailed'),
  aiEnhancement: z.boolean().default(true), // Use AI to improve schemas
});

export type GenerationOptions = z.infer<typeof GenerationOptionsSchema>;

// Generated File
export const GeneratedFileSchema = z.object({
  path: z.string(),
  content: z.string(),
  type: z.enum(['source', 'test', 'doc', 'config', 'deployment']),
  language: z.string().optional(),
  size: z.number().int().nonnegative(),
});

export type GeneratedFile = z.infer<typeof GeneratedFileSchema>;

// Generation Result
export const GenerationResultSchema = z.object({
  success: z.boolean(),
  spec: z.custom<MCPServerSpec>(),
  files: z.array(GeneratedFileSchema),
  security: z.custom<SecurityScanResult>().optional(),
  warnings: z.array(z.string()).default([]),
  errors: z.array(z.string()).default([]),
  metadata: z.object({
    generatedAt: z.date(),
    generator: z.string(),
    version: z.string(),
    duration: z.number().positive(), // milliseconds
    tokensUsed: z.number().int().nonnegative().optional(), // AI tokens
    enhancementsApplied: z.array(z.string()).default([]),
  }),
});

export type GenerationResult = z.infer<typeof GenerationResultSchema>;

// Generation Request
export const GenerationRequestSchema = z.object({
  apiSchema: z.custom<APISchema>(),
  options: GenerationOptionsSchema.optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  author: z.string().optional(),
  version: z.string().default('1.0.0'),
});

export type GenerationRequest = z.infer<typeof GenerationRequestSchema>;

// AI Enhancement Types
export enum AIEnhancementType {
  SchemaImprovement = 'schema_improvement', // Improve API schema descriptions
  ErrorHandling = 'error_handling', // Add better error handling
  InputValidation = 'input_validation', // Enhance input validation
  SecurityHardening = 'security_hardening', // Security improvements
  PerformanceOptimization = 'performance_optimization', // Performance tweaks
  CodeOrganization = 'code_organization', // Better code structure
}

// AI Enhancement
export const AIEnhancementSchema = z.object({
  type: z.nativeEnum(AIEnhancementType),
  description: z.string(),
  before: z.string().optional(),
  after: z.string().optional(),
  confidence: z.number().min(0).max(1), // 0 to 1
  applied: z.boolean().default(false),
});

export type AIEnhancement = z.infer<typeof AIEnhancementSchema>;

// Template Metadata
export const TemplateMetadataSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.string(), // e.g., "Payment", "CRM", "Analytics"
  tags: z.array(z.string()).default([]),
  language: z.nativeEnum(TargetLanguage),
  apiType: z.string(),
  examples: z.array(z.string()).default([]),
  usageCount: z.number().int().nonnegative().default(0),
  rating: z.number().min(0).max(5).optional(),
  verified: z.boolean().default(false),
});

export type TemplateMetadata = z.infer<typeof TemplateMetadataSchema>;
