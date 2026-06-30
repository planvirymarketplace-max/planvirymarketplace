/**
 * Structured logger — Part XXIX §29.1 (Structured Logging Standards).
 * BR-GLOBAL-004: PII excluded from logs; correlation IDs only.
 */

export interface LogContext {
  [key: string]: unknown;
}

export type LogLevel = "debug" | "info" | "warn" | "error";

const PII_KEYS = new Set([
  "email", "phone", "password", "token", "ssn", "creditCard", "name", "address",
]);

function redactPii(ctx: LogContext): LogContext {
  const cleaned: LogContext = {};
  for (const [k, v] of Object.entries(ctx)) {
    cleaned[k] = PII_KEYS.has(k) ? "[REDACTED]" : v;
  }
  return cleaned;
}

export interface Logger {
  debug(msg: string, ctx?: LogContext): void;
  info(msg: string, ctx?: LogContext): void;
  warn(msg: string, ctx?: LogContext): void;
  error(msg: string, ctx?: LogContext): void;
  child(ctx: LogContext): Logger;
}

export function createLogger(scope: string, baseCtx: LogContext = {}): Logger {
  const emit = (level: LogLevel, msg: string, ctx: LogContext = {}) => {
    const entry = {
      level,
      scope,
      msg,
      ts: new Date().toISOString(),
      ...redactPii({ ...baseCtx, ...ctx }),
    };
    // JSON to stdout — structured logging standard (Part XXIX §29.1).
    const stream = level === "error" || level === "warn" ? process.stderr : process.stdout;
    stream.write(JSON.stringify(entry) + "\n");
  };

  const logger: Logger = {
    debug: (m, c) => emit("debug", m, c),
    info: (m, c) => emit("info", m, c),
    warn: (m, c) => emit("warn", m, c),
    error: (m, c) => emit("error", m, c),
    child: (ctx) => createLogger(scope, { ...baseCtx, ...ctx }),
  };
  return logger;
}

export const logger = createLogger("planviry");
