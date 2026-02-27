---
layout: documentation
title: Authorization
---

# Authorization

Scope-based authorization in Nimburion.

## Scope Validation

```go
import "github.com/nimburion/nimburion/pkg/auth"

pub.Router().GET("/admin", 
    auth.Required(),
    auth.RequireScopes("admin:read"),
    handler,
)
```

## Multiple Scopes

```go
auth.RequireScopes("users:read", "users:write")
```

## Custom Authorization

```go
func requireOwnership() gin.HandlerFunc {
    return func(c *gin.Context) {
        claims := auth.GetClaims(c)
        resourceOwner := c.Param("userId")
        
        if claims.Subject != resourceOwner {
            c.AbortWithStatus(403)
            return
        }
        
        c.Next()
    }
}
```
