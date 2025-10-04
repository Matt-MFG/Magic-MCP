import { z, ZodError } from 'zod';

import { ValidationError } from './errors.js';

/**
 * Validation Utilities
 * Helpers for validating data with Zod schemas
 */

export function validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      const details = {
        errors: error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
          code: err.code,
        })),
      };
      throw new ValidationError('Validation failed', details);
    }
    throw error;
  }
}

export function validateSafe<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } {
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

export const URLValidator = z.string().url();

export const EmailValidator = z.string().email();

export const VersionValidator = z.string().regex(/^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?$/);

export const SlugValidator = z.string().regex(/^[a-z0-9-]+$/);

export const SnakeCaseValidator = z.string().regex(/^[a-z][a-z0-9_]*$/);

export const EnvVarValidator = z.string().regex(/^[A-Z][A-Z0-9_]*$/);

/**
 * Sanitization utilities
 */

export function sanitizeString(input: string): string {
  // Remove null bytes
  let sanitized = input.replace(/\0/g, '');

  // Trim whitespace
  sanitized = sanitized.trim();

  return sanitized;
}

export function sanitizeUrl(input: string): string {
  try {
    const url = new URL(input);
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new ValidationError('Invalid URL protocol. Only http and https are allowed.');
    }
    return url.toString();
  } catch {
    throw new ValidationError('Invalid URL format');
  }
}

export function sanitizeFilePath(input: string): string {
  // Prevent path traversal
  if (input.includes('..') || input.includes('~')) {
    throw new ValidationError('Path traversal detected');
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

export function containsSecret(input: string): boolean {
  return SECRET_PATTERNS.some((pattern) => pattern.test(input));
}

export function redactSecrets(input: string): string {
  let redacted = input;
  SECRET_PATTERNS.forEach((pattern) => {
    redacted = redacted.replace(pattern, '[REDACTED]');
  });
  return redacted;
}
