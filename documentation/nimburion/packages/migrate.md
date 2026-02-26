---
layout: documentation
title: pkg/migrate
---

# pkg/migrate

Database migration management.

## Run Migrations

```go
import "github.com/nimburion/nimburion/pkg/migrate"

migrator := migrate.New(db, "migrations")

// Run all pending migrations
migrator.Up()

// Rollback last migration
migrator.Down()

// Check status
status := migrator.Status()
```

## Migration Files

```sql
-- migrations/001_create_users.sql

-- +migrate Up
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL
);

-- +migrate Down
DROP TABLE users;
```

## See Also

- [Database Access Guide](/documentation/nimburion/guides/database-access/)
