# API Gateway Operations

Operational runbook for starting, validating, and generating gateway artifacts.

## Prerequisites
- Go installed
- service config file (for example `config/config.yaml`)
- at least one routing source:
  - `routes.groups` inline, or
  - `routes_files` with one or more YAML files

## Start service
```bash
go run ./cmd --config-file config/config.yaml
```

## Common commands
Show merged routes:
```bash
go run ./cmd routes show --config-file config/config.yaml
```

Validate routes and OpenAPI alignment:
```bash
go run ./cmd routes validate --config-file config/config.yaml
```

Generate aggregated OpenAPI:
```bash
go run ./cmd openapi generate --config-file config/config.yaml --output config/openapi/openapi.yml
```

Run test suite:
```bash
go test ./...
```

## Main endpoints
Public:
- `/health`

Group auth endpoints (if enabled):
- `/auth/me`
- `/auth/login`
- `/auth/callback`
- `/auth/logout`
- `/auth/refresh`

Management:
- `/portal`
- `/api/portal/routes`
- `/api/portal/groups`

## Build and artifact generation
Generate all:
```bash
make generate
```

Main targets:
- `make portal`
- `make schema`
- `make openapi`

## Environment variables
Prefix: `APP_`

Examples:
- `APP_AUTH_ISSUER`
- `APP_AUTH_JWKS_URL`
- `APP_AUTH_AUDIENCE`
- `APP_CORS_ALLOWED_ORIGINS`
