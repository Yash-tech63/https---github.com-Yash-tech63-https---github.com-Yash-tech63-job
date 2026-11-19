/**
 * TrueHire Structured Application Logger
 * 
 * Features:
 * - Structured JSON logging format with ISO timestamp, level, context tag, and message.
 * - Automatic recursive data sanitizer for sensitive fields (passwords, OTPs, JWT tokens, secrets).
 * - Safe for production auditing and centralized log aggregation (Datadog, CloudWatch, etc.).
 */

const SENSITIVE_KEYS = new Set([
  'password',
  'passwordhash',
  'pass',
  'otp',
  'otphash',
  'token',
  'jwt',
  'refreshtoken',
  'authorization',
  'secret',
  'razorpaykeysecret',
  'razorpaysignature',
  'webhooksecret',
  'smtppass',
  'cardnumber',
  'cvv',
  'creditcard'
]);

function isSensitiveKey(key) {
  const normalized = key.toLowerCase().replace(/[-_]/g, '');
  if (SENSITIVE_KEYS.has(normalized)) return true;
  return (
    normalized.includes('password') ||
    normalized.includes('secret') ||
    normalized.includes('signature') ||
    normalized.includes('token') ||
    normalized.includes('otp')
  );
}

function sanitize(obj, depth = 0) {
  if (depth > 5 || !obj) return obj;

  if (typeof obj === 'string') {
    // Redact Bearer tokens if found in raw string
    return obj.replace(/Bearer\s+[A-Za-z0-9._-]+/gi, 'Bearer [REDACTED_JWT]');
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitize(item, depth + 1));
  }

  if (typeof obj === 'object') {
    const sanitizedObj = {};
    for (const [key, val] of Object.entries(obj)) {
      if (isSensitiveKey(key)) {
        sanitizedObj[key] = '[REDACTED]';
      } else if (typeof val === 'object' && val !== null) {
        sanitizedObj[key] = sanitize(val, depth + 1);
      } else {
        sanitizedObj[key] = val;
      }
    }
    return sanitizedObj;
  }

  return obj;
}

class Logger {
  constructor(defaultContext = 'APP') {
    this.defaultContext = defaultContext;
  }

  _format(level, message, context, meta = {}) {
    const timestamp = new Date().toISOString();
    const tag = context || this.defaultContext;
    const cleanMeta = sanitize(meta);

    const logEntry = {
      timestamp,
      level,
      context: `[${tag}]`,
      message,
      ...(Object.keys(cleanMeta).length > 0 ? { data: cleanMeta } : {})
    };

    const formatted = `[${timestamp}] [${level}] [${tag}] ${message}${
      Object.keys(cleanMeta).length > 0 ? ' ' + JSON.stringify(cleanMeta) : ''
    }`;

    return { logEntry, formatted };
  }

  info(message, context, meta) {
    const { formatted } = this._format('INFO', message, context, meta);
    console.log(formatted);
  }

  warn(message, context, meta) {
    const { formatted } = this._format('WARN', message, context, meta);
    console.warn(formatted);
  }

  error(message, context, meta) {
    const { formatted } = this._format('ERROR', message, context, meta);
    console.error(formatted);
  }

  debug(message, context, meta) {
    if (process.env.NODE_ENV !== 'production') {
      const { formatted } = this._format('DEBUG', message, context, meta);
      console.debug(formatted);
    }
  }

  sanitize(data) {
    return sanitize(data);
  }
}

const logger = new Logger('TRUEHIRE');

module.exports = logger;
