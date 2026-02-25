# API Gateway Overview

The API Gateway is an HTTP/WebSocket gateway built on **nimburion**.

## What it does
- Proxies public HTTP endpoints to internal backend services
- Supports WebSocket proxying
- Applies authentication/authorization and scope checks
- Applies hierarchical rate limiting
- Validates requests against per-route OpenAPI specs
- Exposes a developer portal on the management server

## Main capabilities
- Route configuration from inline config or external route files
- Route validation and OpenAPI alignment checks
- Runtime middleware composition by group, route, and method
- Generated artifacts (OpenAPI and JSON schema)

## Related pages
- [Index](./index.md)
- [Operations](./operations.md)
- [Routing and Policies](./routing-and-policies.md)
