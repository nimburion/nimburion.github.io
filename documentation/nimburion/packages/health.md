---
layout: documentation
title: pkg/health
---

# pkg/health

Health check registration and execution.

## Add Health Checks

```go
import "github.com/nimburion/nimburion/pkg/health"

app.Management.AddHealthCheck("database", func() error {
    return db.Ping()
})

app.Management.AddHealthCheck("cache", func() error {
    return cache.Ping()
})
```

## Readiness Checks

```go
app.Management.AddReadinessCheck("migrations", func() error {
    return migrator.IsUpToDate()
})
```

## See Also

- [Deployment Guide](/documentation/nimburion/getting-started/deployment/)
