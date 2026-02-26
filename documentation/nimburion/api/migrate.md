---
layout: documentation
title: pkg/migrate
---


# migrate

```go
import "github.com/nimburion/nimburion/pkg/migrate"
```

## Index

- [func ParseArgs\(args \[\]string\) \(string, int, error\)](<#ParseArgs>)
- [func Run\(args \[\]string, opts Options, ops Operations\) error](<#Run>)
- [func RunParsed\(subcommand string, steps int, opts Options, ops Operations\) error](<#RunParsed>)
- [func RunWithDBContext\(ctx context.Context, sqlDB \*sql.DB, path, serviceName, direction string, steps int, timeout time.Duration, log logger.Logger, builder func\(context.Context, \*sql.DB, string\) \(Operations, error\)\) error](<#RunWithDBContext>)
- [func RunWithSQLDriver\(driverName, dbURL, path, serviceName, direction string, steps int, timeout time.Duration, log logger.Logger, builder OperationsBuilder\) error](<#RunWithSQLDriver>)
- [func RunWithSQLDriverContext\(ctx context.Context, driverName, dbURL, path, serviceName, direction string, steps int, timeout time.Duration, log logger.Logger, builder func\(context.Context, \*sql.DB, string\) \(Operations, error\)\) error](<#RunWithSQLDriverContext>)
- [type Migration](<#Migration>)
- [type Operations](<#Operations>)
- [type OperationsBuilder](<#OperationsBuilder>)
- [type Options](<#Options>)
- [type PendingMigration](<#PendingMigration>)
- [type SQLManager](<#SQLManager>)
  - [func NewSQLManager\(db \*sql.DB, migrationFiles fs.FS, migrationsDir string\) \(\*SQLManager, error\)](<#NewSQLManager>)
  - [func \(m \*SQLManager\) Down\(ctx context.Context, steps int\) \(int, error\)](<#SQLManager.Down>)
  - [func \(m \*SQLManager\) Status\(ctx context.Context\) \(\*Status, error\)](<#SQLManager.Status>)
  - [func \(m \*SQLManager\) Up\(ctx context.Context\) \(int, error\)](<#SQLManager.Up>)
- [type Status](<#Status>)


<a name="ParseArgs"></a>
## func ParseArgs

```go
func ParseArgs(args []string) (string, int, error)
```

ParseArgs parses \[up|down|status\] \[steps\], defaulting to "up".

<a name="Run"></a>
## func Run

```go
func Run(args []string, opts Options, ops Operations) error
```

Run executes migrate subcommands using shared parsing, timeout and logging.

<a name="RunParsed"></a>
## func RunParsed

```go
func RunParsed(subcommand string, steps int, opts Options, ops Operations) error
```

RunParsed executes a parsed migration command.

<a name="RunWithDBContext"></a>
## func RunWithDBContext

```go
func RunWithDBContext(ctx context.Context, sqlDB *sql.DB, path, serviceName, direction string, steps int, timeout time.Duration, log logger.Logger, builder func(context.Context, *sql.DB, string) (Operations, error)) error
```

RunWithDBContext builds operations from an existing DB handle and runs the migrate command.

<a name="RunWithSQLDriver"></a>
## func RunWithSQLDriver

```go
func RunWithSQLDriver(driverName, dbURL, path, serviceName, direction string, steps int, timeout time.Duration, log logger.Logger, builder OperationsBuilder) error
```

RunWithSQLDriver opens the database, builds operations, and runs the migrate command.

<a name="RunWithSQLDriverContext"></a>
## func RunWithSQLDriverContext

```go
func RunWithSQLDriverContext(ctx context.Context, driverName, dbURL, path, serviceName, direction string, steps int, timeout time.Duration, log logger.Logger, builder func(context.Context, *sql.DB, string) (Operations, error)) error
```

RunWithSQLDriverContext is like RunWithSQLDriver but allows supplying a context for builder.

<a name="Migration"></a>
## type Migration

Migration represents a database migration with up and down SQL scripts.

```go
type Migration struct {
    Version int64
    Name    string
    UpSQL   string
    DownSQL string
}
```

<a name="Operations"></a>
## type Operations

Operations defines service\-specific migration hooks.

```go
type Operations struct {
    Up     func(ctx context.Context) (int, error)
    Down   func(ctx context.Context, steps int) (int, error)
    Status func(ctx context.Context) (*Status, error)
}
```

<a name="OperationsBuilder"></a>
## type OperationsBuilder

OperationsBuilder builds migrate Operations using an opened SQL database handle.

```go
type OperationsBuilder func(db *sql.DB, path string) (Operations, error)
```

<a name="Options"></a>
## type Options

Options configures migration command behavior.

```go
type Options struct {
    ServiceName string
    Path        string
    Timeout     time.Duration
    Logger      logger.Logger
}
```

<a name="PendingMigration"></a>
## type PendingMigration

PendingMigration contains an unapplied migration entry for status output.

```go
type PendingMigration struct {
    Version int64
    Name    string
}
```

<a name="SQLManager"></a>
## type SQLManager

SQLManager manages database migrations with support for up/down operations and status tracking.

```go
type SQLManager struct {
    // contains filtered or unexported fields
}
```

<a name="NewSQLManager"></a>
### func NewSQLManager

```go
func NewSQLManager(db *sql.DB, migrationFiles fs.FS, migrationsDir string) (*SQLManager, error)
```

NewSQLManager creates a new SQLManager instance.

<a name="SQLManager.Down"></a>
### func \(\*SQLManager\) Down

```go
func (m *SQLManager) Down(ctx context.Context, steps int) (int, error)
```

Down TODO: add description

<a name="SQLManager.Status"></a>
### func \(\*SQLManager\) Status

```go
func (m *SQLManager) Status(ctx context.Context) (*Status, error)
```

Status returns the HTTP status code that was written, or 0 if not yet written.

<a name="SQLManager.Up"></a>
### func \(\*SQLManager\) Up

```go
func (m *SQLManager) Up(ctx context.Context) (int, error)
```

Up TODO: add description

<a name="Status"></a>
## type Status

Status is the normalized migration status used by the CLI helper.

```go
type Status struct {
    AppliedVersions []int64
    Pending         []PendingMigration
}
```

Generated by [gomarkdoc](<https://github.com/princjef/gomarkdoc>)
