# Contributing to Magic MCP

Thank you for your interest in contributing to Magic MCP! This document provides guidelines for testing, evaluation, and feedback.

## Table of Contents
- [Getting Started](#getting-started)
- [Testing & Evaluation Criteria](#testing--evaluation-criteria)
- [Contribution Guidelines](#contribution-guidelines)
- [Bug Reports](#bug-reports)
- [Feature Requests](#feature-requests)

## Getting Started

### Prerequisites
- Node.js 20+ (tested with v24.3.0)
- npm 10+
- Google Cloud account (for Vertex AI)
- Git

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Magic-MCP.git
   cd Magic-MCP
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Google Cloud** (for AI features)
   ```bash
   # Create new gcloud configuration
   gcloud config configurations create magic-mcp
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID

   # Enable Vertex AI
   gcloud services enable aiplatform.googleapis.com

   # Authenticate for application default credentials
   gcloud auth application-default login
   ```

4. **Create `.env` file**
   ```bash
   GOOGLE_CLOUD_PROJECT=your-project-id
   GOOGLE_CLOUD_LOCATION=us-central1
   VERTEX_AI_MODEL=gemini-2.0-flash-exp
   VERTEX_AI_LOCATION=us-central1
   LOG_LEVEL=info
   ```

5. **Build the project**
   ```bash
   npm run build
   ```

6. **Test with example**
   ```bash
   node packages/cli/dist/cli.js generate \
     examples/github-repos-api.yaml \
     --output test-output \
     --no-tests
   ```

## Testing & Evaluation Criteria

### 1. Code Generation Quality

**Critical Criteria** (Must Pass)
- [ ] **TypeScript Compilation**: Generated code compiles without errors
  ```bash
  cd test-output && npm run build
  # Expected: No TypeScript errors
  ```

- [ ] **Runtime Validation**: Zod schemas are syntactically correct
  ```bash
  grep "z.enum" test-output/src/index.ts
  # Expected: Proper quotes, not HTML entities (&#x27;)
  ```

- [ ] **Type Safety**: No `unknown` types where specific types should exist
  ```bash
  grep -c "Promise<unknown>" test-output/src/index.ts
  # Expected: Only for endpoints with no response schema (e.g., DELETE 204)
  ```

- [ ] **Component Names**: OpenAPI component names preserved
  ```bash
  # If spec has components/schemas/Repository
  grep "export interface Repository" test-output/src/index.ts
  # Expected: Found (not NestedType1)
  ```

**Important Criteria** (Should Pass)
- [ ] **Security Score**: ≥ 95/100
  ```bash
  # Check CLI output during generation
  # Expected: "Security scan passed (score: XX/100)" where XX ≥ 95
  ```

- [ ] **Code Formatting**: Properly formatted with Prettier
  ```bash
  # Generated code should be readable, no formatting errors
  ```

- [ ] **File Size**: Reasonable for API complexity
  ```bash
  ls -lh test-output/src/index.ts
  # Expected: Simple API (5 endpoints) < 30KB
  #           Medium API (50 endpoints) < 100KB
  ```

- [ ] **Deduplication**: Duplicate schemas use type aliases
  ```bash
  grep -A1 "export type.*Response = " test-output/src/index.ts
  # Expected: Type aliases for duplicate response schemas
  ```

### 2. API Coverage Testing

Test with various API specifications to ensure broad compatibility.

#### Test Suite: Simple APIs

**2.1 Petstore API** (Basic CRUD)
```bash
node packages/cli/dist/cli.js generate \
  https://petstore3.swagger.io/api/v3/openapi.json \
  --output test-petstore \
  --no-tests
```

**Evaluation Criteria**:
- [ ] All 5 endpoints generated (GET, POST, PUT, DELETE)
- [ ] Pet schema properly typed
- [ ] Enum for `status` field (`available`, `pending`, `sold`)
- [ ] Image upload endpoint handled correctly

#### Test Suite: Real-World APIs

**2.2 Stripe API** (Complex, Large)
```bash
# Download spec
curl -o stripe.json https://raw.githubusercontent.com/stripe/openapi/master/openapi/spec3.json

node packages/cli/dist/cli.js generate \
  stripe.json \
  --output test-stripe \
  --no-tests \
  --name stripe-api
```

**Evaluation Criteria**:
- [ ] Handles 500+ endpoints without crashing
- [ ] Component schemas preserved (Charge, Customer, PaymentIntent, etc.)
- [ ] Circular references handled gracefully (warning logged, not crash)
- [ ] Generation completes in < 60 seconds

**2.3 GitHub API** (Well-Documented)
```bash
curl -o github.json https://raw.githubusercontent.com/github/rest-api-description/main/descriptions/api.github.com/api.github.com.json

node packages/cli/dist/cli.js generate \
  github.json \
  --output test-github \
  --no-tests \
  --name github-api
```

**Evaluation Criteria**:
- [ ] Complex nested objects extracted as interfaces
- [ ] Pagination parameters handled
- [ ] OAuth scopes documented in warnings
- [ ] Repository, User, Issue schemas preserved

#### Test Suite: Edge Cases

**2.4 OpenAPI 2.0 (Swagger)**
```bash
# Test backwards compatibility
node packages/cli/dist/cli.js generate \
  examples/swagger-2.0-spec.json \
  --output test-swagger2 \
  --no-tests
```

**Evaluation Criteria**:
- [ ] Swagger 2.0 `definitions` converted to interfaces
- [ ] `host` + `basePath` → server URL
- [ ] `securityDefinitions` → authentication config

**2.5 No Components/Schemas**
```bash
# API with inline schemas only (no $ref)
```

**Evaluation Criteria**:
- [ ] Falls back to `NestedType1`, `NestedType2` naming
- [ ] Still generates valid TypeScript
- [ ] Deduplication still works

**2.6 Form-Encoded Bodies**
```bash
# Test application/x-www-form-urlencoded
```

**Evaluation Criteria**:
- [ ] Request body parameters extracted
- [ ] Content-Type header set correctly
- [ ] Zod validation includes body params

### 3. Security Evaluation

**3.1 Generated Code Security**

Run security scan and evaluate findings:
```bash
node packages/cli/dist/cli.js generate <spec> --output test-security
# Check warnings output
```

**Evaluation Criteria**:
- [ ] **No Critical Vulnerabilities**: Score ≥ 95
- [ ] **API Key Handling**: Warns if hardcoded keys detected
- [ ] **Input Validation**: Zod schemas validate all inputs
- [ ] **SQL Injection**: No string concatenation in queries
- [ ] **XSS Prevention**: No unescaped user input in templates

**Security Warning Categories** (should appear when relevant):
- Missing authentication details
- Insufficient input validation
- Missing authorization checks
- Lack of rate limiting
- Potential information disclosure
- Missing audit logging
- XSS vulnerabilities
- CSRF protection missing

**3.2 Dependency Security**
```bash
npm audit
# Expected: No high or critical vulnerabilities
```

### 4. Performance Evaluation

**4.1 Build Performance**
```bash
npm run clean
time npm run build
# Expected: < 5 seconds for clean build
```

**4.2 Generation Performance**
```bash
time node packages/cli/dist/cli.js generate examples/github-repos-api.yaml --output test-perf
# Expected: < 15 seconds for simple API (5 endpoints)
```

**4.3 Memory Usage**
```bash
/usr/bin/time -l node packages/cli/dist/cli.js generate <large-spec> --output test-mem
# Expected: < 500MB for large APIs (500 endpoints)
```

### 5. Developer Experience

**5.1 Error Messages**
```bash
# Test with invalid spec
node packages/cli/dist/cli.js generate invalid.yaml --output test-error
```

**Evaluation Criteria**:
- [ ] Clear error messages (not stack traces)
- [ ] Helpful suggestions for common mistakes
- [ ] Points to documentation when relevant

**5.2 Documentation Quality**
```bash
node packages/cli/dist/cli.js --help
node packages/cli/dist/cli.js generate --help
```

**Evaluation Criteria**:
- [ ] All options documented
- [ ] Examples provided
- [ ] Required vs optional clearly indicated

**5.3 Generated Code Readability**

**Evaluation Criteria**:
- [ ] Proper indentation (2 spaces)
- [ ] JSDoc comments from OpenAPI descriptions
- [ ] Semantic variable names
- [ ] Logical code organization (types → schemas → client → server)

### 6. Functional Testing

**6.1 Generated MCP Server Runtime**

After generating an MCP server, test if it actually works:

```bash
# Generate server
node packages/cli/dist/cli.js generate examples/github-repos-api.yaml --output test-runtime

# Build it
cd test-runtime
npm install
npm run build

# Set API key
export GITHUB_REPOSITORIES_API_SUBSET_API_KEY=your_token_here

# Run server (in one terminal)
npm start

# Test with MCP client (in another terminal)
# Send MCP request to stdio server
```

**Evaluation Criteria**:
- [ ] Server starts without errors
- [ ] Lists available tools correctly
- [ ] Tool calls execute successfully
- [ ] Zod validation rejects invalid inputs
- [ ] API responses properly typed
- [ ] Error handling works (bad requests, network errors)

**6.2 Integration Testing**

Create real API calls to verify generated code:

```typescript
// test-integration.ts
import { GitHubRepositoriesApiSubsetClient } from './src/index.js';

const client = new GitHubRepositoriesApiSubsetClient();

// Test list repos
const repos = await client.reposListForAuthenticatedUser({
  visibility: 'public',
  sort: 'updated'
});

console.log('Repos:', repos.length);
// Expected: Returns array, no type errors
```

**Evaluation Criteria**:
- [ ] TypeScript types match runtime data
- [ ] Optional parameters work
- [ ] Required parameters enforced
- [ ] Enum values validated

## Evaluation Scoring

### Tier 1: Critical (Must Pass)
- TypeScript compilation ✓
- No runtime errors ✓
- Zod validation syntactically correct ✓
- Security score ≥ 90 ✓

**If any Tier 1 fails**: BLOCK release

### Tier 2: Important (Should Pass)
- Component names preserved ✓
- Type deduplication working ✓
- Security score ≥ 95 ✓
- Proper error messages ✓
- Performance within bounds ✓

**If any Tier 2 fails**: Fix before merge, or document as known issue

### Tier 3: Nice to Have (May Pass)
- Security score = 100 ✓
- Generated code size optimized ✓
- Perfect formatting ✓
- Comprehensive JSDoc ✓

**If Tier 3 fails**: Future enhancement

## Bug Reports

### Template for Bug Reports

```markdown
**Description**
Brief description of the bug

**To Reproduce**
1. Step 1
2. Step 2
3. ...

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happened

**OpenAPI Spec**
Link or attach the OpenAPI specification that triggered the bug
(Or minimal reproduction spec)

**Environment**
- OS: [e.g., macOS 14.5]
- Node version: [e.g., v20.11.0]
- Magic MCP version: [e.g., 0.1.0]
- Google Cloud project: [Yes/No]

**Generated Code**
```typescript
// Relevant section of generated code
```

**Error Output**
```
Paste error message
```

**Additional Context**
Any other relevant information
```

### Priority Levels

- **P0 - Critical**: Blocks generation, crashes, data loss
- **P1 - High**: Wrong code generated, security vulnerabilities
- **P2 - Medium**: Suboptimal code, missing features
- **P3 - Low**: Cosmetic issues, documentation

## Feature Requests

### Template for Feature Requests

```markdown
**Is your feature request related to a problem?**
Clear description of the problem

**Describe the solution you'd like**
What you want to happen

**Describe alternatives you've considered**
Other approaches you've thought about

**Use Case**
Real-world scenario where this would be useful

**OpenAPI Example**
Example OpenAPI spec snippet that would benefit from this feature

**Expected Output**
What the generated code should look like

**Additional Context**
Any other relevant information
```

## Contribution Guidelines

### Pull Request Process

1. **Fork & Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Follow existing code style
   - Add tests for new features
   - Update documentation

3. **Test Thoroughly**
   - Run `npm run build`
   - Test with at least 2 different OpenAPI specs
   - Verify generated code compiles

4. **Commit**
   ```bash
   git add .
   git commit -m "feat(scope): description

   Detailed explanation

   🤖 Generated with Claude Code
   Co-Authored-By: Claude <noreply@anthropic.com>"
   ```

5. **Push & PR**
   ```bash
   git push origin feature/your-feature-name
   # Create PR on GitHub
   ```

6. **PR Requirements**
   - [ ] All tests pass
   - [ ] Code reviewed
   - [ ] Documentation updated
   - [ ] CHANGELOG.md updated

### Code Style

- **TypeScript**: Strict mode, explicit types for public APIs
- **Formatting**: Prettier (configured in project)
- **Linting**: Follow existing patterns
- **Comments**: JSDoc for public methods, inline for complex logic

### Testing Requirements

For new features:
- [ ] Unit tests (if applicable)
- [ ] Integration test with example OpenAPI spec
- [ ] Documentation in relevant PHASE_*.md file
- [ ] Entry in CHANGELOG.md

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Accept criticism gracefully

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Personal attacks
- Publishing others' private information

## Getting Help

- **Documentation**: Check `claude.md` and `PHASE_*.md` files
- **Examples**: See `examples/` directory
- **Issues**: Search existing issues before creating new ones
- **Discussions**: Use GitHub Discussions for questions

## Recognition

Contributors will be recognized in:
- CHANGELOG.md (for significant contributions)
- README.md (for major features)
- Git commit history (always)

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

Thank you for helping make Magic MCP better! 🎉
