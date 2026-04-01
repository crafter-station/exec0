import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

function createRateLimiter(
  limiter: ReturnType<typeof Ratelimit.slidingWindow>,
  prefix: string,
) {
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    return null;
  }

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  return new Ratelimit({
    redis,
    limiter,
    prefix: `exec0:ratelimit:${prefix}`,
    analytics: true,
  });
}

const rateLimiters = {
  playground: createRateLimiter(Ratelimit.slidingWindow(5, "1 m"), "playground"),
};

type RateLimitType = keyof typeof rateLimiters;

export async function rateLimit(
  identifier: string,
  type: RateLimitType = "playground",
): Promise<{
  success: boolean;
  remaining: number;
  reset: number;
  limit: number;
}> {
  const limiter = rateLimiters[type];

  if (!limiter) {
    return {
      success: true,
      remaining: 999,
      reset: Date.now() + 60_000,
      limit: 999,
    };
  }

  const result = await limiter.limit(identifier);

  return {
    success: result.success,
    remaining: result.remaining,
    reset: result.reset,
    limit: result.limit,
  };
}

export function getClientIdentifier(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";
  return ip;
}

export function rateLimitResponse(
  reset: number,
  limit: number,
  remaining: number,
): Response {
  return new Response(
    JSON.stringify({
      error: "Too many requests. Please try again later.",
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(Math.ceil((reset - Date.now()) / 1000)),
        "X-RateLimit-Limit": String(limit),
        "X-RateLimit-Remaining": String(remaining),
        "X-RateLimit-Reset": String(reset),
      },
    },
  );
}
