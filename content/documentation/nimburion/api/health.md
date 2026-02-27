---
layout: documentation
title: pkg/health
---


# health

```go
import "github.com/nimburion/nimburion/pkg/health"
```

<details><summary>Example (Adapter Checks)</summary>
<p>

Example\_adapterChecks demonstrates registering adapter health checks

```go
package main

import (
	"context"
	"fmt"
	"time"

	"github.com/nimburion/nimburion/pkg/health"
)

// mockDatabase simulates a database adapter with health check support
type mockDatabase struct {
	connected bool
}

func (db *mockDatabase) HealthCheck(ctx context.Context) error {
	if !db.connected {
		return fmt.Errorf("database not connected")
	}
	return nil
}

// mockCache simulates a cache adapter with health check support
type mockCache struct {
	available bool
}

func (c *mockCache) HealthCheck(ctx context.Context) error {
	if !c.available {
		return fmt.Errorf("cache unavailable")
	}
	return nil
}

func main() {
	// Create a new health check registry
	registry := health.NewRegistry()

	// Create mock adapters
	db := &mockDatabase{connected: true}
	cache := &mockCache{available: true}

	// Register adapter health checks
	registry.Register(health.NewAdapterChecker("database", db, 5*time.Second))
	registry.Register(health.NewAdapterChecker("cache", cache, 5*time.Second))

	// Run all health checks
	ctx := context.Background()
	result := registry.Check(ctx)

	fmt.Printf("Overall Status: %s\n", result.Status)
	fmt.Printf("Number of Checks: %d\n", len(result.Checks))

}
```

#### Output

```
Overall Status: healthy
Number of Checks: 2
```

</p>
</details>

<details><summary>Example (Basic Usage)</summary>
<p>

Example\_basicUsage demonstrates basic health check registry usage

```go
package main

import (
	"context"
	"fmt"

	"github.com/nimburion/nimburion/pkg/health"
)

func main() {
	// Create a new health check registry
	registry := health.NewRegistry()

	// Register a simple ping check (always healthy)
	registry.Register(health.NewPingChecker("liveness"))

	// Run all health checks
	ctx := context.Background()
	result := registry.Check(ctx)

	fmt.Printf("Overall Status: %s\n", result.Status)
	fmt.Printf("Number of Checks: %d\n", len(result.Checks))
	fmt.Printf("Is Healthy: %v\n", result.IsHealthy())

}
```

#### Output

```
Overall Status: healthy
Number of Checks: 1
Is Healthy: true
```

</p>
</details>

<details><summary>Example (Check One)</summary>
<p>

Example\_checkOne demonstrates checking a specific health check

```go
package main

import (
	"context"
	"fmt"
	"time"

	"github.com/nimburion/nimburion/pkg/health"
)

// mockDatabase simulates a database adapter with health check support
type mockDatabase struct {
	connected bool
}

func (db *mockDatabase) HealthCheck(ctx context.Context) error {
	if !db.connected {
		return fmt.Errorf("database not connected")
	}
	return nil
}

func main() {
	// Create a new health check registry
	registry := health.NewRegistry()

	// Register multiple checks
	registry.Register(health.NewPingChecker("liveness"))

	db := &mockDatabase{connected: true}
	registry.Register(health.NewAdapterChecker("database", db, 5*time.Second))

	// Check only the database
	ctx := context.Background()
	result, err := registry.CheckOne(ctx, "database")
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return
	}

	fmt.Printf("Check Name: %s\n", result.Name)
	fmt.Printf("Status: %s\n", result.Status)

}
```

#### Output

```
Check Name: database
Status: healthy
```

</p>
</details>

<details><summary>Example (Composite Check)</summary>
<p>

Example\_compositeCheck demonstrates using composite health checks

```go
package main

import (
	"context"
	"fmt"
	"time"

	"github.com/nimburion/nimburion/pkg/health"
)

// mockDatabase simulates a database adapter with health check support
type mockDatabase struct {
	connected bool
}

func (db *mockDatabase) HealthCheck(ctx context.Context) error {
	if !db.connected {
		return fmt.Errorf("database not connected")
	}
	return nil
}

// mockCache simulates a cache adapter with health check support
type mockCache struct {
	available bool
}

func (c *mockCache) HealthCheck(ctx context.Context) error {
	if !c.available {
		return fmt.Errorf("cache unavailable")
	}
	return nil
}

func main() {
	// Create individual checkers
	db := &mockDatabase{connected: true}
	cache := &mockCache{available: true}

	dbChecker := health.NewAdapterChecker("database", db, 5*time.Second)
	cacheChecker := health.NewAdapterChecker("cache", cache, 5*time.Second)

	// Create a composite checker that combines them
	composite := health.NewCompositeChecker("data-layer", dbChecker, cacheChecker)

	// Create registry and register the composite
	registry := health.NewRegistry()
	registry.Register(composite)

	// Run all health checks
	ctx := context.Background()
	result := registry.Check(ctx)

	fmt.Printf("Overall Status: %s\n", result.Status)

}
```

