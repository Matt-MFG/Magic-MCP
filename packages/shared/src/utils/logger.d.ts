/**
 * Structured Logger
 * Production-ready logging with levels, context, and structured output
 */
export declare enum LogLevel {
    DEBUG = "debug",
    INFO = "info",
    WARN = "warn",
    ERROR = "error",
    FATAL = "fatal"
}
export interface LogContext {
    [key: string]: unknown;
}
export interface LogEntry {
    timestamp: string;
    level: LogLevel;
    message: string;
    context?: LogContext;
    error?: {
        name: string;
        message: string;
        stack?: string;
    };
}
declare class Logger {
    private static instance;
    private minLevel;
    private context;
    private constructor();
    static getInstance(): Logger;
    setMinLevel(level: LogLevel): void;
    setContext(context: LogContext): void;
    clearContext(): void;
    private shouldLog;
    private log;
    debug(message: string, context?: LogContext): void;
    info(message: string, context?: LogContext): void;
    warn(message: string, context?: LogContext): void;
    error(message: string, error?: Error, context?: LogContext): void;
    fatal(message: string, error?: Error, context?: LogContext): void;
}
export declare const logger: Logger;
export {};
//# sourceMappingURL=logger.d.ts.map