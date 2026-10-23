// Simple in-memory sliding-window rate limiter for sensitive authentication & AI routes

interface RateLimitRecord {
  timestamps: number[];
}

const store = new Map<string, RateLimitRecord>();

// Clean up stale entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of store.entries()) {
      record.timestamps = record.timestamps.filter((ts) => now - ts < 3600000);
      if (record.timestamps.length === 0) {
        store.delete(key);
      }
    }
  }, 300000);
}

export interface RateLimitOptions {
  intervalMs: number; // Window size in milliseconds
  maxRequests: number; // Maximum allowed requests within window
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetMs: number;
}

export function rateLimit(
  identifier: string,
  options: RateLimitOptions = { intervalMs: 60000, maxRequests: 10 }
): RateLimitResult {
  const now = Date.now();
  const windowStart = now - options.intervalMs;

  let record = store.get(identifier);
  if (!record) {
    record = { timestamps: [] };
    store.set(identifier, record);
  }

  // Filter out timestamps outside the active window
  record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

  if (record.timestamps.length >= options.maxRequests) {
    const oldest = record.timestamps[0];
    const resetMs = oldest ? oldest + options.intervalMs - now : options.intervalMs;
    return {
      success: false,
      remaining: 0,
      resetMs: Math.max(0, resetMs),
    };
  }

  record.timestamps.push(now);
  return {
    success: true,
    remaining: options.maxRequests - record.timestamps.length,
    resetMs: options.intervalMs,
  };
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}
