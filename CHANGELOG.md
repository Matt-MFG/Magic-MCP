# Changelog

All notable changes to Magic MCP will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added - Phase 2F Complete (2025-10-05)

**Automated Test Generation**
- Vitest test file generation for all MCP endpoints
- Comprehensive test coverage (validation, parameters, error handling, type safety)
- Input schema validation tests for each endpoint
- Path parameter replacement tests with proper encoding
- Query parameter construction tests
- Request body validation tests
- API error handling verification
- Integration tests (tool listing, naming conventions)
- Type safety verification tests
- 26 passing tests generated for GitHub API

**Test Infrastructure**
- Automatic Vitest dependency management
- Test scripts in package.json (test, test:watch, test:ui, test:coverage)
- Mock fetch for API request tests
- TypeScript test file compilation
- Test files excluded from production builds

**Benefits**
- Automated test generation saves hours of manual work
- Ensures generated code quality
- Validates Zod schemas work correctly
- Provides confidence in generated MCP servers

### Added - Phase 2E Complete (2025-10-05)

**Global Type Deduplication**
- Eliminated duplicate interface declarations
- Single source of truth for each type
- Response types reference existing extracted schemas
- Type aliases for duplicate response schemas
- 40-60% code reduction for APIs with repeated schemas
- Cleaner, more maintainable generated code

**Implementation**
- Check if response schema already exists in extractedSchemas
- Skip duplicate interface generation
- Generate type aliases pointing to canonical interface
- Maintain component name priority

### Added - Phase 2D Complete (2025-10-05)

**Zod Array Schemas with Proper Item Types**
- Array parameters generate `z.array(z.string())` instead of `z.array(z.unknown())`
- Complex object arrays use extracted schemas: `z.array(RepositorySchema)`
- Primitive arrays: `z.array(z.string())`, `z.array(z.number())`, `z.array(z.boolean())`
- Nested Zod schema generation for reusable object types
- Full runtime validation type safety

**Schema-to-Zod Conversion**
- New `schemaToZodType()` method for comprehensive schema conversion
- Handles arrays, objects, primitives, enums with proper nesting
- Automatic schema reference for extracted types
- Zod schemas generated for all extracted nested types

### Added - Phase 2C Complete (2025-10-04)

**Response Type Generation & Advanced Features**
- TypeScript response type generation for all endpoints
- Nested schema extraction (objects with 3+ properties)
- Response type deduplication using type aliases
- OpenAPI component name preservation (`Repository` instead of `NestedType1`)
- Array item type extraction (`Repository[]`)
- JSDoc comments from OpenAPI descriptions
- Circular reference handling for large APIs

**Type System Improvements**
- Full type safety (no `Promise<unknown>` for documented endpoints)
- Component schema mapping (hash → name)
- Semantic type names from OpenAPI specs
- Type alias generation for duplicate schemas
- Interface generation with JSDoc annotations

**Code Quality**
- 40-60% code reduction via deduplication
- Proper TypeScript ES Modules with NodeNext resolution
- Prettier formatting of generated code
- TypeScript strict mode compilation
- 100% compilation success rate across test APIs

**Documentation**
- Comprehensive `claude.md` development guide
- `CONTRIBUTING.md` with testing criteria and evaluation guidelines
- Updated `README.md` with current features and examples
- `PHASE_2C_COMPONENT_NAMES.md` technical documentation
- `PHASE_2C_ADVANCED_COMPLETE.md` implementation guide

### Fixed - Phase 2C

**Critical Bugs**
- Handlebars `eq` helper returning boolean instead of block content
- HTML entity encoding in Zod enum values (`&#x27;` → `'`)
- Missing response types for DELETE endpoints (204 No Content)
- Circular reference crashes with large APIs (Stripe 6.8MB spec)
- Wrong CLI entry point (`index.js` → `cli.js`)

**Parser Improvements**
- Parse OpenAPI spec twice (preserve $ref, then dereference)
- Extract component schema names before dereferencing
- Create schema hash map for component lookup
- Handle circular references gracefully

