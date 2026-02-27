---
layout: documentation
title: pkg/observability
---


# logger

```go
import "github.com/nimburion/nimburion/pkg/observability/logger"
```

## Index

- [type AsyncConfig](<#AsyncConfig>)
- [type AsyncLogger](<#AsyncLogger>)
  - [func \(l \*AsyncLogger\) Close\(\)](<#AsyncLogger.Close>)
  - [func \(l \*AsyncLogger\) Debug\(msg string, args ...any\)](<#AsyncLogger.Debug>)
  - [func \(l \*AsyncLogger\) Error\(msg string, args ...any\)](<#AsyncLogger.Error>)
  - [func \(l \*AsyncLogger\) Info\(msg string, args ...any\)](<#AsyncLogger.Info>)
  - [func \(l \*AsyncLogger\) Warn\(msg string, args ...any\)](<#AsyncLogger.Warn>)
  - [func \(l \*AsyncLogger\) With\(args ...any\) Logger](<#AsyncLogger.With>)
  - [func \(l \*AsyncLogger\) WithContext\(ctx context.Context\) Logger](<#AsyncLogger.WithContext>)
- [type Config](<#Config>)
  - [func DefaultConfig\(\) Config](<#DefaultConfig>)
- [type LogFormat](<#LogFormat>)
  - [func ParseLogFormat\(format string\) \(LogFormat, error\)](<#ParseLogFormat>)
- [type LogLevel](<#LogLevel>)
  - [func ParseLogLevel\(level string\) \(LogLevel, error\)](<#ParseLogLevel>)
- [type Logger](<#Logger>)
  - [func WrapAsync\(base Logger, cfg AsyncConfig\) Logger](<#WrapAsync>)
- [type ZapLogger](<#ZapLogger>)
  - [func NewZapLogger\(cfg Config\) \(\*ZapLogger, error\)](<#NewZapLogger>)
  - [func \(l \*ZapLogger\) Debug\(msg string, args ...any\)](<#ZapLogger.Debug>)
  - [func \(l \*ZapLogger\) Error\(msg string, args ...any\)](<#ZapLogger.Error>)
  - [func \(l \*ZapLogger\) Info\(msg string, args ...any\)](<#ZapLogger.Info>)
  - [func \(l \*ZapLogger\) Sync\(\) error](<#ZapLogger.Sync>)
  - [func \(l \*ZapLogger\) Warn\(msg string, args ...any\)](<#ZapLogger.Warn>)
  - [func \(l \*ZapLogger\) With\(args ...any\) Logger](<#ZapLogger.With>)
  - [func \(l \*ZapLogger\) WithContext\(ctx context.Context\) Logger](<#ZapLogger.WithContext>)


<a name="AsyncConfig"></a>
## type AsyncConfig

AsyncConfig configures the async logger wrapper.

```go
type AsyncConfig struct {
    Enabled      bool
    QueueSize    int
    WorkerCount  int
    DropWhenFull bool
}
```

<a name="AsyncLogger"></a>
## type AsyncLogger

AsyncLogger queues log entries and writes them through worker goroutines.

```go
type AsyncLogger struct {
    // contains filtered or unexported fields
}
```

<a name="AsyncLogger.Close"></a>
### func \(\*AsyncLogger\) Close

```go
func (l *AsyncLogger) Close()
```

Close drains the queue and stops async workers.

<a name="AsyncLogger.Debug"></a>
### func \(\*AsyncLogger\) Debug

```go
func (l *AsyncLogger) Debug(msg string, args ...any)
```

Debug logs a debug\-level message asynchronously.

<a name="AsyncLogger.Error"></a>
### func \(\*AsyncLogger\) Error

```go
func (l *AsyncLogger) Error(msg string, args ...any)
```

Error logs an error\-level message asynchronously.

<a name="AsyncLogger.Info"></a>
### func \(\*AsyncLogger\) Info

```go
func (l *AsyncLogger) Info(msg string, args ...any)
```

Info logs an info\-level message asynchronously.

<a name="AsyncLogger.Warn"></a>
### func \(\*AsyncLogger\) Warn

```go
func (l *AsyncLogger) Warn(msg string, args ...any)
```

Warn logs a warn\-level message asynchronously.

<a name="AsyncLogger.With"></a>
### func \(\*AsyncLogger\) With

```go
func (l *AsyncLogger) With(args ...any) Logger
```

With returns a new logger with additional fields.

<a name="AsyncLogger.WithContext"></a>
### func \(\*AsyncLogger\) WithContext

```go
func (l *AsyncLogger) WithContext(ctx context.Context) Logger
```

WithContext returns a new logger with the given context.

<a name="Config"></a>
## type Config

Config holds configuration for the logger

```go
type Config struct {
    Level  LogLevel
    Format LogFormat
}
```

<a name="DefaultConfig"></a>
### func DefaultConfig

```go
func DefaultConfig() Config
```

DefaultConfig returns default configuration for Zap logger with JSON encoding.

<a name="LogFormat"></a>
## type LogFormat

LogFormat represents the output format for logs

```go
type LogFormat string
```

<a name="JSONFormat"></a>

```go
const (
    JSONFormat LogFormat = "json"
    TextFormat LogFormat = "text"
)
```

<a name="ParseLogFormat"></a>
### func ParseLogFormat

```go
func ParseLogFormat(format string) (LogFormat, error)
```

ParseLogFormat converts a string to a LogFormat

<details><summary>Example</summary>
<p>



```go
package main

import (
	"fmt"

	"github.com/nimburion/nimburion/pkg/observability/logger"
)

func main() {
	// Parse log format from string (e.g., from environment variable)
	format, err := logger.ParseLogFormat("json")
	if err != nil {
		fmt.Printf("Invalid log format: %v\n", err)
		return
	}

	log, _ := logger.NewZapLogger(logger.Config{
		Level:  logger.InfoLevel,
		Format: format,
	})
	defer log.Sync()

	log.Info("structured JSON output")
}
```

</p>
</details>

<a name="LogLevel"></a>
## type LogLevel

LogLevel represents the logging level

```go
type LogLevel string
```

<a name="DebugLevel"></a>

```go
const (
    DebugLevel LogLevel = "debug"
    InfoLevel  LogLevel = "info"
    WarnLevel  LogLevel = "warn"
    ErrorLevel LogLevel = "error"
)
```

<a name="ParseLogLevel"></a>
### func ParseLogLevel

```go
func ParseLogLevel(level string) (LogLevel, error)
```

ParseLogLevel converts a string to a LogLevel

<details><summary>Example</summary>
<p>



```go
package main

import (
	"fmt"

	"github.com/nimburion/nimburion/pkg/observability/logger"
)

func main() {
	// Parse log level from string (e.g., from environment variable)
	level, err := logger.ParseLogLevel("debug")
	if err != nil {
		fmt.Printf("Invalid log level: %v\n", err)
		return
	}

	log, _ := logger.NewZapLogger(logger.Config{
		Level:  level,
		Format: logger.JSONFormat,
	})
	defer log.Sync()

	log.Debug("this debug message will be visible")
}
```

</p>
</details>

<a name="Logger"></a>
## type Logger

Logger defines the interface for structured logging throughout the framework. All log methods accept a message string followed by key\-value pairs for structured fields.

```go
type Logger interface {
    // Debug logs a debug-level message with optional key-value pairs
    Debug(msg string, args ...any)

    // Info logs an info-level message with optional key-value pairs
    Info(msg string, args ...any)

    // Warn logs a warning-level message with optional key-value pairs
    Warn(msg string, args ...any)

    // Error logs an error-level message with optional key-value pairs
    Error(msg string, args ...any)

    // With creates a child logger with additional key-value pairs that will be
    // included in all subsequent log entries
    With(args ...any) Logger

    // WithContext creates a child logger that extracts request ID from context
    WithContext(ctx context.Context) Logger
}
```

<a name="WrapAsync"></a>
### func WrapAsync

```go
func WrapAsync(base Logger, cfg AsyncConfig) Logger
```

WrapAsync wraps a logger with async dispatch when enabled.

<a name="ZapLogger"></a>
## type ZapLogger

ZapLogger is a Logger implementation using uber\-go/zap for structured logging.

```go
type ZapLogger struct {
    // contains filtered or unexported fields
}
```

<a name="NewZapLogger"></a>
### func NewZapLogger

```go
func NewZapLogger(cfg Config) (*ZapLogger, error)
```

NewZapLogger creates a new ZapLogger with the specified configuration. It supports both JSON and text \(console\) output formats and configurable log levels.

<details><summary>Example</summary>
<p>



```go
package main

import (
	"github.com/nimburion/nimburion/pkg/observability/logger"
)

func main() {
	// Create a logger with JSON format and info level
	log, err := logger.NewZapLogger(logger.Config{
		Level:  logger.InfoLevel,
		Format: logger.JSONFormat,
	})
	if err != nil {
		panic(err)
	}
	defer log.Sync()

	// Log a simple message
	log.Info("application started")

	// Log with structured fields
	log.Info("user logged in",
		"user_id", "12345",
		"username", "john.doe",
		"ip_address", "192.168.1.1",
	)
}
```

</p>
</details>

<a name="ZapLogger.Debug"></a>
### func \(\*ZapLogger\) Debug

```go
func (l *ZapLogger) Debug(msg string, args ...any)
```

Debug logs a debug\-level message with optional key\-value pairs

<a name="ZapLogger.Error"></a>
### func \(\*ZapLogger\) Error

```go
func (l *ZapLogger) Error(msg string, args ...any)
```

Error logs an error\-level message with optional key\-value pairs

<a name="ZapLogger.Info"></a>
### func \(\*ZapLogger\) Info

```go
func (l *ZapLogger) Info(msg string, args ...any)
```

Info logs an info\-level message with optional key\-value pairs

<a name="ZapLogger.Sync"></a>
### func \(\*ZapLogger\) Sync

```go
func (l *ZapLogger) Sync() error
```

Sync flushes any buffered log entries. Applications should call this before exiting.

<a name="ZapLogger.Warn"></a>
### func \(\*ZapLogger\) Warn

```go
func (l *ZapLogger) Warn(msg string, args ...any)
```

Warn logs a warning\-level message with optional key\-value pairs

<a name="ZapLogger.With"></a>
### func \(\*ZapLogger\) With

```go
func (l *ZapLogger) With(args ...any) Logger
```

With creates a child logger with additional key\-value pairs that will be included in all subsequent log entries

<details><summary>Example</summary>
<p>



```go
package main

import (
	"github.com/nimburion/nimburion/pkg/observability/logger"
)

func main() {
	log, _ := logger.NewZapLogger(logger.Config{
		Level:  logger.InfoLevel,
		Format: logger.JSONFormat,
	})
	defer log.Sync()

	// Create a child logger with service context
	serviceLogger := log.With(
		"service", "user-service",
		"version", "1.0.0",
	)

	// All logs from serviceLogger will include service and version
	serviceLogger.Info("processing request")
	serviceLogger.Warn("slow query detected", "duration_ms", 1500)
}
```

</p>
</details>

<a name="ZapLogger.WithContext"></a>
### func \(\*ZapLogger\) WithContext

```go
func (l *ZapLogger) WithContext(ctx context.Context) Logger
```

WithContext creates a child logger that extracts request ID from context. If a request ID is found in the context, it will be included in all log entries.

<details><summary>Example</summary>
<p>



```go
package main

import (
	"context"

	"github.com/nimburion/nimburion/pkg/observability/logger"
)

func main() {
	log, _ := logger.NewZapLogger(logger.Config{
		Level:  logger.InfoLevel,
		Format: logger.JSONFormat,
	})
	defer log.Sync()

	// Create a context with request ID (typically from middleware)
	ctx := context.WithValue(context.Background(), "request_id", "req-abc-123")

	// Create a logger that includes the request ID
	requestLogger := log.WithContext(ctx)

	// All logs will automatically include the request_id
	requestLogger.Info("handling request")
	requestLogger.Info("database query executed", "rows", 42)
	requestLogger.Info("request completed", "status", 200)
}
```

</p>
</details>

# metrics

```go
import "github.com/nimburion/nimburion/pkg/observability/metrics"
```

Package metrics provides Prometheus metrics for HTTP requests.

Package metrics provides Prometheus metrics integration for the framework.

## Index

- [func DecrementInFlight\(\)](<#DecrementInFlight>)
- [func IncrementInFlight\(\)](<#IncrementInFlight>)
- [func RecordHTTPMetrics\(method, path string, status int, duration time.Duration\)](<#RecordHTTPMetrics>)
- [type Registry](<#Registry>)
  - [func NewRegistry\(\) \*Registry](<#NewRegistry>)
  - [func \(r \*Registry\) Gatherer\(\) prometheus.Gatherer](<#Registry.Gatherer>)
  - [func \(r \*Registry\) Handler\(\) http.Handler](<#Registry.Handler>)
  - [func \(r \*Registry\) MustRegister\(collectors ...prometheus.Collector\)](<#Registry.MustRegister>)
  - [func \(r \*Registry\) Register\(collector prometheus.Collector\) error](<#Registry.Register>)
  - [func \(r \*Registry\) Unregister\(collector prometheus.Collector\) bool](<#Registry.Unregister>)


<a name="DecrementInFlight"></a>
## func DecrementInFlight

```go
func DecrementInFlight()
```

DecrementInFlight decrements the in\-flight requests gauge.

<a name="IncrementInFlight"></a>
## func IncrementInFlight

```go
func IncrementInFlight()
```

IncrementInFlight increments the in\-flight requests gauge.

<details><summary>Example</summary>
<p>

ExampleIncrementInFlight demonstrates tracking in\-flight requests.

```go
package main

import (
	"fmt"

	"github.com/nimburion/nimburion/pkg/observability/metrics"
)

func main() {
	// Increment when request starts
	metrics.IncrementInFlight()

	// Simulate request processing
	// ... handle request ...

	// Decrement when request completes
	defer metrics.DecrementInFlight()

	fmt.Println("In-flight request tracked")
}
```

#### Output

```
In-flight request tracked
```

</p>
</details>

<a name="RecordHTTPMetrics"></a>
## func RecordHTTPMetrics

```go
func RecordHTTPMetrics(method, path string, status int, duration time.Duration)
```

RecordHTTPMetrics records HTTP request metrics. It updates the duration histogram and request counter with the provided labels.

Requirements: 13.2, 13.3, 13.4

<details><summary>Example</summary>
<p>

ExampleRecordHTTPMetrics demonstrates recording HTTP request metrics.

```go
package main

import (
	"fmt"
	"time"

	"github.com/nimburion/nimburion/pkg/observability/metrics"
)

func main() {
	// Record metrics for an HTTP request
	method := "GET"
	path := "/api/users"
	status := 200
	duration := 150 * time.Millisecond

	metrics.RecordHTTPMetrics(method, path, status, duration)

	fmt.Println("HTTP metrics recorded")
}
```

#### Output

```
HTTP metrics recorded
```

</p>
</details>

<a name="Registry"></a>
## type Registry

Registry manages Prometheus metrics registration and exposure. It provides a central place to register custom metrics and includes HTTP metrics and Go runtime metrics by default.

Requirements: 13.1, 13.5, 13.6, 13.7

```go
type Registry struct {
    // contains filtered or unexported fields
}
```

<a name="NewRegistry"></a>
### func NewRegistry

```go
func NewRegistry() *Registry
```

NewRegistry creates a new metrics registry with default collectors. It automatically registers: \- HTTP request metrics \(duration, counter, in\-flight\) \- Go runtime metrics \(goroutines, memory, GC\)

Requirements: 13.1, 13.5, 13.6

<details><summary>Example</summary>
<p>

ExampleNewRegistry demonstrates creating a metrics registry and exposing metrics.

```go
package main

import (
	"fmt"
	"net/http"

	"github.com/nimburion/nimburion/pkg/observability/metrics"
)

func main() {
	// Create a new metrics registry
	registry := metrics.NewRegistry()

	// Expose metrics on an HTTP endpoint
	http.Handle("/metrics", registry.Handler())

	fmt.Println("Metrics registry created and handler registered")
}
```

#### Output

```
Metrics registry created and handler registered
```

</p>
</details>

<a name="Registry.Gatherer"></a>
### func \(\*Registry\) Gatherer

```go
func (r *Registry) Gatherer() prometheus.Gatherer
```

Gatherer returns the underlying prometheus.Gatherer. This is useful for advanced use cases like custom metric exposition.

<a name="Registry.Handler"></a>
### func \(\*Registry\) Handler

```go
func (r *Registry) Handler() http.Handler
```

Handler returns an HTTP handler that exposes metrics in Prometheus format. This handler should be mounted on the management server at /metrics.

Example:

```
http.Handle("/metrics", registry.Handler())
```

Requirements: 13.1, 13.7

<a name="Registry.MustRegister"></a>
### func \(\*Registry\) MustRegister

```go
func (r *Registry) MustRegister(collectors ...prometheus.Collector)
```

MustRegister registers a custom Prometheus collector and panics on error. Use this for metrics that must be registered at startup.

Requirements: 13.5

<details><summary>Example</summary>
<p>

ExampleRegistry\_MustRegister demonstrates registering multiple custom metrics.

```go
package main

import (
	"fmt"

	"github.com/nimburion/nimburion/pkg/observability/metrics"
	"github.com/prometheus/client_golang/prometheus"
)

func main() {
	registry := metrics.NewRegistry()

	// Create custom metrics
	requestsProcessed := prometheus.NewCounter(prometheus.CounterOpts{
		Name: "requests_processed_total",
		Help: "Total number of requests processed",
	})

	activeConnections := prometheus.NewGauge(prometheus.GaugeOpts{
		Name: "active_connections",
		Help: "Number of active connections",
	})

	// Register multiple metrics at once
	registry.MustRegister(requestsProcessed, activeConnections)

	// Use the metrics
	requestsProcessed.Inc()
	activeConnections.Set(42)

	fmt.Println("Multiple custom metrics registered")
}
```

#### Output

```
Multiple custom metrics registered
```

</p>
</details>

<a name="Registry.Register"></a>
### func \(\*Registry\) Register

```go
func (r *Registry) Register(collector prometheus.Collector) error
```

Register registers a custom Prometheus collector. This allows applications to add their own metrics beyond the default HTTP and runtime metrics.

Example:

```
customCounter := prometheus.NewCounter(prometheus.CounterOpts{
    Name: "my_custom_counter",
    Help: "A custom counter metric",
})
registry.Register(customCounter)
```

Requirements: 13.5

<details><summary>Example</summary>
<p>

ExampleRegistry\_Register demonstrates registering custom metrics.

```go
package main

import (
	"fmt"

	"github.com/nimburion/nimburion/pkg/observability/metrics"
	"github.com/prometheus/client_golang/prometheus"
)

func main() {
	registry := metrics.NewRegistry()

	// Create a custom counter
	ordersProcessed := prometheus.NewCounter(prometheus.CounterOpts{
		Name: "orders_processed_total",
		Help: "Total number of orders processed",
	})

	// Register the custom metric
	err := registry.Register(ordersProcessed)
	if err != nil {
		fmt.Printf("Failed to register metric: %v\n", err)
		return
	}

	// Use the metric
	ordersProcessed.Inc()

	fmt.Println("Custom metric registered and incremented")
}
```

#### Output

```
Custom metric registered and incremented
```

</p>
</details>

<a name="Registry.Unregister"></a>
### func \(\*Registry\) Unregister

```go
func (r *Registry) Unregister(collector prometheus.Collector) bool
```

Unregister removes a collector from the registry. This is primarily useful for testing.

Requirements: 13.5

# tracing

```go
import "github.com/nimburion/nimburion/pkg/observability/tracing"
```

Package tracing provides OpenTelemetry distributed tracing support for the framework.

Package tracing provides OpenTelemetry distributed tracing support for the framework.

## Index

- [func RecordError\(span trace.Span, err error\)](<#RecordError>)
- [func RecordSuccess\(span trace.Span\)](<#RecordSuccess>)
- [func StartCacheSpan\(ctx context.Context, operation SpanOperation, opts ...CacheSpanOption\) \(context.Context, trace.Span\)](<#StartCacheSpan>)
- [func StartDatabaseSpan\(ctx context.Context, operation SpanOperation, opts ...DatabaseSpanOption\) \(context.Context, trace.Span\)](<#StartDatabaseSpan>)
- [func StartMessagingSpan\(ctx context.Context, operation SpanOperation, opts ...MessagingSpanOption\) \(context.Context, trace.Span\)](<#StartMessagingSpan>)
- [type CacheSpanOption](<#CacheSpanOption>)
  - [func WithCacheHit\(hit bool\) CacheSpanOption](<#WithCacheHit>)
  - [func WithCacheKey\(key string\) CacheSpanOption](<#WithCacheKey>)
  - [func WithCacheSystem\(system string\) CacheSpanOption](<#WithCacheSystem>)
- [type DatabaseSpanOption](<#DatabaseSpanOption>)
  - [func WithDBName\(name string\) DatabaseSpanOption](<#WithDBName>)
  - [func WithDBStatement\(statement string\) DatabaseSpanOption](<#WithDBStatement>)
  - [func WithDBSystem\(system string\) DatabaseSpanOption](<#WithDBSystem>)
  - [func WithDBTable\(table string\) DatabaseSpanOption](<#WithDBTable>)
- [type MessagingSpanOption](<#MessagingSpanOption>)
  - [func WithMessagingDestination\(destination string\) MessagingSpanOption](<#WithMessagingDestination>)
  - [func WithMessagingMessageID\(messageID string\) MessagingSpanOption](<#WithMessagingMessageID>)
  - [func WithMessagingPayloadSize\(size int\) MessagingSpanOption](<#WithMessagingPayloadSize>)
  - [func WithMessagingSystem\(system string\) MessagingSpanOption](<#WithMessagingSystem>)
- [type SpanOperation](<#SpanOperation>)
- [type TracerConfig](<#TracerConfig>)
- [type TracerProvider](<#TracerProvider>)
  - [func NewTracerProvider\(ctx context.Context, cfg TracerConfig\) \(\*TracerProvider, error\)](<#NewTracerProvider>)
  - [func \(tp \*TracerProvider\) ForceFlush\(ctx context.Context\) error](<#TracerProvider.ForceFlush>)
  - [func \(tp \*TracerProvider\) Shutdown\(ctx context.Context\) error](<#TracerProvider.Shutdown>)
  - [func \(tp \*TracerProvider\) Tracer\(name string\) trace.Tracer](<#TracerProvider.Tracer>)


<a name="RecordError"></a>
## func RecordError

```go
func RecordError(span trace.Span, err error)
```

RecordError records an error in the current span and sets the span status to error. This is a convenience function for consistent error recording.

<details><summary>Example</summary>
<p>

ExampleRecordError demonstrates how to record errors in spans.

```go
package main

import (
	"context"
	"fmt"

	"github.com/nimburion/nimburion/pkg/observability/tracing"
)

func main() {
	ctx := context.Background()

	// Create a span
	ctx, span := tracing.StartDatabaseSpan(ctx, tracing.SpanOperationDBQuery,
		tracing.WithDBTable("users"),
	)
	defer span.End()

	// Simulate an error
	err := fmt.Errorf("connection timeout")

	// Record the error
	tracing.RecordError(span, err)

	fmt.Println("Error recorded in span")
}
```

#### Output

```
Error recorded in span
```

</p>
</details>

<a name="RecordSuccess"></a>
## func RecordSuccess

```go
func RecordSuccess(span trace.Span)
```

RecordSuccess sets the span status to OK. This is a convenience function for marking successful operations.

<a name="StartCacheSpan"></a>
## func StartCacheSpan

```go
func StartCacheSpan(ctx context.Context, operation SpanOperation, opts ...CacheSpanOption) (context.Context, trace.Span)
```

StartCacheSpan creates a new span for a cache operation. It includes cache\-specific attributes like operation type and key.

<details><summary>Example</summary>
<p>

ExampleStartCacheSpan demonstrates how to trace cache operations.

```go
package main

import (
	"context"
	"fmt"

	"github.com/nimburion/nimburion/pkg/observability/tracing"
)

func main() {
	ctx := context.Background()

	// Start a cache span
	ctx, span := tracing.StartCacheSpan(ctx, tracing.SpanOperationCacheGet,
		tracing.WithCacheSystem("redis"),
		tracing.WithCacheKey("user:123"),
	)
	defer span.End()

	// Perform cache operation here
	// ...

	// Record cache hit
	tracing.WithCacheHit(true)
	tracing.RecordSuccess(span)

	fmt.Println("Cache operation traced")
}
```

#### Output

```
Cache operation traced
```

</p>
</details>

<a name="StartDatabaseSpan"></a>
## func StartDatabaseSpan

```go
func StartDatabaseSpan(ctx context.Context, operation SpanOperation, opts ...DatabaseSpanOption) (context.Context, trace.Span)
```

StartDatabaseSpan creates a new span for a database operation. It includes database\-specific attributes like operation type, table name, and query.

Requirements: 14.4

<details><summary>Example</summary>
<p>

ExampleStartDatabaseSpan demonstrates how to trace database operations.

```go
package main

import (
	"context"
	"fmt"

	"github.com/nimburion/nimburion/pkg/observability/tracing"
)

func main() {
	ctx := context.Background()

	// Start a database span
	ctx, span := tracing.StartDatabaseSpan(ctx, tracing.SpanOperationDBQuery,
		tracing.WithDBSystem("postgresql"),
		tracing.WithDBTable("users"),
		tracing.WithDBStatement("SELECT * FROM users WHERE id = $1"),
	)
	defer span.End()

	// Perform database operation here
	// ...

	// Record success
	tracing.RecordSuccess(span)

	fmt.Println("Database operation traced")
}
```

#### Output

```
Database operation traced
```

</p>
</details>

<a name="StartMessagingSpan"></a>
## func StartMessagingSpan

```go
func StartMessagingSpan(ctx context.Context, operation SpanOperation, opts ...MessagingSpanOption) (context.Context, trace.Span)
```

StartMessagingSpan creates a new span for a message broker operation. It includes messaging\-specific attributes like operation type, topic, and message ID.

Requirements: 14.5

<details><summary>Example</summary>
<p>

ExampleStartMessagingSpan demonstrates how to trace message broker operations.

```go
package main

import (
	"context"
	"fmt"

	"github.com/nimburion/nimburion/pkg/observability/tracing"
)

func main() {
	ctx := context.Background()

	// Start a messaging span for publishing
	ctx, span := tracing.StartMessagingSpan(ctx, tracing.SpanOperationMsgPublish,
		tracing.WithMessagingSystem("kafka"),
		tracing.WithMessagingDestination("user.events"),
		tracing.WithMessagingMessageID("msg-123"),
		tracing.WithMessagingPayloadSize(1024),
	)
	defer span.End()

	// Publish message here
	// ...

	// Record success
	tracing.RecordSuccess(span)

	fmt.Println("Message publish traced")
}
```

#### Output

```
Message publish traced
```

</p>
</details>

<a name="CacheSpanOption"></a>
## type CacheSpanOption

CacheSpanOption configures a cache span.

```go
type CacheSpanOption func(*cacheSpanOptions)
```

<a name="WithCacheHit"></a>
### func WithCacheHit

```go
func WithCacheHit(hit bool) CacheSpanOption
```

WithCacheHit sets whether the cache operation was a hit or miss.

<a name="WithCacheKey"></a>
### func WithCacheKey

```go
func WithCacheKey(key string) CacheSpanOption
```

WithCacheKey sets the cache key.

<a name="WithCacheSystem"></a>
### func WithCacheSystem

```go
func WithCacheSystem(system string) CacheSpanOption
```

WithCacheSystem sets the cache system \(e.g., "redis", "memcached"\).

<a name="DatabaseSpanOption"></a>
## type DatabaseSpanOption

DatabaseSpanOption configures a database span.

```go
type DatabaseSpanOption func(*databaseSpanOptions)
```

<a name="WithDBName"></a>
### func WithDBName

```go
func WithDBName(name string) DatabaseSpanOption
```

WithDBName sets the database name.

<a name="WithDBStatement"></a>
### func WithDBStatement

```go
func WithDBStatement(statement string) DatabaseSpanOption
```

WithDBStatement sets the database query statement.

<a name="WithDBSystem"></a>
### func WithDBSystem

```go
func WithDBSystem(system string) DatabaseSpanOption
```

WithDBSystem sets the database system \(e.g., "postgresql", "mysql"\).

<a name="WithDBTable"></a>
### func WithDBTable

```go
func WithDBTable(table string) DatabaseSpanOption
```

WithDBTable sets the database table name for the span.

<a name="MessagingSpanOption"></a>
## type MessagingSpanOption

MessagingSpanOption configures a messaging span.

```go
type MessagingSpanOption func(*messagingSpanOptions)
```

<a name="WithMessagingDestination"></a>
### func WithMessagingDestination

```go
func WithMessagingDestination(destination string) MessagingSpanOption
```

WithMessagingDestination sets the destination \(topic, queue\) name.

<a name="WithMessagingMessageID"></a>
### func WithMessagingMessageID

```go
func WithMessagingMessageID(messageID string) MessagingSpanOption
```

WithMessagingMessageID sets the message ID.

<a name="WithMessagingPayloadSize"></a>
### func WithMessagingPayloadSize

```go
func WithMessagingPayloadSize(size int) MessagingSpanOption
```

WithMessagingPayloadSize sets the message payload size in bytes.

<a name="WithMessagingSystem"></a>
### func WithMessagingSystem

```go
func WithMessagingSystem(system string) MessagingSpanOption
```

WithMessagingSystem sets the messaging system \(e.g., "kafka", "rabbitmq"\).

<a name="SpanOperation"></a>
## type SpanOperation

SpanOperation represents a traced operation type.

```go
type SpanOperation string
```

<a name="SpanOperationDBQuery"></a>

```go
const (
    // Database operations
    SpanOperationDBQuery  SpanOperation = "db.query"
    SpanOperationDBInsert SpanOperation = "db.insert"
    SpanOperationDBUpdate SpanOperation = "db.update"
    SpanOperationDBDelete SpanOperation = "db.delete"
    SpanOperationDBTx     SpanOperation = "db.transaction"

    // Message broker operations
    SpanOperationMsgPublish SpanOperation = "messaging.publish"
    SpanOperationMsgConsume SpanOperation = "messaging.consume"
    SpanOperationMsgProcess SpanOperation = "messaging.process"

    // Cache operations
    SpanOperationCacheGet SpanOperation = "cache.get"
    SpanOperationCacheSet SpanOperation = "cache.set"
    SpanOperationCacheDel SpanOperation = "cache.delete"
)
```

<a name="TracerConfig"></a>
## type TracerConfig

TracerConfig holds configuration for the tracer provider.

```go
type TracerConfig struct {
    // ServiceName identifies the service in traces
    ServiceName string

    // ServiceVersion is the version of the service
    ServiceVersion string

    // Environment identifies the deployment environment (dev, staging, prod)
    Environment string

    // Endpoint is the OTLP collector endpoint (e.g., "localhost:4317")
    Endpoint string

    // SampleRate is the fraction of traces to sample (0.0 to 1.0)
    SampleRate float64

    // Enabled controls whether tracing is active
    Enabled bool
}
```

<a name="TracerProvider"></a>
## type TracerProvider

TracerProvider wraps the OpenTelemetry tracer provider with lifecycle management. It provides methods for creating tracers and graceful shutdown.

Requirements: 14.1, 14.2

```go
type TracerProvider struct {
    // contains filtered or unexported fields
}
```

<a name="NewTracerProvider"></a>
### func NewTracerProvider

```go
func NewTracerProvider(ctx context.Context, cfg TracerConfig) (*TracerProvider, error)
```

NewTracerProvider creates and initializes a new tracer provider with OTLP exporter. It configures the provider with service information, sampling rate, and OTLP endpoint.

Requirements: 14.1, 14.7

<details><summary>Example</summary>
<p>

ExampleNewTracerProvider demonstrates how to create and configure a tracer provider.

```go
package main

import (
	"context"
	"fmt"
	"log"

	"github.com/nimburion/nimburion/pkg/observability/tracing"
)

func main() {
	ctx := context.Background()

	// Create tracer provider with configuration
	provider, err := tracing.NewTracerProvider(ctx, tracing.TracerConfig{
		ServiceName:    "example-service",
		ServiceVersion: "1.0.0",
		Environment:    "production",
		Endpoint:       "localhost:4317",
		SampleRate:     0.1, // Sample 10% of traces
		Enabled:        true,
	})
	if err != nil {
		log.Fatal(err)
	}
	defer provider.Shutdown(ctx)

	// Get a tracer for your component
	tracer := provider.Tracer("example")

	// Create a span
	_, span := tracer.Start(ctx, "example-operation")
	defer span.End()

	fmt.Println("Tracer provider created successfully")
}
```

#### Output

```
Tracer provider created successfully
```

</p>
</details>

<a name="TracerProvider.ForceFlush"></a>
### func \(\*TracerProvider\) ForceFlush

```go
func (tp *TracerProvider) ForceFlush(ctx context.Context) error
```

ForceFlush forces the tracer provider to flush any pending spans. This is useful for ensuring traces are exported before a timeout.

<a name="TracerProvider.Shutdown"></a>
### func \(\*TracerProvider\) Shutdown

```go
func (tp *TracerProvider) Shutdown(ctx context.Context) error
```

Shutdown gracefully shuts down the tracer provider, flushing any pending spans. It should be called during application shutdown to ensure all traces are exported.

<a name="TracerProvider.Tracer"></a>
### func \(\*TracerProvider\) Tracer

```go
func (tp *TracerProvider) Tracer(name string) trace.Tracer
```

Tracer returns a tracer for the given instrumentation scope. The name should identify the instrumentation library \(e.g., "http", "database"\).

Requirements: 14.3, 14.4, 14.5

Generated by [gomarkdoc](<https://github.com/princjef/gomarkdoc>)
