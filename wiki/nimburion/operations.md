# Nimburion Operations

Operational runbook for services built on Nimburion.

## Prerequisites
- Go toolchain installed
- Service config file (optional but recommended)
- Environment overrides with `APP_` prefix

## Common Commands
Run tests:
```bash
go test ./...
```

Run tests with coverage:
```bash
go test -cover ./...
```

Build project:
```bash
go build ./...
```

## Operational Lifecycle
```mermaid
flowchart LR
    Dev[Developer/CI] --> Validate[Run tests and build]
    Validate --> Start[Start service]
    Start --> Check[Check management endpoints]
    Check --> Operate[Operate and observe]
    Operate --> Deploy[Deploy new version]
    Deploy --> Check
```

## Management Endpoints
Typical management endpoints:
- `/health`
- `/ready`
- `/metrics`
- `/version`

Expose them on the management server and secure them with auth/mTLS as needed.

## Endpoint Security Model
```mermaid
flowchart TB
    M[Management Server]
    H[health]
    R[ready]
    Me[metrics]
    V[version]

    M --> H
    M --> R
    M --> Me
    M --> V

    A[Optional auth]
    T[Optional mTLS]

    A -.->|protects| R
    A -.->|protects| Me
    A -.->|protects| V
    T -.->|client-cert and network policy| M
```

## Deploy and Config Rules
- Keep precedence fixed: `ENV > file > defaults`
- Avoid committing secrets; use secret managers or environment injection
- Keep public and management ports distinct
- Apply auth settings consistently between public and management surfaces
- Enable tracing/metrics in non-local environments by default

## Related pages
- [Index](./index.md)
- [Overview](./overview.md)
- [Architecture](./architecture.md)
