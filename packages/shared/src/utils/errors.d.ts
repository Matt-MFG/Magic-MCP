/**
 * Custom Error Classes
 * Structured error handling across the platform
 */
export declare class MagicMCPError extends Error {
    readonly code: string;
    readonly statusCode: number;
    readonly details?: Record<string, unknown> | undefined;
    constructor(message: string, code: string, statusCode?: number, details?: Record<string, unknown> | undefined);
}
export declare class ValidationError extends MagicMCPError {
    constructor(message: string, details?: Record<string, unknown>);
}
export declare class ParseError extends MagicMCPError {
    constructor(message: string, details?: Record<string, unknown>);
}
export declare class GenerationError extends MagicMCPError {
    constructor(message: string, details?: Record<string, unknown>);
}
export declare class SecurityError extends MagicMCPError {
    constructor(message: string, details?: Record<string, unknown>);
}
export declare class DeploymentError extends MagicMCPError {
    constructor(message: string, details?: Record<string, unknown>);
}
export declare class AuthenticationError extends MagicMCPError {
    constructor(message?: string, details?: Record<string, unknown>);
}
export declare class AuthorizationError extends MagicMCPError {
    constructor(message?: string, details?: Record<string, unknown>);
}
export declare class NotFoundError extends MagicMCPError {
    constructor(resource: string, id?: string);
}
export declare class RateLimitError extends MagicMCPError {
    constructor(message?: string, details?: Record<string, unknown>);
}
export declare class ConfigurationError extends MagicMCPError {
    constructor(message: string, details?: Record<string, unknown>);
}
/**
 * Error handler utility
 */
export declare function handleError(error: unknown): MagicMCPError;
//# sourceMappingURL=errors.d.ts.map