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
    "github.com/nimburion/nimburion/pkg/config"
    "github.com/nimburion/nimburion/pkg/server"
)

func main() {
    cfg := config.Load()
    pub := server.NewPublic(cfg)
    mgmt := server.NewManagement(cfg)
    server.Run(pub, mgmt)
}
```

## Adding Routes

```go
pub.Router().GET("/users", listUsers)
pub.Router().POST("/users", createUser)
pub.Router().GET("/users/:id", getUser)
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
