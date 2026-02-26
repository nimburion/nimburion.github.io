---
layout: documentation
title: Getting Started
lang: en
description: Quick start guide for Nimburion framework
---

# Getting Started

Get up and running with Nimburion in minutes using `nimbctl` to scaffold your first service.

## Prerequisites

- **Go 1.23 or later**
- **nimbctl** - Nimburion CLI tool for scaffolding
- (Optional) Docker for running dependencies locally

## Install nimbctl

Install the Nimburion CLI tool:

```bash
go install github.com/nimburion/nimbctl@latest
```

Verify installation:

```bash
nimbctl version
```

## Create Your First Service

Generate a new service with `nimbctl`:

```bash
nimbctl new my-service
cd my-service
```

This creates a complete service structure:

```
my-service/
├── main.go
├── go.mod
├── go.sum
├── config.yaml
├── internal/
│   ├── handlers/
│   ├── services/
│   └── models/
└── README.md
```

## Generated Service Structure

The generated `main.go` uses `server.Bootstrap()` to automatically configure both servers:

```go
package main

import (
    "github.com/gin-gonic/gin"
    "github.com/nimburion/nimburion/pkg/config"
    "github.com/nimburion/nimburion/pkg/server"
)

func main() {
    // Load configuration (ENV > file > defaults)
    cfg := config.Load()
    
    // Bootstrap automatically creates and configures:
    // - Public server (port 8080)
    // - Management server (port 9090)
    // - Middleware chains
    // - Health checks
    // - Metrics
    // - Graceful shutdown
    app := server.Bootstrap(cfg)
    
    // Register your business endpoints
    app.Public.GET("/hello", func(c *gin.Context) {
        c.JSON(200, gin.H{
            "message": "Hello from Nimburion",
        })
    })
    
    // Start both servers with graceful shutdown
    app.Run()
}
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

## What Bootstrap Provides

The `server.Bootstrap()` function automatically configures:

### Public Server (port 8080)
- HTTP router with Gin
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
- Optional profiling endpoints (`/debug/pprof/*`)

### Operational Features
- Graceful shutdown on SIGTERM/SIGINT
- Configurable shutdown timeout
- Lifecycle hooks (OnStart, OnShutdown)
- Structured JSON logging
- Automatic metrics collection

## Configuration

The generated `config.yaml`:

```yaml
public:
  port: 8080
  
management:
  port: 9090
  
log:
  level: info
  format: json
```

Override with environment variables:

```bash
APP_PUBLIC_PORT=8081 \
APP_MANAGEMENT_PORT=9091 \
APP_LOG_LEVEL=debug \
go run main.go
```

## Next Steps

<div class="doc-sections-grid">
  <div class="doc-section-card">
    <h3>Installation Details</h3>
    <p>Learn about Go version requirements, nimbctl options, and setup.</p>
    <a href="{{ '/documentation/nimburion/getting-started/installation/' | relative_url }}">Read more →</a>
  </div>
  
  <div class="doc-section-card">
    <h3>First Service Deep Dive</h3>
    <p>Understand the service structure, routing, middleware, and lifecycle.</p>
    <a href="{{ '/documentation/nimburion/getting-started/first-service/' | relative_url }}">Read more →</a>
  </div>
  
  <div class="doc-section-card">
    <h3>Configuration Basics</h3>
    <p>Configure your service with environment variables, files, and defaults.</p>
    <a href="{{ '/documentation/nimburion/getting-started/configuration-basics/' | relative_url }}">Read more →</a>
  </div>
  
  <div class="doc-section-card">
    <h3>HTTP Servers Guide</h3>
    <p>Learn how Bootstrap configures servers and how to customize them.</p>
    <a href="{{ '/documentation/nimburion/guides/http-servers/' | relative_url }}">Read more →</a>
  </div>
</div>

## Common Issues

**nimbctl not found**  
Make sure `$GOPATH/bin` is in your PATH:
```bash
export PATH=$PATH:$(go env GOPATH)/bin
```

**Port already in use**  
Change the default ports:
```bash
APP_PUBLIC_PORT=8081 APP_MANAGEMENT_PORT=9091 go run main.go
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
