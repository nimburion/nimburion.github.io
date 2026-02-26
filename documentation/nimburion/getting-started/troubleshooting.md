---
layout: documentation
title: Troubleshooting
lang: en
---

# Troubleshooting

## Common Issues

### Port Already in Use

Change ports via environment:
```bash
APP_PUBLIC_PORT=8081 APP_MANAGEMENT_PORT=9091 go run main.go
```

### Configuration Not Loading

Check precedence: ENV > file > defaults

Verify environment variables use `APP_` prefix.

### Health Check Failing

Check registered health checks:
```go
mgmt.AddHealthCheck("db", func() error {
    return db.Ping()
})
```

### High Memory Usage

Enable profiling on management server:
```bash
curl http://localhost:9090/debug/pprof/heap > heap.prof
go tool pprof heap.prof
```

## Debug Logging

Enable debug logs:
```bash
APP_LOG_LEVEL=debug go run main.go
```

## Get Help

- [GitHub Issues](https://github.com/nimburion/nimburion/issues)
- [Configuration Reference](/documentation/nimburion/reference/configuration/)
