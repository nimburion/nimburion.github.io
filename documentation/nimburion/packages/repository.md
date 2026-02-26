---
layout: documentation
title: pkg/repository
---

# pkg/repository

Repository pattern helpers for domain-driven design.

## Define Repository

```go
type UserRepository interface {
    Create(ctx context.Context, user *User) error
    FindByID(ctx context.Context, id string) (*User, error)
    Update(ctx context.Context, user *User) error
    Delete(ctx context.Context, id string) error
}
```

## Implement Repository

```go
type userRepository struct {
    db store.Store
}

func NewUserRepository(db store.Store) UserRepository {
    return &userRepository{db: db}
}

func (r *userRepository) FindByID(ctx context.Context, id string) (*User, error) {
    query := "SELECT id, name, email FROM users WHERE id = $1"
    var user User
    err := r.db.QueryRow(ctx, query, id).Scan(&user.ID, &user.Name, &user.Email)
    return &user, err
}
```

## See Also

- [Database Access Guide](/documentation/nimburion/guides/database-access/)
