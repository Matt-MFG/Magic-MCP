/**
 * Magic MCP Generator Package
 * AI-powered MCP code generation
 */

export { GeminiClient } from './ai/gemini-client.js';
export { MCPGenerator } from './generator/mcp-generator.js';

export type { GeminiConfig, GenerateOptions, GenerateResult } from './ai/gemini-client.js';

// Re-export types from shared
export type {
  GenerationRequest,
  GenerationResult,
  GenerationOptions,
  GeneratedFile,
  TargetLanguage,
  GenerationStrategy,
  CodeQualityLevel,
} from '@magic-mcp/shared';
