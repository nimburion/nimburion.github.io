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

{{< doc-grid >}}
{{< doc-card title="Configuration Basics" description="Configure your service with environment variables, files, and defaults." link="/documentation/nimburion/getting-started/configuration-basics/" linktext="Read more →" >}}
{{< doc-card title="HTTP Servers Guide" description="Learn how to customize servers and add middleware." link="/documentation/nimburion/guides/http-servers/" linktext="Read more →" >}}
{{< doc-card title="First Service Deep Dive" description="Understand the service structure, routing, middleware, and lifecycle." link="/documentation/nimburion/getting-started/first-service/" linktext="Read more →" >}}
{{< doc-card title="Deployment" description="Deploy your service to production environments." link="/documentation/nimburion/getting-started/deployment/" linktext="Read more →" >}}
{{< /doc-grid >}}

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
