---
layout: documentation
title: pkg/middleware
---

# pkg/middleware

HTTP middleware for request processing pipeline.

## Available Middleware

### RequestID
```go
import "github.com/nimburion/nimburion/pkg/middleware"

app.Public.Use(middleware.RequestID())
```
Generates unique ID for each request. Available via `c.GetString("requestId")`.

### Logger
```go
app.Public.Use(middleware.Logger())
```
Structured logging for all HTTP requests with duration, status, method, path.

### Recovery
```go
app.Public.Use(middleware.Recovery())
```
Recovers from panics and returns 500 error.

### CORS
```go
app.Public.Use(middleware.CORS())
```
Cross-Origin Resource Sharing with configurable origins.

### Timeout
```go
app.Public.Use(middleware.Timeout(30 * time.Second))
```
Request timeout enforcement.

### RateLimit
```go
app.Public.Use(middleware.RateLimit(100)) // 100 req/s
```
Rate limiting per endpoint or globally.

## See Also

- [HTTP Servers Guide](/documentation/nimburion/guides/http-servers/)
- [Resilience Guide](/documentation/nimburion/guides/resilience/)
