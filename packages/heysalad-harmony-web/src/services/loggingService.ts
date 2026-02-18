import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_COLLECTION = 'systemLogs';
const REMOTE_LOGGING_ENABLED =
  (import.meta.env.VITE_ENABLE_REMOTE_LOGS ?? '').toString().toLowerCase() === 'true';

const levelToConsole: Record<LogLevel, (...args: unknown[]) => void> = {
  debug: console.debug ?? console.log,
  info: console.info ?? console.log,
  warn: console.warn ?? console.log,
  error: console.error ?? console.log,
};

interface LogContext {
  [key: string]: unknown;
}

interface LogPayload {
  level: LogLevel;
  message: string;
  context?: LogContext;
}

const formatConsolePrefix = (level: LogLevel) => `[bereit][${level.toUpperCase()}]`;

const persistLog = async (payload: LogPayload) => {
  if (!REMOTE_LOGGING_ENABLED) return;

  try {
    await addDoc(collection(db, LOG_COLLECTION), {
      ...payload,
      context: payload.context ?? null,
      timestamp: serverTimestamp(),
      timestampIso: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[bereit][LOGGER] Failed to persist log entry', error);
  }
};

export const logEvent = (level: LogLevel, message: string, context?: LogContext) => {
  const consoleFn = levelToConsole[level] ?? console.log;
  const prefix = formatConsolePrefix(level);

  if (context) {
    consoleFn(prefix, message, context);
  } else {
    consoleFn(prefix, message);
  }

  void persistLog({ level, message, context });
};

export const logInfo = (message: string, context?: LogContext) =>
  logEvent('info', message, context);

export const logWarn = (message: string, context?: LogContext) =>
  logEvent('warn', message, context);

export const logError = (message: string, context?: LogContext) =>
  logEvent('error', message, context);

export const logDebug = (message: string, context?: LogContext) =>
  logEvent('debug', message, context);
