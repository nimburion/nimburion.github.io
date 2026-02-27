---
layout: documentation
title: pkg/jobs
---


# jobs

```go
import "github.com/nimburion/nimburion/pkg/jobs"
```

## Index

- [Constants](<#constants>)
- [Variables](<#variables>)
- [func JobPartitionKey\(tenantID, jobName, jobID string\) string](<#JobPartitionKey>)
- [func MarshalPayloadJSON\(payload any\) \(\[\]byte, error\)](<#MarshalPayloadJSON>)
- [func NewBackendHealthChecker\(name string, backend Backend, timeout time.Duration\) health.Checker](<#NewBackendHealthChecker>)
- [func NewRuntimeHealthChecker\(name string, runtime Runtime, timeout time.Duration\) health.Checker](<#NewRuntimeHealthChecker>)
- [type Backend](<#Backend>)
- [type DLQEntry](<#DLQEntry>)
- [type DLQPolicy](<#DLQPolicy>)
- [type DLQStore](<#DLQStore>)
- [type EventBusBridge](<#EventBusBridge>)
  - [func NewEventBusBridge\(bus eventbus.EventBus\) \(\*EventBusBridge, error\)](<#NewEventBusBridge>)
  - [func \(b \*EventBusBridge\) Close\(\) error](<#EventBusBridge.Close>)
  - [func \(b \*EventBusBridge\) Enqueue\(ctx context.Context, job \*Job\) error](<#EventBusBridge.Enqueue>)
  - [func \(b \*EventBusBridge\) HealthCheck\(ctx context.Context\) error](<#EventBusBridge.HealthCheck>)
  - [func \(b \*EventBusBridge\) Subscribe\(ctx context.Context, queue string, handler Handler\) error](<#EventBusBridge.Subscribe>)
  - [func \(b \*EventBusBridge\) Unsubscribe\(queue string\) error](<#EventBusBridge.Unsubscribe>)
- [type Handler](<#Handler>)
- [type Job](<#Job>)
  - [func JobFromEventBusMessage\(msg \*eventbus.Message\) \(\*Job, error\)](<#JobFromEventBusMessage>)
  - [func JobFromEventBusMessageWithQueue\(msg \*eventbus.Message, fallbackQueue string\) \(\*Job, error\)](<#JobFromEventBusMessageWithQueue>)
  - [func \(j \*Job\) ToEventBusMessage\(\) \(\*eventbus.Message, error\)](<#Job.ToEventBusMessage>)
  - [func \(j \*Job\) Validate\(\) error](<#Job.Validate>)
- [type Lease](<#Lease>)
- [type RedisBackend](<#RedisBackend>)
  - [func NewRedisBackend\(cfg RedisBackendConfig, log logger.Logger\) \(\*RedisBackend, error\)](<#NewRedisBackend>)
  - [func \(b \*RedisBackend\) Ack\(ctx context.Context, lease \*Lease\) error](<#RedisBackend.Ack>)
  - [func \(b \*RedisBackend\) Close\(\) error](<#RedisBackend.Close>)
  - [func \(b \*RedisBackend\) Enqueue\(ctx context.Context, job \*Job\) error](<#RedisBackend.Enqueue>)
  - [func \(b \*RedisBackend\) HealthCheck\(ctx context.Context\) error](<#RedisBackend.HealthCheck>)
  - [func \(b \*RedisBackend\) ListDLQ\(ctx context.Context, queue string, limit int\) \(\[\]\*DLQEntry, error\)](<#RedisBackend.ListDLQ>)
  - [func \(b \*RedisBackend\) MoveToDLQ\(ctx context.Context, lease \*Lease, reason error\) error](<#RedisBackend.MoveToDLQ>)
  - [func \(b \*RedisBackend\) Nack\(ctx context.Context, lease \*Lease, nextRunAt time.Time, reason error\) error](<#RedisBackend.Nack>)
  - [func \(b \*RedisBackend\) Renew\(ctx context.Context, lease \*Lease, leaseFor time.Duration\) error](<#RedisBackend.Renew>)
  - [func \(b \*RedisBackend\) ReplayDLQ\(ctx context.Context, queue string, ids \[\]string\) \(int, error\)](<#RedisBackend.ReplayDLQ>)
  - [func \(b \*RedisBackend\) Reserve\(ctx context.Context, queue string, leaseFor time.Duration\) \(\*Job, \*Lease, error\)](<#RedisBackend.Reserve>)
- [type RedisBackendConfig](<#RedisBackendConfig>)
- [type RetryPolicy](<#RetryPolicy>)
- [type Runtime](<#Runtime>)
- [type RuntimeBackend](<#RuntimeBackend>)
  - [func NewRuntimeBackend\(runtime Runtime, log logger.Logger, cfg RuntimeBackendConfig\) \(\*RuntimeBackend, error\)](<#NewRuntimeBackend>)
  - [func \(b \*RuntimeBackend\) Ack\(ctx context.Context, lease \*Lease\) error](<#RuntimeBackend.Ack>)
  - [func \(b \*RuntimeBackend\) Close\(\) error](<#RuntimeBackend.Close>)
  - [func \(b \*RuntimeBackend\) Enqueue\(ctx context.Context, job \*Job\) error](<#RuntimeBackend.Enqueue>)
  - [func \(b \*RuntimeBackend\) HealthCheck\(ctx context.Context\) error](<#RuntimeBackend.HealthCheck>)
  - [func \(b \*RuntimeBackend\) MoveToDLQ\(ctx context.Context, lease \*Lease, reason error\) error](<#RuntimeBackend.MoveToDLQ>)
  - [func \(b \*RuntimeBackend\) Nack\(ctx context.Context, lease \*Lease, nextRunAt time.Time, reason error\) error](<#RuntimeBackend.Nack>)
  - [func \(b \*RuntimeBackend\) Renew\(ctx context.Context, lease \*Lease, leaseFor time.Duration\) error](<#RuntimeBackend.Renew>)
  - [func \(b \*RuntimeBackend\) Reserve\(ctx context.Context, queue string, leaseFor time.Duration\) \(\*Job, \*Lease, error\)](<#RuntimeBackend.Reserve>)
- [type RuntimeBackendConfig](<#RuntimeBackendConfig>)
- [type RuntimeWorker](<#RuntimeWorker>)
  - [func NewWorker\(backend Backend, log logger.Logger, cfg WorkerConfig\) \(\*RuntimeWorker, error\)](<#NewWorker>)
  - [func \(w \*RuntimeWorker\) Register\(jobName string, handler Handler\) error](<#RuntimeWorker.Register>)
  - [func \(w \*RuntimeWorker\) Start\(ctx context.Context\) error](<#RuntimeWorker.Start>)
  - [func \(w \*RuntimeWorker\) Stop\(ctx context.Context\) error](<#RuntimeWorker.Stop>)
- [type Worker](<#Worker>)
- [type WorkerConfig](<#WorkerConfig>)


## Constants

<a name="DefaultLeaseTTL"></a>

```go
const (
    // DefaultLeaseTTL is the default lease duration when reserve does not provide one.
    DefaultLeaseTTL = 30 * time.Second
    // DefaultDLQSuffix is appended to queue names when moving jobs to dead-letter queue.
    DefaultDLQSuffix = ".dlq"
)
```

<a name="HeaderJobFailureReason"></a>

```go
const (
    HeaderJobFailureReason = "job_failure_reason"
    HeaderJobFailedAt      = "job_failed_at"
    HeaderJobOriginalQueue = "job_original_queue"
)
```

<a name="HeaderJobID"></a>

```go
const (
    HeaderJobID             = "job_id"
    HeaderJobName           = "job_name"
    HeaderJobQueue          = "job_queue"
    HeaderJobTenantID       = "job_tenant_id"
    HeaderJobCorrelationID  = "job_correlation_id"
    HeaderJobIdempotencyKey = "job_idempotency_key"
    HeaderJobRunAt          = "job_run_at"
    HeaderJobAttempt        = "job_attempt"
    HeaderJobMaxAttempts    = "job_max_attempts"
)
```

<a name="DefaultWorkerReserveTimeout"></a>

```go
const (
    DefaultWorkerReserveTimeout = time.Second
    DefaultWorkerStopTimeout    = 10 * time.Second

    DefaultWorkerMaxAttempts    = 5
    DefaultWorkerInitialBackoff = time.Second
    DefaultWorkerMaxBackoff     = 60 * time.Second
    DefaultWorkerAttemptTimeout = 30 * time.Second
)
```

<a name="DefaultContentType"></a>

```go
const (
    DefaultContentType = "application/json"
)
```

## Variables

<a name="ErrValidation"></a>

```go
var (
    // ErrValidation classifies input/config/payload validation failures.
    ErrValidation = errors.New("jobs validation error")
    // ErrConflict classifies state conflicts (for example already-running runtime).
    ErrConflict = errors.New("jobs conflict")
    // ErrNotFound classifies missing logical resources (for example missing lease).
    ErrNotFound = errors.New("jobs not found")
    // ErrRetryable classifies transient backend/runtime failures that may succeed on retry.
    ErrRetryable = errors.New("jobs retryable error")
    // ErrInvalidArgument classifies invalid caller arguments.
    ErrInvalidArgument = errors.New("jobs invalid argument")
    // ErrNotInitialized classifies missing runtime/backend initialization.
    ErrNotInitialized = errors.New("jobs not initialized")
    // ErrClosed classifies operations on an already closed runtime/backend.
    ErrClosed = errors.New("jobs closed")
)
```

<a name="JobPartitionKey"></a>
## func JobPartitionKey

```go
func JobPartitionKey(tenantID, jobName, jobID string) string
```

JobPartitionKey returns a stable partition key to preserve ordering when possible.

<a name="MarshalPayloadJSON"></a>
## func MarshalPayloadJSON

```go
func MarshalPayloadJSON(payload any) ([]byte, error)
```

MarshalPayloadJSON marshals payload using the same conventions used by eventbus JSON payloads.

<a name="NewBackendHealthChecker"></a>
## func NewBackendHealthChecker

```go
func NewBackendHealthChecker(name string, backend Backend, timeout time.Duration) health.Checker
```

NewBackendHealthChecker creates a standard health checker for a jobs backend.

<a name="NewRuntimeHealthChecker"></a>
## func NewRuntimeHealthChecker

```go
func NewRuntimeHealthChecker(name string, runtime Runtime, timeout time.Duration) health.Checker
```

NewRuntimeHealthChecker creates a standard health checker for a jobs runtime.

<a name="Backend"></a>
## type Backend

Backend defines a reliable jobs backend contract with reserve/ack/nack semantics.

```go
type Backend interface {
    Enqueue(ctx context.Context, job *Job) error
    Reserve(ctx context.Context, queue string, leaseFor time.Duration) (*Job, *Lease, error)
    Ack(ctx context.Context, lease *Lease) error
    Nack(ctx context.Context, lease *Lease, nextRunAt time.Time, reason error) error
    Renew(ctx context.Context, lease *Lease, leaseFor time.Duration) error
    MoveToDLQ(ctx context.Context, lease *Lease, reason error) error
    HealthCheck(ctx context.Context) error
    Close() error
}
```

<a name="DLQEntry"></a>
## type DLQEntry

DLQEntry represents one dead\-letter record.

```go
type DLQEntry struct {
    ID            string
    Queue         string
    OriginalQueue string
    Job           *Job
    Reason        string
    FailedAt      time.Time
}
```

<a name="DLQPolicy"></a>
## type DLQPolicy

DLQPolicy controls dead\-letter queue behavior.

```go
type DLQPolicy struct {
    Enabled     bool
    QueueSuffix string
}
```

<a name="DLQStore"></a>
## type DLQStore

DLQStore exposes listing and replay operations for dead\-letter queues.

```go
type DLQStore interface {
    ListDLQ(ctx context.Context, queue string, limit int) ([]*DLQEntry, error)
    ReplayDLQ(ctx context.Context, queue string, ids []string) (int, error)
}
```

<a name="EventBusBridge"></a>
## type EventBusBridge

EventBusBridge adapts an eventbus adapter to the jobs runtime contract. This keeps jobs and transport concerns separated while reusing existing eventbus adapters.

```go
type EventBusBridge struct {
    // contains filtered or unexported fields
}
```

<a name="NewEventBusBridge"></a>
### func NewEventBusBridge

```go
func NewEventBusBridge(bus eventbus.EventBus) (*EventBusBridge, error)
```

NewEventBusBridge creates a jobs runtime backed by eventbus.

<a name="EventBusBridge.Close"></a>
### func \(\*EventBusBridge\) Close

```go
func (b *EventBusBridge) Close() error
```

Close closes the underlying event bus.

<a name="EventBusBridge.Enqueue"></a>
### func \(\*EventBusBridge\) Enqueue

```go
func (b *EventBusBridge) Enqueue(ctx context.Context, job *Job) error
```

Enqueue publishes a job to its queue through eventbus.

<a name="EventBusBridge.HealthCheck"></a>
### func \(\*EventBusBridge\) HealthCheck

```go
func (b *EventBusBridge) HealthCheck(ctx context.Context) error
```

HealthCheck checks connectivity to the underlying event bus.

<a name="EventBusBridge.Subscribe"></a>
### func \(\*EventBusBridge\) Subscribe

```go
func (b *EventBusBridge) Subscribe(ctx context.Context, queue string, handler Handler) error
```

Subscribe consumes jobs from the given queue and maps transport message to job contract.

<a name="EventBusBridge.Unsubscribe"></a>
### func \(\*EventBusBridge\) Unsubscribe

```go
func (b *EventBusBridge) Unsubscribe(queue string) error
```

Unsubscribe removes a queue subscription.

<a name="Handler"></a>
## type Handler

Handler processes consumed jobs.

```go
type Handler func(ctx context.Context, job *Job) error
```

<a name="Job"></a>
## type Job

Job describes one logical application workload unit.

```go
type Job struct {
    ID             string
    Name           string
    Queue          string
    Payload        []byte
    Headers        map[string]string
    ContentType    string
    TenantID       string
    CorrelationID  string
    IdempotencyKey string
    PartitionKey   string
    RunAt          time.Time
    Attempt        int
    MaxAttempts    int
    CreatedAt      time.Time
}
```

<a name="JobFromEventBusMessage"></a>
### func JobFromEventBusMessage

```go
func JobFromEventBusMessage(msg *eventbus.Message) (*Job, error)
```

JobFromEventBusMessage decodes a job from a consumed eventbus message.

<a name="JobFromEventBusMessageWithQueue"></a>
### func JobFromEventBusMessageWithQueue

```go
func JobFromEventBusMessageWithQueue(msg *eventbus.Message, fallbackQueue string) (*Job, error)
```

JobFromEventBusMessageWithQueue decodes a job and applies a fallback queue when missing.

<a name="Job.ToEventBusMessage"></a>
### func \(\*Job\) ToEventBusMessage

```go
func (j *Job) ToEventBusMessage() (*eventbus.Message, error)
```

ToEventBusMessage converts a job into an eventbus message while keeping transport\-specific concerns inside eventbus primitives.

<a name="Job.Validate"></a>
### func \(\*Job\) Validate

```go
func (j *Job) Validate() error
```

Validate checks the required fields used by runtime behavior.

<a name="Lease"></a>
## type Lease

Lease tracks temporary ownership over a reserved job.

```go
type Lease struct {
    JobID    string
    Token    string
    Queue    string
    ExpireAt time.Time
    Attempt  int
}
```

<a name="RedisBackend"></a>
## type RedisBackend

RedisBackend implements jobs Backend with Redis lists/zsets and lease keys.

```go
type RedisBackend struct {
    // contains filtered or unexported fields
}
```

<a name="NewRedisBackend"></a>
### func NewRedisBackend

```go
func NewRedisBackend(cfg RedisBackendConfig, log logger.Logger) (*RedisBackend, error)
```

NewRedisBackend creates a Redis\-backed jobs backend.

<a name="RedisBackend.Ack"></a>
### func \(\*RedisBackend\) Ack

```go
func (b *RedisBackend) Ack(ctx context.Context, lease *Lease) error
```

Ack confirms job completion and releases the lease.

<a name="RedisBackend.Close"></a>
### func \(\*RedisBackend\) Close

```go
func (b *RedisBackend) Close() error
```

Close closes Redis connections.

<a name="RedisBackend.Enqueue"></a>
### func \(\*RedisBackend\) Enqueue

```go
func (b *RedisBackend) Enqueue(ctx context.Context, job *Job) error
```

Enqueue schedules a job for immediate or delayed execution.

<a name="RedisBackend.HealthCheck"></a>
### func \(\*RedisBackend\) HealthCheck

```go
func (b *RedisBackend) HealthCheck(ctx context.Context) error
```

HealthCheck verifies Redis connectivity.

<a name="RedisBackend.ListDLQ"></a>
### func \(\*RedisBackend\) ListDLQ

```go
func (b *RedisBackend) ListDLQ(ctx context.Context, queue string, limit int) ([]*DLQEntry, error)
```

ListDLQ lists latest dead\-letter records for one original queue.

<a name="RedisBackend.MoveToDLQ"></a>
### func \(\*RedisBackend\) MoveToDLQ

```go
func (b *RedisBackend) MoveToDLQ(ctx context.Context, lease *Lease, reason error) error
```

MoveToDLQ moves the failed job to the dead letter queue with failure metadata. Records the failure reason, timestamp, and original queue for later inspection or replay.

<a name="RedisBackend.Nack"></a>
### func \(\*RedisBackend\) Nack

```go
func (b *RedisBackend) Nack(ctx context.Context, lease *Lease, nextRunAt time.Time, reason error) error
```

Nack rejects the job and reschedules it for retry at the specified time. Increments the attempt counter and records the failure reason in job headers.

<a name="RedisBackend.Renew"></a>
### func \(\*RedisBackend\) Renew

```go
func (b *RedisBackend) Renew(ctx context.Context, lease *Lease, leaseFor time.Duration) error
```

Renew extends the lease expiration to prevent the job from being reclaimed by another worker. Should be called periodically during long\-running job processing.

<a name="RedisBackend.ReplayDLQ"></a>
### func \(\*RedisBackend\) ReplayDLQ

```go
func (b *RedisBackend) ReplayDLQ(ctx context.Context, queue string, ids []string) (int, error)
```

ReplayDLQ re\-enqueues selected DLQ entries back to original queue.

<a name="RedisBackend.Reserve"></a>
### func \(\*RedisBackend\) Reserve

```go
func (b *RedisBackend) Reserve(ctx context.Context, queue string, leaseFor time.Duration) (*Job, *Lease, error)
```

Reserve claims the next available job from the queue and returns it with a lease. Blocks until a job is available or the context is cancelled. Automatically transfers delayed jobs to the ready queue when their run time arrives.

<a name="RedisBackendConfig"></a>
## type RedisBackendConfig

RedisBackendConfig configures Redis\-backed jobs backend.

```go
type RedisBackendConfig struct {
    URL              string
    Prefix           string
    OperationTimeout time.Duration
    PollInterval     time.Duration
    DLQSuffix        string
    TransferBatch    int
}
```

<a name="RetryPolicy"></a>
## type RetryPolicy

RetryPolicy controls retry behavior for failed jobs.

```go
type RetryPolicy struct {
    MaxAttempts    int
    InitialBackoff time.Duration
    MaxBackoff     time.Duration
    AttemptTimeout time.Duration
}
```

<a name="Runtime"></a>
## type Runtime

Runtime defines a backend\-agnostic jobs runtime contract.

```go
type Runtime interface {
    Enqueue(ctx context.Context, job *Job) error
    Subscribe(ctx context.Context, queue string, handler Handler) error
    Unsubscribe(queue string) error
    HealthCheck(ctx context.Context) error
    Close() error
}
```

<a name="RuntimeBackend"></a>
## type RuntimeBackend

RuntimeBackend provides lease/ack/nack semantics by coordinating runtime subscriptions. It preserves transport\-level retries by blocking subscription callback completion until ack/nack/dlq decisions are applied.

```go
type RuntimeBackend struct {
    // contains filtered or unexported fields
}
```

<a name="NewRuntimeBackend"></a>
### func NewRuntimeBackend

```go
func NewRuntimeBackend(runtime Runtime, log logger.Logger, cfg RuntimeBackendConfig) (*RuntimeBackend, error)
```

NewRuntimeBackend creates a lease\-aware backend over an existing jobs runtime.

<a name="RuntimeBackend.Ack"></a>
### func \(\*RuntimeBackend\) Ack

```go
func (b *RuntimeBackend) Ack(ctx context.Context, lease *Lease) error
```

Ack marks a reserved job as successfully processed.

<a name="RuntimeBackend.Close"></a>
### func \(\*RuntimeBackend\) Close

```go
func (b *RuntimeBackend) Close() error
```

Close unsubscribes active queues and releases pending leases.

<a name="RuntimeBackend.Enqueue"></a>
### func \(\*RuntimeBackend\) Enqueue

```go
func (b *RuntimeBackend) Enqueue(ctx context.Context, job *Job) error
```

Enqueue delegates enqueue to the underlying runtime.

<a name="RuntimeBackend.HealthCheck"></a>
### func \(\*RuntimeBackend\) HealthCheck

```go
func (b *RuntimeBackend) HealthCheck(ctx context.Context) error
```

HealthCheck verifies backend connectivity through underlying runtime.

<a name="RuntimeBackend.MoveToDLQ"></a>
### func \(\*RuntimeBackend\) MoveToDLQ

```go
func (b *RuntimeBackend) MoveToDLQ(ctx context.Context, lease *Lease, reason error) error
```

MoveToDLQ forwards a reserved job to dead\-letter queue and releases the lease.

<a name="RuntimeBackend.Nack"></a>
### func \(\*RuntimeBackend\) Nack

```go
func (b *RuntimeBackend) Nack(ctx context.Context, lease *Lease, nextRunAt time.Time, reason error) error
```

Nack requeues a reserved job for retry.

<a name="RuntimeBackend.Renew"></a>
### func \(\*RuntimeBackend\) Renew

```go
func (b *RuntimeBackend) Renew(ctx context.Context, lease *Lease, leaseFor time.Duration) error
```

Renew extends the lease expiry for an in\-flight job.

<a name="RuntimeBackend.Reserve"></a>
### func \(\*RuntimeBackend\) Reserve

```go
func (b *RuntimeBackend) Reserve(ctx context.Context, queue string, leaseFor time.Duration) (*Job, *Lease, error)
```

Reserve waits for a job from a queue and returns a lease for processing.

<a name="RuntimeBackendConfig"></a>
## type RuntimeBackendConfig

RuntimeBackendConfig configures the lease\-aware backend built on top of a jobs runtime.

```go
type RuntimeBackendConfig struct {
    BufferSize   int
    DLQSuffix    string
    CloseRuntime bool
}
```

<a name="RuntimeWorker"></a>
## type RuntimeWorker

RuntimeWorker processes jobs from backend queues with retries and DLQ routing.

```go
type RuntimeWorker struct {
    // contains filtered or unexported fields
}
```

<a name="NewWorker"></a>
### func NewWorker

```go
func NewWorker(backend Backend, log logger.Logger, cfg WorkerConfig) (*RuntimeWorker, error)
```

NewWorker creates a worker from backend \+ configuration.

<a name="RuntimeWorker.Register"></a>
### func \(\*RuntimeWorker\) Register

```go
func (w *RuntimeWorker) Register(jobName string, handler Handler) error
```

Register binds a handler to a logical job name.

<a name="RuntimeWorker.Start"></a>
### func \(\*RuntimeWorker\) Start

```go
func (w *RuntimeWorker) Start(ctx context.Context) error
```

Start launches worker loops and blocks until context cancellation.

<a name="RuntimeWorker.Stop"></a>
### func \(\*RuntimeWorker\) Stop

```go
func (w *RuntimeWorker) Stop(ctx context.Context) error
```

Stop requests graceful shutdown and waits for active workers to finish.

<a name="Worker"></a>
## type Worker

Worker defines a background jobs worker lifecycle.

```go
type Worker interface {
    Register(jobName string, handler Handler) error
    Start(ctx context.Context) error
    Stop(ctx context.Context) error
}
```

<a name="WorkerConfig"></a>
## type WorkerConfig

WorkerConfig configures worker lifecycle and concurrency.

```go
type WorkerConfig struct {
    Queues         []string
    Concurrency    int
    LeaseTTL       time.Duration
    ReserveTimeout time.Duration
    StopTimeout    time.Duration
    Retry          RetryPolicy
    DLQ            DLQPolicy
}
```

# factory

```go
import "github.com/nimburion/nimburion/pkg/jobs/factory"
```

## Index

- [Constants](<#constants>)
- [func NewBackend\(cfg Config, eventBusCfg config.EventBusConfig, log logger.Logger\) \(jobs.Backend, error\)](<#NewBackend>)
- [func NewBackendWithValidation\(cfg Config, eventBusCfg config.EventBusConfig, validationCfg config.KafkaValidationConfig, log logger.Logger\) \(jobs.Backend, error\)](<#NewBackendWithValidation>)
- [func NewRuntime\(cfg Config, eventBusCfg config.EventBusConfig, log logger.Logger\) \(jobs.Runtime, error\)](<#NewRuntime>)
- [func NewRuntimeWithValidation\(cfg Config, eventBusCfg config.EventBusConfig, validationCfg config.KafkaValidationConfig, log logger.Logger\) \(jobs.Runtime, error\)](<#NewRuntimeWithValidation>)
- [type Config](<#Config>)


## Constants

<a name="BackendEventBus"></a>

```go
const (
    BackendEventBus = config.JobsBackendEventBus
    BackendRedis    = config.JobsBackendRedis
)
```

<a name="NewBackend"></a>
## func NewBackend

```go
func NewBackend(cfg Config, eventBusCfg config.EventBusConfig, log logger.Logger) (jobs.Backend, error)
```

NewBackend creates a lease\-aware backend for jobs worker runtime.

<a name="NewBackendWithValidation"></a>
## func NewBackendWithValidation

```go
func NewBackendWithValidation(cfg Config, eventBusCfg config.EventBusConfig, validationCfg config.KafkaValidationConfig, log logger.Logger) (jobs.Backend, error)
```

NewBackendWithValidation creates a backend and applies eventbus schema validation when enabled.

<a name="NewRuntime"></a>
## func NewRuntime

```go
func NewRuntime(cfg Config, eventBusCfg config.EventBusConfig, log logger.Logger) (jobs.Runtime, error)
```

NewRuntime creates a jobs runtime adapter from config. Default backend is eventbus to remain aligned with existing Nimburion async integrations.

<a name="NewRuntimeWithValidation"></a>
## func NewRuntimeWithValidation

```go
func NewRuntimeWithValidation(cfg Config, eventBusCfg config.EventBusConfig, validationCfg config.KafkaValidationConfig, log logger.Logger) (jobs.Runtime, error)
```

NewRuntimeWithValidation creates a jobs runtime and applies eventbus schema validation when enabled.

<a name="Config"></a>
## type Config

Config configures jobs runtime adapter selection.

```go
type Config = config.JobsConfig
```

Generated by [gomarkdoc](<https://github.com/princjef/gomarkdoc>)
