---
layout: wiki
title: Nimburion Architecture
lang: en
---

# Nimburion Architecture

## Runtime Model
1. Load configuration (`ENV > file > defaults`)
2. Build public and management servers
3. Attach router, middleware, handlers, and adapters
4. Start both servers with lifecycle hooks
5. Expose management endpoints and perform graceful shutdown

## Runtime Flow
```mermaid
sequenceDiagram
    participant Boot as Bootstrap
    participant Cfg as Config Loader
    participant Pub as Public Server
    participant Mgmt as Management Server
    participant Dep as Adapters/Dependencies

    Boot->>Cfg: Load config (ENV > file > defaults)
    Cfg-->>Boot: Validated configuration
    Boot->>Dep: Initialize dependencies
    Boot->>Pub: Build and register routes/middleware
    Boot->>Mgmt: Build management endpoints
    Boot->>Pub: Start
    Boot->>Mgmt: Start
    Note over Pub,Mgmt: Service running
    Boot->>Pub: Graceful shutdown signal
    Boot->>Mgmt: Graceful shutdown signal
```

## Boundaries
- Transport layer: HTTP routing, middleware, request/response concerns
- Domain/application layer: business workflows and orchestration
- Infrastructure layer: datastore, cache, search, messaging, email adapters
- Operations layer: observability, health checks, resilience primitives

## Boundary Diagram
```mermaid
flowchart TB
    subgraph Transport
      Srv[pkg/server]
      Rt[pkg/server/router]
      Mid[pkg/middleware]
      Auth[pkg/auth]
      Ctrl[pkg/controller]
    end

    subgraph Domain
      Repo[pkg/repository]
    end

    subgraph Infrastructure
      Store[pkg/store]
      Bus[pkg/eventbus]
      Email[pkg/email]
      Rt2[pkg/realtime]
    end

    subgraph Operations
      Cfg[pkg/config + pkg/configschema]
      Obs[pkg/observability]
      Hl[pkg/health]
      Res[pkg/resilience]
      Cli[pkg/cli + pkg/migrate + pkg/version]
    end

    Transport --> Domain
    Domain --> Infrastructure
    Transport --> Operations
    Infrastructure --> Operations
```

## Main Packages (Current)
- `pkg/server`, `pkg/server/router`: server and router abstraction
- `pkg/config`, `pkg/configschema`: config loading and validation helpers
- `pkg/middleware`, `pkg/auth`: security and request pipeline
- `pkg/controller`, `pkg/repository`: transport helpers and data abstraction
- `pkg/store`, `pkg/eventbus`, `pkg/email`: pluggable integrations
- `pkg/observability`, `pkg/health`, `pkg/resilience`: runtime operations
- `pkg/realtime`: SSE/WebSocket support
- `pkg/cli`, `pkg/migrate`, `pkg/version`: service tooling

## Out of Scope for This Page
- Long implementation snippets
- Detailed property-by-property formal proofs
- Deep test internals

## Related pages
- [Index](./index.md)
- [Overview](./overview.md)
- [Operations](./operations.md)
