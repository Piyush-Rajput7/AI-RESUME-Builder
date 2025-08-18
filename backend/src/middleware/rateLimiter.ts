import { RateLimiterMemory } from 'rate-limiter-flexible';
import { Request, Response, NextFunction } from 'express';

const generalLimiter = new RateLimiterMemory({
  keyGenerator: (req: Request) => req.ip,
  points: 100, // Number of requests
  duration: 60, // Per 60 seconds
});

const aiLimiter = new RateLimiterMemory({
  keyGenerator: (req: Request) => req.ip,
  points: 10, // AI requests are more expensive
  duration: 60,
});

export const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limiter = req.path.startsWith('/api/ai') ? aiLimiter : generalLimiter;
    await limiter.consume(req.ip);
    next();
  } catch (rejRes: any) {
    res.status(429).json({
      error: 'Too many requests',
      retryAfter: Math.round(rejRes.msBeforeNext / 1000) || 1,
    });
  }
};