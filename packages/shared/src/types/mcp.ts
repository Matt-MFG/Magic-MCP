import { z } from 'zod';

/**
 * Core MCP Types
 * Based on the Model Context Protocol specification
 */

// MCP Server Configuration
export const MCPServerConfigSchema = z.object({
  name: z.string().min(1).max(100),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  description: z.string().max(500),
  author: z.string().optional(),
  license: z.string().optional(),
  repository: z.string().url().optional(),
  homepage: z.string().url().optional(),
});

export type MCPServerConfig = z.infer<typeof MCPServerConfigSchema>;

// MCP Tool Definition
export const MCPToolParameterSchema = z.object({
  name: z.string(),
  description: z.string(),
  type: z.enum(['string', 'number', 'boolean', 'object', 'array']),
  required: z.boolean().default(false),
  enum: z.array(z.string()).optional(),
  default: z.unknown().optional(),
  properties: z.record(z.unknown()).optional(), // For nested objects
  items: z.unknown().optional(), // For arrays
});

export type MCPToolParameter = z.infer<typeof MCPToolParameterSchema>;

export const MCPToolSchema = z.object({
  name: z.string().regex(/^[a-z][a-z0-9_]*$/), // snake_case convention
  description: z.string().min(10).max(1000),
  inputSchema: z.object({
    type: z.literal('object'),
    properties: z.record(MCPToolParameterSchema),
    required: z.array(z.string()).optional(),
  }),
  handler: z.string().optional(), // Function name in generated code
});

export type MCPTool = z.infer<typeof MCPToolSchema>;

// MCP Resource Definition
export const MCPResourceSchema = z.object({
  uri: z.string(),
  name: z.string(),
  description: z.string().optional(),
  mimeType: z.string().optional(),
});

export type MCPResource = z.infer<typeof MCPResourceSchema>;

// MCP Prompt Definition
export const MCPPromptSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  arguments: z.array(
    z.object({
      name: z.string(),
      description: z.string().optional(),
      required: z.boolean().default(false),
    })
  ).optional(),
});

export type MCPPrompt = z.infer<typeof MCPPromptSchema>;

// Complete MCP Server Specification
export const MCPServerSpecSchema = z.object({
  config: MCPServerConfigSchema,
  tools: z.array(MCPToolSchema).default([]),
  resources: z.array(MCPResourceSchema).default([]),
  prompts: z.array(MCPPromptSchema).default([]),
});

export type MCPServerSpec = z.infer<typeof MCPServerSpecSchema>;

// MCP Server Runtime Configuration
export const MCPServerRuntimeConfigSchema = z.object({
  transport: z.enum(['stdio', 'http', 'sse']).default('stdio'),
  port: z.number().int().min(1).max(65535).optional(),
  host: z.string().optional(),
  cors: z.boolean().default(false),
  authentication: z.enum(['none', 'bearer', 'oauth2', 'apikey']).default('none'),
  rateLimit: z.object({
    enabled: z.boolean().default(false),
    requests: z.number().int().positive().optional(),
    window: z.number().int().positive().optional(), // in seconds
  }).optional(),
});

export type MCPServerRuntimeConfig = z.infer<typeof MCPServerRuntimeConfigSchema>;