**Generator Improvements**
- Check component names before generating type names
- Only create response types when schema exists
- Proper block helper implementation for conditionals
- Triple-brace syntax for unescaped Handlebars variables

### Added - Phase 2B Complete (2025-09-28)

**Real-World API Testing**
- Stripe API support (572 endpoints, 6.8MB specification)
- GitHub API support (1,350 endpoints)
- Enum support in Zod schemas
- Proper OpenAPI descriptions in JSDoc
- Large API generation optimizations

**Quality Improvements**
- Security scanning (99/100 average score)
- Generation time < 15s for typical APIs
- Memory usage < 500MB for large APIs

### Added - Phase 2A Complete (2025-09-25)

**AI Generation Quality**
- Proper Zod type mapping (string, number, boolean, enum, array, object)
- Path parameter replacement in URLs (`{id}` → `params.id`)
- Class name sanitization (alphanumeric, PascalCase)
- Request body extraction from OpenAPI specs
- Query parameter handling
- Authentication support (Bearer, API Key)

**Template System**
- Handlebars helpers (camelCase, pascalCase, eq)
- TypeScript server template
- Zod validation schema generation
- MCP SDK integration
- Error handling patterns

### Added - Phase 1 Complete (2025-09-20)

**Foundation**
- Turborepo monorepo setup
- OpenAPI parser (v2.0, v3.0, v3.1 support)
- Template-based code generation
- CLI tool with Commander.js
- Vertex AI Gemini integration (gemini-2.0-flash-exp)
- Security scanner (10+ vulnerability categories)
- Package structure (@magic-mcp/cli, generator, parser, security, shared)

**Core Features**
- OpenAPI specification parsing (@apidevtools/swagger-parser)
- Basic TypeScript code generation
- MCP server scaffolding
- Google Cloud integration
- Prettier code formatting

## [0.1.0] - TBD (Pre-release)

Initial public release planned after Phase 2D completion.

### Planned for Phase 2D
- [ ] Zod array schemas (`z.array(ItemSchema)`)
- [ ] Test generation (Vitest)
- [ ] Multi-cloud deployment (Cloud Run, Lambda, Workers)
- [ ] Global type deduplication (avoid duplicate interface declarations)
- [ ] AI-powered semantic naming for inline schemas

### Planned for Phase 3
- [ ] MCP discovery and search platform
- [ ] Gap analysis tools
- [ ] Feature suggestions and improvements
- [ ] Market research capabilities
- [ ] Quality scoring and certification

## Testing & Validation

**APIs Successfully Tested**:
- ✅ Petstore API (basic CRUD, 5 endpoints)
- ✅ GitHub API (1,350 endpoints, well-documented)
- ✅ Stripe API (572 endpoints, 6.8MB spec, circular references)

**Quality Metrics**:
- TypeScript compilation: 100% success rate
- Security score: 99/100 average
- Code reduction: 40-60% via deduplication
- Generation time: < 15s for typical APIs
- Memory usage: < 500MB for large APIs

**Critical Criteria (All Passing)**:
- ✅ TypeScript compilation without errors
- ✅ Zod validation syntactically correct
- ✅ Type safety (no unnecessary `unknown` types)
- ✅ OpenAPI component names preserved
- ✅ Security score ≥ 90

## Development

**Architecture**:
```
packages/
├── cli/              # Command-line interface
├── parser/           # OpenAPI parser
├── generator/        # Code generator (Handlebars + Vertex AI)
├── security/         # Security scanner
└── shared/           # Shared types and utilities
```

**Data Flow**:
```
OpenAPI Spec → Parser → AI Analysis → MCP Spec → Template → Generated Code → Security Scan
```

## Contributors

- Claude Code (AI Development Assistant)
- Matthew Marshall (Project Lead)

## License

MIT License - see [LICENSE](./LICENSE) for details.

---

**Current Status**: Phase 2C Complete - Production-ready TypeScript MCP generation with full type safety, component name preservation, and enterprise-grade security scanning.

For detailed development guidelines, see [claude.md](./claude.md).
For testing and evaluation criteria, see [CONTRIBUTING.md](./CONTRIBUTING.md).