#### Output

```
Overall Status: healthy
```

</p>
</details>

<details><summary>Example (Custom Check)</summary>
<p>

Example\_customCheck demonstrates registering a custom health check

```go
package main

import (
	"context"
	"fmt"
	"time"

	"github.com/nimburion/nimburion/pkg/health"
)

func main() {
	// Create a new health check registry
	registry := health.NewRegistry()

	// Register a custom health check using a function
	registry.RegisterFunc("disk-space", func(ctx context.Context) health.CheckResult {
		// Simulate checking disk space
		freeSpacePercent := 75

		if freeSpacePercent < 10 {
			return health.CheckResult{
				Name:      "disk-space",
				Status:    health.StatusUnhealthy,
				Error:     "disk space critically low",
				Timestamp: time.Now(),
			}
		} else if freeSpacePercent < 20 {
			return health.CheckResult{
				Name:      "disk-space",
				Status:    health.StatusDegraded,
				Message:   "disk space running low",
				Timestamp: time.Now(),
			}
		}

		return health.CheckResult{
			Name:      "disk-space",
			Status:    health.StatusHealthy,
			Message:   fmt.Sprintf("%d%% free", freeSpacePercent),
			Timestamp: time.Now(),
		}
	})

	// Run all health checks
	ctx := context.Background()
	result := registry.Check(ctx)

	fmt.Printf("Overall Status: %s\n", result.Status)

}
```

#### Output

```
Overall Status: healthy
```

</p>
</details>

<details><summary>Example (Dependency Checks)</summary>
<p>

Example\_dependencyChecks demonstrates using convenience functions for dependency health checks

```go
package main

import (
	"context"
	"fmt"

	"github.com/nimburion/nimburion/pkg/health"
)

// mockDatabase simulates a database adapter with health check support
type mockDatabase struct {
	connected bool
}

func (db *mockDatabase) HealthCheck(ctx context.Context) error {
	if !db.connected {
		return fmt.Errorf("database not connected")
	}
	return nil
}

// mockCache simulates a cache adapter with health check support
type mockCache struct {
	available bool
}

func (c *mockCache) HealthCheck(ctx context.Context) error {
	if !c.available {
		return fmt.Errorf("cache unavailable")
	}
	return nil
}

func main() {
	// Create a new health check registry
	registry := health.NewRegistry()

	// Create mock adapters
	db := &mockDatabase{connected: true}
	cache := &mockCache{available: true}

	// Mock message broker (using database as placeholder for example)
	broker := &mockDatabase{connected: true}

	// Register dependency health checks using convenience functions
	registry.Register(health.NewDatabaseChecker("postgres", db))
	registry.Register(health.NewCacheChecker("redis", cache))
	registry.Register(health.NewMessageBrokerChecker("kafka", broker))

	// Run all health checks
	ctx := context.Background()
	result := registry.Check(ctx)

	fmt.Printf("Overall Status: %s\n", result.Status)
	fmt.Printf("Number of Checks: %d\n", len(result.Checks))

}
```

#### Output

```
Overall Status: healthy
Number of Checks: 3
```

</p>
</details>

<details><summary>Example (List Checks)</summary>
<p>

Example\_listChecks demonstrates listing registered health checks

```go
package main

import (
	"context"
	"fmt"
	"time"

	"github.com/nimburion/nimburion/pkg/health"
)

// mockDatabase simulates a database adapter with health check support
type mockDatabase struct {
	connected bool
}

func (db *mockDatabase) HealthCheck(ctx context.Context) error {
	if !db.connected {
		return fmt.Errorf("database not connected")
	}
	return nil
}

// mockCache simulates a cache adapter with health check support
type mockCache struct {
	available bool
}

func (c *mockCache) HealthCheck(ctx context.Context) error {
	if !c.available {
		return fmt.Errorf("cache unavailable")
	}
	return nil
}

func main() {
	// Create a new health check registry
	registry := health.NewRegistry()

	// Register multiple checks
	registry.Register(health.NewPingChecker("liveness"))

	db := &mockDatabase{connected: true}
	registry.Register(health.NewAdapterChecker("database", db, 5*time.Second))

	cache := &mockCache{available: true}
	registry.Register(health.NewAdapterChecker("cache", cache, 5*time.Second))

	// List all registered checks
	checks := registry.List()

	fmt.Printf("Number of registered checks: %d\n", len(checks))

}
```

