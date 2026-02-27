---
layout: documentation
title: Authentication
---

# Authentication

OAuth2/OIDC JWT authentication in Nimburion.

## Configuration

```yaml
auth:
  enabled: true
  issuer: https://auth.example.com
  audience: my-service
```

## Protecting Routes

```go
import "github.com/nimburion/nimburion/pkg/auth"

pub.Use(auth.JWT(cfg))

pub.Router().GET("/protected", auth.Required(), handler)
```

## Extracting Claims

```go
func handler(c *gin.Context) {
    claims := auth.GetClaims(c)
    userID := claims.Subject
    email := claims.Email
}
```
