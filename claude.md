# Claude Development Guide for Magic MCP

**Last Updated**: October 5, 2025
**Current Phase**: 2F Complete (Automated Test Generation)
**Next Phase**: 3 (AI Semantic Naming, Multi-Cloud Deployment)

## Project Overview

Magic MCP is an enterprise-grade MCP (Model Context Protocol) server generator that transforms OpenAPI specifications into production-ready TypeScript servers. The generator uses AI (Vertex AI Gemini) for schema analysis and Handlebars templates for code generation.

### Core Value Proposition
- **Input**: OpenAPI 2.0/3.0/3.1 specification (YAML or JSON)
- **Output**: Fully-typed TypeScript MCP server with Zod validation
- **Quality**: Production-ready code with 99/100 security score

## Architecture

### Package Structure (Monorepo)
```
packages/
├── cli/              # Command-line interface (Commander.js)
├── parser/           # OpenAPI parser (@apidevtools/swagger-parser)
├── generator/        # Code generator (Handlebars + Vertex AI)
├── security/         # Security scanner (10+ vulnerability categories)
└── shared/           # Shared types and utilities
```

### Key Technologies
- **TypeScript**: ES Modules with NodeNext resolution
- **Zod**: Runtime validation with type inference
- **Handlebars**: Template-based code generation
- **Vertex AI Gemini**: AI-powered schema analysis (gemini-2.0-flash-exp)
- **Turborepo**: Monorepo build orchestration
- **Prettier**: Code formatting

### Data Flow
```
OpenAPI Spec → Parser → AI Analysis → MCP Spec → Template → Generated Code → Security Scan
```

## Current State (Phase 2F Complete)

### Completed Features

**Phase 1: Foundation**
- ✅ Monorepo setup with Turborepo
- ✅ OpenAPI parser (supports v2.0, v3.0, v3.1)
- ✅ Template-based code generation
- ✅ CLI with Commander.js

**Phase 2A: AI Generation Quality**
- ✅ Proper Zod type mapping (not z.unknown())
- ✅ Path parameter replacement
- ✅ Class name sanitization
- ✅ Request body extraction (JSON + form-urlencoded)

**Phase 2B: Real-World API Testing**
- ✅ Tested with Stripe API (572 endpoints)
- ✅ Tested with GitHub API (1,350 endpoints)
- ✅ Enum support in Zod schemas
- ✅ Proper descriptions from OpenAPI

**Phase 2C: Response Types & Advanced Features**
- ✅ TypeScript response type generation
- ✅ Nested schema extraction (3+ properties)
- ✅ Response type deduplication (type aliases)
- ✅ OpenAPI component name preservation (`Repository` not `NestedType1`)
- ✅ Array item type extraction
- ✅ Circular reference handling

**Phase 2D: Zod Array Schemas**
- ✅ Proper array item types: `z.array(z.string())` instead of `z.array(z.unknown())`
- ✅ Complex object arrays: `z.array(RepositorySchema)`
- ✅ Nested Zod schema generation for extracted types
- ✅ Full runtime validation type safety

**Phase 2E: Global Type Deduplication**
- ✅ Single source of truth for each type
- ✅ Eliminated duplicate interface declarations
- ✅ Type aliases for response schemas
- ✅ 40-60% code reduction

**Phase 2F: Automated Test Generation**
- ✅ Vitest test file generation
- ✅ Comprehensive test coverage (26 tests for GitHub API)
- ✅ Input validation, parameter handling, error handling tests
- ✅ Integration and type safety tests
- ✅ Automatic dependency management

### Key Files

**Templates**
- `packages/generator/src/templates/typescript-server.hbs` - Main server template
  - Line 35: `{{{responseInterfaces}}}` - Response types injection point
  - Line 40-43: `{{{nestedZodSchemas}}}` - Nested Zod schemas for array items
  - Line 47: `z.{{{zodType}}}` - Zod validation (triple braces prevent HTML escaping)
  - Line 113: `Promise<{{responseTypeName}}>` - Typed response returns
- `packages/generator/src/templates/typescript-test.hbs` - Test template
  - Generates comprehensive Vitest test suites
  - Input validation tests for each endpoint
  - Parameter handling tests (path, query, body)
  - Error handling and type safety tests

