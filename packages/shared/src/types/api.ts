import { z } from 'zod';

/**
 * API Schema Types
 * Support for various API specification formats
 */

// API Type
export enum APIType {
  OpenAPI = 'openapi',
  GraphQL = 'graphql',
  GRPC = 'grpc',
  REST = 'rest',
  SOAP = 'soap',
}

// OpenAPI Version
export enum OpenAPIVersion {
  V2 = '2.0',
  V3 = '3.0',
  V3_1 = '3.1',
}

// HTTP Methods
export const HTTPMethodSchema = z.enum([
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
  'HEAD',
  'OPTIONS',
  'TRACE',
]);

export type HTTPMethod = z.infer<typeof HTTPMethodSchema>;

// Authentication Types
export const AuthTypeSchema = z.enum([
  'none',
  'apiKey',
  'bearer',
  'oauth2',
  'basic',
  'digest',
  'mutual_tls',
]);

export type AuthType = z.infer<typeof AuthTypeSchema>;

// API Endpoint
export const APIEndpointSchema = z.object({
  path: z.string(),
  method: HTTPMethodSchema,
  operationId: z.string().optional(),
  summary: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).default([]),
  parameters: z.array(z.object({
    name: z.string(),
    in: z.enum(['query', 'header', 'path', 'cookie']),
    required: z.boolean().default(false),
    description: z.string().optional(),
    schema: z.record(z.unknown()),
  })).default([]),
  requestBody: z.object({
    required: z.boolean().default(false),
    content: z.record(z.unknown()),
  }).optional(),
  responses: z.record(z.object({
    description: z.string(),
    content: z.record(z.unknown()).optional(),
  })),
  security: z.array(z.record(z.array(z.string()))).optional(),
  deprecated: z.boolean().default(false),
});

export type APIEndpoint = z.infer<typeof APIEndpointSchema>;

// API Schema
export const APISchemaSchema = z.object({
  type: z.nativeEnum(APIType),
  version: z.string(),
  info: z.object({
    title: z.string(),
    description: z.string().optional(),
    version: z.string(),
    termsOfService: z.string().url().optional(),
    contact: z.object({
      name: z.string().optional(),
      url: z.string().url().optional(),
      email: z.string().email().optional(),
    }).optional(),
    license: z.object({
      name: z.string(),
      url: z.string().url().optional(),
    }).optional(),
  }),
  servers: z.array(z.object({
    url: z.string().url(),
    description: z.string().optional(),
    variables: z.record(z.object({
      default: z.string(),
      enum: z.array(z.string()).optional(),
      description: z.string().optional(),
    })).optional(),
  })).default([]),
  endpoints: z.array(APIEndpointSchema),
  authentication: z.object({
    type: AuthTypeSchema,
    config: z.record(z.unknown()).optional(),
  }).optional(),
  tags: z.array(z.object({
    name: z.string(),
    description: z.string().optional(),
  })).default([]),
  externalDocs: z.object({
    description: z.string().optional(),
    url: z.string().url(),
  }).optional(),
});

export type APISchema = z.infer<typeof APISchemaSchema>;

// API Discovery Result
export const APIDiscoveryResultSchema = z.object({
  source: z.enum(['url', 'file', 'inline']),
  type: z.nativeEnum(APIType),
  schema: APISchemaSchema,
  raw: z.unknown(), // Original schema document
  warnings: z.array(z.string()).default([]),
  errors: z.array(z.string()).default([]),
});

export type APIDiscoveryResult = z.infer<typeof APIDiscoveryResultSchema>;
