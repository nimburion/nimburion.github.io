# Nimburion Overview

Nimburion is a reusable Go framework for building production-grade microservices with consistent architecture and operations.

## Objectives
- Reduce service bootstrap time and repeated boilerplate
- Standardize runtime behavior across teams
- Keep security, observability, and reliability first-class

## Use Cases
- Greenfield microservices that need production defaults from day one
- Existing services being aligned to shared platform contracts
- Platform teams exposing reusable infrastructure building blocks

## System Context
```mermaid
flowchart LR
    Client[External Clients]
    Svc[Service built with Nimburion]
    Mgmt[Management Surface]

    Client -->|HTTP/WebSocket| Svc
    Svc -->|Health/Ready/Metrics/Version| Mgmt

    Svc --> DB[(SQL/NoSQL)]
    Svc --> Cache[(Redis/Memcached)]
    Svc --> Search[(OpenSearch/Elasticsearch)]
    Svc --> Bus[(Kafka/RabbitMQ/SQS)]
    Svc --> Obs[(Logs/Metrics/Tracing)]
```

## Capability Matrix
| Area | What Nimburion provides |
| --- | --- |
| Runtime | Public + management servers, graceful shutdown |
| Security | OAuth2/OIDC JWT validation, scope authorization, security middleware |
| Data | Pluggable adapters for SQL/NoSQL, cache, search |
| Messaging | Event bus adapters (Kafka, RabbitMQ, SQS), outbox/idempotency helpers |
| Observability | Structured logging, metrics, tracing, health/readiness endpoints |
| Reliability | Timeout, rate limit, circuit breaker, retry patterns |
| API Contract | OpenAPI generation and request validation |

## Capability Map
```mermaid
flowchart TB
    N[Nimburion]
    N --> RT[Runtime]
    N --> SEC[Security]
    N --> DATA[Data]
    N --> MSG[Messaging]
    N --> OBS[Observability]
    N --> REL[Reliability]
    N --> API[API Contract]

    RT --> RT1[Dual servers]
    SEC --> SEC1[JWT + scopes]
    DATA --> DATA1[Store/Cache/Search adapters]
    MSG --> MSG1[Kafka RabbitMQ SQS]
    OBS --> OBS1[Logs metrics tracing]
    REL --> REL1[Timeout rate-limit CB retry]
    API --> API1[OpenAPI generate/validate]
```

## Related pages
- [Index](./index.md)
- [Architecture](./architecture.md)
- [Operations](./operations.md)
