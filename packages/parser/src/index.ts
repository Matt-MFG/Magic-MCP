/**
 * Magic MCP Parser Package
 * API schema parsers for various formats
 */

export { OpenAPIParser } from './openapi/parser.js';

// Re-export types from shared
export type {
  APISchema,
  APIEndpoint,
  APIType,
  HTTPMethod,
  AuthType,
  APIDiscoveryResult,
} from '@magic-mcp/shared';
