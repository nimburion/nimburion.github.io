---
layout: documentation
title: pkg/config
---

# pkg/config

Configuration management with precedence: ENV > file > defaults.

## Overview

The config package provides:
- Configuration loading from multiple sources
- Environment variable overrides with `APP_` prefix
- Type-safe configuration structs
- Validation and defaults
- Hot reload support (optional)

## Installation

```bash
import "github.com/nimburion/nimburion/pkg/config"
```

## Quick Start

```go
package main

import "github.com/nimburion/nimburion/pkg/config"

func main() {
    // Load config with precedence: ENV > file > defaults
    cfg := config.Load()
    
    fmt.Printf("Public port: %d\n", cfg.Public.Port)
    fmt.Printf("Log level: %s\n", cfg.Log.Level)
}
```

## Configuration Structure

```go
type Config struct {
    Public     PublicConfig
    Management ManagementConfig
    Server     ServerConfig
    Log        LogConfig
    Store      StoreConfig
    EventBus   EventBusConfig
    Jobs       JobsConfig
    Tracing    TracingConfig
    Auth       AuthConfig
}
```

### PublicConfig

```go
type PublicConfig struct {
    Port         int           // Default: 8080
    ReadTimeout  time.Duration // Default: 30s
    WriteTimeout time.Duration // Default: 30s
    IdleTimeout  time.Duration // Default: 120s
}
```

### ManagementConfig

```go
type ManagementConfig struct {
    Port         int           // Default: 9090
    ReadTimeout  time.Duration // Default: 10s
    WriteTimeout time.Duration // Default: 10s
}
```

### LogConfig

```go
type LogConfig struct {
    Level  string // debug, info, warn, error (default: info)
    Format string // json, console (default: json)
    Output string // stdout, stderr, file (default: stdout)
    File   string // Log file path (if output=file)
}
```

### StoreConfig

```go
type StoreConfig struct {
    Type            string        // postgres, mysql, mongodb, etc
    Host            string
    Port            int
    Database        string
    Username        string
    Password        string
    MaxOpenConns    int           // Default: 25
    MaxIdleConns    int           // Default: 5
    ConnMaxLifetime time.Duration // Default: 5m
}
```

## API Reference

### Load

```go
func Load() *Config
```

Loads configuration with precedence:
1. Environment variables (with `APP_` prefix)
2. Config file (`config.yaml` in current directory)
3. Default values

Example:
```go
cfg := config.Load()
```

### LoadFrom

```go
func LoadFrom(path string) *Config
```

Loads configuration from specific file path.

Example:
```go
cfg := config.LoadFrom("/etc/myapp/config.yaml")
```

### Default

```go
func Default() *Config
```

Returns configuration with only default values (no file or env).

Example:
```go
cfg := config.Default()
```

### Validate

```go
func (c *Config) Validate() error
```

Validates configuration values.

Example:
```go
cfg := config.Load()
if err := cfg.Validate(); err != nil {
    log.Fatal(err)
}
```

## Configuration File

Create `config.yaml`:

```yaml
public:
  port: 8080
  readTimeout: 30s
  writeTimeout: 30s
  idleTimeout: 120s

management:
  port: 9090

server:
  shutdownTimeout: 30s

log:
  level: info
  format: json
  output: stdout

store:
  type: postgres
  host: localhost
  port: 5432
  database: myapp
  username: postgres
  password: ${DB_PASSWORD}
  maxOpenConns: 25
  maxIdleConns: 5
  connMaxLifetime: 5m

eventbus:
  type: kafka
  brokers:
    - localhost:9092
  groupId: my-service

jobs:
  backend: redis
  redis:
    addr: localhost:6379
  concurrency: 10

tracing:
  enabled: true
  exporter: otlp
  endpoint: http://jaeger:4318
  serviceName: my-service
  sampleRate: 1.0

auth:
  enabled: true
  issuer: https://auth.example.com
  audience: my-service
```

## Environment Variables

