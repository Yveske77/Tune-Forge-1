import type { Request, Response, NextFunction } from "express";

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

export interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
  message?: string;
}

export function createRateLimiter(options: RateLimitOptions) {
  const { windowMs, maxRequests, message = "Too many requests. Please try again later." } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    const key = getClientKey(req);
    const now = Date.now();

    let entry = rateLimitStore.get(key);

    if (!entry || now > entry.resetTime) {
      entry = { count: 1, resetTime: now + windowMs };
      rateLimitStore.set(key, entry);
      cleanupOldEntries();
      return next();
    }

    if (entry.count >= maxRequests) {
      res.setHeader("Retry-After", Math.ceil((entry.resetTime - now) / 1000).toString());
      return res.status(429).json({ error: message });
    }

    entry.count++;
    next();
  };
}

function getClientKey(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  const ip = typeof forwarded === "string" ? forwarded.split(",")[0] : req.ip;
  
  const user = (req as any).user?.claims?.sub;
  if (user) {
    return `user:${user}`;
  }
  
  return `ip:${ip}`;
}

function cleanupOldEntries() {
  const now = Date.now();
  const entries = Array.from(rateLimitStore.entries());
  for (const [key, entry] of entries) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Pre-configured rate limiters
export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 10,
  message: "Too many login attempts. Please try again later.",
});

export const apiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100,
  message: "Rate limit exceeded. Please slow down.",
});

export const agentRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10,
  message: "AI assistant rate limit exceeded. Please wait a moment.",
});

export const uploadRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 20,
  message: "Upload rate limit exceeded. Please wait.",
});
