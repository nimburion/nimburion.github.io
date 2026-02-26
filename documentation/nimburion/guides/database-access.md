---
layout: documentation
title: Database Access
---

# Database Access

Guide to using the store and repository packages for database access in Nimburion.

## Overview

Nimburion provides two layers for database access:

- **pkg/store** - Low-level database adapters with pluggable implementations
- **pkg/repository** - Repository pattern helpers for domain-driven design

## Store Adapters

The store package provides consistent interfaces for SQL and NoSQL databases.

### Supported Databases

- **SQL**: PostgreSQL, MySQL, SQLite
- **NoSQL**: MongoDB, DynamoDB
- **In-Memory**: For testing

### Configuration

Configure database connection in `config.yaml`:

```yaml
store:
  type: postgres
  host: localhost
  port: 5432
  database: myapp
  username: ${DB_USER}
  password: ${DB_PASSWORD}
  maxOpenConns: 25
  maxIdleConns: 5
  connMaxLifetime: 5m
```

### Initialize Store

```go
package main

import (
    "github.com/nimburion/nimburion/pkg/config"
    "github.com/nimburion/nimburion/pkg/store"
    "github.com/nimburion/nimburion/pkg/store/postgres"
)

func main() {
    cfg := config.Load()
    
    // Create store adapter
    db, err := postgres.New(cfg.Store)
    if err != nil {
        log.Fatal(err)
    }
    defer db.Close()
    
    // Use in your application
    app := server.Bootstrap(cfg)
    app.SetStore(db)
    app.Run()
}
```

### Query Examples

```go
// Raw query
rows, err := db.Query(ctx, "SELECT * FROM users WHERE active = $1", true)
if err != nil {
    return err
}
defer rows.Close()

// Query single row
var user User
err = db.QueryRow(ctx, 
    "SELECT id, name, email FROM users WHERE id = $1", 
    userID,
).Scan(&user.ID, &user.Name, &user.Email)

// Execute statement
result, err := db.Exec(ctx,
    "UPDATE users SET last_login = $1 WHERE id = $2",
    time.Now(), userID,
)
```

### Transactions

```go
tx, err := db.Begin(ctx)
if err != nil {
    return err
}
defer tx.Rollback()

// Execute queries in transaction
_, err = tx.Exec(ctx, "INSERT INTO users (name) VALUES ($1)", "Alice")
if err != nil {
    return err
}

_, err = tx.Exec(ctx, "INSERT INTO audit_log (action) VALUES ($1)", "user_created")
if err != nil {
    return err
}

// Commit transaction
if err := tx.Commit(); err != nil {
    return err
}
```

## Repository Pattern

The repository package provides helpers for implementing the repository pattern.

### Define Repository Interface

```go
package repository

import "context"

type UserRepository interface {
    Create(ctx context.Context, user *User) error
    FindByID(ctx context.Context, id string) (*User, error)
    FindByEmail(ctx context.Context, email string) (*User, error)
    Update(ctx context.Context, user *User) error
    Delete(ctx context.Context, id string) error
    List(ctx context.Context, opts ListOptions) ([]*User, error)
}
```

### Implement Repository

```go
package repository

import (
    "context"
    "github.com/nimburion/nimburion/pkg/store"
)

type userRepository struct {
    db store.Store
}

func NewUserRepository(db store.Store) UserRepository {
    return &userRepository{db: db}
}

func (r *userRepository) Create(ctx context.Context, user *User) error {
    query := `
        INSERT INTO users (id, name, email, created_at)
        VALUES ($1, $2, $3, $4)
    `
    _, err := r.db.Exec(ctx, query, 
        user.ID, user.Name, user.Email, user.CreatedAt,
    )
    return err
}

func (r *userRepository) FindByID(ctx context.Context, id string) (*User, error) {
    query := `
        SELECT id, name, email, created_at, updated_at
        FROM users
        WHERE id = $1
    `
    var user User
    err := r.db.QueryRow(ctx, query, id).Scan(
        &user.ID, &user.Name, &user.Email, 
        &user.CreatedAt, &user.UpdatedAt,
    )
    if err != nil {
        return nil, err
    }
    return &user, nil
}

func (r *userRepository) Update(ctx context.Context, user *User) error {
    query := `
        UPDATE users
        SET name = $1, email = $2, updated_at = $3
        WHERE id = $4
    `
    _, err := r.db.Exec(ctx, query,
        user.Name, user.Email, time.Now(), user.ID,
    )
    return err
}

func (r *userRepository) Delete(ctx context.Context, id string) error {
    query := "DELETE FROM users WHERE id = $1"
    _, err := r.db.Exec(ctx, query, id)
    return err
}
```

