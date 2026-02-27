---
layout: documentation
title: Getting Started
lang: en
description: Quick start guide for Nimburion framework
---

# Getting Started

Get up and running with Nimburion in minutes with a simple HTTP service.

## Prerequisites

- **Go 1.23 or later**
- (Optional) Docker for running dependencies locally

## Create Your First Service

Create a new directory and initialize a Go module:

```bash
mkdir my-service
cd my-service
go mod init my-service
```

Add Nimburion dependency:

```bash
go get github.com/nimburion/nimburion
```

Create `main.go`:

```go
package main

import (
    "context"
    "log"
    
    "github.com/nimburion/nimburion/pkg/config"
    "github.com/nimburion/nimburion/pkg/health"
    "github.com/nimburion/nimburion/pkg/observability/logger"
    "github.com/nimburion/nimburion/pkg/observability/metrics"
    "github.com/nimburion/nimburion/pkg/server"
    "github.com/nimburion/nimburion/pkg/server/router/nethttp"
)

func main() {
    // Load configuration
    loader := config.NewViperLoader("config.yaml", "APP")
    cfg, err := loader.Load()
    if err != nil {
        log.Fatalf("failed to load config: %v", err)
    }
    
    // Create logger
    appLogger, err := logger.NewZapLogger(logger.Config{
        Level:  logger.InfoLevel,
        Format: logger.JSONFormat,
    })
    if err != nil {
        log.Fatalf("failed to create logger: %v", err)
    }
    
    // Build HTTP servers
    servers, err := server.BuildHTTPServers(&server.RunHTTPServersOptions{
        Config:          cfg,
        PublicRouter:    nethttp.NewRouter(),
        ManagementRouter: nethttp.NewRouter(),
        Logger:          appLogger,
        HealthRegistry:  health.NewRegistry(),
        MetricsRegistry: metrics.NewRegistry(),
    })
    if err != nil {
        log.Fatalf("failed to build servers: %v", err)
    }
    
    // Register business endpoints
    servers.Public.Router().HandleFunc("GET /hello", func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Content-Type", "application/json")
        w.Write([]byte(`{"message":"Hello from Nimburion"}`))
    })
    
    // Run servers with graceful shutdown
    if err := server.RunHTTPServersWithSignals(servers, &server.RunHTTPServersOptions{
        Config: cfg,
        Logger: appLogger,
    }); err != nil {
        log.Fatalf("server error: %v", err)
    }
}
```

Create `config.yaml`:

```yaml
service:
  name: my-service
  environment: development

http:
  port: 8080

management:
  enabled: true
  port: 9090

log:
  level: info
  format: json
```

## Run Your Service

Start the service:

```bash
go run main.go
```

You'll see structured logs:

```json
{"level":"info","msg":"Starting public server","port":8080}
{"level":"info","msg":"Starting management server","port":9090}
```

## Test Your Service

Test the business endpoint:

```bash
curl http://localhost:8080/hello
```

Response:
```json
{"message":"Hello from Nimburion"}
```

Test management endpoints:

```bash
# Health check
curl http://localhost:9090/health
{"status":"ok"}

# Readiness check
curl http://localhost:9090/ready
{"status":"ready"}

# Metrics (Prometheus format)
curl http://localhost:9090/metrics

# Version info
curl http://localhost:9090/version
{"version":"0.1.0","commit":"abc123","buildTime":"2026-02-26T18:00:00Z"}
```

## What You Get

The framework automatically provides:

### Public Server (port 8080)
- HTTP router
- Request ID middleware
- Structured logging middleware
- Recovery middleware (panic handling)
- CORS middleware
- Request validation

### Management Server (port 9090)
- Health check endpoint (`/health`)
- Readiness check endpoint (`/ready`)
- Prometheus metrics endpoint (`/metrics`)
- Version endpoint (`/version`)

### Operational Features
- Graceful shutdown on SIGTERM/SIGINT
- Configurable shutdown timeout
- Lifecycle hooks (startup/shutdown)
- Structured JSON logging
- Automatic metrics collection

## Configuration

Override with environment variables:

```bash
APP_HTTP_PORT=8081 \
APP_MANAGEMENT_PORT=9091 \
APP_LOG_LEVEL=debug \
go run main.go
```

## Next Steps

<div class="doc-sections-grid">
  <div class="doc-section-card">
    <h3>Configuration Basics</h3>
    <p>Configure your service with environment variables, files, and defaults.</p>
    <a href="/documentation/nimburion/getting-started/configuration-basics/">Read more →</a>
  </div>
  
  <div class="doc-section-card">
    <h3>HTTP Servers Guide</h3>
    <p>Learn how to customize servers and add middleware.</p>
    <a href="/documentation/nimburion/guides/http-servers/">Read more →</a>
  </div>
  
  <div class="doc-section-card">
    <h3>First Service Deep Dive</h3>
    <p>Understand the service structure, routing, middleware, and lifecycle.</p>
    <a href="/documentation/nimburion/getting-started/first-service/">Read more →</a>
  </div>
  
  <div class="doc-section-card">
    <h3>Deployment</h3>
    <p>Deploy your service to production environments.</p>
    <a href="/documentation/nimburion/getting-started/deployment/">Read more →</a>
  </div>
</div>

## Common Issues

**Port already in use**  
Change the default ports:
```bash
APP_HTTP_PORT=8081 APP_MANAGEMENT_PORT=9091 go run main.go
```

**Go version too old**  
Nimburion requires Go 1.23 or later:
```bash
go version
# Upgrade if needed
```

## Get Help

- [Configuration Reference](/documentation/nimburion/reference/configuration/)
- [Troubleshooting Guide](/documentation/nimburion/getting-started/troubleshooting/)
- [GitHub Issues](https://github.com/nimburion/nimburion/issues)
