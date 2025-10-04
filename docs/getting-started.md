# Getting Started with Magic MCP

Welcome to Magic MCP! This guide will help you generate your first production-ready MCP server in minutes.

## Prerequisites

- Node.js 20+ installed
- npm 9+ installed
- Google Cloud account with Vertex AI enabled (for AI features)
- An OpenAPI specification for your API

## Installation

### Global Installation (Recommended)

```bash
npm install -g @magic-mcp/cli
```

### Local Installation

```bash
npm install @magic-mcp/cli
```

## Quick Start

### 1. Generate from OpenAPI Specification

The fastest way to create an MCP server is from an existing OpenAPI spec:

```bash
magic-mcp generate https://api.stripe.com/v1/openapi.yaml \
  --output ./stripe-mcp \
  --name stripe-mcp \
  --project YOUR_GCP_PROJECT_ID
```

**What happens:**
- ✅ Parses your OpenAPI specification
- ✅ Uses AI to analyze and enhance the schema
- ✅ Generates production-ready TypeScript code
- ✅ Creates comprehensive tests
- ✅ Runs security scans
- ✅ Generates documentation

### 2. Generate from Natural Language

Describe what you want and let AI create the MCP:

```bash
magic-mcp create "A server for managing GitHub issues with tools to create, update, list, and close issues" \
  --output ./github-issues-mcp \
  --project YOUR_GCP_PROJECT_ID
```

### 3. Security Scan Existing Code

Scan any MCP server for security vulnerabilities:

```bash
magic-mcp scan ./my-mcp-server
```

## Configuration

### Environment Variables

Create a `.env` file in your project:

```bash
# Google Cloud Configuration (required for AI features)
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json

# Optional: Override default location
GOOGLE_CLOUD_LOCATION=us-central1
```

### Google Cloud Setup

1. **Create a Google Cloud Project**
   ```bash
   gcloud projects create magic-mcp-dev
   gcloud config set project magic-mcp-dev
   ```

2. **Enable Vertex AI API**
   ```bash
   gcloud services enable aiplatform.googleapis.com
   ```

3. **Create Service Account**
   ```bash
   gcloud iam service-accounts create magic-mcp \
     --display-name="Magic MCP Service Account"

   gcloud projects add-iam-policy-binding magic-mcp-dev \
     --member="serviceAccount:magic-mcp@magic-mcp-dev.iam.gserviceaccount.com" \
     --role="roles/aiplatform.user"

   gcloud iam service-accounts keys create ~/magic-mcp-key.json \
     --iam-account=magic-mcp@magic-mcp-dev.iam.gserviceaccount.com
   ```

4. **Set Environment Variable**
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS=~/magic-mcp-key.json
   export GOOGLE_CLOUD_PROJECT=magic-mcp-dev
   ```

## Using Your Generated MCP Server

After generation, you'll have a complete MCP server:

```bash
cd stripe-mcp

# Install dependencies
npm install

# Build the server
npm run build

# Run the server
npm start
```

### Connecting to Claude Desktop

Add your MCP server to Claude Desktop's configuration:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "stripe": {
      "command": "node",
      "args": ["/path/to/stripe-mcp/dist/index.js"],
      "env": {
        "STRIPE_API_KEY": "sk_test_..."
      }
    }
  }
}
```

Restart Claude Desktop and your MCP tools will be available!

## CLI Commands Reference

### `magic-mcp generate`

Generate MCP server from OpenAPI specification.

```bash
magic-mcp generate <spec> [options]
```

**Arguments:**
- `<spec>` - URL or file path to OpenAPI specification

**Options:**
- `-o, --output <dir>` - Output directory (default: `./generated-mcp`)
- `-n, --name <name>` - MCP server name (default: from spec title)
- `-l, --language <lang>` - Target language: `typescript` or `python` (default: `typescript`)
- `--no-tests` - Skip test generation
- `--no-docs` - Skip documentation generation
- `--no-security-scan` - Skip security scanning
- `--project <id>` - Google Cloud project ID
- `--location <region>` - Google Cloud region (default: `us-central1`)

