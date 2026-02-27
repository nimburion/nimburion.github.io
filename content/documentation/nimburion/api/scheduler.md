---
layout: documentation
title: pkg/scheduler
---


# scheduler

```go
import "github.com/nimburion/nimburion/pkg/scheduler"
```

## Index

- [Constants](<#constants>)
- [Variables](<#variables>)
- [func NewLockProviderHealthChecker\(name string, provider LockProvider, timeout time.Duration\) health.Checker](<#NewLockProviderHealthChecker>)
- [type Config](<#Config>)
- [type LockLease](<#LockLease>)
- [type LockProvider](<#LockProvider>)
- [type PostgresLockProvider](<#PostgresLockProvider>)
  - [func NewPostgresLockProvider\(cfg PostgresLockProviderConfig, log logger.Logger\) \(\*PostgresLockProvider, error\)](<#NewPostgresLockProvider>)
  - [func \(p \*PostgresLockProvider\) Acquire\(ctx context.Context, key string, ttl time.Duration\) \(\*LockLease, bool, error\)](<#PostgresLockProvider.Acquire>)
  - [func \(p \*PostgresLockProvider\) Close\(\) error](<#PostgresLockProvider.Close>)
  - [func \(p \*PostgresLockProvider\) HealthCheck\(ctx context.Context\) error](<#PostgresLockProvider.HealthCheck>)
  - [func \(p \*PostgresLockProvider\) Release\(ctx context.Context, lease \*LockLease\) error](<#PostgresLockProvider.Release>)
  - [func \(p \*PostgresLockProvider\) Renew\(ctx context.Context, lease \*LockLease, ttl time.Duration\) error](<#PostgresLockProvider.Renew>)
- [type PostgresLockProviderConfig](<#PostgresLockProviderConfig>)
- [type RedisLockProvider](<#RedisLockProvider>)
  - [func NewRedisLockProvider\(cfg RedisLockProviderConfig, log logger.Logger\) \(\*RedisLockProvider, error\)](<#NewRedisLockProvider>)
  - [func \(p \*RedisLockProvider\) Acquire\(ctx context.Context, key string, ttl time.Duration\) \(\*LockLease, bool, error\)](<#RedisLockProvider.Acquire>)
  - [func \(p \*RedisLockProvider\) Close\(\) error](<#RedisLockProvider.Close>)
  - [func \(p \*RedisLockProvider\) HealthCheck\(ctx context.Context\) error](<#RedisLockProvider.HealthCheck>)
  - [func \(p \*RedisLockProvider\) Release\(ctx context.Context, lease \*LockLease\) error](<#RedisLockProvider.Release>)
  - [func \(p \*RedisLockProvider\) Renew\(ctx context.Context, lease \*LockLease, ttl time.Duration\) error](<#RedisLockProvider.Renew>)
- [type RedisLockProviderConfig](<#RedisLockProviderConfig>)
- [type Runtime](<#Runtime>)
  - [func NewRuntime\(jobsRuntime jobs.Runtime, lockProvider LockProvider, log logger.Logger, cfg Config\) \(\*Runtime, error\)](<#NewRuntime>)
  - [func \(r \*Runtime\) Register\(task Task\) error](<#Runtime.Register>)
  - [func \(r \*Runtime\) Start\(ctx context.Context\) error](<#Runtime.Start>)
  - [func \(r \*Runtime\) Stop\(ctx context.Context\) error](<#Runtime.Stop>)
  - [func \(r \*Runtime\) Trigger\(ctx context.Context, taskName string\) error](<#Runtime.Trigger>)
- [type Task](<#Task>)
  - [func \(t \*Task\) Validate\(\) error](<#Task.Validate>)


## Constants

<a name="DefaultDispatchTimeout"></a>

```go
const (
    DefaultDispatchTimeout = 10 * time.Second
    DefaultLockTTL         = 30 * time.Second
)
```

<a name="MisfirePolicySkip"></a>

```go
const (
    MisfirePolicySkip     = "skip"
    MisfirePolicyFireOnce = "fire_once"
)
```

## Variables

<a name="ErrValidation"></a>

```go
var (
    // ErrValidation classifies input/config/schedule validation failures.
    ErrValidation = errors.New("scheduler validation error")
    // ErrConflict classifies state conflicts (for example duplicate task, already running).
    ErrConflict = errors.New("scheduler conflict")
    // ErrNotFound classifies missing logical resources.
    ErrNotFound = errors.New("scheduler not found")
    // ErrRetryable classifies transient failures safe to retry.
    ErrRetryable = errors.New("scheduler retryable error")
    // ErrInvalidArgument classifies invalid caller/provider arguments.
    ErrInvalidArgument = errors.New("scheduler invalid argument")
    // ErrNotInitialized classifies missing runtime/provider initialization.
    ErrNotInitialized = errors.New("scheduler not initialized")
    // ErrClosed classifies operations performed on closed components.
    ErrClosed = errors.New("scheduler closed")
)
```

<a name="NewLockProviderHealthChecker"></a>
## func NewLockProviderHealthChecker

```go
func NewLockProviderHealthChecker(name string, provider LockProvider, timeout time.Duration) health.Checker
```

NewLockProviderHealthChecker creates a standard health checker for scheduler lock providers.

<a name="Config"></a>
## type Config

Config controls scheduler runtime behavior.

```go
type Config struct {
    DispatchTimeout time.Duration
    DefaultLockTTL  time.Duration
}
```

<a name="LockLease"></a>
## type LockLease

LockLease identifies a distributed lock instance.

```go
type LockLease struct {
    Key      string
    Token    string
    ExpireAt time.Time
}
```

<a name="LockProvider"></a>
## type LockProvider

LockProvider coordinates singleton execution across multiple scheduler instances.

```go
type LockProvider interface {
    Acquire(ctx context.Context, key string, ttl time.Duration) (*LockLease, bool, error)
    Renew(ctx context.Context, lease *LockLease, ttl time.Duration) error
    Release(ctx context.Context, lease *LockLease) error
    HealthCheck(ctx context.Context) error
    Close() error
}
```

<a name="PostgresLockProvider"></a>
## type PostgresLockProvider

PostgresLockProvider stores distributed lock rows in Postgres.

```go
type PostgresLockProvider struct {
    // contains filtered or unexported fields
}
```

<a name="NewPostgresLockProvider"></a>
### func NewPostgresLockProvider

```go
func NewPostgresLockProvider(cfg PostgresLockProviderConfig, log logger.Logger) (*PostgresLockProvider, error)
```

NewPostgresLockProvider creates lock provider backed by Postgres table rows.

<a name="PostgresLockProvider.Acquire"></a>
### func \(\*PostgresLockProvider\) Acquire

```go
func (p *PostgresLockProvider) Acquire(ctx context.Context, key string, ttl time.Duration) (*LockLease, bool, error)
```

Acquire acquires lock row if missing or expired.

<a name="PostgresLockProvider.Close"></a>
### func \(\*PostgresLockProvider\) Close

```go
func (p *PostgresLockProvider) Close() error
```

Close closes DB resources.

<a name="PostgresLockProvider.HealthCheck"></a>
### func \(\*PostgresLockProvider\) HealthCheck

```go
func (p *PostgresLockProvider) HealthCheck(ctx context.Context) error
```

HealthCheck verifies Postgres connectivity.

<a name="PostgresLockProvider.Release"></a>
### func \(\*PostgresLockProvider\) Release

```go
func (p *PostgresLockProvider) Release(ctx context.Context, lease *LockLease) error
```

Release deletes lock row when token matches.

<a name="PostgresLockProvider.Renew"></a>
### func \(\*PostgresLockProvider\) Renew

```go
func (p *PostgresLockProvider) Renew(ctx context.Context, lease *LockLease, ttl time.Duration) error
```

Renew extends lock expiry when token matches.

<a name="PostgresLockProviderConfig"></a>
## type PostgresLockProviderConfig

PostgresLockProviderConfig configures Postgres lock provider.

```go
type PostgresLockProviderConfig struct {
    URL              string
    Table            string
    OperationTimeout time.Duration
}
```

<a name="RedisLockProvider"></a>
## type RedisLockProvider

RedisLockProvider is a distributed lock provider using Redis SET NX PX semantics.

```go
type RedisLockProvider struct {
    // contains filtered or unexported fields
}
```

<a name="NewRedisLockProvider"></a>
### func NewRedisLockProvider

```go
func NewRedisLockProvider(cfg RedisLockProviderConfig, log logger.Logger) (*RedisLockProvider, error)
```

NewRedisLockProvider creates a Redis\-based lock provider.

<a name="RedisLockProvider.Acquire"></a>
### func \(\*RedisLockProvider\) Acquire

```go
func (p *RedisLockProvider) Acquire(ctx context.Context, key string, ttl time.Duration) (*LockLease, bool, error)
```

Acquire attempts to acquire a lock key with TTL.

<a name="RedisLockProvider.Close"></a>
### func \(\*RedisLockProvider\) Close

```go
func (p *RedisLockProvider) Close() error
```

Close closes Redis client connections.

<a name="RedisLockProvider.HealthCheck"></a>
### func \(\*RedisLockProvider\) HealthCheck

```go
func (p *RedisLockProvider) HealthCheck(ctx context.Context) error
```

HealthCheck verifies Redis connectivity.

<a name="RedisLockProvider.Release"></a>
### func \(\*RedisLockProvider\) Release

```go
func (p *RedisLockProvider) Release(ctx context.Context, lease *LockLease) error
```

Release unlocks the key if the lease token matches.

<a name="RedisLockProvider.Renew"></a>
### func \(\*RedisLockProvider\) Renew

```go
func (p *RedisLockProvider) Renew(ctx context.Context, lease *LockLease, ttl time.Duration) error
```

Renew extends lock expiry when token still matches.

<a name="RedisLockProviderConfig"></a>
## type RedisLockProviderConfig

RedisLockProviderConfig configures distributed locks backed by Redis.

```go
type RedisLockProviderConfig struct {
    URL              string
    Prefix           string
    OperationTimeout time.Duration
}
```

<a name="Runtime"></a>
## type Runtime

Runtime dispatches scheduled tasks into the jobs runtime with distributed locking.

```go
type Runtime struct {
    // contains filtered or unexported fields
}
```

<a name="NewRuntime"></a>
### func NewRuntime

```go
func NewRuntime(jobsRuntime jobs.Runtime, lockProvider LockProvider, log logger.Logger, cfg Config) (*Runtime, error)
```

NewRuntime creates a distributed scheduler runtime.

<a name="Runtime.Register"></a>
### func \(\*Runtime\) Register

```go
func (r *Runtime) Register(task Task) error
```

Register adds a new scheduled task.

<a name="Runtime.Start"></a>
### func \(\*Runtime\) Start

```go
func (r *Runtime) Start(ctx context.Context) error
```

Start runs all registered tasks until context cancellation.

<a name="Runtime.Stop"></a>
### func \(\*Runtime\) Stop

```go
func (r *Runtime) Stop(ctx context.Context) error
```

Stop requests scheduler shutdown and waits for active loops.

<a name="Runtime.Trigger"></a>
### func \(\*Runtime\) Trigger

```go
func (r *Runtime) Trigger(ctx context.Context, taskName string) error
```

Trigger dispatches one registered task immediately.

<a name="Task"></a>
## type Task

Task describes one scheduler entry that dispatches a job.

```go
type Task struct {
    Name           string
    Schedule       string
    Queue          string
    JobName        string
    Payload        []byte
    Headers        map[string]string
    TenantID       string
    IdempotencyKey string
    Timezone       string
    LockTTL        time.Duration
    MisfirePolicy  string
}
```

<a name="Task.Validate"></a>
### func \(\*Task\) Validate

```go
func (t *Task) Validate() error
```

Validate verifies required fields and schedule syntax.

Generated by [gomarkdoc](<https://github.com/princjef/gomarkdoc>)
