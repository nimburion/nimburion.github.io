---
layout: documentation
title: HTTP Servers
---

# HTTP Servers

Guide to using public and management HTTP servers in Nimburion.

## Dual Server Architecture

Nimburion runs two independent HTTP servers:
- **Public server** - Business endpoints (port 8080)
- **Management server** - Operational endpoints (port 9090)

## Creating Servers

```go
pub := server.NewPublic(cfg)
mgmt := server.NewManagement(cfg)
```

## Routing

```go
pub.Router().GET("/users", listUsers)
pub.Router().POST("/users", createUser)
pub.Router().PUT("/users/:id", updateUser)
pub.Router().DELETE("/users/:id", deleteUser)
```

## Middleware

```go
pub.Use(middleware.RequestID())
pub.Use(middleware.Logger())
pub.Use(middleware.Recovery())
pub.Use(middleware.CORS())
```

## Lifecycle

```go
pub.OnStart(func() error {
    return db.Connect()
})

pub.OnShutdown(func() error {
    return db.Close()
})

server.Run(pub, mgmt)
```
