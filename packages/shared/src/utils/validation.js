"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvVarValidator = exports.SnakeCaseValidator = exports.SlugValidator = exports.VersionValidator = exports.EmailValidator = exports.URLValidator = void 0;
exports.validate = validate;
exports.validateSafe = validateSafe;
exports.sanitizeString = sanitizeString;
exports.sanitizeUrl = sanitizeUrl;
exports.sanitizeFilePath = sanitizeFilePath;
exports.containsSecret = containsSecret;
exports.redactSecrets = redactSecrets;
const zod_1 = require("zod");
const errors_js_1 = require("./errors.js");
/**
 * Validation Utilities
 * Helpers for validating data with Zod schemas
 */
function validate(schema, data) {
    try {
        return schema.parse(data);
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            const details = {
                errors: error.errors.map((err) => ({
                    path: err.path.join('.'),
                    message: err.message,
                    code: err.code,
                })),
            };
            throw new errors_js_1.ValidationError('Validation failed', details);
        }
        throw error;
    }
}
function validateSafe(schema, data) {
    const result = schema.safeParse(data);
    if (result.success) {
        return { success: true, data: result.data };
    }
    return {
        success: false,
        errors: result.error.errors.map((err) => `${err.path.join('.')}: ${err.message}`),
    };
}
/**
 * Common validation patterns
 */
exports.URLValidator = zod_1.z.string().url();
exports.EmailValidator = zod_1.z.string().email();
exports.VersionValidator = zod_1.z.string().regex(/^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?$/);
exports.SlugValidator = zod_1.z.string().regex(/^[a-z0-9-]+$/);
exports.SnakeCaseValidator = zod_1.z.string().regex(/^[a-z][a-z0-9_]*$/);
exports.EnvVarValidator = zod_1.z.string().regex(/^[A-Z][A-Z0-9_]*$/);
/**
 * Sanitization utilities
 */
function sanitizeString(input) {
    // Remove null bytes
    let sanitized = input.replace(/\0/g, '');
    // Trim whitespace
    sanitized = sanitized.trim();
    return sanitized;
}
function sanitizeUrl(input) {
    try {
        const url = new URL(input);
        // Only allow http and https protocols
        if (!['http:', 'https:'].includes(url.protocol)) {
            throw new errors_js_1.ValidationError('Invalid URL protocol. Only http and https are allowed.');
        }
        return url.toString();
    }
    catch {
        throw new errors_js_1.ValidationError('Invalid URL format');
    }
}
function sanitizeFilePath(input) {
    // Prevent path traversal
    if (input.includes('..') || input.includes('~')) {
        throw new errors_js_1.ValidationError('Path traversal detected');
    }
    // Remove leading slashes for relative paths
    return input.replace(/^\/+/, '');
}
/**
 * Secret detection
 */
const SECRET_PATTERNS = [
    /[a-zA-Z0-9_-]*api[_-]?key[a-zA-Z0-9_-]*/i,
    /[a-zA-Z0-9_-]*secret[a-zA-Z0-9_-]*/i,
    /[a-zA-Z0-9_-]*token[a-zA-Z0-9_-]*/i,
    /[a-zA-Z0-9_-]*password[a-zA-Z0-9_-]*/i,
    /[a-zA-Z0-9_-]*private[_-]?key[a-zA-Z0-9_-]*/i,
    /sk_live_[a-zA-Z0-9]{24,}/, // Stripe secret key
    /sk_test_[a-zA-Z0-9]{24,}/, // Stripe test key
    /AIza[a-zA-Z0-9_-]{35}/, // Google API key
    /ghp_[a-zA-Z0-9]{36}/, // GitHub personal access token
    /xox[baprs]-[a-zA-Z0-9-]{10,}/, // Slack token
];
function containsSecret(input) {
    return SECRET_PATTERNS.some((pattern) => pattern.test(input));
}
function redactSecrets(input) {
    let redacted = input;
    SECRET_PATTERNS.forEach((pattern) => {
        redacted = redacted.replace(pattern, '[REDACTED]');
    });
    return redacted;
}
//# sourceMappingURL=validation.js.map