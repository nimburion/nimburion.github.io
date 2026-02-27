---
layout: documentation
title: Deployment
lang: en
description: Deploy Nimburion services to production
---

# Deployment

Operational guide for deploying and running Nimburion services in production.

## Prerequisites

- Service built and tested
- Configuration prepared (environment or file)
- Infrastructure ready (compute, networking, dependencies)

## Build for Production

```bash
CGO_ENABLED=0 GOOS=linux go build -o service ./main.go
```

## Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY go.* ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o service ./main.go

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /app
COPY --from=builder /app/service .
EXPOSE 8080 9090
CMD ["./service"]
```

Build and run:

```bash
docker build -t my-service:latest .
docker run -p 8080:8080 -p 9090:9090 \
  -e APP_LOG_LEVEL=info \
  my-service:latest
```

## Kubernetes Deployment

Create `deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-service
  template:
    metadata:
      labels:
        app: my-service
    spec:
      containers:
      - name: service
        image: my-service:latest
        ports:
        - containerPort: 8080
          name: public
        - containerPort: 9090
          name: management
        env:
        - name: APP_LOG_LEVEL
          value: info
        livenessProbe:
          httpGet:
            path: /health
            port: 9090
        readinessProbe:
          httpGet:
            path: /ready
            port: 9090
```

## Configuration Management

### Environment Variables

Use `APP_` prefix for all config:

```bash
export APP_PUBLIC_PORT=8080
export APP_MANAGEMENT_PORT=9090
export APP_LOG_LEVEL=info
```

### Config Files

Mount config file in container:

```bash
docker run -v $(pwd)/config.yaml:/app/config.yaml my-service
```

### Secrets

Never commit secrets. Use:
- Kubernetes Secrets
- AWS Secrets Manager
- HashiCorp Vault
- Environment injection

See [Configuration Secrets](/documentation/nimburion/reference/configuration-secrets/)

## Management Endpoints

Expose on management server (port 9090):

- `GET /health` - Liveness probe
- `GET /ready` - Readiness probe
- `GET /metrics` - Prometheus metrics
- `GET /version` - Version info

## Security

### Network Isolation

Keep management port (9090) isolated from public traffic:
- Use network policies in Kubernetes
- Use security groups in AWS
- Use firewall rules in VMs

### Authentication

Protect management endpoints:
```yaml
management:
  auth:
    enabled: true
    type: basic
    username: admin
    password: ${MGMT_PASSWORD}
```

Or use mTLS for service-to-service communication.

## Monitoring

### Health Checks

Configure health checks for dependencies:

```go
mgmt.AddHealthCheck("database", func() error {
    return db.Ping()
})

mgmt.AddHealthCheck("cache", func() error {
    return cache.Ping()
})
```

### Metrics

Scrape Prometheus metrics from `/metrics` on management port.

### Logging

Nimburion logs to stdout in JSON format. Configure log aggregation:
- CloudWatch Logs (AWS)
- Stackdriver (GCP)
- ELK Stack
- Datadog

## Graceful Shutdown

Nimburion handles SIGTERM/SIGINT automatically:

1. Stop accepting new requests
2. Wait for in-flight requests to complete
3. Run shutdown hooks
4. Exit

Configure timeout:

```yaml
server:
  shutdownTimeout: 30s
```

## Operational Checklist

- [ ] Build with `CGO_ENABLED=0` for static binary
- [ ] Set appropriate log level (info or warn in production)
- [ ] Configure health checks for all dependencies
- [ ] Expose metrics on management port
- [ ] Protect management endpoints with auth or network isolation
- [ ] Use secrets manager for sensitive config
- [ ] Set up log aggregation
- [ ] Configure monitoring and alerting
- [ ] Test graceful shutdown
- [ ] Document runbook for common issues

## Next Steps

- [Monitoring](/documentation/nimburion/getting-started/monitoring/) - Set up observability
- [Troubleshooting](/documentation/nimburion/getting-started/troubleshooting/) - Debug common issues
- [Configuration Reference](/documentation/nimburion/reference/configuration/) - All config options

