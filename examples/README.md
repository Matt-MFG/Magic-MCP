# Magic MCP Examples

This directory contains example APIs and generated MCP servers to help you get started.

## Example: Simple Task API

A basic task management API to demonstrate Magic MCP capabilities.

### Generate the MCP Server

```bash
cd examples

# Generate from the OpenAPI spec
magic-mcp generate simple-api.yaml \
  --output ./task-mcp \
  --name task-mcp \
  --project YOUR_GCP_PROJECT_ID
```

### What Gets Generated

```
task-mcp/
├── src/
│   └── index.ts          # Main MCP server implementation
├── package.json          # Node.js dependencies
├── tsconfig.json         # TypeScript configuration
└── README.md             # Usage documentation
```

### Test the Generated Server

```bash
cd task-mcp

# Install dependencies
npm install

# Build
npm run build

# Set your API credentials
export TASK_MCP_API_KEY="your-api-key-here"

# Run the server
npm start
```

### Use with Claude Desktop

1. Add to your Claude Desktop configuration:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "tasks": {
      "command": "node",
      "args": ["/absolute/path/to/examples/task-mcp/dist/index.js"],
      "env": {
        "TASK_MCP_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

2. Restart Claude Desktop

3. Try these prompts in Claude:
   - "List all my pending tasks"
   - "Create a new task titled 'Review PR #42' with high priority"
   - "Update task task_123 to mark it as completed"
   - "Delete task task_456"

## Available Tools

The generated MCP server includes these tools:

- **list_tasks** - List all tasks with optional filtering
- **create_task** - Create a new task
- **get_task** - Get details of a specific task
- **update_task** - Update a task's properties
- **delete_task** - Delete a task

## Security Features

The generated code includes:

✅ **Input Validation** - All parameters validated with Zod schemas
✅ **Authentication** - Bearer token authentication built-in
✅ **Error Handling** - Comprehensive error handling and reporting
✅ **Type Safety** - Full TypeScript type safety
✅ **Secret Management** - API keys loaded from environment variables
✅ **Security Scanning** - Automated vulnerability detection

## Customization

### Modify the API Spec

Edit `simple-api.yaml` and regenerate:

```bash
magic-mcp generate simple-api.yaml --output ./task-mcp
```

### Extend the Generated Code

The generated code is fully editable. Common customizations:

1. **Add caching**: Implement response caching for better performance
2. **Add retry logic**: Handle transient API failures
3. **Custom validation**: Add business-specific validation rules
4. **Logging**: Add detailed logging for debugging
5. **Metrics**: Integrate with monitoring tools

### Example: Add Caching

Edit `src/index.ts`:

```typescript
class TaskMCPClient {
  private cache = new Map<string, { data: unknown; expires: number }>();

  async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    // Check cache for GET requests
    if (method === 'GET') {
      const cacheKey = `${method}:${path}`;
      const cached = this.cache.get(cacheKey);

      if (cached && cached.expires > Date.now()) {
        return cached.data as T;
      }
    }

    // Make request...
    const result = await fetch(/* ... */);

    // Cache GET responses for 60 seconds
    if (method === 'GET') {
      this.cache.set(`${method}:${path}`, {
        data: result,
        expires: Date.now() + 60000,
      });
    }

    return result;
  }
}
```

## More Examples

Check out these additional examples:

- **Stripe Payments** - Payment processing MCP
- **GitHub Issues** - Issue management MCP
- **Slack Messaging** - Team communication MCP
- **SendGrid Email** - Email sending MCP

Coming soon!

## Feedback

Found an issue with the generated code? Have a suggestion?

- [Open an issue](https://github.com/magic-mcp/magic-mcp/issues)
- [Join our Discord](https://discord.gg/magic-mcp)
- [Email us](mailto:support@magic-mcp.com)

---

Happy building! 🚀