Override any config value with environment variables using `APP_` prefix:

```bash
# Public server
export APP_PUBLIC_PORT=8081
export APP_PUBLIC_READ_TIMEOUT=60s

# Management server
export APP_MANAGEMENT_PORT=9091

# Logging
export APP_LOG_LEVEL=debug
export APP_LOG_FORMAT=console

# Database
export APP_STORE_TYPE=postgres
export APP_STORE_HOST=db.example.com
export APP_STORE_PORT=5432
export APP_STORE_DATABASE=myapp
export APP_STORE_USERNAME=dbuser
export APP_STORE_PASSWORD=secret123

# Event bus
export APP_EVENTBUS_TYPE=kafka
export APP_EVENTBUS_BROKERS=kafka1:9092,kafka2:9092

# Jobs
export APP_JOBS_BACKEND=redis
export APP_JOBS_REDIS_ADDR=redis:6379

# Tracing
export APP_TRACING_ENABLED=true
export APP_TRACING_ENDPOINT=http://jaeger:4318

# Auth
export APP_AUTH_ENABLED=true
export APP_AUTH_ISSUER=https://auth.example.com
```

## Precedence Example

Given:
- `config.yaml`: `public.port: 8080`
- Environment: `APP_PUBLIC_PORT=8081`
- Default: `8080`

Result: `cfg.Public.Port == 8081` (environment wins)

## Secret Management

Use environment variables for secrets:

```yaml
store:
  password: ${DB_PASSWORD}

auth:
  clientSecret: ${AUTH_CLIENT_SECRET}
```

Then set in environment:
```bash
export APP_STORE_PASSWORD=secret123
export APP_AUTH_CLIENT_SECRET=oauth-secret
```

Or use secret managers:
```bash
export APP_STORE_PASSWORD=$(aws secretsmanager get-secret-value --secret-id db-password --query SecretString --output text)
```

## Hot Reload

Enable configuration hot reload:

```go
cfg := config.Load()

// Watch for config changes
watcher := config.NewWatcher(cfg, "config.yaml")
watcher.OnChange(func(newCfg *config.Config) {
    log.Println("Config reloaded")
    // Update application config
})

watcher.Start()
defer watcher.Stop()
```

## Validation

Add custom validation:

```go
cfg := config.Load()

if cfg.Public.Port == cfg.Management.Port {
    log.Fatal("public and management ports must be different")
}

if cfg.Store.MaxOpenConns < cfg.Store.MaxIdleConns {
    log.Fatal("maxOpenConns must be >= maxIdleConns")
}

if cfg.Tracing.SampleRate < 0 || cfg.Tracing.SampleRate > 1 {
    log.Fatal("tracing sample rate must be between 0 and 1")
}
```

## Testing

Use default config for tests:

```go
func TestHandler(t *testing.T) {
    cfg := config.Default()
    cfg.Log.Level = "debug"
    
    app := server.Bootstrap(cfg)
    // ... test code
}
```

Or create test config:

```go
func testConfig() *config.Config {
    return &config.Config{
        Public: config.PublicConfig{
            Port: 8888,
        },
        Log: config.LogConfig{
            Level: "debug",
            Format: "console",
        },
        Store: config.StoreConfig{
            Type: "memory",
        },
    }
}
```

## Best Practices

1. **Use environment variables for secrets** - Never commit secrets to config files
2. **Set sensible defaults** - Application should work with minimal config
3. **Validate on startup** - Fail fast if config is invalid
4. **Document all options** - Keep config reference up to date
5. **Use typed config** - Avoid stringly-typed configuration
6. **Separate by environment** - Use different config files for dev/staging/prod
7. **Version config files** - Track config changes in git (except secrets)

## See Also

- [Configuration Reference](/documentation/nimburion/reference/configuration/)
- [Configuration Secrets](/documentation/nimburion/reference/configuration-secrets/)
- [Getting Started](/documentation/nimburion/getting-started/configuration-basics/)
