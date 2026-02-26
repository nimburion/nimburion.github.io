---
layout: documentation
title: Getting Started
lang: en
description: Quick start guide for Nimburion framework
---

# Getting Started

Get up and running with Nimburion in minutes. This guide walks you through installation, creating your first service, and basic configuration.

## Prerequisites

- Go 1.21 or later
- Basic understanding of Go and HTTP services
- (Optional) Docker for running dependencies locally

## Installation

Install Nimburion using Go modules:

```bash
go get github.com/nimburion/nimburion
```

Or add it to your `go.mod`:

```go
require github.com/nimburion/nimburion v0.1.0
```

## Your First Service

Create a new Go project:

```bash
mkdir my-service
cd my-service
go mod init github.com/yourorg/my-service
go get github.com/nimburion/nimburion
```

Create `main.go`:

```go
package main

import (
    "github.com/gin-gonic/gin"
    "github.com/nimburion/nimburion/pkg/config"
    "github.com/nimburion/nimburion/pkg/server"
)

func main() {
    // Load configuration
    cfg := config.Load()
    
    // Create public and management servers
    pub := server.NewPublic(cfg)
    mgmt := server.NewManagement(cfg)
    
    // Register routes
    pub.Router().GET("/hello", func(c *gin.Context) {
        c.JSON(200, gin.H{
            "message": "Hello from Nimburion",
        })
    })
    
    // Start both servers with graceful shutdown
    server.Run(pub, mgmt)
}
```

Run your service:

```bash
go run main.go
```

Test it:

```bash
# Public endpoint
curl http://localhost:8080/hello

# Management endpoints
curl http://localhost:9090/health
curl http://localhost:9090/ready
curl http://localhost:9090/version
```

## What Just Happened?

You created a service with:

- **Public server** on port 8080 for business endpoints
- **Management server** on port 9090 for operational endpoints
- **Health checks** at `/health` and `/ready`
- **Version endpoint** at `/version`
- **Graceful shutdown** handling SIGTERM/SIGINT
- **Structured logging** to stdout
- **Metrics** exposed at `/metrics` (management server)

## Next Steps

<div class="doc-sections-grid">
  <div class="doc-section-card">
    <h3>Installation Details</h3>
    <p>Learn about Go version requirements, dependencies, and setup options.</p>
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
    <h3>Deployment</h3>
    <p>Deploy your service to production with Docker, Kubernetes, or VMs.</p>
    <a href="{{ '/documentation/nimburion/getting-started/deployment/' | relative_url }}">Read more →</a>
  </div>
</div>

## Common Issues

**Port already in use**  
Change the default ports using environment variables:
```bash
APP_PUBLIC_PORT=8081 APP_MANAGEMENT_PORT=9091 go run main.go
```

**Module not found**  
Make sure you've run `go mod tidy` to download dependencies.

**Configuration errors**  
Check that your config file is valid YAML and environment variables use the `APP_` prefix.

## Get Help

- [Configuration Reference](/documentation/nimburion/reference/configuration/)
- [Troubleshooting Guide](/documentation/nimburion/getting-started/troubleshooting/)
- [GitHub Issues](https://github.com/nimburion/nimburion/issues)
