---
layout: documentation
title: pkg/observability
---

# pkg/observability

Structured logging, metrics, and distributed tracing.

## Logging

```go
import "github.com/nimburion/nimburion/pkg/observability/log"

log.Info("user created", "userId", user.ID, "email", user.Email)
log.Error("failed to process", "error", err)

// Context-aware logging
logger := log.FromContext(ctx)
logger.Info("processing request")
```

## Metrics

```go
import "github.com/nimburion/nimburion/pkg/observability/metrics"

counter := metrics.NewCounter("requests_total", "Total requests")
counter.Inc()

histogram := metrics.NewHistogram("request_duration", "Request duration")
histogram.Observe(duration.Seconds())
```

## Tracing

```go
import "github.com/nimburion/nimburion/pkg/observability/tracing"

ctx, span := tracing.StartSpan(ctx, "process_order")
defer span.End()

span.SetAttribute("order.id", orderID)
span.RecordError(err)
```

## See Also

- [Observability Guide](/documentation/nimburion/guides/observability/)
