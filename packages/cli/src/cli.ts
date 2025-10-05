#!/usr/bin/env node

/**
 * Magic MCP CLI
 * Command-line interface for generating MCP servers
 */

import { Command } from 'commander';
import { config } from 'dotenv';

import { generateCommand } from './commands/generate.js';
import { createCommand } from './commands/create.js';
import { scanCommand } from './commands/scan.js';

// Load environment variables
config();

const program = new Command();

program
  .name('magic-mcp')
  .description('AI-powered MCP server generator')
  .version('0.1.0');

// Generate command - from OpenAPI spec
program
  .command('generate')
  .description('Generate MCP server from OpenAPI specification')
  .argument('<spec>', 'OpenAPI specification URL or file path')
  .option('-o, --output <dir>', 'Output directory', './generated-mcp')
  .option('-n, --name <name>', 'MCP server name')
  .option('-l, --language <lang>', 'Target language (typescript|python)', 'typescript')
  .option('--no-tests', 'Skip test generation')
  .option('--no-docs', 'Skip documentation generation')
  .option('--no-security-scan', 'Skip security scanning')
  .option('--project <id>', 'Google Cloud project ID for AI')
  .option('--location <region>', 'Google Cloud location', 'us-central1')
  .action(generateCommand);

// Create command - from natural language
program
  .command('create')
  .description('Create MCP server from natural language description')
  .argument('<description>', 'Natural language description of the MCP')
  .option('-o, --output <dir>', 'Output directory', './generated-mcp')
  .option('-l, --language <lang>', 'Target language (typescript|python)', 'typescript')
  .option('--project <id>', 'Google Cloud project ID for AI')
  .option('--location <region>', 'Google Cloud location', 'us-central1')
  .action(createCommand);

// Scan command - security scan existing code
program
  .command('scan')
  .description('Scan MCP server code for security vulnerabilities')
  .argument('<dir>', 'Directory containing MCP server code')
  .option('--min-severity <level>', 'Minimum severity level (low|medium|high|critical)', 'low')
  .option('--json', 'Output results as JSON')
  .action(scanCommand);

// Parse arguments and execute
program.parse();
