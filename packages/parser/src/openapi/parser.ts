import SwaggerParser from 'swagger-parser';
import type { OpenAPI, OpenAPIV2, OpenAPIV3, OpenAPIV3_1 } from 'openapi-types';

import {
  APISchema,
  APIEndpoint,
  APIType,
  OpenAPIVersion,
  HTTPMethod,
  AuthType,
  ParseError,
  logger,
} from '@magic-mcp/shared';

/**
 * OpenAPI Parser
 * Parses OpenAPI 2.0 and 3.x specifications into our unified APISchema format
 */

export class OpenAPIParser {
  /**
   * Parse an OpenAPI specification from URL or object
   */
  async parse(input: string | object): Promise<APISchema> {
    try {
      logger.info('Parsing OpenAPI specification', {
        inputType: typeof input,
      });

      // Use swagger-parser to dereference and validate
      const api = (await SwaggerParser.validate(input)) as OpenAPI.Document;

      // Detect version
      const version = this.detectVersion(api);
      logger.debug('Detected OpenAPI version', { version });

      // Parse based on version
      const schema = this.isV2(api)
        ? this.parseV2(api as OpenAPIV2.Document)
        : this.parseV3(api as OpenAPIV3.Document | OpenAPIV3_1.Document);

      logger.info('Successfully parsed OpenAPI specification', {
        title: schema.info.title,
        endpointCount: schema.endpoints.length,
      });

      return schema;
    } catch (error) {
      logger.error('Failed to parse OpenAPI specification', error as Error);
      throw new ParseError('Failed to parse OpenAPI specification', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  private detectVersion(api: OpenAPI.Document): OpenAPIVersion {
    if ('swagger' in api && api.swagger === '2.0') {
      return OpenAPIVersion.V2;
    }
    if ('openapi' in api) {
      if (api.openapi.startsWith('3.0')) {
        return OpenAPIVersion.V3;
      }
      if (api.openapi.startsWith('3.1')) {
        return OpenAPIVersion.V3_1;
      }
    }
    throw new ParseError(`Unsupported OpenAPI version: ${JSON.stringify(api)}`);
  }

  private isV2(api: OpenAPI.Document): api is OpenAPIV2.Document {
    return 'swagger' in api;
  }

  /**
   * Parse OpenAPI 2.0 (Swagger) specification
   */
  private parseV2(api: OpenAPIV2.Document): APISchema {
    const endpoints: APIEndpoint[] = [];

    // Parse paths
    if (api.paths) {
      for (const [path, pathItem] of Object.entries(api.paths)) {
        if (!pathItem) continue;

        for (const method of ['get', 'post', 'put', 'patch', 'delete', 'head', 'options'] as const) {
          const operation = pathItem[method];
          if (!operation) continue;

          endpoints.push(this.parseV2Operation(path, method.toUpperCase() as HTTPMethod, operation));
        }
      }
    }

    return {
      type: APIType.OpenAPI,
      version: '2.0',
      info: {
        title: api.info.title,
        description: api.info.description,
        version: api.info.version,
        termsOfService: api.info.termsOfService,
        contact: api.info.contact,
        license: api.info.license,
      },
      servers: this.parseV2Servers(api),
      endpoints,
      authentication: this.parseV2Auth(api),
      tags: api.tags || [],
      externalDocs: api.externalDocs,
    };
  }

  private parseV2Servers(api: OpenAPIV2.Document): APISchema['servers'] {
    const servers: APISchema['servers'] = [];

    // OpenAPI 2.0 uses host, basePath, schemes
    if (api.host) {
      const schemes = api.schemes || ['https'];
      const basePath = api.basePath || '';

      for (const scheme of schemes) {
        servers.push({
          url: `${scheme}://${api.host}${basePath}`,
        });
      }
    }

    return servers;
  }

  private parseV2Operation(
    path: string,
    method: HTTPMethod,
    operation: OpenAPIV2.OperationObject
  ): APIEndpoint {
    const parameters = (operation.parameters || []).map((param) => {
      const p = param as OpenAPIV2.ParameterObject;
      return {
        name: p.name,
        in: p.in as 'query' | 'header' | 'path' | 'cookie',
        required: p.required || false,
        description: p.description,
        schema: p.schema || { type: p.type },
      };
    });

    const requestBody = operation.parameters?.find(
      (p) => 'in' in p && p.in === 'body'
    ) as OpenAPIV2.InBodyParameterObject | undefined;

    return {
      path,
      method,
      operationId: operation.operationId,
      summary: operation.summary,
      description: operation.description,
      tags: operation.tags || [],
      parameters,
      requestBody: requestBody
        ? {
            required: requestBody.required || false,
            content: {
              'application/json': requestBody.schema || {},
            },
          }
        : undefined,
      responses: this.parseV2Responses(operation.responses),
      deprecated: operation.deprecated || false,
    };
  }

  private parseV2Responses(
    responses: OpenAPIV2.ResponsesObject
  ): APIEndpoint['responses'] {
    const result: APIEndpoint['responses'] = {};

    for (const [statusCode, response] of Object.entries(responses)) {
      const resp = response as OpenAPIV2.ResponseObject;
      result[statusCode] = {
        description: resp.description,
        content: resp.schema
          ? {
              'application/json': resp.schema,
            }
          : undefined,
      };
    }

    return result;
  }

  private parseV2Auth(api: OpenAPIV2.Document): APISchema['authentication'] {
    if (!api.securityDefinitions || Object.keys(api.securityDefinitions).length === 0) {
      return { type: AuthType.None };
    }

    // Get first security definition (simplified for now)
    const [firstKey, firstDef] = Object.entries(api.securityDefinitions)[0];

    switch (firstDef.type) {
      case 'apiKey':
        return {
          type: AuthType.ApiKey,
          config: {
            name: firstDef.name,
            in: firstDef.in,
          },
        };
      case 'oauth2':
        return {
          type: AuthType.OAuth2,
          config: {
            flow: firstDef.flow,
            authorizationUrl: firstDef.authorizationUrl,
            tokenUrl: firstDef.tokenUrl,
            scopes: firstDef.scopes,
          },
        };
      case 'basic':
        return { type: AuthType.Basic };
      default:
        return { type: AuthType.None };
    }
  }

  /**
   * Parse OpenAPI 3.x specification
   */
  private parseV3(api: OpenAPIV3.Document | OpenAPIV3_1.Document): APISchema {
    const endpoints: APIEndpoint[] = [];

    // Parse paths
    if (api.paths) {
      for (const [path, pathItem] of Object.entries(api.paths)) {
        if (!pathItem) continue;

        for (const method of ['get', 'post', 'put', 'patch', 'delete', 'head', 'options'] as const) {
          const operation = pathItem[method];
          if (!operation) continue;

          endpoints.push(this.parseV3Operation(path, method.toUpperCase() as HTTPMethod, operation));
        }
      }
    }

    return {
      type: APIType.OpenAPI,
      version: 'openapi' in api ? api.openapi : '3.0',
      info: {
        title: api.info.title,
        description: api.info.description,
        version: api.info.version,
        termsOfService: api.info.termsOfService,
        contact: api.info.contact,
        license: api.info.license,
      },
      servers: api.servers || [],
      endpoints,
      authentication: this.parseV3Auth(api),
      tags: api.tags || [],
      externalDocs: api.externalDocs,
    };
  }

  private parseV3Operation(
    path: string,
    method: HTTPMethod,
    operation: OpenAPIV3.OperationObject
  ): APIEndpoint {
    const parameters = (operation.parameters || []).map((param) => {
      const p = param as OpenAPIV3.ParameterObject;
      return {
        name: p.name,
        in: p.in as 'query' | 'header' | 'path' | 'cookie',
        required: p.required || false,
        description: p.description,
        schema: p.schema || {},
      };
    });

    return {
      path,
      method,
      operationId: operation.operationId,
      summary: operation.summary,
      description: operation.description,
      tags: operation.tags || [],
      parameters,
      requestBody: operation.requestBody
        ? {
            required: (operation.requestBody as OpenAPIV3.RequestBodyObject).required || false,
            content: (operation.requestBody as OpenAPIV3.RequestBodyObject).content || {},
          }
        : undefined,
      responses: this.parseV3Responses(operation.responses),
      security: operation.security,
      deprecated: operation.deprecated || false,
    };
  }

  private parseV3Responses(
    responses: OpenAPIV3.ResponsesObject
  ): APIEndpoint['responses'] {
    const result: APIEndpoint['responses'] = {};

    for (const [statusCode, response] of Object.entries(responses)) {
      const resp = response as OpenAPIV3.ResponseObject;
      result[statusCode] = {
        description: resp.description,
        content: resp.content,
      };
    }

    return result;
  }

  private parseV3Auth(api: OpenAPIV3.Document | OpenAPIV3_1.Document): APISchema['authentication'] {
    if (!api.components?.securitySchemes) {
      return { type: AuthType.None };
    }

    // Get first security scheme (simplified for now)
    const [firstKey, firstScheme] = Object.entries(api.components.securitySchemes)[0];
    const scheme = firstScheme as OpenAPIV3.SecuritySchemeObject;

    switch (scheme.type) {
      case 'apiKey':
        return {
          type: AuthType.ApiKey,
          config: {
            name: scheme.name,
            in: scheme.in,
          },
        };
      case 'http':
        if (scheme.scheme === 'bearer') {
          return {
            type: AuthType.Bearer,
            config: {
              bearerFormat: scheme.bearerFormat,
            },
          };
        }
        if (scheme.scheme === 'basic') {
          return { type: AuthType.Basic };
        }
        return { type: AuthType.None };
      case 'oauth2':
        return {
          type: AuthType.OAuth2,
          config: scheme.flows,
        };
      case 'mutualTLS':
        return { type: AuthType.MutualTls };
      default:
        return { type: AuthType.None };
    }
  }
}
