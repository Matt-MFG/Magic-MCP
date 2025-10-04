/**
 * Magic MCP Shared Package
 * Common types, utilities, and constants
 */

export * from './types/index.js';
export * from './utils/index.js';

// Package version
export const VERSION = '0.1.0';

// Constants
export const MAGIC_MCP_USER_AGENT = `magic-mcp/${VERSION}`;
export const DEFAULT_TIMEOUT = 30000; // 30 seconds
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
export const MAX_GENERATED_FILES = 100;
