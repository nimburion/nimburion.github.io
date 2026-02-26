---
layout: documentation
title: pkg/auth
---

# pkg/auth

Authentication and authorization with OAuth2/OIDC JWT.

## JWT Validation

```go
import "github.com/nimburion/nimburion/pkg/auth"

// Add JWT middleware
app.Public.Use(auth.JWT(cfg))

// Protect routes
app.Public.GET("/protected", auth.Required(), handler)
```

## Scope Authorization

```go
app.Public.GET("/admin", 
    auth.Required(),
    auth.RequireScopes("admin:read"),
    handler,
)
```

## Extract Claims

```go
func handler(c *gin.Context) {
    claims := auth.GetClaims(c)
    userID := claims.Subject
    email := claims.Email
}
```

## See Also

- [Authentication Guide](/documentation/nimburion/guides/authentication/)
- [Authorization Guide](/documentation/nimburion/guides/authorization/)
