---
layout: documentation
title: Installation
lang: en
---

# Installation

## Requirements

- Go 1.21 or later
- Git

## Install via Go Modules

```bash
go get github.com/nimburion/nimburion
```

## Verify Installation

```bash
go list -m github.com/nimburion/nimburion
```

## Dependencies

Nimburion uses these key dependencies:
- Gin for HTTP routing
- Viper for configuration
- Zap for structured logging
- Prometheus client for metrics
- OpenTelemetry for tracing

All dependencies are managed via Go modules.
