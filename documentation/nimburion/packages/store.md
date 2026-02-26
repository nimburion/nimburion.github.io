---
layout: documentation
title: pkg/store
---

# pkg/store

Database adapters with pluggable implementations.

## Supported Databases

- PostgreSQL
- MySQL
- SQLite
- MongoDB
- DynamoDB
- In-Memory (testing)

## Usage

```go
import "github.com/nimburion/nimburion/pkg/store/postgres"

db, err := postgres.New(cfg.Store)
if err != nil {
    log.Fatal(err)
}
defer db.Close()

// Query
rows, err := db.Query(ctx, "SELECT * FROM users WHERE active = $1", true)

// Execute
result, err := db.Exec(ctx, "UPDATE users SET name = $1 WHERE id = $2", name, id)

// Transactions
tx, _ := db.Begin(ctx)
tx.Exec(ctx, "INSERT INTO users ...")
tx.Commit()
```

## See Also

- [Database Access Guide](/documentation/nimburion/guides/database-access/)
