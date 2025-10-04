# Contributing to Magic MCP

Thank you for your interest in contributing to Magic MCP! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## Getting Started

### Prerequisites

- Node.js 20+
- npm 9+
- Git
- Google Cloud account (for testing AI features)

### Development Setup

1. **Fork and clone the repository**

```bash
git clone https://github.com/YOUR_USERNAME/magic-mcp.git
cd magic-mcp
```

2. **Install dependencies**

```bash
npm install
```

3. **Build all packages**

```bash
npm run build
```

4. **Run tests**

```bash
npm test
```

## Project Structure

```
magic-mcp/
├── packages/
│   ├── shared/       # Common types and utilities
│   ├── parser/       # API schema parsers
│   ├── generator/    # AI-powered code generation
│   ├── security/     # Security scanning
│   ├── deployer/     # Multi-cloud deployment (future)
│   └── cli/          # Command-line interface
├── examples/         # Example APIs and generated servers
├── docs/             # Documentation
└── infrastructure/   # Infrastructure as code (future)
```

## Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

Use prefixes:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test improvements

### 2. Make Your Changes

Follow these guidelines:

**Code Style**
- Use TypeScript strict mode
- Follow ESLint and Prettier configurations
- Write meaningful variable and function names
- Add JSDoc comments for public APIs

**Testing**
- Write unit tests for new functionality
- Ensure all tests pass before committing
- Aim for >80% code coverage

**Security**
- Never commit secrets or credentials
- Follow security best practices
- Run security scans on changes

### 3. Test Your Changes

```bash
# Type check
npm run type-check

# Lint
npm run lint

# Format
npm run format

# Test
npm test

# Build
npm run build
```

### 4. Commit Your Changes

We use conventional commits:

```bash
git commit -m "feat(generator): add Python code generation support"
git commit -m "fix(security): resolve prompt injection vulnerability"
git commit -m "docs(readme): update installation instructions"
```

**Commit types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code style changes
- `refactor` - Code refactoring
- `test` - Test updates
- `chore` - Build/config changes

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a pull request on GitHub with:
- Clear title and description
- Reference to related issues
- Screenshots/demos if applicable
- Test results

## Development Guidelines

### TypeScript

- Use strict type checking
- Avoid `any` types
- Use Zod for runtime validation
- Export types from `@magic-mcp/shared`

### Error Handling

- Use custom error classes from `@magic-mcp/shared`
- Provide helpful error messages
- Log errors appropriately

### Logging

- Use the logger from `@magic-mcp/shared`
- Set appropriate log levels
- Include context in log messages

### Security

- Validate all user inputs
- Sanitize outputs
- Use environment variables for secrets
- Follow OWASP guidelines

## Testing

### Unit Tests

Use Vitest for unit tests:

```typescript
import { describe, it, expect } from 'vitest';
import { MyFunction } from './my-function.js';

describe('MyFunction', () => {
  it('should handle valid input', () => {
    const result = MyFunction('valid-input');
    expect(result).toBe('expected-output');
  });

  it('should throw on invalid input', () => {
    expect(() => MyFunction('invalid')).toThrow();
  });
});
```

### Integration Tests

Test complete workflows:

```typescript
describe('MCP Generation', () => {
  it('should generate valid MCP from OpenAPI', async () => {
    const parser = new OpenAPIParser();
    const schema = await parser.parse('./test/fixtures/api.yaml');

    const generator = new MCPGenerator(mockGemini);
    const result = await generator.generate({ apiSchema: schema });

    expect(result.success).toBe(true);
    expect(result.files.length).toBeGreaterThan(0);
  });
});
```

## Documentation

### Code Documentation

Add JSDoc comments to public APIs:

```typescript
/**
 * Generate MCP server from API schema
 *
 * @param request - Generation request with API schema and options
 * @returns Generation result with files and metadata
 * @throws {GenerationError} If generation fails
 *
 * @example
 * ```typescript
 * const result = await generator.generate({
 *   apiSchema: schema,
 *   options: { language: TargetLanguage.TypeScript }
 * });
 * ```
 */
async generate(request: GenerationRequest): Promise<GenerationResult> {
  // Implementation
}
```

### User Documentation

Update relevant docs in `/docs`:
- `getting-started.md` - User guides
- `api-reference.md` - API documentation
- `architecture.md` - System design
- `security.md` - Security practices

## Pull Request Process

1. **Ensure all checks pass**
   - Tests passing ✓
   - Linting passing ✓
   - Type checking passing ✓
   - Security scan passing ✓

2. **Update documentation**
   - Add/update relevant docs
   - Update CHANGELOG.md
   - Add examples if needed

3. **Request review**
   - Tag relevant maintainers
   - Respond to feedback
   - Make requested changes

4. **After approval**
   - Squash commits if requested
   - Maintainer will merge

## Release Process

Releases are managed by maintainers using changesets:

```bash
# Create a changeset
npx changeset

# Publish (maintainers only)
npx changeset version
npm run build
npx changeset publish
```

## Getting Help

- **Discord**: Join our [Discord community](https://discord.gg/magic-mcp)
- **GitHub Discussions**: Ask questions in [Discussions](https://github.com/magic-mcp/magic-mcp/discussions)
- **Email**: development@magic-mcp.com

## Areas for Contribution

We especially welcome contributions in these areas:

### High Priority
- [ ] Python MCP server generation
- [ ] Go language support
- [ ] GraphQL schema parser
- [ ] AWS Lambda deployment
- [ ] Azure Functions deployment
- [ ] Enhanced security rules

### Medium Priority
- [ ] VS Code extension
- [ ] Web dashboard
- [ ] Template library
- [ ] Performance optimizations
- [ ] Better error messages

### Nice to Have
- [ ] Cloudflare Workers deployment
- [ ] gRPC support
- [ ] Additional test coverage
- [ ] Internationalization
- [ ] Video tutorials

## Recognition

Contributors are recognized in:
- README.md contributors section
- Release notes
- Project website

Thank you for contributing to Magic MCP! 🎉
