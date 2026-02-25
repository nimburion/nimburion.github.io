---
layout: wiki
title: API Gateway Routing and Policies
lang: en
---

# API Gateway Routing and Policies

## Routing model
The gateway combines:
- inline routes (`routes.groups`)
- external route files (`routes_files`)

`LoadRoutes` pipeline:
1. merge inline and file-based routes
2. validate route and websocket configuration
3. resolve OpenAPI file paths
4. validate OpenAPI files
5. check OpenAPI operation alignment against configured routes

## HTTP request flow
For each HTTP route:
1. build reverse proxy to `target_url`
2. compose middleware chain
3. register `405` handlers for unsupported methods

Typical middleware chain:
- rate limiting (group/route/method)
- scope authorization
- OpenAPI request validation (if configured)

## WebSocket flow
For websocket routes:
- handle upgrade and forward required headers
- connect to backend websocket target
- stream data bidirectionally

## OpenAPI policies
Per-route OpenAPI options:
- `openapi.file` (required when `openapi` is configured)
- `openapi.mode`: `strict` or `warn-only`

Policy behavior:
- **config-time**: `routes validate` checks route/spec alignment
- **runtime**: middleware validates incoming requests per route

## Validation constraints (high level)
- paths/prefixes must be valid and normalized
- target URLs must be absolute and protocol-appropriate
- rate limits must be > 0
- middleware references must be supported
