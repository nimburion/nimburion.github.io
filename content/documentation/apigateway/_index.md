---
layout: documentation
title: API Gateway
lang: en
hero:
  eyebrow: Edge project
  title: API Gateway documentation for routing and policy control.
  subtitle: HTTP/WebSocket gateway built on Nimburion with controlled exposure, policy enforcement, and operational visibility at the edge.
  panelLabel: API Gateway docs sections
---

{{< project-grid title="Start here" description="Read conceptual pages first, then move to routing and policy specifics." >}}
{{< project-card number="1" title="Architecture" description="Purpose, system role, and high-level capability map of the gateway." link="/documentation/apigateway/overview/" >}}
{{< project-card number="2" title="Operations" description="Runbook, reliability practices, and production operations guidance." link="/documentation/apigateway/operations/" >}}
{{< project-card number="3" title="Routing and Policies" description="Routing model, policy chain, and contract-driven edge behavior." link="/documentation/apigateway/routing-and-policies/" >}}
{{< /project-grid >}}

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

{{< cta-panel title="Back to ecosystem index" description="Return to Documentation Home to switch project area." link="/documentation/" linktext="Open Documentation Home" >}}
