import Handlebars from 'handlebars';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { format } from 'prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import {
  APISchema,
  APIEndpoint,
  GenerationRequest,
  GenerationResult,
  GeneratedFile,
  MCPServerSpec,
  MCPTool,
  MCPToolParameter,
  TargetLanguage,
  GenerationError,
  logger,
} from '@magic-mcp/shared';

import { GeminiClient } from '../ai/gemini-client.js';

/**
 * MCP Generator
 * Generates MCP server code from API schemas using AI
 */

export class MCPGenerator {
  private gemini: GeminiClient;
  private templates: Map<string, HandlebarsTemplateDelegate> = new Map();
  private extractedSchemas: Map<string, { schema: unknown; name: string }> = new Map();
  private schemaCounter = 0;
  private componentSchemas: Record<string, string> = {};

  constructor(gemini: GeminiClient) {
    this.gemini = gemini;
    this.registerHelpers();
  }

  /**
   * Register Handlebars helpers
   */
  private registerHelpers(): void {
    Handlebars.registerHelper('camelCase', (str: string) => {
      return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    });

    Handlebars.registerHelper('pascalCase', (str: string) => {
      const camel = str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      return camel.charAt(0).toUpperCase() + camel.slice(1);
    });

    Handlebars.registerHelper('eq', function(this: unknown, a: unknown, b: unknown, options?: Handlebars.HelperOptions) {
      // Used as subexpression {{#if (eq a b)}} - no options param
      if (typeof options === 'undefined') {
        return a === b;
      }
      // Used as block helper {{#eq a b}} - options param present
      if (typeof options.fn !== 'function') {
        // Fallback: return boolean if options exists but fn doesn't
        return a === b;
      }
      if (a === b) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    });
  }

  /**
   * Load template from file
   */
  private async loadTemplate(name: string): Promise<HandlebarsTemplateDelegate> {
    if (this.templates.has(name)) {
      return this.templates.get(name)!;
    }

    const templatePath = path.join(__dirname, '..', 'templates', `${name}.hbs`);
    const templateContent = await fs.readFile(templatePath, 'utf-8');
    const template = Handlebars.compile(templateContent);
    this.templates.set(name, template);

    return template;
  }

