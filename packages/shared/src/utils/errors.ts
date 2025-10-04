/**
 * Custom Error Classes
 * Structured error handling across the platform
 */

export class MagicMCPError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'MagicMCPError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends MagicMCPError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'VALIDATION_ERROR', 400, details);
    this.name = 'ValidationError';
  }
}

export class ParseError extends MagicMCPError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'PARSE_ERROR', 400, details);
    this.name = 'ParseError';
  }
}

export class GenerationError extends MagicMCPError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'GENERATION_ERROR', 500, details);
    this.name = 'GenerationError';
  }
}

export class SecurityError extends MagicMCPError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'SECURITY_ERROR', 403, details);
    this.name = 'SecurityError';
  }
}

export class DeploymentError extends MagicMCPError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'DEPLOYMENT_ERROR', 500, details);
    this.name = 'DeploymentError';
  }
}

export class AuthenticationError extends MagicMCPError {
  constructor(message: string = 'Authentication failed', details?: Record<string, unknown>) {
    super(message, 'AUTHENTICATION_ERROR', 401, details);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends MagicMCPError {
  constructor(message: string = 'Insufficient permissions', details?: Record<string, unknown>) {
    super(message, 'AUTHORIZATION_ERROR', 403, details);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends MagicMCPError {
  constructor(resource: string, id?: string) {
    const message = id ? `${resource} with id '${id}' not found` : `${resource} not found`;
    super(message, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

export class RateLimitError extends MagicMCPError {
  constructor(message: string = 'Rate limit exceeded', details?: Record<string, unknown>) {
    super(message, 'RATE_LIMIT_ERROR', 429, details);
    this.name = 'RateLimitError';
  }
}

export class ConfigurationError extends MagicMCPError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'CONFIGURATION_ERROR', 500, details);
    this.name = 'ConfigurationError';
  }
}

/**
 * Error handler utility
 */
export function handleError(error: unknown): MagicMCPError {
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
