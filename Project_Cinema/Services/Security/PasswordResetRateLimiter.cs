using Microsoft.Extensions.Caching.Memory;
using System;

namespace Project_Cinema.Services.Security
{
    public class PasswordResetRateLimiter
    {
        private readonly IMemoryCache _cache;

        // Policy:
        // - cooldown seconds per identifier+ip (e.g. 60s)
        // - max N requests per window (e.g. 3 per 15 minutes)
        private const int CooldownSeconds = 60;
        private const int MaxRequestsPerWindow = 3;
        private static readonly TimeSpan Window = TimeSpan.FromMinutes(15);

        public PasswordResetRateLimiter(IMemoryCache cache)
        {
            _cache = cache;
        }

        public RateLimitResult Check(string identifier, string ip)
        {
            var key = BuildKey(identifier, ip);
            var now = DateTimeOffset.UtcNow;

            var state = _cache.GetOrCreate(key, entry =>
            {
                entry.AbsoluteExpirationRelativeToNow = Window;
                return new RateState
                {
                    WindowStartUtc = now,
                    Count = 0,
                    LastRequestUtc = DateTimeOffset.MinValue
                };
            })!;

            // Cooldown
            var cooldownRemaining = (int)Math.Ceiling((state.LastRequestUtc.AddSeconds(CooldownSeconds) - now).TotalSeconds);
            if (cooldownRemaining > 0)
            {
                return RateLimitResult.Blocked(cooldownRemaining);
            }

            // Window max
            var windowRemaining = state.WindowStartUtc.Add(Window) - now;
            if (windowRemaining <= TimeSpan.Zero)
            {
                state.WindowStartUtc = now;
                state.Count = 0;
            }

            if (state.Count >= MaxRequestsPerWindow)
            {
                var retryAfter = (int)Math.Ceiling((state.WindowStartUtc.Add(Window) - now).TotalSeconds);
                if (retryAfter < 1) retryAfter = 1;
                return RateLimitResult.Blocked(retryAfter);
            }

            // Allow and update
            state.Count++;
            state.LastRequestUtc = now;
            _cache.Set(key, state, new MemoryCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = Window
            });

            return RateLimitResult.Allowed();
        }

        private static string BuildKey(string identifier, string ip)
        {
            var id = (identifier ?? "").Trim().ToLowerInvariant();
            var addr = (ip ?? "").Trim();
            return $"pwdreset:{addr}:{id}";
        }

        private class RateState
        {
            public DateTimeOffset WindowStartUtc { get; set; }
            public int Count { get; set; }
            public DateTimeOffset LastRequestUtc { get; set; }
        }
    }

    public readonly struct RateLimitResult
    {
        public bool IsAllowed { get; }
        public int RetryAfterSeconds { get; }

        private RateLimitResult(bool isAllowed, int retryAfterSeconds)
        {
            IsAllowed = isAllowed;
            RetryAfterSeconds = retryAfterSeconds;
        }

        public static RateLimitResult Allowed() => new(true, 0);
        public static RateLimitResult Blocked(int retryAfterSeconds) => new(false, retryAfterSeconds);
    }
}

