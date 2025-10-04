"use strict";
/**
 * Magic MCP Shared Package
 * Common types, utilities, and constants
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_GENERATED_FILES = exports.MAX_FILE_SIZE = exports.DEFAULT_TIMEOUT = exports.MAGIC_MCP_USER_AGENT = exports.VERSION = void 0;
__exportStar(require("./types/index.js"), exports);
__exportStar(require("./utils/index.js"), exports);
// Package version
exports.VERSION = '0.1.0';
// Constants
exports.MAGIC_MCP_USER_AGENT = `magic-mcp/${exports.VERSION}`;
exports.DEFAULT_TIMEOUT = 30000; // 30 seconds
exports.MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
exports.MAX_GENERATED_FILES = 100;
//# sourceMappingURL=index.js.map