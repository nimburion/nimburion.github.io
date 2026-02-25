# API Gateway

HTTP/WebSocket API Gateway built on `nimburion`.

## Start here
- [Overview](./overview.md)
- [Operations](./operations.md)
- [Routing and Policies](./routing-and-policies.md)

## Quick start
```bash
go run ./cmd --config-file config/config.yaml
```

## Main commands
```bash
go run ./cmd routes show --config-file config/config.yaml
go run ./cmd routes validate --config-file config/config.yaml
go run ./cmd openapi generate --config-file config/config.yaml --output config/openapi/openapi.yml
```