### Use Repository in Handler

```go
package handlers

import (
    "github.com/gin-gonic/gin"
    "myapp/internal/repository"
)

type UserHandler struct {
    repo repository.UserRepository
}

func NewUserHandler(repo repository.UserRepository) *UserHandler {
    return &UserHandler{repo: repo}
}

func (h *UserHandler) GetUser(c *gin.Context) {
    id := c.Param("id")
    
    user, err := h.repo.FindByID(c.Request.Context(), id)
    if err != nil {
        c.JSON(404, gin.H{"error": "user not found"})
        return
    }
    
    c.JSON(200, user)
}

func (h *UserHandler) CreateUser(c *gin.Context) {
    var user User
    if err := c.ShouldBindJSON(&user); err != nil {
        c.JSON(400, gin.H{"error": err.Error()})
        return
    }
    
    user.ID = uuid.New().String()
    user.CreatedAt = time.Now()
    
    if err := h.repo.Create(c.Request.Context(), &user); err != nil {
        c.JSON(500, gin.H{"error": "failed to create user"})
        return
    }
    
    c.JSON(201, user)
}
```

## Database Migrations

Use the migrate package for schema migrations:

```go
import "github.com/nimburion/nimburion/pkg/migrate"

func main() {
    cfg := config.Load()
    db, _ := postgres.New(cfg.Store)
    
    // Run migrations
    migrator := migrate.New(db, "migrations")
    if err := migrator.Up(); err != nil {
        log.Fatal(err)
    }
}
```

Migration file `migrations/001_create_users.sql`:

```sql
-- +migrate Up
CREATE TABLE users (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- +migrate Down
DROP TABLE users;
```

## Connection Pooling

Configure connection pool settings:

```yaml
store:
  maxOpenConns: 25      # Maximum open connections
  maxIdleConns: 5       # Maximum idle connections
  connMaxLifetime: 5m   # Connection max lifetime
  connMaxIdleTime: 10m  # Connection max idle time
```

## Testing

Use in-memory store for testing:

```go
import "github.com/nimburion/nimburion/pkg/store/memory"

func TestUserRepository(t *testing.T) {
    db := memory.New()
    repo := NewUserRepository(db)
    
    user := &User{
        ID:    "123",
        Name:  "Alice",
        Email: "alice@example.com",
    }
    
    err := repo.Create(context.Background(), user)
    assert.NoError(t, err)
    
    found, err := repo.FindByID(context.Background(), "123")
    assert.NoError(t, err)
    assert.Equal(t, "Alice", found.Name)
}
```

## Best Practices

1. **Use context for cancellation** - Pass context to all database operations
2. **Handle errors properly** - Check for specific errors (not found, duplicate, etc)
3. **Use transactions** - For operations that must be atomic
4. **Close resources** - Always defer Close() on rows and transactions
5. **Use prepared statements** - For repeated queries
6. **Implement repository pattern** - Separate data access from business logic
7. **Test with in-memory store** - Fast unit tests without real database

## Next Steps

- [Event-Driven Architecture](/documentation/nimburion/guides/event-driven/) - Publish domain events
- [Observability](/documentation/nimburion/guides/observability/) - Monitor database queries
- [Store Package Reference](/documentation/nimburion/packages/store/) - Full API documentation
