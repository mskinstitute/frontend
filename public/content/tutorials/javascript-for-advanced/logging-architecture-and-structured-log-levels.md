# Logging Architecture & Structured Log Levels in Modern JavaScript

Relying on scattered `console.log()` calls across an enterprise application produces unreadable, unstructured logs that cannot be indexed or filtered in log aggregation platforms (Datadog, Splunk, ElasticSearch). Implementing a **Structured Logging Architecture** with formal **Log Levels** is critical for observability and production monitoring.

---

## 1. The Standard Log Levels Hierarchy

In production logging standards (RFC 5424 / Syslog / Winston), log levels follow a strict numerical severity hierarchy:

```
  0: TRACE / DEBUG  ──► Verbose internal variable states and function inputs
  1: INFO           ──► General application lifecycle events (server started, user logged in)
  2: WARN           ──► Recoverable anomalies (cache miss, deprecated API usage)
  3: ERROR          ──► Action failed, but application continues (DB query failed)
  4: FATAL          ──► Unrecoverable crash requiring immediate process termination
```

```
Log Level Threshold: [ WARN (Level 2) ]
  • DEBUG (0): Suppressed! (Zero CPU/disk overhead in production)
  • INFO  (1): Suppressed!
  • WARN  (2): Logged & Processed
  • ERROR (3): Logged & Processed
```

---

## 2. Structured JSON Logging

In production, logs must **never be raw unstructured strings** like `"User 42 logged in at 10:00"`. They must be **valid JSON objects** with standardized fields:

```json
{
  "timestamp": "2026-03-15T14:32:01.892Z",
  "level": "INFO",
  "service": "billing-service",
  "environment": "production",
  "traceId": "c8942a-991f",
  "userId": "USR-1049",
  "message": "Payment processed successfully",
  "metadata": {
    "amount": 120.00,
    "currency": "USD",
    "gatewayLatencyMs": 142
  }
}
```

---

## 3. Implementing a Production-Grade Logger Class

```javascript
const LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  FATAL: 4
};

class Logger {
  constructor(serviceName, minLevel = LogLevel.INFO) {
    this.serviceName = serviceName;
    this.minLevel = minLevel;
  }

  setLevel(level) {
    this.minLevel = level;
  }

  #log(levelName, levelValue, message, meta = {}) {
    // Suppress logs below active severity threshold
    if (levelValue < this.minLevel) return;

    const logEntry = {
      timestamp: new Date().toISOString(),
      level: levelName,
      service: this.serviceName,
      message,
      ...meta
    };

    // Output as single-line JSON string (NDJSON format for Datadog / CloudWatch)
    const jsonOutput = JSON.stringify(logEntry);

    if (levelValue >= LogLevel.ERROR) {
      console.error(jsonOutput);
    } else if (levelValue === LogLevel.WARN) {
      console.warn(jsonOutput);
    } else {
      console.log(jsonOutput);
    }
  }

  debug(msg, meta) { this.#log('DEBUG', LogLevel.DEBUG, msg, meta); }
  info(msg, meta)  { this.#log('INFO', LogLevel.INFO, msg, meta); }
  warn(msg, meta)  { this.#log('WARN', LogLevel.WARN, msg, meta); }
  error(msg, meta) { this.#log('ERROR', LogLevel.ERROR, msg, meta); }
  fatal(msg, meta) { this.#log('FATAL', LogLevel.FATAL, msg, meta); }
}

// Instantiate singleton service logger
export const authLogger = new Logger('AuthService', process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG);
```

---

## 4. Context Enrichment & Trace Correlation

In microservices and distributed frontend apps, correlate logs across multiple API requests using a `TraceId` or `CorrelationId`:

```javascript
class ChildLogger {
  constructor(parentLogger, contextualMetadata) {
    this.parent = parentLogger;
    this.context = contextualMetadata;
  }

  info(msg, meta = {}) {
    this.parent.info(msg, { ...this.context, ...meta });
  }

  error(msg, meta = {}) {
    this.parent.error(msg, { ...this.context, ...meta });
  }
}

// Create a child logger enriched with current HTTP request context:
const requestLogger = new ChildLogger(authLogger, {
  traceId: 'req_a9821f',
  ip: '192.168.1.1'
});

requestLogger.info('User authenticated successfully');
// Automatically contains traceId, IP, and serviceName in JSON payload!
```

---

## Practice Quiz

### Q1: What is the primary benefit of structured JSON logging over plain text strings?
- A) JSON logs take less disk space
- B) Structured JSON can be automatically parsed, indexed, filtered, and queried by log aggregation engines (Datadog, ElasticSearch)
- C) JSON logs are executed by the browser
- D) It prevents errors from occurring
**Answer:** B
**Explanation:** Structured JSON allows log analytics platforms to index individual fields (`userId`, `level`, `traceId`) for precise search and dashboard telemetry.

### Q2: In an environment where the logging threshold is configured to WARN, which log levels will be emitted?
- A) Only DEBUG and INFO
- B) WARN, ERROR, and FATAL
- C) Only WARN
- D) All levels
**Answer:** B
**Explanation:** Log levels operate on severity thresholds; setting the level to `WARN` emits messages at or above that severity (`WARN`, `ERROR`, `FATAL`), suppressing lower levels (`INFO`, `DEBUG`).

### Q3: What is a "Correlation ID" (or Trace ID) in distributed application logging?
- A) A password hash
- B) A unique identifier passed across microservices and frontend requests that links all related log entries from a single user transaction
- C) A CSS ID attribute
- D) A database primary key
**Answer:** B
**Explanation:** Correlation IDs track an end-to-end user operation across frontend and backend services, allowing developers to trace the entire transaction sequence in logs.

### Q4: Why should DEBUG level logs be disabled in production environments?
- A) DEBUG logs are illegal
- B) High-volume debug logs waste excessive I/O bandwidth, consume gigabytes of log storage, and can leak sensitive runtime memory states
- C) JavaScript will throw a syntax error
- D) It disables HTTPS
**Answer:** B
**Explanation:** Verbose debug logging adds high I/O overhead, increases cloud ingestion costs, and risks logging sensitive credentials or PII in production.

### Q5: How does a Child Logger pattern simplify contextual logging?
- A) It deletes parent logs
- B) It automatically injects shared context (such as request ID, tenant ID, or user ID) into every log entry without repetitive boilerplate
- C) It converts logs to XML
- D) It runs on a child thread
**Answer:** B
**Explanation:** Child loggers retain contextual metadata (like request or session IDs) and automatically merge it into every subsequent log call.
