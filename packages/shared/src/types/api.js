"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIDiscoveryResultSchema = exports.APISchemaSchema = exports.APIEndpointSchema = exports.AuthTypeSchema = exports.HTTPMethodSchema = exports.OpenAPIVersion = exports.APIType = void 0;
const zod_1 = require("zod");
/**
 * API Schema Types
 * Support for various API specification formats
 */
// API Type
var APIType;
(function (APIType) {
    APIType["OpenAPI"] = "openapi";
    APIType["GraphQL"] = "graphql";
    APIType["GRPC"] = "grpc";
    APIType["REST"] = "rest";
    APIType["SOAP"] = "soap";
})(APIType || (exports.APIType = APIType = {}));
// OpenAPI Version
var OpenAPIVersion;
(function (OpenAPIVersion) {
    OpenAPIVersion["V2"] = "2.0";
    OpenAPIVersion["V3"] = "3.0";
    OpenAPIVersion["V3_1"] = "3.1";
})(OpenAPIVersion || (exports.OpenAPIVersion = OpenAPIVersion = {}));
// HTTP Methods
exports.HTTPMethodSchema = zod_1.z.enum([
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'HEAD',
    'OPTIONS',
    'TRACE',
]);
// Authentication Types
exports.AuthTypeSchema = zod_1.z.enum([
    'none',
    'apiKey',
    'bearer',
    'oauth2',
    'basic',
    'digest',
    'mutual_tls',
]);
// API Endpoint
exports.APIEndpointSchema = zod_1.z.object({
    path: zod_1.z.string(),
    method: exports.HTTPMethodSchema,
    operationId: zod_1.z.string().optional(),
    summary: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    tags: zod_1.z.array(zod_1.z.string()).default([]),
    parameters: zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string(),
        in: zod_1.z.enum(['query', 'header', 'path', 'cookie']),
        required: zod_1.z.boolean().default(false),
        description: zod_1.z.string().optional(),
        schema: zod_1.z.record(zod_1.z.unknown()),
    })).default([]),
    requestBody: zod_1.z.object({
        required: zod_1.z.boolean().default(false),
        content: zod_1.z.record(zod_1.z.unknown()),
    }).optional(),
    responses: zod_1.z.record(zod_1.z.object({
        description: zod_1.z.string(),
        content: zod_1.z.record(zod_1.z.unknown()).optional(),
    })),
    security: zod_1.z.array(zod_1.z.record(zod_1.z.array(zod_1.z.string()))).optional(),
    deprecated: zod_1.z.boolean().default(false),
});
// API Schema
exports.APISchemaSchema = zod_1.z.object({
    type: zod_1.z.nativeEnum(APIType),
    version: zod_1.z.string(),
    info: zod_1.z.object({
        title: zod_1.z.string(),
        description: zod_1.z.string().optional(),
        version: zod_1.z.string(),
        termsOfService: zod_1.z.string().url().optional(),
        contact: zod_1.z.object({
            name: zod_1.z.string().optional(),
            url: zod_1.z.string().url().optional(),
            email: zod_1.z.string().email().optional(),
        }).optional(),
        license: zod_1.z.object({
            name: zod_1.z.string(),
            url: zod_1.z.string().url().optional(),
        }).optional(),
    }),
    servers: zod_1.z.array(zod_1.z.object({
        url: zod_1.z.string().url(),
        description: zod_1.z.string().optional(),
        variables: zod_1.z.record(zod_1.z.object({
            default: zod_1.z.string(),
            enum: zod_1.z.array(zod_1.z.string()).optional(),
            description: zod_1.z.string().optional(),
        })).optional(),
    })).default([]),
    endpoints: zod_1.z.array(exports.APIEndpointSchema),
    authentication: zod_1.z.object({
        type: exports.AuthTypeSchema,
        config: zod_1.z.record(zod_1.z.unknown()).optional(),
    }).optional(),
    tags: zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string(),
        description: zod_1.z.string().optional(),
    })).default([]),
    externalDocs: zod_1.z.object({
        description: zod_1.z.string().optional(),
        url: zod_1.z.string().url(),
    }).optional(),
});
// API Discovery Result
exports.APIDiscoveryResultSchema = zod_1.z.object({
    source: zod_1.z.enum(['url', 'file', 'inline']),
    type: zod_1.z.nativeEnum(APIType),
    schema: exports.APISchemaSchema,
    raw: zod_1.z.unknown(), // Original schema document
    warnings: zod_1.z.array(zod_1.z.string()).default([]),
    errors: zod_1.z.array(zod_1.z.string()).default([]),
});
//# sourceMappingURL=api.js.map