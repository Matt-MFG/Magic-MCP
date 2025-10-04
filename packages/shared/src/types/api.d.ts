import { z } from 'zod';
/**
 * API Schema Types
 * Support for various API specification formats
 */
export declare enum APIType {
    OpenAPI = "openapi",
    GraphQL = "graphql",
    GRPC = "grpc",
    REST = "rest",
    SOAP = "soap"
}
export declare enum OpenAPIVersion {
    V2 = "2.0",
    V3 = "3.0",
    V3_1 = "3.1"
}
export declare const HTTPMethodSchema: z.ZodEnum<["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS", "TRACE"]>;
export type HTTPMethod = z.infer<typeof HTTPMethodSchema>;
export declare const AuthTypeSchema: z.ZodEnum<["none", "apiKey", "bearer", "oauth2", "basic", "digest", "mutual_tls"]>;
export type AuthType = z.infer<typeof AuthTypeSchema>;
export declare const APIEndpointSchema: z.ZodObject<{
    path: z.ZodString;
    method: z.ZodEnum<["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS", "TRACE"]>;
    operationId: z.ZodOptional<z.ZodString>;
    summary: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    parameters: z.ZodDefault<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        in: z.ZodEnum<["query", "header", "path", "cookie"]>;
        required: z.ZodDefault<z.ZodBoolean>;
        description: z.ZodOptional<z.ZodString>;
        schema: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        in: "path" | "query" | "header" | "cookie";
        required: boolean;
        schema: Record<string, unknown>;
        description?: string | undefined;
    }, {
        name: string;
        in: "path" | "query" | "header" | "cookie";
        schema: Record<string, unknown>;
        description?: string | undefined;
        required?: boolean | undefined;
    }>, "many">>;
    requestBody: z.ZodOptional<z.ZodObject<{
        required: z.ZodDefault<z.ZodBoolean>;
        content: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    }, "strip", z.ZodTypeAny, {
        required: boolean;
        content: Record<string, unknown>;
    }, {
        content: Record<string, unknown>;
        required?: boolean | undefined;
    }>>;
    responses: z.ZodRecord<z.ZodString, z.ZodObject<{
        description: z.ZodString;
        content: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        description: string;
        content?: Record<string, unknown> | undefined;
    }, {
        description: string;
        content?: Record<string, unknown> | undefined;
    }>>;
    security: z.ZodOptional<z.ZodArray<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString, "many">>, "many">>;
    deprecated: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
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
}, {
    path: string;
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS" | "TRACE";
    responses: Record<string, {
        description: string;
        content?: Record<string, unknown> | undefined;
    }>;
    operationId?: string | undefined;
    summary?: string | undefined;
    description?: string | undefined;
    tags?: string[] | undefined;
    parameters?: {
        name: string;
        in: "path" | "query" | "header" | "cookie";
        schema: Record<string, unknown>;
        description?: string | undefined;
        required?: boolean | undefined;
    }[] | undefined;
    requestBody?: {
        content: Record<string, unknown>;
        required?: boolean | undefined;
    } | undefined;
    security?: Record<string, string[]>[] | undefined;
    deprecated?: boolean | undefined;
}>;
export type APIEndpoint = z.infer<typeof APIEndpointSchema>;
export declare const APISchemaSchema: z.ZodObject<{
    type: z.ZodNativeEnum<typeof APIType>;
    version: z.ZodString;
    info: z.ZodObject<{
        title: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        version: z.ZodString;
        termsOfService: z.ZodOptional<z.ZodString>;
        contact: z.ZodOptional<z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            url: z.ZodOptional<z.ZodString>;
            email: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            name?: string | undefined;
            url?: string | undefined;
            email?: string | undefined;
        }, {
            name?: string | undefined;
            url?: string | undefined;
            email?: string | undefined;
        }>>;
        license: z.ZodOptional<z.ZodObject<{
            name: z.ZodString;
            url: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            url?: string | undefined;
        }, {
            name: string;
            url?: string | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
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
    }, {
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
    }>;
    servers: z.ZodDefault<z.ZodArray<z.ZodObject<{
        url: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        variables: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            default: z.ZodString;
            enum: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            description: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            default: string;
            description?: string | undefined;
            enum?: string[] | undefined;
        }, {
            default: string;
            description?: string | undefined;
            enum?: string[] | undefined;
        }>>>;
    }, "strip", z.ZodTypeAny, {
        url: string;
        description?: string | undefined;
        variables?: Record<string, {
            default: string;
            description?: string | undefined;
            enum?: string[] | undefined;
        }> | undefined;
    }, {
        url: string;
        description?: string | undefined;
        variables?: Record<string, {
            default: string;
            description?: string | undefined;
            enum?: string[] | undefined;
        }> | undefined;
    }>, "many">>;
    endpoints: z.ZodArray<z.ZodObject<{
        path: z.ZodString;
        method: z.ZodEnum<["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS", "TRACE"]>;
        operationId: z.ZodOptional<z.ZodString>;
        summary: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        parameters: z.ZodDefault<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            in: z.ZodEnum<["query", "header", "path", "cookie"]>;
            required: z.ZodDefault<z.ZodBoolean>;
            description: z.ZodOptional<z.ZodString>;
            schema: z.ZodRecord<z.ZodString, z.ZodUnknown>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            in: "path" | "query" | "header" | "cookie";
            required: boolean;
            schema: Record<string, unknown>;
            description?: string | undefined;
        }, {
            name: string;
            in: "path" | "query" | "header" | "cookie";
            schema: Record<string, unknown>;
            description?: string | undefined;
            required?: boolean | undefined;
        }>, "many">>;
        requestBody: z.ZodOptional<z.ZodObject<{
            required: z.ZodDefault<z.ZodBoolean>;
            content: z.ZodRecord<z.ZodString, z.ZodUnknown>;
        }, "strip", z.ZodTypeAny, {
            required: boolean;
            content: Record<string, unknown>;
        }, {
            content: Record<string, unknown>;
            required?: boolean | undefined;
        }>>;
        responses: z.ZodRecord<z.ZodString, z.ZodObject<{
            description: z.ZodString;
            content: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, "strip", z.ZodTypeAny, {
            description: string;
            content?: Record<string, unknown> | undefined;
        }, {
            description: string;
            content?: Record<string, unknown> | undefined;
        }>>;
        security: z.ZodOptional<z.ZodArray<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString, "many">>, "many">>;
        deprecated: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
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
    }, {
        path: string;
        method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS" | "TRACE";
        responses: Record<string, {
            description: string;
            content?: Record<string, unknown> | undefined;
        }>;
        operationId?: string | undefined;
        summary?: string | undefined;
        description?: string | undefined;
        tags?: string[] | undefined;
        parameters?: {
            name: string;
            in: "path" | "query" | "header" | "cookie";
            schema: Record<string, unknown>;
            description?: string | undefined;
            required?: boolean | undefined;
        }[] | undefined;
        requestBody?: {
            content: Record<string, unknown>;
            required?: boolean | undefined;
        } | undefined;
        security?: Record<string, string[]>[] | undefined;
        deprecated?: boolean | undefined;
    }>, "many">;
    authentication: z.ZodOptional<z.ZodObject<{
        type: z.ZodEnum<["none", "apiKey", "bearer", "oauth2", "basic", "digest", "mutual_tls"]>;
        config: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        type: "none" | "apiKey" | "bearer" | "oauth2" | "basic" | "digest" | "mutual_tls";
        config?: Record<string, unknown> | undefined;
    }, {
        type: "none" | "apiKey" | "bearer" | "oauth2" | "basic" | "digest" | "mutual_tls";
        config?: Record<string, unknown> | undefined;
    }>>;
    tags: z.ZodDefault<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        description?: string | undefined;
    }, {
        name: string;
        description?: string | undefined;
    }>, "many">>;
    externalDocs: z.ZodOptional<z.ZodObject<{
        description: z.ZodOptional<z.ZodString>;
        url: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        url: string;
        description?: string | undefined;
    }, {
        url: string;
        description?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    type: APIType;
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
}, {
    type: APIType;
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
    endpoints: {
        path: string;
        method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS" | "TRACE";
        responses: Record<string, {
            description: string;
            content?: Record<string, unknown> | undefined;
        }>;
        operationId?: string | undefined;
        summary?: string | undefined;
        description?: string | undefined;
        tags?: string[] | undefined;
        parameters?: {
            name: string;
            in: "path" | "query" | "header" | "cookie";
            schema: Record<string, unknown>;
            description?: string | undefined;
            required?: boolean | undefined;
        }[] | undefined;
        requestBody?: {
            content: Record<string, unknown>;
            required?: boolean | undefined;
        } | undefined;
        security?: Record<string, string[]>[] | undefined;
        deprecated?: boolean | undefined;
    }[];
    tags?: {
        name: string;
        description?: string | undefined;
    }[] | undefined;
    servers?: {
        url: string;
        description?: string | undefined;
        variables?: Record<string, {
            default: string;
            description?: string | undefined;
            enum?: string[] | undefined;
        }> | undefined;
    }[] | undefined;
    authentication?: {
        type: "none" | "apiKey" | "bearer" | "oauth2" | "basic" | "digest" | "mutual_tls";
        config?: Record<string, unknown> | undefined;
    } | undefined;
    externalDocs?: {
        url: string;
        description?: string | undefined;
    } | undefined;
}>;
export type APISchema = z.infer<typeof APISchemaSchema>;
export declare const APIDiscoveryResultSchema: z.ZodObject<{
    source: z.ZodEnum<["url", "file", "inline"]>;
    type: z.ZodNativeEnum<typeof APIType>;
    schema: z.ZodObject<{
        type: z.ZodNativeEnum<typeof APIType>;
        version: z.ZodString;
        info: z.ZodObject<{
            title: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            version: z.ZodString;
            termsOfService: z.ZodOptional<z.ZodString>;
            contact: z.ZodOptional<z.ZodObject<{
                name: z.ZodOptional<z.ZodString>;
                url: z.ZodOptional<z.ZodString>;
                email: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                name?: string | undefined;
                url?: string | undefined;
                email?: string | undefined;
            }, {
                name?: string | undefined;
                url?: string | undefined;
                email?: string | undefined;
            }>>;
            license: z.ZodOptional<z.ZodObject<{
                name: z.ZodString;
                url: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                name: string;
                url?: string | undefined;
            }, {
                name: string;
                url?: string | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
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
        }, {
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
        }>;
        servers: z.ZodDefault<z.ZodArray<z.ZodObject<{
            url: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            variables: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
                default: z.ZodString;
                enum: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                description: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                default: string;
                description?: string | undefined;
                enum?: string[] | undefined;
            }, {
                default: string;
                description?: string | undefined;
                enum?: string[] | undefined;
            }>>>;
        }, "strip", z.ZodTypeAny, {
            url: string;
            description?: string | undefined;
            variables?: Record<string, {
                default: string;
                description?: string | undefined;
                enum?: string[] | undefined;
            }> | undefined;
        }, {
            url: string;
            description?: string | undefined;
            variables?: Record<string, {
                default: string;
                description?: string | undefined;
                enum?: string[] | undefined;
            }> | undefined;
        }>, "many">>;
        endpoints: z.ZodArray<z.ZodObject<{
            path: z.ZodString;
            method: z.ZodEnum<["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS", "TRACE"]>;
            operationId: z.ZodOptional<z.ZodString>;
            summary: z.ZodOptional<z.ZodString>;
            description: z.ZodOptional<z.ZodString>;
            tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            parameters: z.ZodDefault<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                in: z.ZodEnum<["query", "header", "path", "cookie"]>;
                required: z.ZodDefault<z.ZodBoolean>;
                description: z.ZodOptional<z.ZodString>;
                schema: z.ZodRecord<z.ZodString, z.ZodUnknown>;
            }, "strip", z.ZodTypeAny, {
                name: string;
                in: "path" | "query" | "header" | "cookie";
                required: boolean;
                schema: Record<string, unknown>;
                description?: string | undefined;
            }, {
                name: string;
                in: "path" | "query" | "header" | "cookie";
                schema: Record<string, unknown>;
                description?: string | undefined;
                required?: boolean | undefined;
            }>, "many">>;
            requestBody: z.ZodOptional<z.ZodObject<{
                required: z.ZodDefault<z.ZodBoolean>;
                content: z.ZodRecord<z.ZodString, z.ZodUnknown>;
            }, "strip", z.ZodTypeAny, {
                required: boolean;
                content: Record<string, unknown>;
            }, {
                content: Record<string, unknown>;
                required?: boolean | undefined;
            }>>;
            responses: z.ZodRecord<z.ZodString, z.ZodObject<{
                description: z.ZodString;
                content: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, "strip", z.ZodTypeAny, {
                description: string;
                content?: Record<string, unknown> | undefined;
            }, {
                description: string;
                content?: Record<string, unknown> | undefined;
            }>>;
            security: z.ZodOptional<z.ZodArray<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString, "many">>, "many">>;
            deprecated: z.ZodDefault<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
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
        }, {
            path: string;
            method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS" | "TRACE";
            responses: Record<string, {
                description: string;
                content?: Record<string, unknown> | undefined;
            }>;
            operationId?: string | undefined;
            summary?: string | undefined;
            description?: string | undefined;
            tags?: string[] | undefined;
            parameters?: {
                name: string;
                in: "path" | "query" | "header" | "cookie";
                schema: Record<string, unknown>;
                description?: string | undefined;
                required?: boolean | undefined;
            }[] | undefined;
            requestBody?: {
                content: Record<string, unknown>;
                required?: boolean | undefined;
            } | undefined;
            security?: Record<string, string[]>[] | undefined;
            deprecated?: boolean | undefined;
        }>, "many">;
        authentication: z.ZodOptional<z.ZodObject<{
            type: z.ZodEnum<["none", "apiKey", "bearer", "oauth2", "basic", "digest", "mutual_tls"]>;
            config: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, "strip", z.ZodTypeAny, {
            type: "none" | "apiKey" | "bearer" | "oauth2" | "basic" | "digest" | "mutual_tls";
            config?: Record<string, unknown> | undefined;
        }, {
            type: "none" | "apiKey" | "bearer" | "oauth2" | "basic" | "digest" | "mutual_tls";
            config?: Record<string, unknown> | undefined;
        }>>;
        tags: z.ZodDefault<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            description?: string | undefined;
        }, {
            name: string;
            description?: string | undefined;
        }>, "many">>;
        externalDocs: z.ZodOptional<z.ZodObject<{
            description: z.ZodOptional<z.ZodString>;
            url: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            url: string;
            description?: string | undefined;
        }, {
            url: string;
            description?: string | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        type: APIType;
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
    }, {
        type: APIType;
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
        endpoints: {
            path: string;
            method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS" | "TRACE";
            responses: Record<string, {
                description: string;
                content?: Record<string, unknown> | undefined;
            }>;
            operationId?: string | undefined;
            summary?: string | undefined;
            description?: string | undefined;
            tags?: string[] | undefined;
            parameters?: {
                name: string;
                in: "path" | "query" | "header" | "cookie";
                schema: Record<string, unknown>;
                description?: string | undefined;
                required?: boolean | undefined;
            }[] | undefined;
            requestBody?: {
                content: Record<string, unknown>;
                required?: boolean | undefined;
            } | undefined;
            security?: Record<string, string[]>[] | undefined;
            deprecated?: boolean | undefined;
        }[];
        tags?: {
            name: string;
            description?: string | undefined;
        }[] | undefined;
        servers?: {
            url: string;
            description?: string | undefined;
            variables?: Record<string, {
                default: string;
                description?: string | undefined;
                enum?: string[] | undefined;
            }> | undefined;
        }[] | undefined;
        authentication?: {
            type: "none" | "apiKey" | "bearer" | "oauth2" | "basic" | "digest" | "mutual_tls";
            config?: Record<string, unknown> | undefined;
        } | undefined;
        externalDocs?: {
            url: string;
            description?: string | undefined;
        } | undefined;
    }>;
    raw: z.ZodUnknown;
    warnings: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    errors: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    type: APIType;
    schema: {
        type: APIType;
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
    source: "url" | "file" | "inline";
    warnings: string[];
    errors: string[];
    raw?: unknown;
}, {
    type: APIType;
    schema: {
        type: APIType;
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
        endpoints: {
            path: string;
            method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS" | "TRACE";
            responses: Record<string, {
                description: string;
                content?: Record<string, unknown> | undefined;
            }>;
            operationId?: string | undefined;
            summary?: string | undefined;
            description?: string | undefined;
            tags?: string[] | undefined;
            parameters?: {
                name: string;
                in: "path" | "query" | "header" | "cookie";
                schema: Record<string, unknown>;
                description?: string | undefined;
                required?: boolean | undefined;
            }[] | undefined;
            requestBody?: {
                content: Record<string, unknown>;
                required?: boolean | undefined;
            } | undefined;
            security?: Record<string, string[]>[] | undefined;
            deprecated?: boolean | undefined;
        }[];
        tags?: {
            name: string;
            description?: string | undefined;
        }[] | undefined;
        servers?: {
            url: string;
            description?: string | undefined;
            variables?: Record<string, {
                default: string;
                description?: string | undefined;
                enum?: string[] | undefined;
            }> | undefined;
        }[] | undefined;
        authentication?: {
            type: "none" | "apiKey" | "bearer" | "oauth2" | "basic" | "digest" | "mutual_tls";
            config?: Record<string, unknown> | undefined;
        } | undefined;
        externalDocs?: {
            url: string;
            description?: string | undefined;
        } | undefined;
    };
    source: "url" | "file" | "inline";
    raw?: unknown;
    warnings?: string[] | undefined;
    errors?: string[] | undefined;
}>;
export type APIDiscoveryResult = z.infer<typeof APIDiscoveryResultSchema>;
//# sourceMappingURL=api.d.ts.map