**Core Generator Logic**
- `packages/generator/src/generator/mcp-generator.ts`
  - Line 56-71: `eq` helper - Works as both block helper and subexpression
  - Line 84-100: `generate()` - Main entry point, resets state
  - Line 142-161: `analyzeSchema()` - AI analysis with circular ref handling
  - Line 310-407: `schemaToZodType()` - NEW: Converts schemas to Zod with array support
  - Line 433-471: `generateInterface()` - Creates TypeScript interfaces from schemas
  - Line 473-506: `generateZodSchema()` - NEW: Generates Zod schemas for extracted types
  - Line 508-574: `schemaToTypeScript()` - Converts JSON Schema to TS types
  - Line 543-574: `extractNestedSchema()` - Extracts nested objects, checks component names
  - Line 732-767: Response deduplication - Checks extractedSchemas, skips duplicates
  - Line 826-837: Test generation - Generates test file when includeTests=true
  - Line 891-930: `generatePackageJson()` - Adds Vitest deps/scripts when tests enabled

**Parser**
- `packages/parser/src/openapi/parser.ts`
  - Line 33-34: Parses original spec before dereferencing (preserves $ref)
  - Line 84-107: `extractComponentNames()` - Extracts components/schemas names
  - Line 262-299: `parseV3()` - Parses OpenAPI 3.x, includes component names in output

**Type Definitions**
- `packages/shared/src/types/api.ts`
  - Line 117-119: `components.schemas` field - Maps schema hash → component name

## Development Patterns

### Code Generation Flow

1. **Parse OpenAPI**
   ```typescript
   const originalApi = await $RefParser.parse(spec);  // Keep $ref
   const componentNames = extractComponentNames(originalApi);
   const api = await $RefParser.validate(spec);  // Dereference
   ```

2. **Extract Parameters**
   ```typescript
   // Path, query, header params
   for (const param of endpoint.parameters) {
     const schema = param.schema as { type?: string; enum?: string[] };
     params.push({
       name: param.name,
       type: this.schemaToType(param.schema),
       enum: schema?.enum,  // Preserve enums!
     });
   }
   ```

3. **Generate Zod Schemas**
   ```typescript
   // In template
   {{name}}: z.{{{zodType}}}  // Triple braces = no HTML escaping

   // For enums
   typeToZodType('string', ['all', 'public'])
   // Returns: "enum(['all', 'public'])"
   ```

4. **Generate Response Types**
   ```typescript
   // Check component names first
   const componentName = this.componentSchemas[schemaKey];
   const canonicalName = componentName || generateName();

   // Create interface
   export interface Repository { ... }

   // Create aliases for duplicates
   export type GetResponse = Repository;
   ```

### Template Conventions

**Handlebars Helpers**
- `{{camelCase name}}` - Converts to camelCase
- `{{pascalCase name}}` - Converts to PascalCase
- `{{{zodType}}}` - Triple braces prevent HTML escaping (critical for enums!)
- `{{#if condition}}...{{/if}}` - Conditionals
- `{{#each items}}...{{/each}}` - Loops

**Common Patterns**
```handlebars
{{#each tools}}
const {{pascalCase name}}Schema = z.object({
  {{#each parameters}}
  {{name}}: z.{{{zodType}}}{{#if required}}{{else}}.optional(){{/if}},
  {{/each}}
});
{{/each}}
```

### State Management

The generator maintains state during generation:
```typescript
class MCPGenerator {
  private extractedSchemas: Map<string, { schema: unknown; name: string }>;
  private schemaCounter: number;
  private componentSchemas: Record<string, string>;
}

// Reset at start of each generation
this.extractedSchemas.clear();
this.schemaCounter = 0;
this.componentSchemas = request.apiSchema.components?.schemas || {};
```

### Error Handling Patterns

**Circular References**
```typescript
try {
  const schemaKey = JSON.stringify(schema);
  // ... use schemaKey
} catch (error) {
  logger.debug(`Skipping schema (circular reference)`);
  return fallbackValue;
}
```

**Missing Data**
```typescript
const responseSchema = responses?.['200']?.content?.['application/json']?.schema
  || responses?.['201']?.content?.['application/json']?.schema;
const responseTypeName = responseSchema && endpoint
  ? this.getResponseTypeName(endpoint)
  : undefined;  // Don't generate type if no schema
```

## Testing Strategy

### Manual Testing
```bash
# Build
npm run build

# Test with example API
node packages/cli/dist/cli.js generate examples/github-repos-api.yaml \
  --output test-output \
  --no-tests

# Verify compilation
cd test-output && npm run build
```

### Verification Checklist
- [ ] TypeScript compilation succeeds (no errors)
- [ ] Zod enums use proper quotes (not HTML entities)
- [ ] Response types are fully typed (not `unknown`)
- [ ] Component names preserved (not `NestedType1`)
- [ ] Security scan passes (score > 95)
- [ ] Generated code size reasonable (< 100KB for typical APIs)

