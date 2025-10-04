"use strict";
/**
 * Structured Logger
 * Production-ready logging with levels, context, and structured output
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.LogLevel = void 0;
var LogLevel;
(function (LogLevel) {
    LogLevel["DEBUG"] = "debug";
    LogLevel["INFO"] = "info";
    LogLevel["WARN"] = "warn";
    LogLevel["ERROR"] = "error";
    LogLevel["FATAL"] = "fatal";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
class Logger {
    static instance;
    minLevel = LogLevel.INFO;
    context = {};
    constructor() { }
    static getInstance() {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }
    setMinLevel(level) {
        this.minLevel = level;
    }
    setContext(context) {
        this.context = { ...this.context, ...context };
    }
    clearContext() {
        this.context = {};
    }
    shouldLog(level) {
        const levels = [
            LogLevel.DEBUG,
            LogLevel.INFO,
            LogLevel.WARN,
            LogLevel.ERROR,
            LogLevel.FATAL,
        ];
        return levels.indexOf(level) >= levels.indexOf(this.minLevel);
    }
    log(level, message, context, error) {
        if (!this.shouldLog(level)) {
            return;
        }
        const entry = {
            timestamp: new Date().toISOString(),
            level,
            message,
            context: { ...this.context, ...context },
        };
        if (error) {
            entry.error = {
                name: error.name,
                message: error.message,
                stack: error.stack,
            };
        }
        // In production, this would be sent to a logging service
        // For now, output to console
        const output = JSON.stringify(entry);
        switch (level) {
            case LogLevel.DEBUG:
            case LogLevel.INFO:
                console.log(output);
                break;
            case LogLevel.WARN:
                console.warn(output);
                break;
            case LogLevel.ERROR:
            case LogLevel.FATAL:
                console.error(output);
                break;
        }
    }
    debug(message, context) {
        this.log(LogLevel.DEBUG, message, context);
    }
    info(message, context) {
        this.log(LogLevel.INFO, message, context);
    }
    warn(message, context) {
        this.log(LogLevel.WARN, message, context);
    }
    error(message, error, context) {
        this.log(LogLevel.ERROR, message, context, error);
    }
    fatal(message, error, context) {
        this.log(LogLevel.FATAL, message, context, error);
    }
}
// Export singleton instance
exports.logger = Logger.getInstance();
//# sourceMappingURL=logger.js.map