**Examples:**

```bash
# From URL
magic-mcp generate https://petstore.swagger.io/v2/swagger.json

# From local file
magic-mcp generate ./api-spec.yaml --output ./my-mcp

# Skip tests and docs for faster generation
magic-mcp generate ./spec.json --no-tests --no-docs

# Generate Python server
magic-mcp generate ./spec.json --language python
```

### `magic-mcp create`

Create MCP server from natural language description.

```bash
magic-mcp create <description> [options]
```

**Arguments:**
- `<description>` - Natural language description of the API/MCP

**Options:**
- `-o, --output <dir>` - Output directory (default: `./generated-mcp`)
- `-l, --language <lang>` - Target language (default: `typescript`)
- `--project <id>` - Google Cloud project ID
- `--location <region>` - Google Cloud region (default: `us-central1`)

**Examples:**

```bash
magic-mcp create "A weather API with current conditions and 5-day forecast"

magic-mcp create "Slack messaging with send, edit, and delete message capabilities"
```

### `magic-mcp scan`

Scan MCP server code for security vulnerabilities.

```bash
magic-mcp scan <dir> [options]
```

**Arguments:**
- `<dir>` - Directory containing MCP server code

**Options:**
- `--min-severity <level>` - Minimum severity: `low`, `medium`, `high`, `critical` (default: `low`)
- `--json` - Output results as JSON

**Examples:**

```bash
# Scan all issues
magic-mcp scan ./my-mcp

# Only show critical and high severity
magic-mcp scan ./my-mcp --min-severity high

# JSON output for CI/CD
magic-mcp scan ./my-mcp --json > security-report.json
```

## Advanced Usage

### Custom AI Parameters

Set environment variables to customize AI behavior:

```bash
export MAGIC_MCP_AI_TEMPERATURE=0.2  # Lower = more deterministic
export MAGIC_MCP_AI_MAX_TOKENS=8192  # Max response length
```

### CI/CD Integration

Example GitHub Actions workflow:

```yaml
name: Generate and Test MCP

on: [push]

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install Magic MCP
        run: npm install -g @magic-mcp/cli

      - name: Generate MCP
        run: |
          magic-mcp generate ./api-spec.yaml \
            --output ./generated-mcp \
            --project ${{ secrets.GCP_PROJECT_ID }}
        env:
          GOOGLE_APPLICATION_CREDENTIALS: ${{ secrets.GCP_SA_KEY }}

      - name: Security Scan
        run: magic-mcp scan ./generated-mcp --min-severity high

      - name: Test Generated Code
        run: |
          cd generated-mcp
          npm install
          npm test
```

## Next Steps

- [Architecture Overview](./architecture.md)
- [API Reference](./api-reference.md)
- [Security Best Practices](./security.md)
- [Deployment Guide](./deployment.md)
- [Contributing Guide](../CONTRIBUTING.md)

## Troubleshooting

### "Google Cloud project ID required"

Make sure you've set the `GOOGLE_CLOUD_PROJECT` environment variable or pass `--project` flag.

### "Permission denied" errors

Ensure your service account has the `roles/aiplatform.user` role.

### Generation is slow

- First generation may be slower as AI models warm up
- Subsequent generations are typically faster
- Consider using `--no-tests --no-docs` for faster iteration

### Security scan shows false positives

Review the findings carefully. You can:
1. Fix legitimate issues
2. Document why certain patterns are safe in your context
3. Adjust code to use recommended patterns

## Support

- **Documentation**: https://magic-mcp.com/docs
- **Discord**: https://discord.gg/magic-mcp
- **GitHub Issues**: https://github.com/magic-mcp/magic-mcp/issues
- **Email**: support@magic-mcp.com

---

**Ready to build?** Let's create something magical! ✨