  /**
   * Generate MCP server from API schema
   */
  async generate(request: GenerationRequest): Promise<GenerationResult> {
    const startTime = Date.now();

    // Reset state for this generation
    this.extractedSchemas.clear();
    this.schemaCounter = 0;
    this.componentSchemas = request.apiSchema.components?.schemas || {};

    logger.info('Starting MCP generation', {
      apiTitle: request.apiSchema.info.title,
      language: request.options?.language || 'typescript',
      componentSchemaCount: Object.keys(this.componentSchemas).length,
    });

    try {
      // Step 1: Analyze schema with AI
      const analysis = await this.analyzeSchema(request.apiSchema);

      // Step 2: Convert API endpoints to MCP tools
      const spec = await this.createMCPSpec(request, analysis);

      // Step 3: Generate code files
      const files = await this.generateFiles(spec, request);

      // Step 4: Format generated code
      const formattedFiles = await this.formatFiles(files);

      const duration = Date.now() - startTime;

      logger.info('MCP generation completed', {
        duration,
        fileCount: formattedFiles.length,
        toolCount: spec.tools.length,
      });

      return {
        success: true,
        spec,
        files: formattedFiles,
        warnings: analysis.securityConcerns,
        errors: [],
        metadata: {
          generatedAt: new Date(),
          generator: '@magic-mcp/generator',
          version: '0.1.0',
          duration,
          tokensUsed: 0, // Will be updated if using AI generation
          enhancementsApplied: analysis.improvements,
        },
      };
    } catch (error) {
      logger.error('MCP generation failed', error as Error);
      throw new GenerationError('Failed to generate MCP server', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Analyze API schema with AI
   */
  private async analyzeSchema(apiSchema: APISchema): Promise<{
    improvements: string[];
    securityConcerns: string[];
    missingEndpoints: string[];
  }> {
    logger.debug('Analyzing API schema with AI');

    try {
      const schemaJson = JSON.stringify(apiSchema, null, 2);
      return this.gemini.analyzeSchema(schemaJson);
    } catch (error) {
      // Handle circular references or very large schemas
      logger.warn('Failed to stringify schema for AI analysis (possible circular reference)', { error });
      return {
        improvements: [],
        securityConcerns: ['Schema contains circular references - manual review recommended'],
        missingEndpoints: [],
      };
    }
  }

  /**
   * Create MCP specification from API schema
   */
  private async createMCPSpec(
    request: GenerationRequest,
    _analysis: { improvements: string[]; securityConcerns: string[] }
  ): Promise<MCPServerSpec> {
    const { apiSchema } = request;

    // Convert endpoints to tools
    const tools: MCPTool[] = apiSchema.endpoints.map((endpoint) =>
      this.endpointToTool(endpoint)
    );

    return {
      config: {
        name: request.name || this.sanitizeName(apiSchema.info.title),
        version: request.version || '1.0.0',
        description:
          request.description ||
          apiSchema.info.description ||
          `MCP server for ${apiSchema.info.title}`,
        author: request.author,
        license: apiSchema.info.license?.name,
        repository: undefined,
        homepage: apiSchema.externalDocs?.url,
      },
      tools,
      resources: [],
      prompts: [],
    };
  }

  /**
   * Convert API endpoint to MCP tool
   */
  private endpointToTool(endpoint: APIEndpoint): MCPTool {
    const toolName = this.generateToolName(endpoint);
    const parameters = this.extractParameters(endpoint);

    return {
      name: toolName,
      description: endpoint.summary || endpoint.description || `Call ${endpoint.method} ${endpoint.path}`,
      inputSchema: {
        type: 'object',
        properties: Object.fromEntries(
          parameters.map((p) => [p.name, p])
        ),
        required: parameters.filter((p) => p.required).map((p) => p.name),
      },
      handler: toolName.replace(/_/g, ''),
    };
  }

  /**
   * Generate tool name from endpoint
   */
  private generateToolName(endpoint: APIEndpoint): string {
    if (endpoint.operationId) {
      return this.toSnakeCase(endpoint.operationId);
    }

    // Generate from method and path
    const method = endpoint.method.toLowerCase();
    const pathParts = endpoint.path
      .split('/')
      .filter((p) => p && !p.startsWith('{'))
      .join('_');

    return this.toSnakeCase(`${method}_${pathParts}`);
  }

  /**
   * Extract parameters from endpoint
   */
  private extractParameters(endpoint: APIEndpoint): MCPToolParameter[] {
    const params: MCPToolParameter[] = [];

    // Add path, query, header parameters
    for (const param of endpoint.parameters) {
      const schema = param.schema as { type?: string; enum?: string[]; items?: unknown };
      params.push({
        name: param.name,
        description: param.description || `${param.name} parameter`,
        type: this.schemaToType(param.schema),
        required: param.required,
        enum: schema?.enum,
        items: schema?.items, // Store array item schema for Zod generation
      });
    }

    // Add request body parameters (simplified)
    if (endpoint.requestBody?.content) {
      // Try both JSON and form-encoded content types
      const content = endpoint.requestBody.content['application/json']
        || endpoint.requestBody.content['application/x-www-form-urlencoded']
        || Object.values(endpoint.requestBody.content)[0];

      if (content && typeof content === 'object' && 'schema' in content) {
        const schema = content.schema as { properties?: Record<string, unknown>; required?: string[] };
        if (schema.properties) {
          const required = schema.required || [];
          for (const [name, propSchema] of Object.entries(schema.properties)) {
            const prop = propSchema as { type?: string; description?: string; enum?: string[]; items?: unknown };
            params.push({
              name,
              description: prop.description || `${name} from request body`,
              type: this.schemaToType(propSchema),
              required: required.includes(name),
              enum: prop.enum,
              items: prop.items, // Store array item schema for Zod generation
            });
          }
        }
      }
    }

    return params;
  }

  /**
   * Convert JSON schema type to our type system
   */
  private schemaToType(schema: unknown): MCPToolParameter['type'] {
    if (!schema || typeof schema !== 'object') {
      return 'string';
    }

    const s = schema as { type?: string };
    switch (s.type) {
      case 'integer':
      case 'number':
        return 'number';
      case 'boolean':
        return 'boolean';
      case 'object':
        return 'object';
      case 'array':
        return 'array';
      default:
        return 'string';
    }
  }

  /**
   * Convert JSON schema to Zod type (with full schema support including arrays)
   */
  private schemaToZodType(schema: unknown): string {
    if (!schema || typeof schema !== 'object') {
      return 'unknown()';
    }

    const s = schema as {
      type?: string;
      enum?: string[];
      items?: unknown;
      properties?: Record<string, unknown>;
      nullable?: boolean;
    };

    let zodType: string;

    if (s.enum) {
      const values = s.enum.map(v => `'${v}'`).join(', ');
      zodType = `enum([${values}])`;
    } else {
      switch (s.type) {
        case 'string':
          zodType = 'string()';
          break;
        case 'integer':
        case 'number':
          zodType = 'number()';
          break;
        case 'boolean':
          zodType = 'boolean()';
          break;
        case 'array':
          if (s.items) {
            const itemSchema = s.items as {
              type?: string;
              properties?: Record<string, unknown>;
            };

            // Check if array items are objects that should be extracted
            if (itemSchema.type === 'object' && itemSchema.properties && this.shouldExtractNestedSchema(itemSchema as { properties: Record<string, unknown> })) {
              const extractedName = this.extractNestedSchema(itemSchema as { properties: Record<string, unknown> });
              zodType = `array(${extractedName}Schema)`;
            } else {
              const itemType = this.schemaToZodType(s.items);
              // Nested items need z. prefix since template only adds it at top level
              zodType = `array(z.${itemType})`;
            }
          } else {
            zodType = 'array(z.unknown())';
          }
          break;
        case 'object':
          if (s.properties) {
            // For complex objects, extract as separate schema
            if (this.shouldExtractNestedSchema(s as { properties: Record<string, unknown> })) {
              const extractedName = this.extractNestedSchema(s as { properties: Record<string, unknown> });
              zodType = `${extractedName}Schema`;
            } else {
              zodType = 'record(z.unknown())';
            }
          } else {
            zodType = 'record(z.unknown())';
          }
          break;
        default:
          zodType = 'unknown()';
      }
    }

    return s.nullable ? `${zodType}.nullable()` : zodType;
  }

  /**
   * Extract response type name from endpoint
   */
  private getResponseTypeName(endpoint: APIEndpoint): string {
    // Use operation ID to generate type name
    if (endpoint.operationId) {
      const parts = endpoint.operationId.split('/').pop() || endpoint.operationId;
      return parts
        .split(/[-_]/)
        .map(p => p.charAt(0).toUpperCase() + p.slice(1))
        .join('') + 'Response';
    }

    // Fallback to method + path
    const method = endpoint.method.toLowerCase();
    const pathParts = endpoint.path.split('/').filter(p => p && !p.startsWith('{'));
    return pathParts
      .map(p => p.charAt(0).toUpperCase() + p.slice(1))
      .join('') + method.charAt(0).toUpperCase() + method.slice(1) + 'Response';
  }

  /**
   * Generate TypeScript interface from schema
   */
  private generateInterface(name: string, schema: unknown, indent = 0): string {
    if (!schema || typeof schema !== 'object') {
      return '';
    }

    const s = schema as {
      type?: string;
      properties?: Record<string, unknown>;
      items?: unknown;
      required?: string[];
      description?: string;
    };

    const indentStr = '  '.repeat(indent);
    let result = '';

    if (s.type === 'object' && s.properties) {
      result += `${indentStr}export interface ${name} {\n`;
      const required = s.required || [];

      for (const [propName, propSchema] of Object.entries(s.properties)) {
        const prop = propSchema as { type?: string; description?: string; nullable?: boolean };
        const optional = !required.includes(propName) || prop.nullable ? '?' : '';
        const tsType = this.schemaToTypeScript(propSchema);

        if (prop.description) {
          result += `${indentStr}  /** ${prop.description} */\n`;
        }
        result += `${indentStr}  ${propName}${optional}: ${tsType};\n`;
      }

      result += `${indentStr}}\n`;
    } else if (s.type === 'array' && s.items) {
      const itemType = this.schemaToTypeScript(s.items);
      result += `${indentStr}export type ${name} = ${itemType}[];\n`;
    }

    return result;
  }

  /**
   * Generate Zod schema for a type
   */
  private generateZodSchema(name: string, schema: unknown): string {
    if (!schema || typeof schema !== 'object') {
      return '';
    }

    const s = schema as {
      type?: string;
      properties?: Record<string, unknown>;
      items?: unknown;
      required?: string[];
    };

    if (s.type === 'object' && s.properties) {
      const required = s.required || [];
      const props = Object.entries(s.properties).map(([propName, propSchema]) => {
        const zodType = this.schemaToZodType(propSchema);
        const isRequired = required.includes(propName);
        const optional = isRequired ? '' : '.optional()';
        const propDesc = (propSchema as { description?: string })?.description;
        const describe = propDesc ? `.describe('${propDesc.replace(/'/g, "\\'")}')` : '';
        return `  ${propName}: z.${zodType}${optional}${describe},`;
      }).join('\n');

      return `export const ${name}Schema = z.object({\n${props}\n});`;
    } else if (s.type === 'array' && s.items) {
      const itemType = this.schemaToZodType(s.items);
      return `export const ${name}Schema = z.array(z.${itemType});`;
    }

    return '';
  }

  /**
   * Convert JSON schema to TypeScript type
   */
  private schemaToTypeScript(schema: unknown): string {
    if (!schema || typeof schema !== 'object') {
      return 'unknown';
    }

    const s = schema as {
      type?: string;
      enum?: string[];
      items?: unknown;
      properties?: Record<string, unknown>;
      nullable?: boolean;
    };

    let tsType: string;

    if (s.enum) {
      tsType = s.enum.map(v => `'${v}'`).join(' | ');
    } else {
      switch (s.type) {
        case 'string':
          tsType = 'string';
          break;
        case 'integer':
        case 'number':
          tsType = 'number';
          break;
        case 'boolean':
          tsType = 'boolean';
          break;
        case 'array':
          const itemType = s.items ? this.schemaToTypeScript(s.items) : 'unknown';
          tsType = `${itemType}[]`;
          break;
        case 'object':
          if (s.properties) {
            // Check if this object should be extracted
            if (this.shouldExtractNestedSchema(s)) {
              const extractedName = this.extractNestedSchema(s);
              tsType = extractedName;
            } else {
              // Inline object type
              const props = Object.entries(s.properties).map(([name, propSchema]) => {
                const propType = this.schemaToTypeScript(propSchema);
                return `${name}: ${propType}`;
              }).join('; ');
              tsType = `{ ${props} }`;
            }
          } else {
            tsType = 'Record<string, unknown>';
          }
          break;
        default:
          tsType = 'unknown';
      }
    }

    return s.nullable ? `${tsType} | null` : tsType;
  }

  /**
   * Check if a nested object schema should be extracted as a separate interface
   */
  private shouldExtractNestedSchema(schema: { properties?: Record<string, unknown> }): boolean {
    if (!schema.properties) return false;

    // Extract if it has 3 or more properties (significant complexity)
    const propCount = Object.keys(schema.properties).length;
    return propCount >= 3;
  }

  /**
   * Extract a nested schema and return its type name
   */
  private extractNestedSchema(schema: { properties?: Record<string, unknown> }): string {
    // Generate a hash or signature for deduplication
    const schemaKey = JSON.stringify(schema);

    // Check if this schema has a component name from OpenAPI spec
    if (this.componentSchemas[schemaKey]) {
      const componentName = this.componentSchemas[schemaKey];
      // Store it so it gets generated
      if (!this.extractedSchemas.has(schemaKey)) {
        this.extractedSchemas.set(schemaKey, { schema, name: componentName });
      }
      return componentName;
    }

    // Check if we've already extracted this exact schema
    if (this.extractedSchemas.has(schemaKey)) {
      return this.extractedSchemas.get(schemaKey)!.name;
    }

    // Generate a name (fallback for schemas not in components)
    this.schemaCounter++;
    const name = `NestedType${this.schemaCounter}`;

    // Store it
    this.extractedSchemas.set(schemaKey, { schema, name });

    return name;
  }

  /**
   * Convert our type to JSON Schema type string
   */
  private typeToJsonSchemaType(type: string): string {
    switch (type) {
      case 'string':
        return 'string';
      case 'number':
        return 'number';
      case 'boolean':
        return 'boolean';
      case 'object':
        return 'object';
      case 'array':
        return 'array';
      default:
        return 'string';
    }
  }

  /**
   * Generate code files
   */
  private async generateFiles(
    spec: MCPServerSpec,
    request: GenerationRequest
  ): Promise<GeneratedFile[]> {
    const language = request.options?.language || TargetLanguage.TypeScript;

    logger.debug('Generating files', { language, toolCount: spec.tools.length });

    switch (language) {
      case TargetLanguage.TypeScript:
        return this.generateTypeScriptFiles(spec, request);
      case TargetLanguage.Python:
        return this.generatePythonFiles(spec, request);
      default:
        throw new GenerationError(`Unsupported language: ${language}`);
    }
  }

  /**
   * Generate TypeScript files
   */
  private async generateTypeScriptFiles(
    spec: MCPServerSpec,
    request: GenerationRequest
  ): Promise<GeneratedFile[]> {
    const files: GeneratedFile[] = [];

    // Generate main server file
    const template = await this.loadTemplate('typescript-server');

    // Sanitize name for use in identifiers (replace hyphens with underscores)
    const safeName = spec.config.name.replace(/-/g, '_');

    const templateData: Record<string, unknown> = {
      name: safeName,
      version: spec.config.version,
      description: spec.config.description,
      apiBaseUrl: request.apiSchema.servers[0]?.url || 'https://api.example.com',
      hasAuth: !!request.apiSchema.authentication && request.apiSchema.authentication.type !== 'none',
      authType: request.apiSchema.authentication?.type || 'none',
      authEnvVar: `${safeName.toUpperCase()}_API_KEY`,
      authHeaderName: 'X-API-Key',
      tools: spec.tools.map((tool) => {
        const endpoint = this.findEndpointForTool(tool.name, request.apiSchema);
        const params = Object.entries(tool.inputSchema.properties).map(([paramName, param]) => {
          const toolParam = param as MCPToolParameter;

          // Reconstruct schema object for schemaToZodType
          const schema: { type?: string; enum?: string[]; items?: unknown } = {
            type: toolParam.type,
          };
          if (toolParam.enum) schema.enum = toolParam.enum;
          if (toolParam.items) schema.items = toolParam.items;

          return {
            ...toolParam,
            name: paramName,
            zodType: this.schemaToZodType(schema),
            jsonSchemaType: this.typeToJsonSchemaType(toolParam.type),
          };
        });

        // Categorize parameters by location
        const pathParams = endpoint?.parameters?.filter(p => p.in === 'path').map(p => ({
          name: p.name,
          ...params.find(param => param.name === p.name),
        })) || [];

        const queryParams = endpoint?.parameters?.filter(p => p.in === 'query').map(p => ({
          name: p.name,
          ...params.find(param => param.name === p.name),
        })) || [];

        const bodyParams = params.filter(p =>
          !pathParams.some(pp => pp.name === p.name) &&
          !queryParams.some(qp => qp.name === p.name)
        );

        // Extract response type
        const responses = endpoint?.responses as Record<string, { content?: Record<string, { schema?: unknown }> }> | undefined;
        const responseSchema = responses?.['200']?.content?.['application/json']?.schema
          || responses?.['201']?.content?.['application/json']?.schema;
        const responseTypeName = responseSchema && endpoint ? this.getResponseTypeName(endpoint) : undefined;

        return {
          name: tool.name,
          description: tool.description,
          parameters: params,
          endpoint,
          hasPathParams: pathParams.length > 0,
          hasQueryParams: queryParams.length > 0,
          hasBodyParams: bodyParams.length > 0,
          pathParams,
          queryParams,
          bodyParams,
          responseTypeName,
          responseSchema,
        };
      }),
    };

    // Deduplicate response schemas before generating interfaces
    const tools = templateData.tools as Array<{ responseSchema?: unknown; responseTypeName: string }>;
    const responseSchemaMap = new Map<string, { names: string[]; schema: unknown }>();

    for (const tool of tools) {
      if (tool.responseSchema) {
        const schemaKey = JSON.stringify(tool.responseSchema);
        const existing = responseSchemaMap.get(schemaKey);
        if (existing) {
          // Same schema - reuse the first name
          existing.names.push(tool.responseTypeName);
        } else {
          responseSchemaMap.set(schemaKey, {
            names: [tool.responseTypeName],
            schema: tool.responseSchema
          });
        }
      }
    }

    // Generate one interface per unique schema
    const responseInterfaces = Array.from(responseSchemaMap.values())
      .map(({ names, schema }) => {
        const schemaKey = JSON.stringify(schema);

        // Check if this schema has a component name
        const componentName = this.componentSchemas[schemaKey];
        const canonicalName = componentName || names[0];

        // Check if already extracted as nested schema
        const alreadyExtracted = this.extractedSchemas.has(schemaKey);

        let interfaceCode = '';
        if (!alreadyExtracted) {
          // Only generate interface if not already extracted
          interfaceCode = this.generateInterface(canonicalName, schema);
        }

        // Get the name from extracted schemas if it exists
        const extractedName = alreadyExtracted ? this.extractedSchemas.get(schemaKey)!.name : null;
        const referenceName = extractedName || canonicalName;

        // Add type aliases for all names
        const namesToAlias = alreadyExtracted
          ? names  // Alias all names if already extracted
          : (componentName ? names : names.slice(1));  // Otherwise follow existing logic

        const aliases = namesToAlias
          .filter(name => name !== referenceName)  // Don't alias to itself
          .map(alias => `export type ${alias} = ${referenceName};`)
          .join('\n');

        return [interfaceCode, aliases].filter(Boolean).join('\n');
      })
      .filter(i => i)
      .join('\n\n');

    // Generate nested schema interfaces
    const nestedInterfaces = Array.from(this.extractedSchemas.values())
      .map(({ schema, name }) => this.generateInterface(name, schema))
      .filter(i => i)
      .join('\n');

    // Generate Zod schemas for nested types
    const nestedZodSchemas = Array.from(this.extractedSchemas.values())
      .map(({ schema, name }) => this.generateZodSchema(name, schema))
      .filter(i => i)
      .join('\n\n');

    // Combine all type interfaces (nested first, then responses)
    const allInterfaces = [nestedInterfaces, responseInterfaces]
      .filter(i => i)
      .join('\n\n');

    templateData.responseInterfaces = allInterfaces;
    templateData.nestedZodSchemas = nestedZodSchemas;

    const serverCode = template(templateData);

    files.push({
      path: 'src/index.ts',
      content: serverCode,
      type: 'source',
      language: 'typescript',
      size: serverCode.length,
    });

    // Generate package.json
    const packageJson = this.generatePackageJson(spec, request);
    files.push({
      path: 'package.json',
      content: JSON.stringify(packageJson, null, 2),
      type: 'config',
      size: 0,
    });

    // Generate tsconfig.json
    const tsconfig = this.generateTsConfig();
    files.push({
      path: 'tsconfig.json',
      content: JSON.stringify(tsconfig, null, 2),
      type: 'config',
      size: 0,
    });

    // Generate README.md
    const readme = this.generateReadme(spec, request);
    files.push({
      path: 'README.md',
      content: readme,
      type: 'doc',
      size: readme.length,
    });

    // Generate tests if requested
    if (request.options?.includeTests) {
      const testTemplate = await this.loadTemplate('typescript-test');
      const testCode = testTemplate(templateData);
      files.push({
        path: 'src/index.test.ts',
        content: testCode,
        type: 'test',
        language: 'typescript',
        size: testCode.length,
      });
    }

    // Generate deployment configurations
    const dockerfileTemplate = await this.loadTemplate('dockerfile');
    const dockerfile = dockerfileTemplate(templateData);
    files.push({
      path: 'Dockerfile',
      content: dockerfile,
      type: 'config',
      size: dockerfile.length,
    });

    const cloudRunTemplate = await this.loadTemplate('cloudrun.yaml');
    const cloudRunConfig = cloudRunTemplate(templateData);
    files.push({
      path: 'deploy/cloudrun.yaml',
      content: cloudRunConfig,
      type: 'config',
      size: cloudRunConfig.length,
    });

    const lambdaTemplate = await this.loadTemplate('lambda.yaml');
    const lambdaConfig = lambdaTemplate(templateData);
    files.push({
      path: 'deploy/lambda.yaml',
      content: lambdaConfig,
      type: 'config',
      size: lambdaConfig.length,
    });

    return files;
  }

  /**
   * Generate Python files (placeholder)
   */
  private async generatePythonFiles(
    _spec: MCPServerSpec,
    _request: GenerationRequest
  ): Promise<GeneratedFile[]> {
    // TODO: Implement Python generation
    throw new GenerationError('Python generation not yet implemented');
  }

  /**
   * Find endpoint for tool
   */
  private findEndpointForTool(toolName: string, apiSchema: APISchema): APIEndpoint | undefined {
    return apiSchema.endpoints.find((e) => {
      const generatedName = this.generateToolName(e);
      return generatedName === toolName;
    });
  }

  /**
   * Format generated files
   */
  private async formatFiles(files: GeneratedFile[]): Promise<GeneratedFile[]> {
    return Promise.all(
      files.map(async (file) => {
        if (file.type === 'source' && file.language === 'typescript') {
          try {
            const formatted = await format(file.content, {
              parser: 'typescript',
              singleQuote: true,
              trailingComma: 'es5',
              printWidth: 100,
            });
            return { ...file, content: formatted, size: formatted.length };
          } catch (error) {
            logger.warn('Failed to format file', { path: file.path, error });
            return file;
          }
        }
        return file;
      })
    );
  }

  /**
   * Generate package.json
   */
  private generatePackageJson(spec: MCPServerSpec, request: GenerationRequest): object {
    const scripts: Record<string, string> = {
      build: 'tsc',
      dev: 'tsc --watch',
      start: 'node dist/index.js',
    };

    const devDependencies: Record<string, string> = {
      '@types/node': '^20.11.5',
      typescript: '^5.3.3',
    };

    // Add test script and dependencies if tests are enabled
    if (request.options?.includeTests) {
      scripts.test = 'vitest run';
      scripts['test:watch'] = 'vitest';
      scripts['test:ui'] = 'vitest --ui';
      scripts['test:coverage'] = 'vitest run --coverage';

      devDependencies.vitest = '^1.2.0';
      devDependencies['@vitest/ui'] = '^1.2.0';
      devDependencies['@vitest/coverage-v8'] = '^1.2.0';
    }

    return {
      name: spec.config.name,
      version: spec.config.version,
      description: spec.config.description,
      type: 'module',
      bin: {
        [spec.config.name]: './dist/index.js',
      },
      scripts,
      dependencies: {
        '@modelcontextprotocol/sdk': '^0.5.0',
        zod: '^3.22.4',
      },
      devDependencies,
    };
  }

  /**
   * Generate tsconfig.json
   */
  private generateTsConfig(): object {
    return {
      compilerOptions: {
        target: 'ES2022',
        module: 'NodeNext',
        moduleResolution: 'NodeNext',
        outDir: './dist',
        rootDir: './src',
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
      },
      include: ['src/**/*'],
      exclude: ['node_modules', 'dist', 'src/**/*.test.ts'],
    };
  }

  /**
   * Generate README.md
   */
  private generateReadme(spec: MCPServerSpec, _request: GenerationRequest): string {
    return `# ${spec.config.name}

${spec.config.description}

## Installation

\`\`\`bash
npm install
npm run build
\`\`\`

## Usage

\`\`\`bash
npm start
\`\`\`

## Available Tools

${spec.tools.map((tool) => `- **${tool.name}**: ${tool.description}`).join('\n')}

## Configuration

Set the following environment variables:

- \`${spec.config.name.toUpperCase().replace(/-/g, '_')}_API_KEY\`: Your API key

---

Generated by [Magic MCP](https://magic-mcp.com)
`;
  }

  /**
   * Utility: Sanitize name for package/file names
   */
  private sanitizeName(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  /**
   * Utility: Convert to snake_case
   */
  private toSnakeCase(str: string): string {
    return str
      .replace(/([A-Z])/g, '_$1')
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
  }
}
