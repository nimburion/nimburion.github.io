---
layout: documentation
title: Configuration Basics
lang: en
---

# Configuration Basics

## Configuration Priority

`ENV > config file > defaults`

## Environment Variables

All config keys can be set via environment with `APP_` prefix:

```bash
APP_PUBLIC_PORT=8080
APP_MANAGEMENT_PORT=9090
APP_LOG_LEVEL=info
```

## Config File

Create `config.yaml`:

```yaml
public:
  port: 8080
management:
  port: 9090
log:
  level: info
```

Load it:

```go
cfg := config.LoadFrom("config.yaml")
```

## Common Settings

- `public.port` - Public server port (default: 8080)
- `management.port` - Management server port (default: 9090)
- `log.level` - Log level: debug, info, warn, error (default: info)
- `log.format` - Log format: json, console (default: json)

See [Configuration Reference](/documentation/nimburion/reference/configuration/) for all options.
