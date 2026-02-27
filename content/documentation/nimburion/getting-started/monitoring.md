---
layout: documentation
title: Monitoring
lang: en
---

# Monitoring

## Management Endpoints

- `GET /health` - Health check
- `GET /ready` - Readiness check
- `GET /metrics` - Prometheus metrics
- `GET /version` - Version info

## Health Checks

```go
mgmt.AddHealthCheck("database", func() error {
    return db.Ping()
})
```

## Metrics

Nimburion exposes Prometheus metrics automatically:
- HTTP request duration
- HTTP request count
- Active connections
- Go runtime metrics

## Distributed Tracing

Enable OpenTelemetry tracing:

```yaml
tracing:
  enabled: true
  endpoint: http://jaeger:14268/api/traces
```
