---
layout: documentation
title: pkg/cli
---

# pkg/cli

CLI utilities for service management.

## Create Commands

```go
import "github.com/nimburion/nimburion/pkg/cli"

cmd := cli.NewCommand("migrate", "Run database migrations", func(args []string) error {
    return migrator.Up()
})

cli.Register(cmd)
cli.Execute()
```

## Built-in Commands

- `version` - Show version info
- `config` - Show configuration
- `health` - Check health status
