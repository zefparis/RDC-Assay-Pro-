import { Request, Response, NextFunction } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { config } from '@/config/environment';
import { logger } from '@/utils/logger';

// Create rate limiter instance
const rateLimiter = new RateLimiterMemory({
  keyPrefix: 'rl_api',
  points: config.rateLimit.maxRequests, // Number of requests
  duration: Math.floor(config.rateLimit.windowMs / 1000), // Per duration in seconds
  blockDuration: 60, // Block for 60 seconds if limit exceeded
});

// Strict rate limiter for auth endpoints
const authRateLimiter = new RateLimiterMemory({
  keyPrefix: 'rl_auth',
  points: 5, // 5 attempts
  duration: 900, // Per 15 minutes
  blockDuration: 900, // Block for 15 minutes
});

// File upload rate limiter
const uploadRateLimiter = new RateLimiterMemory({
  keyPrefix: 'rl_upload',
  points: 10, // 10 uploads
  duration: 3600, // Per hour
  blockDuration: 3600, // Block for 1 hour
});

export const createRateLimiter = (limiter: RateLimiterMemory, message?: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const key = req.ip || 'unknown';
      await limiter.consume(key);
      next();
    } catch (rejRes: any) {
      const remainingPoints = rejRes?.remainingPoints || 0;
      const msBeforeNext = rejRes?.msBeforeNext || 0;
      const totalHits = rejRes?.totalHits || 0;

      logger.warn(`Rate limit exceeded for IP: ${req.ip}`, {
        ip: req.ip,
        path: req.path,
        method: req.method,
        remainingPoints,
        msBeforeNext,
        totalHits,
      });

      res.set({
        'Retry-After': Math.round(msBeforeNext / 1000) || 1,
        'X-RateLimit-Limit': config.rateLimit.maxRequests,
        'X-RateLimit-Remaining': remainingPoints,
        'X-RateLimit-Reset': new Date(Date.now() + msBeforeNext).toISOString(),
      });

      res.status(429).json({
        success: false,
        message: message || 'Too many requests, please try again later',
        retryAfter: Math.round(msBeforeNext / 1000),
      });
    }
  };
};

// Export different rate limiters
export const generalRateLimit = createRateLimiter(rateLimiter);
export const authRateLimit = createRateLimiter(
  authRateLimiter,
  'Too many authentication attempts, please try again later'
);
export const uploadRateLimit = createRateLimiter(
  uploadRateLimiter,
  'Too many file uploads, please try again later'
);

// Default export
export default generalRateLimit;
