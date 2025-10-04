import { z } from 'zod';
/**
 * Validation Utilities
 * Helpers for validating data with Zod schemas
 */
export declare function validate<T>(schema: z.ZodSchema<T>, data: unknown): T;
export declare function validateSafe<T>(schema: z.ZodSchema<T>, data: unknown): {
    success: true;
    data: T;
} | {
    success: false;
    errors: string[];
};
/**
 * Common validation patterns
 */
export declare const URLValidator: z.ZodString;
export declare const EmailValidator: z.ZodString;
export declare const VersionValidator: z.ZodString;
export declare const SlugValidator: z.ZodString;
export declare const SnakeCaseValidator: z.ZodString;
export declare const EnvVarValidator: z.ZodString;
/**
 * Sanitization utilities
 */
export declare function sanitizeString(input: string): string;
export declare function sanitizeUrl(input: string): string;
export declare function sanitizeFilePath(input: string): string;
export declare function containsSecret(input: string): boolean;
export declare function redactSecrets(input: string): string;
//# sourceMappingURL=validation.d.ts.map