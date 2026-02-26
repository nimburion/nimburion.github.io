---
layout: documentation
title: pkg/resilience
---

# pkg/resilience

Circuit breaker, retry, timeout, and rate limiting.

## Circuit Breaker

```go
import "github.com/nimburion/nimburion/pkg/resilience"

cb := resilience.NewCircuitBreaker(resilience.CircuitBreakerConfig{
    FailureThreshold: 5,
    Timeout:          30 * time.Second,
})

result, err := cb.Execute(func() (interface{}, error) {
    return externalAPI.Call()
})
```

## Retry

```go
err := resilience.Retry(ctx, resilience.RetryConfig{
    MaxAttempts: 3,
    InitialDelay: 100 * time.Millisecond,
}, func() error {
    return externalAPI.Call()
})
```

## Rate Limiting

```go
limiter := resilience.NewRateLimiter(100, time.Second)

if !limiter.Allow() {
    return errors.New("rate limit exceeded")
}
```

## See Also

- [Resilience Guide](/documentation/nimburion/guides/resilience/)
