# 🪄 Magic MCP

> **The AI-Native MCP Platform for Production**

Generate production-ready Model Context Protocol (MCP) servers in minutes with AI-powered security, multi-cloud deployment, and intelligent optimization.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)

## 🌟 What is Magic MCP?

Magic MCP transforms any API into a production-ready MCP server using AI. It's the only platform that combines:

- 🤖 **AI-Powered Generation**: Natural language → working MCP server
- 🔒 **Enterprise Security**: Automated scanning, compliance templates, audit trails
- ☁️ **Multi-Cloud Deployment**: GCP, AWS, Azure, Cloudflare Workers
- 📊 **Production Observability**: Monitoring, tracing, alerts out-of-the-box
- 🚀 **Developer Experience**: CLI, web dashboard, VS Code extension

## 🎯 Quick Start

### Install the CLI

```bash
npm install -g @magic-mcp/cli
```

### Generate Your First MCP

```bash
# From an OpenAPI specification
magic-mcp generate https://api.stripe.com/openapi.yaml

# From natural language
magic-mcp create "A server for managing GitHub issues"

# Deploy to Cloud Run
magic-mcp deploy --provider gcp
```

## 🏗️ Project Structure

```
magic-mcp/
├── packages/
│   ├── cli/                  # Command-line interface (open source)
│   ├── core/                 # Core MCP generation engine
│   ├── generator/            # AI-powered code generator
│   ├── parser/               # API schema parsers (OpenAPI, GraphQL, etc.)
│   ├── security/             # Security scanning and hardening
│   ├── deployer/             # Multi-cloud deployment orchestration
│   ├── dashboard/            # Web dashboard (Next.js)
│   └── shared/               # Shared utilities and types
├── examples/                 # Example MCP servers
├── docs/                     # Documentation
└── infrastructure/           # IaC (Terraform, Docker)
```

## 🚀 Features

### For Developers
- ✅ Generate MCPs from OpenAPI, GraphQL, or natural language
- ✅ TypeScript and Python support
- ✅ Automatic test generation
- ✅ Interactive playground for testing
- ✅ One-click deployment to 4+ cloud providers

### For Teams
- ✅ Multi-tenant workspaces
- ✅ Team collaboration features
- ✅ SSO and RBAC
- ✅ Approval workflows for sensitive operations
- ✅ Advanced observability and debugging

### For Enterprises
- ✅ SOC 2, HIPAA, PCI compliance templates
- ✅ White-label deployment option
- ✅ On-premises support
- ✅ 99.99% SLA guarantees
- ✅ Dedicated security reviews

## 🔒 Security First

Magic MCP is built with security as a core principle:

- **Automated Vulnerability Scanning**: Every generated MCP is scanned for security issues
- **Least-Privilege by Default**: AI calculates minimum required permissions
- **Secret Management**: Built-in integration with cloud secret managers
- **Prompt Injection Protection**: Automatic input sanitization
- **Complete Audit Trails**: Every operation logged for compliance

## 📚 Documentation

- [Getting Started Guide](./docs/getting-started.md)
- [Architecture Overview](./docs/architecture.md)
- [API Reference](./docs/api-reference.md)
- [Security Best Practices](./docs/security.md)
- [Deployment Guide](./docs/deployment.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

Magic MCP is open source (MIT license) with a commercial hosted offering for production deployments.

## 📦 Packages

| Package | Description | Status |
|---------|-------------|--------|
| `@magic-mcp/cli` | Command-line interface | ⏳ In Development |
| `@magic-mcp/core` | Core generation engine | ⏳ In Development |
| `@magic-mcp/generator` | AI-powered code generator | ⏳ In Development |
| `@magic-mcp/parser` | API schema parsers | ⏳ In Development |
| `@magic-mcp/security` | Security scanning | ⏳ In Development |
| `@magic-mcp/deployer` | Multi-cloud deployment | ⏳ In Development |

## 🗺️ Roadmap

### Phase 1: MVP (Weeks 1-8)
- [x] Project initialization
- [ ] OpenAPI → TypeScript MCP generator
- [ ] Basic security scanning
- [ ] GCP Cloud Run deployment
- [ ] CLI tool
- [ ] Web dashboard (basic)

### Phase 2: Growth (Weeks 9-16)
- [ ] AWS Lambda + Azure Functions support
- [ ] Python MCP generation
- [ ] Natural language interface
- [ ] Advanced security features
- [ ] Public registry with semantic search

### Phase 3: Enterprise (Weeks 17-28)
- [ ] Multi-tenant architecture
- [ ] SSO and advanced RBAC
- [ ] Compliance certifications
- [ ] White-label option
- [ ] Enterprise-grade SLAs

See [ROADMAP.md](./ROADMAP.md) for detailed milestones.

## 💡 Why Magic MCP?

### The Problem
Building production-ready MCP servers is hard:
- Security vulnerabilities (prompt injection, over-privileged access)
- Complex deployment and infrastructure setup
- Poor observability and debugging
- Governance and compliance challenges

### The Solution
Magic MCP automates the entire lifecycle:
1. **Generate**: AI creates secure, well-tested MCP code
2. **Scan**: Automatic security and quality checks
3. **Deploy**: One-click to multiple cloud providers
4. **Monitor**: Built-in observability and alerting
5. **Govern**: Compliance templates and audit trails

## 🌐 Community

- [Discord](https://discord.gg/magic-mcp) - Join our community
- [GitHub Discussions](https://github.com/magic-mcp/magic-mcp/discussions) - Ask questions
- [Twitter](https://twitter.com/magic_mcp) - Follow for updates
- [Blog](https://magic-mcp.com/blog) - Tutorials and insights

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

The CLI and core generation tools are open source. The hosted platform and enterprise features are commercial offerings.

## 🙏 Acknowledgments

Built with:
- [Model Context Protocol](https://modelcontextprotocol.io/) by Anthropic
- [Google Cloud Vertex AI](https://cloud.google.com/vertex-ai) for AI capabilities
- [TypeScript](https://www.typescriptlang.org/) for type safety
- Amazing open source community

## 📞 Support

- **Community**: [Discord](https://discord.gg/magic-mcp)
- **Email**: support@magic-mcp.com
- **Enterprise**: enterprise@magic-mcp.com

---

Made with ❤️ by the Magic MCP team
