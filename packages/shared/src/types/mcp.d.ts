import { z } from 'zod';
/**
 * Core MCP Types
 * Based on the Model Context Protocol specification
 */
export declare const MCPServerConfigSchema: z.ZodObject<{
    name: z.ZodString;
    version: z.ZodString;
    description: z.ZodString;
    author: z.ZodOptional<z.ZodString>;
    license: z.ZodOptional<z.ZodString>;
    repository: z.ZodOptional<z.ZodString>;
    homepage: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    description: string;
    name: string;
    version: string;
    license?: string | undefined;
    author?: string | undefined;
    repository?: string | undefined;
    homepage?: string | undefined;
}, {
    description: string;
    name: string;
    version: string;
    license?: string | undefined;
    author?: string | undefined;
    repository?: string | undefined;
    homepage?: string | undefined;
}>;
export type MCPServerConfig = z.infer<typeof MCPServerConfigSchema>;
export declare const MCPToolParameterSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    type: z.ZodEnum<["string", "number", "boolean", "object", "array"]>;
    required: z.ZodDefault<z.ZodBoolean>;
    enum: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    default: z.ZodOptional<z.ZodUnknown>;
    properties: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    items: z.ZodOptional<z.ZodUnknown>;
}, "strip", z.ZodTypeAny, {
    type: "string" | "number" | "boolean" | "object" | "array";
    description: string;
    name: string;
    required: boolean;
    default?: unknown;
    enum?: string[] | undefined;
    properties?: Record<string, unknown> | undefined;
    items?: unknown;
}, {
    type: "string" | "number" | "boolean" | "object" | "array";
    description: string;
    name: string;
    required?: boolean | undefined;
    default?: unknown;
    enum?: string[] | undefined;
    properties?: Record<string, unknown> | undefined;
    items?: unknown;
}>;
export type MCPToolParameter = z.infer<typeof MCPToolParameterSchema>;
export declare const MCPToolSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    inputSchema: z.ZodObject<{
        type: z.ZodLiteral<"object">;
        properties: z.ZodRecord<z.ZodString, z.ZodObject<{
            name: z.ZodString;
            description: z.ZodString;
            type: z.ZodEnum<["string", "number", "boolean", "object", "array"]>;
            required: z.ZodDefault<z.ZodBoolean>;
            enum: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            default: z.ZodOptional<z.ZodUnknown>;
            properties: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            items: z.ZodOptional<z.ZodUnknown>;
        }, "strip", z.ZodTypeAny, {
            type: "string" | "number" | "boolean" | "object" | "array";
            description: string;
            name: string;
            required: boolean;
            default?: unknown;
            enum?: string[] | undefined;
            properties?: Record<string, unknown> | undefined;
            items?: unknown;
        }, {
            type: "string" | "number" | "boolean" | "object" | "array";
            description: string;
            name: string;
            required?: boolean | undefined;
            default?: unknown;
            enum?: string[] | undefined;
            properties?: Record<string, unknown> | undefined;
            items?: unknown;
        }>>;
        required: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
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
    }, {
        type: "object";
        properties: Record<string, {
            type: "string" | "number" | "boolean" | "object" | "array";
            description: string;
            name: string;
            required?: boolean | undefined;
            default?: unknown;
            enum?: string[] | undefined;
            properties?: Record<string, unknown> | undefined;
            items?: unknown;
        }>;
        required?: string[] | undefined;
    }>;
    handler: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
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
}, {
    description: string;
    name: string;
    inputSchema: {
        type: "object";
        properties: Record<string, {
            type: "string" | "number" | "boolean" | "object" | "array";
            description: string;
            name: string;
            required?: boolean | undefined;
            default?: unknown;
            enum?: string[] | undefined;
            properties?: Record<string, unknown> | undefined;
            items?: unknown;
        }>;
        required?: string[] | undefined;
    };
    handler?: string | undefined;
}>;
export type MCPTool = z.infer<typeof MCPToolSchema>;
export declare const MCPResourceSchema: z.ZodObject<{
    uri: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    mimeType: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    uri: string;
    description?: string | undefined;
    mimeType?: string | undefined;
}, {
    name: string;
    uri: string;
    description?: string | undefined;
    mimeType?: string | undefined;
}>;
export type MCPResource = z.infer<typeof MCPResourceSchema>;
export declare const MCPPromptSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    arguments: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        required: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        required: boolean;
        description?: string | undefined;
    }, {
        name: string;
        description?: string | undefined;
        required?: boolean | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description?: string | undefined;
    arguments?: {
        name: string;
        required: boolean;
        description?: string | undefined;
    }[] | undefined;
}, {
    name: string;
    description?: string | undefined;
    arguments?: {
        name: string;
        description?: string | undefined;
        required?: boolean | undefined;
    }[] | undefined;
}>;
export type MCPPrompt = z.infer<typeof MCPPromptSchema>;
export declare const MCPServerSpecSchema: z.ZodObject<{
    config: z.ZodObject<{
        name: z.ZodString;
        version: z.ZodString;
        description: z.ZodString;
        author: z.ZodOptional<z.ZodString>;
        license: z.ZodOptional<z.ZodString>;
        repository: z.ZodOptional<z.ZodString>;
        homepage: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        description: string;
        name: string;
        version: string;
        license?: string | undefined;
        author?: string | undefined;
        repository?: string | undefined;
        homepage?: string | undefined;
    }, {
        description: string;
        name: string;
        version: string;
        license?: string | undefined;
        author?: string | undefined;
        repository?: string | undefined;
        homepage?: string | undefined;
    }>;
    tools: z.ZodDefault<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodString;
        inputSchema: z.ZodObject<{
            type: z.ZodLiteral<"object">;
            properties: z.ZodRecord<z.ZodString, z.ZodObject<{
                name: z.ZodString;
                description: z.ZodString;
                type: z.ZodEnum<["string", "number", "boolean", "object", "array"]>;
                required: z.ZodDefault<z.ZodBoolean>;
                enum: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                default: z.ZodOptional<z.ZodUnknown>;
                properties: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
                items: z.ZodOptional<z.ZodUnknown>;
            }, "strip", z.ZodTypeAny, {
                type: "string" | "number" | "boolean" | "object" | "array";
                description: string;
                name: string;
                required: boolean;
                default?: unknown;
                enum?: string[] | undefined;
                properties?: Record<string, unknown> | undefined;
                items?: unknown;
            }, {
                type: "string" | "number" | "boolean" | "object" | "array";
                description: string;
                name: string;
                required?: boolean | undefined;
                default?: unknown;
                enum?: string[] | undefined;
                properties?: Record<string, unknown> | undefined;
                items?: unknown;
            }>>;
            required: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
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
        }, {
            type: "object";
            properties: Record<string, {
                type: "string" | "number" | "boolean" | "object" | "array";
                description: string;
                name: string;
                required?: boolean | undefined;
                default?: unknown;
                enum?: string[] | undefined;
                properties?: Record<string, unknown> | undefined;
                items?: unknown;
            }>;
            required?: string[] | undefined;
        }>;
        handler: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
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
    }, {
        description: string;
        name: string;
        inputSchema: {
            type: "object";
            properties: Record<string, {
                type: "string" | "number" | "boolean" | "object" | "array";
                description: string;
                name: string;
                required?: boolean | undefined;
                default?: unknown;
                enum?: string[] | undefined;
                properties?: Record<string, unknown> | undefined;
                items?: unknown;
            }>;
            required?: string[] | undefined;
        };
        handler?: string | undefined;
    }>, "many">>;
    resources: z.ZodDefault<z.ZodArray<z.ZodObject<{
        uri: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        mimeType: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        uri: string;
        description?: string | undefined;
        mimeType?: string | undefined;
    }, {
        name: string;
        uri: string;
        description?: string | undefined;
        mimeType?: string | undefined;
    }>, "many">>;
    prompts: z.ZodDefault<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        arguments: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            required: z.ZodDefault<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            required: boolean;
            description?: string | undefined;
        }, {
            name: string;
            description?: string | undefined;
            required?: boolean | undefined;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        description?: string | undefined;
        arguments?: {
            name: string;
            required: boolean;
            description?: string | undefined;
        }[] | undefined;
    }, {
        name: string;
        description?: string | undefined;
        arguments?: {
            name: string;
            description?: string | undefined;
            required?: boolean | undefined;
        }[] | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
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
}, {
    config: {
        description: string;
        name: string;
        version: string;
        license?: string | undefined;
        author?: string | undefined;
        repository?: string | undefined;
        homepage?: string | undefined;
    };
    tools?: {
        description: string;
        name: string;
        inputSchema: {
            type: "object";
            properties: Record<string, {
                type: "string" | "number" | "boolean" | "object" | "array";
                description: string;
                name: string;
                required?: boolean | undefined;
                default?: unknown;
                enum?: string[] | undefined;
                properties?: Record<string, unknown> | undefined;
                items?: unknown;
            }>;
            required?: string[] | undefined;
        };
        handler?: string | undefined;
    }[] | undefined;
    resources?: {
        name: string;
        uri: string;
        description?: string | undefined;
        mimeType?: string | undefined;
    }[] | undefined;
    prompts?: {
        name: string;
        description?: string | undefined;
        arguments?: {
            name: string;
            description?: string | undefined;
            required?: boolean | undefined;
        }[] | undefined;
    }[] | undefined;
}>;
export type MCPServerSpec = z.infer<typeof MCPServerSpecSchema>;
export declare const MCPServerRuntimeConfigSchema: z.ZodObject<{
    transport: z.ZodDefault<z.ZodEnum<["stdio", "http", "sse"]>>;
    port: z.ZodOptional<z.ZodNumber>;
    host: z.ZodOptional<z.ZodString>;
    cors: z.ZodDefault<z.ZodBoolean>;
    authentication: z.ZodDefault<z.ZodEnum<["none", "bearer", "oauth2", "apikey"]>>;
    rateLimit: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        requests: z.ZodOptional<z.ZodNumber>;
        window: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        requests?: number | undefined;
        window?: number | undefined;
    }, {
        enabled?: boolean | undefined;
        requests?: number | undefined;
        window?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    authentication: "none" | "bearer" | "oauth2" | "apikey";
    transport: "stdio" | "http" | "sse";
    cors: boolean;
    port?: number | undefined;
    host?: string | undefined;
    rateLimit?: {
        enabled: boolean;
        requests?: number | undefined;
        window?: number | undefined;
    } | undefined;
}, {
    authentication?: "none" | "bearer" | "oauth2" | "apikey" | undefined;
    transport?: "stdio" | "http" | "sse" | undefined;
    port?: number | undefined;
    host?: string | undefined;
    cors?: boolean | undefined;
    rateLimit?: {
        enabled?: boolean | undefined;
        requests?: number | undefined;
        window?: number | undefined;
    } | undefined;
}>;
export type MCPServerRuntimeConfig = z.infer<typeof MCPServerRuntimeConfigSchema>;
//# sourceMappingURL=mcp.d.ts.map