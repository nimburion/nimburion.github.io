---
layout: documentation
title: HTTP Servers
---

# HTTP Servers

Guide to using public and management HTTP servers in Nimburion.

> **Note**: This guide uses simplified pseudocode examples. For working code, see the [Getting Started](/documentation/nimburion/getting-started/) guide.

## Dual Server Architecture

Nimburion runs two independent HTTP servers:

- **Public server** - Business endpoints (default port: 8080)
- **Management server** - Operational endpoints (default port: 9090)

This separation keeps operational concerns isolated from business traffic and allows independent scaling, security policies, and monitoring.

## Bootstrap Function

The `server.Bootstrap()` function automatically creates and configures both servers with sensible defaults:

```go
package main

import (
    "github.com/nimburion/nimburion/pkg/config"
    "github.com/nimburion/nimburion/pkg/server"
)

func main() {
    cfg := config.Load()
    
    // Bootstrap creates both servers with:
    // - Middleware chains
    // - Health checks
    // - Metrics collection
    // - Graceful shutdown
    app := server.Bootstrap(cfg)
    
    // Register your routes
    app.Public.GET("/users", listUsers)
    app.Public.POST("/users", createUser)
    
    // Start both servers
    app.Run()
}
```

## What Bootstrap Configures

### Public Server

**Middleware Chain** (applied in order):
1. Request ID - Generates unique ID for each request
2. Logger - Structured logging for all requests
3. Recovery - Panic recovery with stack traces
4. CORS - Cross-origin resource sharing
5. Metrics - Prometheus metrics collection

**Features**:
- Gin router with high performance
- Request validation
- Response compression
- Timeout handling

### Management Server

**Endpoints**:
- `GET /health` - Liveness probe
- `GET /ready` - Readiness probe with dependency checks
- `GET /metrics` - Prometheus metrics
- `GET /version` - Version, commit, build time
- `GET /swagger` - Swagger UI (reserved)

**Security**:
- Isolated from public traffic
- Optional authentication
- Network-level access control recommended

## Routing

### Public Routes

```go
// Simple routes
app.Public.GET("/users", listUsers)
app.Public.POST("/users", createUser)
app.Public.PUT("/users/:id", updateUser)
app.Public.DELETE("/users/:id", deleteUser)

// Route groups
api := app.Public.Group("/api/v1")
{
    api.GET("/users", listUsers)
    api.POST("/users", createUser)
}

// With middleware
authenticated := app.Public.Group("/admin")
authenticated.Use(auth.Required())
{
    authenticated.GET("/stats", getStats)
}
```

### Path Parameters

```go
app.Public.GET("/users/:id", func(c *gin.Context) {
    id := c.Param("id")
    // ...
})

app.Public.GET("/users/:id/posts/:postId", func(c *gin.Context) {
    userID := c.Param("id")
    postID := c.Param("postId")
    // ...
})
```

### Query Parameters

```go
app.Public.GET("/users", func(c *gin.Context) {
    page := c.DefaultQuery("page", "1")
    limit := c.Query("limit")
    // ...
})
```

## Custom Middleware

Add middleware to the public server:

```go
app.Public.Use(myMiddleware())

func myMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        // Before request
        start := time.Now()
        
        c.Next()
        
        // After request
        duration := time.Since(start)
        log.Printf("Request took %v", duration)
    }
}
```

## Lifecycle Hooks

Execute code during server lifecycle:

```go
// Run before servers start
app.OnStart(func() error {
    log.Println("Connecting to database...")
    return db.Connect()
})

// Run during graceful shutdown
app.OnShutdown(func() error {
    log.Println("Closing database connection...")
    return db.Close()
})

app.Run()
```

## Configuration

Configure servers via `config.yaml`:

```yaml
public:
  port: 8080
  readTimeout: 30s
  writeTimeout: 30s
  idleTimeout: 120s
  
management:
  port: 9090
  readTimeout: 10s
  writeTimeout: 10s
  
server:
  shutdownTimeout: 30s
```

Or via environment variables:

```bash
APP_PUBLIC_PORT=8081
APP_MANAGEMENT_PORT=9091
APP_SERVER_SHUTDOWN_TIMEOUT=60s
```

## Graceful Shutdown

Bootstrap automatically handles graceful shutdown:

1. Receives SIGTERM or SIGINT
2. Stops accepting new connections
3. Waits for in-flight requests (up to `shutdownTimeout`)
4. Executes `OnShutdown` hooks
5. Exits

```go
app.OnShutdown(func() error {
    // Close database connections
    db.Close()
    
    // Close message broker connections
    broker.Close()
    
    // Flush metrics
    metrics.Flush()
    
    return nil
})
```

## Advanced: Manual Server Creation

If you need more control, create servers manually:

```go
cfg := config.Load()

// Create servers manually
pub := server.NewPublic(cfg)
mgmt := server.NewManagement(cfg)

// Configure public server
pub.Use(middleware.RequestID())
pub.Use(middleware.Logger())
pub.Router().GET("/hello", handler)

// Configure management server
mgmt.AddHealthCheck("database", func() error {
    return db.Ping()
})

// Run both servers
server.Run(pub, mgmt)
```

## Health Checks

Add custom health checks to the management server:

```go
app.Management.AddHealthCheck("database", func() error {
    return db.Ping()
})

app.Management.AddHealthCheck("cache", func() error {
    return cache.Ping()
})

app.Management.AddHealthCheck("external-api", func() error {
    resp, err := http.Get("https://api.example.com/health")
    if err != nil {
        return err
    }
    if resp.StatusCode != 200 {
        return fmt.Errorf("unhealthy: status %d", resp.StatusCode)
    }
    return nil
})
```

Health check response:

```bash
curl http://localhost:9090/health
```

```json
{
  "status": "healthy",
  "checks": {
    "database": "ok",
    "cache": "ok",
    "external-api": "ok"
  }
}
```

## Metrics

Bootstrap automatically collects metrics:

- `http_requests_total` - Total HTTP requests
- `http_request_duration_seconds` - Request duration histogram
- `http_requests_in_flight` - Current in-flight requests
- Go runtime metrics (memory, goroutines, GC)

Access metrics:

```bash
curl http://localhost:9090/metrics
```

## Next Steps

- [Authentication](/documentation/nimburion/guides/authentication/) - Protect your endpoints
- [Middleware Reference](/documentation/nimburion/reference/middleware/) - Available middleware
- [Configuration Reference](/documentation/nimburion/reference/configuration/) - All server options
