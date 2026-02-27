---
layout: documentation
title: API & Package Reference
---

# API & Package Reference

Complete API documentation auto-generated from godoc comments with comprehensive type signatures, method descriptions, and usage examples.

## Core

{{< doc-grid >}}
{{< doc-card title="server" description="HTTP server implementations with graceful startup/shutdown, routing, and middleware" link="/documentation/nimburion/api/server/" >}}
{{< doc-card title="config" description="Configuration management with precedence, validation, and hot reload" link="/documentation/nimburion/api/config/" >}}
{{< doc-card title="auth" description="JWT authentication, claim validation, and JWKS integration" link="/documentation/nimburion/api/auth/" >}}
{{< /doc-grid >}}

## Data & Messaging

{{< doc-grid >}}
{{< doc-card title="eventbus" description="Message broker adapters (Kafka, RabbitMQ, SQS)" link="/documentation/nimburion/api/eventbus/" >}}
{{< doc-card title="jobs" description="Background job processing with retry and DLQ" link="/documentation/nimburion/api/jobs/" >}}
{{< doc-card title="scheduler" description="Cron-style task scheduling" link="/documentation/nimburion/api/scheduler/" >}}
{{< doc-card title="repository" description="Data access patterns with CRUD operations" link="/documentation/nimburion/api/repository/" >}}
{{< doc-card title="store" description="Database adapters (PostgreSQL, MongoDB, DynamoDB, etc.)" link="/documentation/nimburion/api/store/" >}}
{{< /doc-grid >}}

## Communication

{{< doc-grid >}}
{{< doc-card title="email" description="Email provider integrations (SendGrid, SES, SMTP, etc.)" link="/documentation/nimburion/api/email/" >}}
{{< doc-card title="realtime" description="WebSocket and Server-Sent Events" link="/documentation/nimburion/api/realtime/" >}}
{{< /doc-grid >}}

## Operations

{{< doc-grid >}}
{{< doc-card title="observability" description="Logging, metrics, and distributed tracing" link="/documentation/nimburion/api/observability/" >}}
{{< doc-card title="health" description="Health check registration and execution" link="/documentation/nimburion/api/health/" >}}
{{< doc-card title="migrate" description="Database migration management" link="/documentation/nimburion/api/migrate/" >}}
{{< /doc-grid >}}

---

*Auto-generated from godoc comments using [gomarkdoc](https://github.com/princjef/gomarkdoc)*