### Test APIs
- **Simple**: `examples/petstore-api.yaml` (5 endpoints)
- **Medium**: `examples/github-repos-api.yaml` (5 endpoints, complex schemas)
- **Large**: Stripe full spec (572 endpoints, 6.8MB)

## Known Issues & Limitations

### Current Limitations
1. **Duplicate Interfaces**: Component schemas may be declared twice (nested + response)
   - TypeScript merges them, but it's redundant
   - Future: Global deduplication pass

2. **Generic Array Items**: `z.array(z.unknown())` instead of `z.array(ItemSchema)`
   - Next priority: Zod array schemas with proper item types

3. **Circular Reference Schemas**: Skipped during component extraction
   - Rare in practice, handled gracefully with warning

4. **Large APIs**: Gemini analysis may time out (>10MB specs)
   - Handled with try-catch, returns empty analysis

### Bug History (Fixed)

**Bug 1: Handlebars `eq` Helper** (Fixed in Phase 2C)
- Issue: Returned boolean `true` output as `1` in generated code
- Fix: Proper block helper with `options.fn()` and `options.inverse()`

**Bug 2: HTML Entity Encoding** (Fixed in Phase 2C)
- Issue: Zod enums had `&#x27;` instead of `'`
- Fix: Use `{{{zodType}}}` (triple braces) to disable HTML escaping

**Bug 3: Missing DELETE Response Type** (Fixed in Phase 2C)
- Issue: 204 No Content endpoints generated `Promise<DeleteResponse>` but type didn't exist
- Fix: Only set `responseTypeName` when `responseSchema` exists

## Next Priorities (Phase 2D)

### 1. Zod Array Schemas (High Impact, Low Effort)
**Goal**: Generate `z.array(ItemSchema)` for runtime validation

**Current**:
```typescript
export type ListResponse = Repository[];  // TypeScript only
const ListSchema = z.array(z.unknown());  // No validation!
```

**Target**:
```typescript
export type ListResponse = Repository[];
const RepositorySchema = z.object({ ... });
const ListSchema = z.array(RepositorySchema);  // Proper validation!
```

**Implementation**:
- Detect array response types
- Generate Zod schemas for item types
- Reference in array validator

### 2. Test Generation (High Value, High Effort)
**Goal**: Auto-generate Vitest tests with mock data

**Features**:
- Example requests for each endpoint
- Mock responses from schemas
- Basic integration tests
- Test data generation from Zod schemas

**Implementation**:
- New template: `vitest-tests.hbs`
- Generate `tests/` directory
- Use `@faker-js/faker` for mock data

### 3. Multi-Cloud Deployment (Phase 2E)
**Goal**: Deploy generated MCPs to various platforms

**Targets**:
- Google Cloud Run (Dockerfile + cloudbuild.yaml)
- AWS Lambda (handler wrapper)
- Cloudflare Workers (adapter)

## Coding Guidelines

### TypeScript Style
- Use **explicit types** for public APIs
- Use **type guards** for narrowing (`tool is { responseSchema: unknown }`)
- Prefer **const** over let
- Use **async/await** over promises
- Export types with **export type** (not just export)

### Logging
```typescript
import { logger } from '@magic-mcp/shared';

logger.debug('Detail for developers');
logger.info('Important milestones');
logger.warn('Recoverable issues');
logger.error('Failures', error as Error);
```

### Error Handling
```typescript
try {
  // Operation
} catch (error) {
  logger.error('Operation failed', error as Error);
  throw new GenerationError('User-friendly message', {
    error: error instanceof Error ? error.message : String(error),
  });
}
```

### Naming Conventions
- **Files**: kebab-case (`mcp-generator.ts`)
- **Classes**: PascalCase (`MCPGenerator`)
- **Methods**: camelCase (`generateInterface()`)
- **Constants**: UPPER_SNAKE_CASE (`CONFIG`)
- **Private methods**: prefix with `private`

## Environment Setup

### Google Cloud (for Vertex AI)
```bash
# Configure gcloud for project
gcloud config configurations create magic-mcp
gcloud auth login
gcloud config set project magic-mcp-ai
gcloud auth application-default login

# Enable Vertex AI API
gcloud services enable aiplatform.googleapis.com

# Grant permissions
gcloud projects add-iam-policy-binding magic-mcp-ai \
  --member="user:YOUR_EMAIL" \
  --role="roles/aiplatform.user"
```

