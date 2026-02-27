---
layout: documentation
title: First Service
lang: en
---

# First Service

Deep dive into creating and understanding your first Nimburion service.

## Service Structure

```
my-service/
├── main.go
├── go.mod
├── go.sum
├── config.yaml (optional)
└── internal/
    ├── handlers/
    ├── services/
    └── models/
```

## Minimal Service

```go
package main

import (
    "context"
    
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
            
            servers, _ := server.BuildHTTPServers(httpOpts)
            return server.RunHTTPServersWithSignals(servers, httpOpts)
        },
    }
    
    cmd := cli.NewServiceCommand(opts)
    cli.Execute(cmd)
}
```

## Adding Routes

```go
servers.Public.Router().GET("/users", listUsers)
servers.Public.Router().POST("/users", createUser)
servers.Public.Router().GET("/users/{id}", getUser)
```

## Adding Middleware

```go
pub.Use(middleware.RequestID())
pub.Use(middleware.Logger())
pub.Use(middleware.Recovery())
```

## Lifecycle Hooks

```go
pub.OnStart(func() error {
    // Initialize resources
    return nil
})

pub.OnShutdown(func() error {
    // Cleanup resources
    return nil
})
```
