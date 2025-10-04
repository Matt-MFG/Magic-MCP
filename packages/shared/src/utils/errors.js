"use strict";
/**
 * Custom Error Classes
 * Structured error handling across the platform
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationError = exports.RateLimitError = exports.NotFoundError = exports.AuthorizationError = exports.AuthenticationError = exports.DeploymentError = exports.SecurityError = exports.GenerationError = exports.ParseError = exports.ValidationError = exports.MagicMCPError = void 0;
exports.handleError = handleError;
class MagicMCPError extends Error {
    code;
    statusCode;
    details;
    constructor(message, code, statusCode = 500, details) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.details = details;
        this.name = 'MagicMCPError';
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.MagicMCPError = MagicMCPError;
class ValidationError extends MagicMCPError {
    constructor(message, details) {
        super(message, 'VALIDATION_ERROR', 400, details);
        this.name = 'ValidationError';
    }
}
exports.ValidationError = ValidationError;
class ParseError extends MagicMCPError {
    constructor(message, details) {
        super(message, 'PARSE_ERROR', 400, details);
        this.name = 'ParseError';
    }
}
exports.ParseError = ParseError;
class GenerationError extends MagicMCPError {
    constructor(message, details) {
        super(message, 'GENERATION_ERROR', 500, details);
        this.name = 'GenerationError';
    }
}
exports.GenerationError = GenerationError;
class SecurityError extends MagicMCPError {
    constructor(message, details) {
        super(message, 'SECURITY_ERROR', 403, details);
        this.name = 'SecurityError';
    }
}
exports.SecurityError = SecurityError;
class DeploymentError extends MagicMCPError {
    constructor(message, details) {
        super(message, 'DEPLOYMENT_ERROR', 500, details);
        this.name = 'DeploymentError';
    }
}
exports.DeploymentError = DeploymentError;
class AuthenticationError extends MagicMCPError {
    constructor(message = 'Authentication failed', details) {
        super(message, 'AUTHENTICATION_ERROR', 401, details);
        this.name = 'AuthenticationError';
    }
}
exports.AuthenticationError = AuthenticationError;
class AuthorizationError extends MagicMCPError {
    constructor(message = 'Insufficient permissions', details) {
        super(message, 'AUTHORIZATION_ERROR', 403, details);
        this.name = 'AuthorizationError';
    }
}
exports.AuthorizationError = AuthorizationError;
class NotFoundError extends MagicMCPError {
    constructor(resource, id) {
        const message = id ? `${resource} with id '${id}' not found` : `${resource} not found`;
        super(message, 'NOT_FOUND', 404);
        this.name = 'NotFoundError';
    }
}
exports.NotFoundError = NotFoundError;
class RateLimitError extends MagicMCPError {
    constructor(message = 'Rate limit exceeded', details) {
        super(message, 'RATE_LIMIT_ERROR', 429, details);
        this.name = 'RateLimitError';
    }
}
exports.RateLimitError = RateLimitError;
class ConfigurationError extends MagicMCPError {
    constructor(message, details) {
        super(message, 'CONFIGURATION_ERROR', 500, details);
        this.name = 'ConfigurationError';
    }
}
exports.ConfigurationError = ConfigurationError;
/**
 * Error handler utility
 */
function handleError(error) {
    if (error instanceof MagicMCPError) {
        return error;
    }
    if (error instanceof Error) {
        return new MagicMCPError(error.message, 'UNKNOWN_ERROR', 500, {
            originalError: error.name,
            stack: error.stack,
        });
    }
    return new MagicMCPError('An unknown error occurred', 'UNKNOWN_ERROR', 500, {
        error: String(error),
    });
}
//# sourceMappingURL=errors.js.map