#### Output

```
Number of registered checks: 3
```

</p>
</details>

<details><summary>Example (Unhealthy Check)</summary>
<p>

Example\_unhealthyCheck demonstrates handling unhealthy checks

```go
package main

import (
	"context"
	"fmt"
	"time"

	"github.com/nimburion/nimburion/pkg/health"
)

// mockDatabase simulates a database adapter with health check support
type mockDatabase struct {
	connected bool
}

func (db *mockDatabase) HealthCheck(ctx context.Context) error {
	if !db.connected {
		return fmt.Errorf("database not connected")
	}
	return nil
}

// mockCache simulates a cache adapter with health check support
type mockCache struct {
	available bool
}

func (c *mockCache) HealthCheck(ctx context.Context) error {
	if !c.available {
		return fmt.Errorf("cache unavailable")
	}
	return nil
}

func main() {
	// Create a new health check registry
	registry := health.NewRegistry()

	// Register a healthy check
	healthyDB := &mockDatabase{connected: true}
	registry.Register(health.NewAdapterChecker("database", healthyDB, 5*time.Second))

	// Register an unhealthy check
	unhealthyCache := &mockCache{available: false}
	registry.Register(health.NewAdapterChecker("cache", unhealthyCache, 5*time.Second))

	// Run all health checks
	ctx := context.Background()
	result := registry.Check(ctx)

	fmt.Printf("Overall Status: %s\n", result.Status)
	fmt.Printf("Is Healthy: %v\n", result.IsHealthy())

	// Check individual results
	for _, check := range result.Checks {
		if check.Status == health.StatusUnhealthy {
			fmt.Printf("Unhealthy Check: %s - %s\n", check.Name, check.Error)
		}
	}

}
```

#### Output

```
Overall Status: unhealthy
Is Healthy: false
Unhealthy Check: cache - cache unavailable
```

</p>
</details>

## Index

