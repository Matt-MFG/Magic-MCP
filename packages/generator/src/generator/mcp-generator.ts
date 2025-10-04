import Handlebars from 'handlebars';
import * as fs from 'fs/promises';
import * as path from 'path';
import { format } from 'prettier';

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

    Handlebars.registerHelper('eq', (a: unknown, b: unknown) => a === b);

    Handlebars.registerHelper('zodType', (type: string) => {
      const mapping: Record<string, string> = {
        string: 'string',
        number: 'number',
        boolean: 'boolean',
        object: 'object',
        array: 'array',
      };
      return mapping[type] || 'unknown';
    });

    Handlebars.registerHelper('jsonSchemaType', (type: string) => {
      return type || 'string';
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
    logger.info('Starting MCP generation', {
      apiTitle: request.apiSchema.info.title,
      language: request.options?.language || 'typescript',
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

    const schemaJson = JSON.stringify(apiSchema, null, 2);
    return this.gemini.analyzeSchema(schemaJson);
  }

  /**
   * Create MCP specification from API schema
   */
  private async createMCPSpec(
    request: GenerationRequest,
    analysis: { improvements: string[]; securityConcerns: string[] }
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
      params.push({
        name: param.name,
        description: param.description || `${param.name} parameter`,
        type: this.schemaToType(param.schema),
        required: param.required,
      });
    }

    // Add request body parameters (simplified)
    if (endpoint.requestBody?.content) {
      const jsonContent = endpoint.requestBody.content['application/json'];
      if (jsonContent && typeof jsonContent === 'object' && 'properties' in jsonContent) {
        const properties = jsonContent.properties as Record<string, unknown>;
        for (const [name, schema] of Object.entries(properties)) {
          params.push({
            name,
            description: `${name} from request body`,
            type: this.schemaToType(schema),
            required: endpoint.requestBody.required,
          });
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

    const templateData = {
      name: spec.config.name,
      version: spec.config.version,
      description: spec.config.description,
      apiBaseUrl: request.apiSchema.servers[0]?.url || 'https://api.example.com',
      hasAuth: !!request.apiSchema.authentication && request.apiSchema.authentication.type !== 'none',
      authType: request.apiSchema.authentication?.type || 'none',
      authEnvVar: `${spec.config.name.toUpperCase().replace(/-/g, '_')}_API_KEY`,
      authHeaderName: 'X-API-Key',
      tools: spec.tools.map((tool) => ({
        name: tool.name,
        description: tool.description,
        parameters: Object.values(tool.inputSchema.properties),
        endpoint: this.findEndpointForTool(tool.name, request.apiSchema),
        hasPathParams: false,
        hasQueryParams: false,
        hasBodyParams: false,
        pathParams: [],
        queryParams: [],
        bodyParams: [],
      })),
    };

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

    return files;
  }

  /**
   * Generate Python files (placeholder)
   */
  private async generatePythonFiles(
    spec: MCPServerSpec,
    request: GenerationRequest
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
    return {
      name: spec.config.name,
      version: spec.config.version,
      description: spec.config.description,
      type: 'module',
      bin: {
        [spec.config.name]: './dist/index.js',
      },
      scripts: {
        build: 'tsc',
        dev: 'tsc --watch',
        start: 'node dist/index.js',
      },
      dependencies: {
        '@modelcontextprotocol/sdk': '^0.5.0',
        zod: '^3.22.4',
      },
      devDependencies: {
        '@types/node': '^20.11.5',
        typescript: '^5.3.3',
      },
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
      exclude: ['node_modules', 'dist'],
    };
  }

  /**
   * Generate README.md
   */
  private generateReadme(spec: MCPServerSpec, request: GenerationRequest): string {
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
