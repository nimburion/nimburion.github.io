---
layout: documentation
title: Getting Started
lang: en
description: Quick start guide for the Nimburion ecosystem
---

# Getting Started with Nimburion

Build production-ready Go microservices in minutes with the Nimburion ecosystem.

## What is Nimburion?

Nimburion is a complete ecosystem for building cloud-native microservices in Go:

- **Nimburion Framework** - Core library with HTTP servers, configuration, observability, and operational patterns
- **API Gateway** - Edge routing, authentication, rate limiting, and policy enforcement
- **nimbctl** - CLI tool for project scaffolding and code generation

## Quick Start

### 1. Install Prerequisites

- **Go 1.23 or later**
- (Optional) Docker for local dependencies

```bash
go version
# go version go1.23.0 darwin/arm64
```

### 2. Create Your First Service

```bash
# Create project
mkdir my-service && cd my-service
go mod init my-service

# Add Nimburion
go get github.com/nimburion/nimburion
```

Create `main.go`:

```go
package main

import (
    "context"
    "net/http"
    
    "github.com/nimburion/nimburion/pkg/cli"
    "github.com/nimburion/nimburion/pkg/config"
    "github.com/nimburion/nimburion/pkg/observability/logger"
    "github.com/nimburion/nimburion/pkg/server"
)

func main() {
    opts := cli.ServiceCommandOptions{
        Name:        "my-service",
        Description: "My Nimburion service",
        RunServer: func(ctx context.Context, cfg *config.Config, log logger.Logger) error {
            httpOpts := server.NewDefaultRunHTTPServersOptions()
            httpOpts.Config = cfg
            httpOpts.Logger = log
            
            servers, err := server.BuildHTTPServers(httpOpts)
            if err != nil {
                return err
            }
            
            servers.Public.Router().GET("/hello", func(w http.ResponseWriter, r *http.Request) {
                w.Header().Set("Content-Type", "application/json")
                w.Write([]byte(`{"message":"Hello from Nimburion"}`))
            })
            
            return server.RunHTTPServersWithSignals(servers, httpOpts)
        },
    }
    
    cmd := cli.NewServiceCommand(opts)
    cli.Execute(cmd)
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

### 3. Run Your Service

```bash
go run main.go
```

### 4. Test Endpoints

```bash
# Business endpoint
curl http://localhost:8080/hello
{"message":"Hello from Nimburion"}

# Health check
curl http://localhost:9090/health
{"status":"ok"}

# Metrics
curl http://localhost:9090/metrics
```

## What You Get Out of the Box

### Dual HTTP Servers
- **Public Server** (8080) - Business logic endpoints
- **Management Server** (9090) - Health, metrics, version

### Observability
- Structured JSON logging
- Prometheus metrics
- Request tracing with correlation IDs
- Health and readiness checks

### Operational Excellence
- Graceful shutdown (SIGTERM/SIGINT)
- Configuration from files and environment variables
- Panic recovery middleware
- CORS and security headers

## Next Steps

{{< doc-grid >}}
{{< doc-card title="Nimburion Framework" description="Deep dive into HTTP servers, middleware, configuration, and observability." link="/documentation/nimburion/" linktext="Explore framework →" >}}
{{< doc-card title="API Gateway" description="Set up edge routing, authentication, and rate limiting for your services." link="/documentation/apigateway/" linktext="Learn about gateway →" >}}
{{< doc-card title="Guides & Tutorials" description="Authentication, databases, event-driven architecture, and deployment patterns." link="/documentation/nimburion/guides/" linktext="Browse guides →" >}}
{{< doc-card title="API Reference" description="Complete API documentation for all packages and components." link="/documentation/nimburion/api/" linktext="View API docs →" >}}
{{< /doc-grid >}}

## Common Patterns

### Add Database Support

```bash
go get github.com/nimburion/nimburion/pkg/database
```

See [Database Guide](/documentation/nimburion/guides/database/) for PostgreSQL, MySQL, and connection pooling.

### Add Authentication

```bash
go get github.com/nimburion/nimburion/pkg/auth
```

See [Authentication Guide](/documentation/nimburion/guides/authentication/) for JWT, OAuth2, and API keys.

### Deploy to Production

See [Deployment Guide](/documentation/nimburion/getting-started/deployment/) for Docker, Kubernetes, and cloud platforms.

## Get Help

- [Documentation](/documentation/)
- [GitHub Issues](https://github.com/nimburion/nimburion/issues)
- [Examples Repository](https://github.com/nimburion/examples)
