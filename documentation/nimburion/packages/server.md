---
layout: documentation
title: pkg/server
---

# pkg/server

HTTP server lifecycle management with dual server architecture.

## Overview

The server package provides:
- Public server for business endpoints
- Management server for operational endpoints
- Bootstrap function for automatic configuration
- Graceful shutdown handling
- Lifecycle hooks

## Installation

```bash
import "github.com/nimburion/nimburion/pkg/server"
```

## Bootstrap

The recommended way to create servers:

```go
package main

import (
    "github.com/nimburion/nimburion/pkg/config"
    "github.com/nimburion/nimburion/pkg/server"
)

func main() {
    cfg := config.Load()
    
    // Bootstrap creates and configures both servers
    app := server.Bootstrap(cfg)
    
    // Register routes
    app.Public.GET("/hello", helloHandler)
    
    // Start servers
    app.Run()
}
```

## API Reference

### Bootstrap

```go
func Bootstrap(cfg *config.Config) *Application
```

Creates an Application with:
- Public server with middleware chain
- Management server with health, metrics, version endpoints
- Graceful shutdown handling
- Lifecycle hooks support

### Application

```go
type Application struct {
    Public     *gin.Engine
    Management *ManagementServer
}
```

#### Methods

**Run()**
```go
func (app *Application) Run() error
```
Starts both servers and blocks until shutdown signal.

**OnStart()**
```go
func (app *Application) OnStart(fn func() error)
```
Registers function to run before servers start.

**OnShutdown()**
```go
func (app *Application) OnShutdown(fn func() error)
```
Registers function to run during graceful shutdown.

**SetStore()**
```go
func (app *Application) SetStore(store store.Store)
```
Sets database store for dependency injection.

**SetEventBus()**
```go
func (app *Application) SetEventBus(bus eventbus.EventBus)
```
Sets event bus for dependency injection.

**SetJobProcessor()**
```go
func (app *Application) SetJobProcessor(processor jobs.Processor)
```
Sets job processor for dependency injection.

### ManagementServer

```go
type ManagementServer struct {
    // contains filtered or unexported fields
}
```

#### Methods

**AddHealthCheck()**
```go
func (m *ManagementServer) AddHealthCheck(name string, check HealthCheckFunc)
```
Registers a custom health check.

Example:
```go
app.Management.AddHealthCheck("database", func() error {
    return db.Ping()
})
```

**AddReadinessCheck()**
```go
func (m *ManagementServer) AddReadinessCheck(name string, check HealthCheckFunc)
```
Registers a custom readiness check.

## Manual Server Creation

For advanced use cases:

```go
// Create servers manually
pub := server.NewPublic(cfg)
mgmt := server.NewManagement(cfg)

// Configure public server
pub.Use(middleware.RequestID())
pub.Use(middleware.Logger())
pub.GET("/hello", helloHandler)

// Configure management server
mgmt.AddHealthCheck("database", dbHealthCheck)

// Run both servers
server.Run(pub, mgmt)
```

### NewPublic

```go
func NewPublic(cfg *config.Config) *gin.Engine
```

Creates a public server with:
- Gin router
- Configurable port, timeouts
- No middleware (add manually)

### NewManagement

```go
func NewManagement(cfg *config.Config) *ManagementServer
```

Creates a management server with:
- Health endpoint (`/health`)
- Readiness endpoint (`/ready`)
- Metrics endpoint (`/metrics`)
- Version endpoint (`/version`)

### Run

```go
func Run(public *gin.Engine, management *ManagementServer) error
```

Starts both servers and handles graceful shutdown.

## Configuration

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

## Examples

### Basic Server

```go
func main() {
    cfg := config.Load()
    app := server.Bootstrap(cfg)
    
    app.Public.GET("/users", listUsers)
    app.Public.POST("/users", createUsers)
    
    app.Run()
}
```

### With Lifecycle Hooks

```go
func main() {
    cfg := config.Load()
    app := server.Bootstrap(cfg)
    
    // Initialize resources
    app.OnStart(func() error {
        log.Println("Connecting to database...")
        return db.Connect()
    })
    
    // Cleanup resources
    app.OnShutdown(func() error {
        log.Println("Closing database...")
        return db.Close()
    })
    
    app.Public.GET("/users", listUsers)
    app.Run()
}
```

### With Custom Health Checks

```go
func main() {
    cfg := config.Load()
    app := server.Bootstrap(cfg)
    
    // Add health checks
    app.Management.AddHealthCheck("database", func() error {
        return db.Ping()
    })
    
    app.Management.AddHealthCheck("cache", func() error {
        return cache.Ping()
    })
    
    app.Management.AddReadinessCheck("migrations", func() error {
        return migrator.IsUpToDate()
    })
    
    app.Run()
}
```

### With Dependencies

```go
func main() {
    cfg := config.Load()
    
    // Initialize dependencies
    db, _ := postgres.New(cfg.Store)
    bus, _ := kafka.New(cfg.EventBus)
    processor, _ := jobs.NewProcessor(backend, cfg.Jobs)
    
    // Create app
    app := server.Bootstrap(cfg)
    app.SetStore(db)
    app.SetEventBus(bus)
    app.SetJobProcessor(processor)
    
    // Register routes with dependencies
    userHandler := handlers.NewUserHandler(db, bus)
    app.Public.POST("/users", userHandler.Create)
    
    app.Run()
}
```

## Testing

```go
import (
    "net/http/httptest"
    "testing"
    "github.com/stretchr/testify/assert"
)

func TestUserEndpoint(t *testing.T) {
    cfg := config.Default()
    app := server.Bootstrap(cfg)
    
    app.Public.GET("/users/:id", getUserHandler)
    
    // Create test request
    w := httptest.NewRecorder()
    req := httptest.NewRequest("GET", "/users/123", nil)
    
    // Serve request
    app.Public.ServeHTTP(w, req)
    
    // Assert response
    assert.Equal(t, 200, w.Code)
}
```

## See Also

- [HTTP Servers Guide](/documentation/nimburion/guides/http-servers/)
- [Getting Started](/documentation/nimburion/getting-started/)
- [pkg/middleware](/documentation/nimburion/packages/middleware/)