- [type AdapterChecker](<#AdapterChecker>)
  - [func NewAdapterChecker\(name string, adapter HealthCheckable, timeout time.Duration\) \*AdapterChecker](<#NewAdapterChecker>)
  - [func NewCacheChecker\(name string, cache HealthCheckable\) \*AdapterChecker](<#NewCacheChecker>)
  - [func NewDatabaseChecker\(name string, db HealthCheckable\) \*AdapterChecker](<#NewDatabaseChecker>)
  - [func NewMessageBrokerChecker\(name string, broker HealthCheckable\) \*AdapterChecker](<#NewMessageBrokerChecker>)
  - [func \(c \*AdapterChecker\) Check\(ctx context.Context\) CheckResult](<#AdapterChecker.Check>)
  - [func \(c \*AdapterChecker\) Name\(\) string](<#AdapterChecker.Name>)
- [type AggregatedResult](<#AggregatedResult>)
  - [func \(r AggregatedResult\) IsHealthy\(\) bool](<#AggregatedResult.IsHealthy>)
- [type CheckResult](<#CheckResult>)
- [type Checker](<#Checker>)
- [type CheckerFunc](<#CheckerFunc>)
  - [func \(f CheckerFunc\) Check\(ctx context.Context\) CheckResult](<#CheckerFunc.Check>)
  - [func \(f CheckerFunc\) Name\(\) string](<#CheckerFunc.Name>)
- [type CompositeChecker](<#CompositeChecker>)
  - [func NewCompositeChecker\(name string, checkers ...Checker\) \*CompositeChecker](<#NewCompositeChecker>)
  - [func \(c \*CompositeChecker\) Check\(ctx context.Context\) CheckResult](<#CompositeChecker.Check>)
  - [func \(c \*CompositeChecker\) Name\(\) string](<#CompositeChecker.Name>)
- [type CustomChecker](<#CustomChecker>)
  - [func NewCustomChecker\(name string, checkFunc func\(ctx context.Context\) \(Status, string, error\)\) \*CustomChecker](<#NewCustomChecker>)
  - [func \(c \*CustomChecker\) Check\(ctx context.Context\) CheckResult](<#CustomChecker.Check>)
  - [func \(c \*CustomChecker\) Name\(\) string](<#CustomChecker.Name>)
- [type HealthCheckable](<#HealthCheckable>)
- [type PingChecker](<#PingChecker>)
  - [func NewPingChecker\(name string\) \*PingChecker](<#NewPingChecker>)
  - [func \(c \*PingChecker\) Check\(ctx context.Context\) CheckResult](<#PingChecker.Check>)
  - [func \(c \*PingChecker\) Name\(\) string](<#PingChecker.Name>)
- [type Registry](<#Registry>)
  - [func NewRegistry\(\) \*Registry](<#NewRegistry>)
  - [func \(r \*Registry\) Check\(ctx context.Context\) AggregatedResult](<#Registry.Check>)
  - [func \(r \*Registry\) CheckOne\(ctx context.Context, name string\) \(CheckResult, error\)](<#Registry.CheckOne>)
  - [func \(r \*Registry\) List\(\) \[\]string](<#Registry.List>)
  - [func \(r \*Registry\) Register\(checker Checker\)](<#Registry.Register>)
  - [func \(r \*Registry\) RegisterFunc\(name string, checkFunc func\(ctx context.Context\) CheckResult\)](<#Registry.RegisterFunc>)
  - [func \(r \*Registry\) Unregister\(name string\)](<#Registry.Unregister>)
- [type Status](<#Status>)


<a name="AdapterChecker"></a>
## type AdapterChecker

AdapterChecker creates a health checker for any component that implements HealthCheckable

```go
type AdapterChecker struct {
    // contains filtered or unexported fields
}
```

<a name="NewAdapterChecker"></a>
### func NewAdapterChecker

```go
func NewAdapterChecker(name string, adapter HealthCheckable, timeout time.Duration) *AdapterChecker
```

NewAdapterChecker creates a new health checker for an adapter

<a name="NewCacheChecker"></a>
### func NewCacheChecker

```go
func NewCacheChecker(name string, cache HealthCheckable) *AdapterChecker
```

NewCacheChecker creates a health checker for a cache adapter This is a convenience function for creating an AdapterChecker with cache\-specific defaults

<a name="NewDatabaseChecker"></a>
### func NewDatabaseChecker

```go
func NewDatabaseChecker(name string, db HealthCheckable) *AdapterChecker
```

NewDatabaseChecker creates a health checker for a database adapter This is a convenience function for creating an AdapterChecker with database\-specific defaults

<a name="NewMessageBrokerChecker"></a>
### func NewMessageBrokerChecker

```go
func NewMessageBrokerChecker(name string, broker HealthCheckable) *AdapterChecker
```

NewMessageBrokerChecker creates a health checker for a message broker adapter This is a convenience function for creating an AdapterChecker with message broker\-specific defaults

<a name="AdapterChecker.Check"></a>
### func \(\*AdapterChecker\) Check

```go
func (c *AdapterChecker) Check(ctx context.Context) CheckResult
```

Check performs the health check on the adapter

<a name="AdapterChecker.Name"></a>
### func \(\*AdapterChecker\) Name

```go
func (c *AdapterChecker) Name() string
```

Name returns the name of the health check

<a name="AggregatedResult"></a>
## type AggregatedResult

AggregatedResult represents the aggregated result of all health checks

```go
type AggregatedResult struct {
    Status    Status        `json:"status"`
    Checks    []CheckResult `json:"checks"`
    Timestamp time.Time     `json:"timestamp"`
    Duration  time.Duration `json:"duration"`
}
```

<a name="AggregatedResult.IsHealthy"></a>
### func \(AggregatedResult\) IsHealthy

```go
func (r AggregatedResult) IsHealthy() bool
```

IsHealthy returns true if the overall status is healthy

<a name="CheckResult"></a>
## type CheckResult

CheckResult represents the result of a health check

```go
type CheckResult struct {
    Name      string                 `json:"name"`
    Status    Status                 `json:"status"`
    Message   string                 `json:"message,omitempty"`
    Error     string                 `json:"error,omitempty"`
    Timestamp time.Time              `json:"timestamp"`
    Duration  time.Duration          `json:"duration"`
    Metadata  map[string]interface{} `json:"metadata,omitempty"`
}
```

<a name="Checker"></a>
## type Checker

Checker is the interface that health check implementations must satisfy

```go
type Checker interface {
    // Check performs the health check and returns the result
    Check(ctx context.Context) CheckResult

    // Name returns the name of the health check
    Name() string
}
```

<a name="CheckerFunc"></a>
## type CheckerFunc

CheckerFunc is a function type that implements the Checker interface

```go
type CheckerFunc func(ctx context.Context) CheckResult
```

<a name="CheckerFunc.Check"></a>
### func \(CheckerFunc\) Check

```go
func (f CheckerFunc) Check(ctx context.Context) CheckResult
```

Check implements the Checker interface

<a name="CheckerFunc.Name"></a>
### func \(CheckerFunc\) Name

```go
func (f CheckerFunc) Name() string
```

Name returns a default name for function\-based checkers

<a name="CompositeChecker"></a>
## type CompositeChecker

CompositeChecker combines multiple checkers into one All sub\-checks must pass for the composite check to be healthy

```go
type CompositeChecker struct {
    // contains filtered or unexported fields
}
```

<a name="NewCompositeChecker"></a>
### func NewCompositeChecker

```go
func NewCompositeChecker(name string, checkers ...Checker) *CompositeChecker
```

NewCompositeChecker creates a new composite checker

<a name="CompositeChecker.Check"></a>
### func \(\*CompositeChecker\) Check

```go
func (c *CompositeChecker) Check(ctx context.Context) CheckResult
```

Check runs all sub\-checks and aggregates the results

<a name="CompositeChecker.Name"></a>
### func \(\*CompositeChecker\) Name

```go
func (c *CompositeChecker) Name() string
```

Name returns the name of the health check

<a name="CustomChecker"></a>
## type CustomChecker

CustomChecker allows creating a health checker from a custom function

```go
type CustomChecker struct {
    // contains filtered or unexported fields
}
```

<a name="NewCustomChecker"></a>
### func NewCustomChecker

```go
func NewCustomChecker(name string, checkFunc func(ctx context.Context) (Status, string, error)) *CustomChecker
```

NewCustomChecker creates a new custom health checker The checkFunc should return \(status, message, error\)

<a name="CustomChecker.Check"></a>
### func \(\*CustomChecker\) Check

```go
func (c *CustomChecker) Check(ctx context.Context) CheckResult
```

Check executes the custom check function

<a name="CustomChecker.Name"></a>
### func \(\*CustomChecker\) Name

```go
func (c *CustomChecker) Name() string
```

Name returns the name of the health check

<a name="HealthCheckable"></a>
## type HealthCheckable

HealthCheckable is an interface for components that support health checks

```go
type HealthCheckable interface {
    HealthCheck(ctx context.Context) error
}
```

<a name="PingChecker"></a>
## type PingChecker

PingChecker creates a simple health checker that always returns healthy Useful for liveness checks

```go
type PingChecker struct {
    // contains filtered or unexported fields
}
```

<a name="NewPingChecker"></a>
### func NewPingChecker

```go
func NewPingChecker(name string) *PingChecker
```

NewPingChecker creates a new ping checker

<a name="PingChecker.Check"></a>
### func \(\*PingChecker\) Check

```go
func (c *PingChecker) Check(ctx context.Context) CheckResult
```

Check always returns healthy status

<a name="PingChecker.Name"></a>
### func \(\*PingChecker\) Name

```go
func (c *PingChecker) Name() string
```

Name returns the name of the health check

<a name="Registry"></a>
## type Registry

Registry manages a collection of health checks

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

NewRegistry creates a new health check registry

<a name="Registry.Check"></a>
### func \(\*Registry\) Check

```go
func (r *Registry) Check(ctx context.Context) AggregatedResult
```

Check runs all registered health checks and returns aggregated results If any check fails, the overall status is unhealthy

<a name="Registry.CheckOne"></a>
### func \(\*Registry\) CheckOne

```go
func (r *Registry) CheckOne(ctx context.Context, name string) (CheckResult, error)
```

CheckOne runs a specific health check by name

<a name="Registry.List"></a>
### func \(\*Registry\) List

```go
func (r *Registry) List() []string
```

List returns the names of all registered health checks

<a name="Registry.Register"></a>
### func \(\*Registry\) Register

```go
func (r *Registry) Register(checker Checker)
```

Register adds a health check to the registry If a checker with the same name already exists, it will be replaced

<a name="Registry.RegisterFunc"></a>
### func \(\*Registry\) RegisterFunc

```go
func (r *Registry) RegisterFunc(name string, checkFunc func(ctx context.Context) CheckResult)
```

RegisterFunc registers a function\-based health check with a given name

<a name="Registry.Unregister"></a>
### func \(\*Registry\) Unregister

```go
func (r *Registry) Unregister(name string)
```

Unregister removes a health check from the registry

<a name="Status"></a>
## type Status

Status represents the health status of a component

```go
type Status string
```

<a name="StatusHealthy"></a>

```go
const (
    StatusHealthy   Status = "healthy"
    StatusUnhealthy Status = "unhealthy"
    StatusDegraded  Status = "degraded"
)
```

Generated by [gomarkdoc](<https://github.com/princjef/gomarkdoc>)