### Environment Variables (.env)
```bash
GOOGLE_CLOUD_PROJECT=magic-mcp-ai
GOOGLE_CLOUD_LOCATION=us-central1
VERTEX_AI_MODEL=gemini-2.0-flash-exp
VERTEX_AI_LOCATION=us-central1
LOG_LEVEL=debug  # or info, warn, error
```

## Performance Considerations

### Build Time
- Current: ~1.5s for full build (Turborepo caching)
- Optimization: Incremental builds, watch mode available

### Generation Time
- Simple API (5 endpoints): ~10s
- Medium API (50 endpoints): ~15s
- Large API (500 endpoints): ~30s
- Bottleneck: Gemini AI analysis (can be skipped with flag)

### Generated Code Size
- Typical API: 10-30KB TypeScript
- Large API: 50-100KB TypeScript
- Compiled: ~80% of source size

## Debugging Tips

### Enable Debug Logging
```bash
LOG_LEVEL=debug node packages/cli/dist/cli.js generate ...
```

### Check Generated Code Before Formatting
Comment out the `formatFiles()` call to see raw template output

### Inspect Template Data
Add `console.error(JSON.stringify(templateData, null, 2))` before template compilation

### Test Template Changes Without Full Build
```bash
# Copy template to dist
cp packages/generator/src/templates/typescript-server.hbs \
   packages/generator/dist/templates/

# Test without rebuilding
node packages/cli/dist/cli.js generate ...
```

### Verify Parser Output
```bash
node -e "
import { OpenAPIParser } from './packages/parser/dist/openapi/parser.js';
const parser = new OpenAPIParser();
const result = await parser.parse('./examples/github-repos-api.yaml');
console.log(JSON.stringify(result, null, 2));
"
```

## Git Workflow

### Branch Strategy
- `main` - Production-ready code
- `develop` - Integration branch
- `feature/*` - New features
- `fix/*` - Bug fixes

### Commit Message Format
```
<type>(<scope>): <subject>

<body>

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

**Types**: feat, fix, docs, style, refactor, test, chore

### Before Committing
1. Run `npm run build` - Ensure clean build
2. Test with example API - Verify generation works
3. Check git diff - Review all changes
4. Update documentation - If public API changed

## Resources

### Documentation Files
- `PHASE_1_COMPLETE.md` - Foundation work
- `PHASE_2A_COMPLETE.md` - AI generation quality
- `PHASE_2B_COMPLETE.md` - Real-world API testing
- `PHASE_2C_COMPLETE.md` - Response type generation & bug fixes
- `PHASE_2C_ADVANCED_COMPLETE.md` - Nested schemas & deduplication
- `PHASE_2C_COMPONENT_NAMES.md` - OpenAPI component preservation

### Key Dependencies
- `@apidevtools/swagger-parser` - OpenAPI parsing/dereferencing
- `@modelcontextprotocol/sdk` - MCP protocol implementation
- `@google-cloud/aiplatform` - Vertex AI client
- `handlebars` - Template engine
- `zod` - Runtime validation
- `commander` - CLI framework

### External Links
- [MCP Documentation](https://modelcontextprotocol.io)
- [OpenAPI Specification](https://spec.openapis.org/oas/latest.html)
- [Vertex AI Gemini](https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference/gemini)

## Quick Reference

### Build & Test
```bash
npm run build                    # Build all packages
npm run dev                      # Watch mode
npm run clean                    # Clean dist/

# Generate MCP
node packages/cli/dist/cli.js generate <spec> --output <dir>

# Options
--no-tests                       # Skip test generation
--name <name>                    # Custom MCP name
--project <id>                   # GCP project
```

### Common Tasks

**Add new template variable**:
1. Add to `templateData` object in `generateTypeScriptFiles()`
2. Use in template with `{{variableName}}`
3. Rebuild: `npm run build`

**Add new Handlebars helper**:
1. Register in `registerHelpers()` method
2. Use in template with `{{helperName arg}}`

**Add new Zod type**:
1. Update `typeToZodType()` method
2. Add case for new JSON Schema type
3. Test with example that uses the type

**Add component schema support for new feature**:
1. Extract in parser `extractComponentNames()`
2. Pass through `APISchema.components.schemas`
3. Check in generator `this.componentSchemas[schemaKey]`

## Contact & Support

This project is designed to be continued by future Claude sessions. All architecture decisions, patterns, and gotchas are documented here.

**For new Claude sessions**:
1. Read this file completely
2. Review phase completion docs (PHASE_*.md)
3. Check current TODO list
4. Build and test to verify environment
5. Continue with next priority

**For humans**:
- GitHub Issues: [Report bugs or request features]
- Pull Requests: Welcome with tests!
- Discussions: Architecture questions, feature proposals
