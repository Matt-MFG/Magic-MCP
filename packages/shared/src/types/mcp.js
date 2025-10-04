"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MCPServerRuntimeConfigSchema = exports.MCPServerSpecSchema = exports.MCPPromptSchema = exports.MCPResourceSchema = exports.MCPToolSchema = exports.MCPToolParameterSchema = exports.MCPServerConfigSchema = void 0;
const zod_1 = require("zod");
/**
 * Core MCP Types
 * Based on the Model Context Protocol specification
 */
// MCP Server Configuration
exports.MCPServerConfigSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100),
    version: zod_1.z.string().regex(/^\d+\.\d+\.\d+$/),
    description: zod_1.z.string().max(500),
    author: zod_1.z.string().optional(),
    license: zod_1.z.string().optional(),
    repository: zod_1.z.string().url().optional(),
    homepage: zod_1.z.string().url().optional(),
});
// MCP Tool Definition
exports.MCPToolParameterSchema = zod_1.z.object({
    name: zod_1.z.string(),
    description: zod_1.z.string(),
    type: zod_1.z.enum(['string', 'number', 'boolean', 'object', 'array']),
    required: zod_1.z.boolean().default(false),
    enum: zod_1.z.array(zod_1.z.string()).optional(),
    default: zod_1.z.unknown().optional(),
    properties: zod_1.z.record(zod_1.z.unknown()).optional(), // For nested objects
    items: zod_1.z.unknown().optional(), // For arrays
});
exports.MCPToolSchema = zod_1.z.object({
    name: zod_1.z.string().regex(/^[a-z][a-z0-9_]*$/), // snake_case convention
    description: zod_1.z.string().min(10).max(1000),
    inputSchema: zod_1.z.object({
        type: zod_1.z.literal('object'),
        properties: zod_1.z.record(exports.MCPToolParameterSchema),
        required: zod_1.z.array(zod_1.z.string()).optional(),
    }),
    handler: zod_1.z.string().optional(), // Function name in generated code
});
// MCP Resource Definition
exports.MCPResourceSchema = zod_1.z.object({
    uri: zod_1.z.string(),
    name: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    mimeType: zod_1.z.string().optional(),
});
// MCP Prompt Definition
exports.MCPPromptSchema = zod_1.z.object({
    name: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    arguments: zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string(),
        description: zod_1.z.string().optional(),
        required: zod_1.z.boolean().default(false),
    })).optional(),
});
// Complete MCP Server Specification
exports.MCPServerSpecSchema = zod_1.z.object({
    config: exports.MCPServerConfigSchema,
    tools: zod_1.z.array(exports.MCPToolSchema).default([]),
    resources: zod_1.z.array(exports.MCPResourceSchema).default([]),
    prompts: zod_1.z.array(exports.MCPPromptSchema).default([]),
});
// MCP Server Runtime Configuration
exports.MCPServerRuntimeConfigSchema = zod_1.z.object({
    transport: zod_1.z.enum(['stdio', 'http', 'sse']).default('stdio'),
    port: zod_1.z.number().int().min(1).max(65535).optional(),
    host: zod_1.z.string().optional(),
    cors: zod_1.z.boolean().default(false),
    authentication: zod_1.z.enum(['none', 'bearer', 'oauth2', 'apikey']).default('none'),
    rateLimit: zod_1.z.object({
        enabled: zod_1.z.boolean().default(false),
        requests: zod_1.z.number().int().positive().optional(),
        window: zod_1.z.number().int().positive().optional(), // in seconds
    }).optional(),
});
//# sourceMappingURL=mcp.js.map