---
layout: documentation
title: pkg/repository
---


# repository

```go
import "github.com/nimburion/nimburion/pkg/repository"
```

<details><summary>Example</summary>
<p>

Example demonstrates how to use the generic CRUD repository

```go
package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"

	"github.com/nimburion/nimburion/pkg/repository"
)

// User is an example entity
type User struct {
	ID      int64  `db:"id"`
	Name    string `db:"name"`
	Email   string `db:"email"`
	Version int64  `db:"version"`
}

func (u *User) GetVersion() int64 {
	return u.Version
}

func (u *User) SetVersion(version int64) {
	u.Version = version
}

// UserMapper implements EntityMapper for User
type UserMapper struct{}

func (m *UserMapper) ToRow(user *User) ([]string, []interface{}, error) {
	return []string{"id", "name", "email", "version"},
		[]interface{}{user.ID, user.Name, user.Email, user.Version},
		nil
}

func (m *UserMapper) FromRow(rows *sql.Rows) (*User, error) {
	user := &User{}
	err := rows.Scan(&user.ID, &user.Name, &user.Email, &user.Version)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (m *UserMapper) GetID(user *User) int64 {
	return user.ID
}

func (m *UserMapper) SetID(user *User, id int64) {
	user.ID = id
}

// Example demonstrates how to use the generic CRUD repository
func main() {
	// This is a conceptual example - in real code, you would have a real database connection
	var db *sql.DB // Assume this is initialized

	// Create a repository for User entities
	userRepo := repository.NewGenericCrudRepository[User, int64](
		db,
		"users",
		"id",
		&UserMapper{},
	)

	ctx := context.Background()

	// Create a new user
	user := &User{
		ID:      1,
		Name:    "John Doe",
		Email:   "john@example.com",
		Version: 0,
	}
	if err := userRepo.Create(ctx, user); err != nil {
		log.Fatal(err)
	}

	// Find user by ID
	foundUser, err := userRepo.FindByID(ctx, 1)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Found user: %s\n", foundUser.Name)

	// Find all users with filters, sorting, and pagination
	opts := repository.QueryOptions{
		Filter: repository.Filter{
			"name": "John Doe",
		},
		Sort: repository.Sort{
			Field: "email",
			Order: repository.SortAsc,
		},
		Pagination: repository.Pagination{
			Page:     1,
			PageSize: 10,
		},
	}
	users, err := userRepo.FindAll(ctx, opts)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Found %d users\n", len(users))

	// Update user
	foundUser.Email = "john.doe@example.com"
	if err := userRepo.Update(ctx, foundUser); err != nil {
		log.Fatal(err)
	}

	// Count users
	count, err := userRepo.Count(ctx, repository.Filter{"name": "John Doe"})
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Total users: %d\n", count)

	// Delete user
	if err := userRepo.Delete(ctx, 1); err != nil {
		log.Fatal(err)
	}
}
```

</p>
</details>

## Index

- [type EntityMapper](<#EntityMapper>)
- [type Filter](<#Filter>)
- [type GenericCrudRepository](<#GenericCrudRepository>)
  - [func NewGenericCrudRepository\[T any, ID comparable\]\(executor SQLExecutor, tableName string, idColumn string, mapper EntityMapper\[T, ID\]\) \*GenericCrudRepository\[T, ID\]](<#NewGenericCrudRepository>)
  - [func \(r \*GenericCrudRepository\[T, ID\]\) Count\(ctx context.Context, filter Filter\) \(int64, error\)](<#GenericCrudRepository[T, ID].Count>)
  - [func \(r \*GenericCrudRepository\[T, ID\]\) Create\(ctx context.Context, entity \*T\) error](<#GenericCrudRepository[T, ID].Create>)
  - [func \(r \*GenericCrudRepository\[T, ID\]\) Delete\(ctx context.Context, id ID\) error](<#GenericCrudRepository[T, ID].Delete>)
  - [func \(r \*GenericCrudRepository\[T, ID\]\) FindAll\(ctx context.Context, opts QueryOptions\) \(\[\]T, error\)](<#GenericCrudRepository[T, ID].FindAll>)
  - [func \(r \*GenericCrudRepository\[T, ID\]\) FindByID\(ctx context.Context, id ID\) \(\*T, error\)](<#GenericCrudRepository[T, ID].FindByID>)
  - [func \(r \*GenericCrudRepository\[T, ID\]\) Update\(ctx context.Context, entity \*T\) error](<#GenericCrudRepository[T, ID].Update>)
- [type OptimisticLockError](<#OptimisticLockError>)
  - [func NewOptimisticLockError\(entityID string, expected, actual int64\) \*OptimisticLockError](<#NewOptimisticLockError>)
  - [func \(e \*OptimisticLockError\) Error\(\) string](<#OptimisticLockError.Error>)
- [type Pagination](<#Pagination>)
  - [func \(p Pagination\) Limit\(\) int](<#Pagination.Limit>)
  - [func \(p Pagination\) Offset\(\) int](<#Pagination.Offset>)
- [type QueryOptions](<#QueryOptions>)
- [type Reader](<#Reader>)
- [type ReflectionMapper](<#ReflectionMapper>)
  - [func NewReflectionMapper\[T any, ID comparable\]\(idField string\) \*ReflectionMapper\[T, ID\]](<#NewReflectionMapper>)
  - [func \(m \*ReflectionMapper\[T, ID\]\) FromRow\(rows \*sql.Rows\) \(\*T, error\)](<#ReflectionMapper[T, ID].FromRow>)
  - [func \(m \*ReflectionMapper\[T, ID\]\) GetID\(entity \*T\) ID](<#ReflectionMapper[T, ID].GetID>)
  - [func \(m \*ReflectionMapper\[T, ID\]\) SetID\(entity \*T, id ID\)](<#ReflectionMapper[T, ID].SetID>)
  - [func \(m \*ReflectionMapper\[T, ID\]\) ToRow\(entity \*T\) \(\[\]string, \[\]interface\{\}, error\)](<#ReflectionMapper[T, ID].ToRow>)
- [type Repository](<#Repository>)
- [type SQLExecutor](<#SQLExecutor>)
- [type Sort](<#Sort>)
- [type SortOrder](<#SortOrder>)
- [type Transaction](<#Transaction>)
- [type TransactionManager](<#TransactionManager>)
- [type UnitOfWork](<#UnitOfWork>)
- [type Versioned](<#Versioned>)
- [type Writer](<#Writer>)


<a name="EntityMapper"></a>
## type EntityMapper

EntityMapper defines how to map between entities and database rows

```go
type EntityMapper[T any, ID comparable] interface {
    // ToRow converts an entity to column names and values for INSERT/UPDATE
    ToRow(entity *T) (columns []string, values []interface{}, err error)

    // FromRow scans a database row into an entity
    FromRow(rows *sql.Rows) (*T, error)

    // GetID extracts the ID from an entity
    GetID(entity *T) ID

    // SetID sets the ID on an entity
    SetID(entity *T, id ID)
}
```

<a name="Filter"></a>
## type Filter

Filter represents field\-based filtering criteria

```go
type Filter map[string]interface{}
```

<a name="GenericCrudRepository"></a>
## type GenericCrudRepository

GenericCrudRepository provides a generic implementation of CRUD operations for SQL databases

```go
type GenericCrudRepository[T any, ID comparable] struct {
    // contains filtered or unexported fields
}
```

<a name="NewGenericCrudRepository"></a>
### func NewGenericCrudRepository

```go
func NewGenericCrudRepository[T any, ID comparable](executor SQLExecutor, tableName string, idColumn string, mapper EntityMapper[T, ID]) *GenericCrudRepository[T, ID]
```

NewGenericCrudRepository creates a new generic CRUD repository

<a name="GenericCrudRepository[T, ID].Count"></a>
### func \(\*GenericCrudRepository\[T, ID\]\) Count

```go
func (r *GenericCrudRepository[T, ID]) Count(ctx context.Context, filter Filter) (int64, error)
```

Count returns the number of entities matching the filter

<a name="GenericCrudRepository[T, ID].Create"></a>
### func \(\*GenericCrudRepository\[T, ID\]\) Create

```go
func (r *GenericCrudRepository[T, ID]) Create(ctx context.Context, entity *T) error
```

Create inserts a new entity into the database

<a name="GenericCrudRepository[T, ID].Delete"></a>
### func \(\*GenericCrudRepository\[T, ID\]\) Delete

```go
func (r *GenericCrudRepository[T, ID]) Delete(ctx context.Context, id ID) error
```

Delete removes an entity from the database by its ID

<a name="GenericCrudRepository[T, ID].FindAll"></a>
### func \(\*GenericCrudRepository\[T, ID\]\) FindAll

```go
func (r *GenericCrudRepository[T, ID]) FindAll(ctx context.Context, opts QueryOptions) ([]T, error)
```

FindAll retrieves entities matching the query options with support for filtering, sorting, and pagination. Filters are combined with AND logic. Returns an empty slice if no entities match.

<a name="GenericCrudRepository[T, ID].FindByID"></a>
### func \(\*GenericCrudRepository\[T, ID\]\) FindByID

```go
func (r *GenericCrudRepository[T, ID]) FindByID(ctx context.Context, id ID) (*T, error)
```

FindByID retrieves an entity by its ID

<a name="GenericCrudRepository[T, ID].Update"></a>
### func \(\*GenericCrudRepository\[T, ID\]\) Update

```go
func (r *GenericCrudRepository[T, ID]) Update(ctx context.Context, entity *T) error
```

Update updates an existing entity in the database. Automatically uses optimistic locking if the entity implements the Versioned interface. Returns sql.ErrNoRows if the entity doesn't exist or version mismatch occurs.

<a name="OptimisticLockError"></a>
## type OptimisticLockError

OptimisticLockError is returned when an optimistic lock conflict is detected

```go
type OptimisticLockError struct {
    EntityID string
    Expected int64
    Actual   int64
}
```

<a name="NewOptimisticLockError"></a>
### func NewOptimisticLockError

```go
func NewOptimisticLockError(entityID string, expected, actual int64) *OptimisticLockError
```

NewOptimisticLockError creates a new OptimisticLockError

<a name="OptimisticLockError.Error"></a>
### func \(\*OptimisticLockError\) Error

```go
func (e *OptimisticLockError) Error() string
```

Error returns the error message for optimistic lock failures.

<a name="Pagination"></a>
## type Pagination

Pagination specifies page\-based pagination parameters

```go
type Pagination struct {
    Page     int
    PageSize int
}
```

<a name="Pagination.Limit"></a>
### func \(Pagination\) Limit

```go
func (p Pagination) Limit() int
```

Limit returns the page size for database queries

<a name="Pagination.Offset"></a>
### func \(Pagination\) Offset

```go
func (p Pagination) Offset() int
```

Offset calculates the offset for database queries

<a name="QueryOptions"></a>
## type QueryOptions

QueryOptions encapsulates filtering, sorting, and pagination options for queries

```go
type QueryOptions struct {
    Filter     Filter
    Sort       Sort
    Pagination Pagination
}
```

<a name="Reader"></a>
## type Reader

Reader provides read operations for entities

```go
type Reader[T any, ID comparable] interface {
    FindByID(ctx context.Context, id ID) (*T, error)
    FindAll(ctx context.Context, opts QueryOptions) ([]T, error)
    Count(ctx context.Context, filter Filter) (int64, error)
}
```

<a name="ReflectionMapper"></a>
## type ReflectionMapper

ReflectionMapper provides a basic entity mapper using reflection This is a simple implementation for demonstration purposes Production code should use custom mappers for better performance and control

```go
type ReflectionMapper[T any, ID comparable] struct {
    // contains filtered or unexported fields
}
```

<a name="NewReflectionMapper"></a>
### func NewReflectionMapper

```go
func NewReflectionMapper[T any, ID comparable](idField string) *ReflectionMapper[T, ID]
```

NewReflectionMapper creates a new reflection\-based entity mapper

<a name="ReflectionMapper[T, ID].FromRow"></a>
### func \(\*ReflectionMapper\[T, ID\]\) FromRow

```go
func (m *ReflectionMapper[T, ID]) FromRow(rows *sql.Rows) (*T, error)
```

FromRow scans a database row into an entity using reflection

<a name="ReflectionMapper[T, ID].GetID"></a>
### func \(\*ReflectionMapper\[T, ID\]\) GetID

```go
func (m *ReflectionMapper[T, ID]) GetID(entity *T) ID
```

GetID extracts the ID from an entity using reflection

<a name="ReflectionMapper[T, ID].SetID"></a>
### func \(\*ReflectionMapper\[T, ID\]\) SetID

```go
func (m *ReflectionMapper[T, ID]) SetID(entity *T, id ID)
```

SetID sets the ID on an entity using reflection

<a name="ReflectionMapper[T, ID].ToRow"></a>
### func \(\*ReflectionMapper\[T, ID\]\) ToRow

```go
func (m *ReflectionMapper[T, ID]) ToRow(entity *T) ([]string, []interface{}, error)
```

ToRow converts an entity to column names and values using reflection

<a name="Repository"></a>
## type Repository

Repository combines Reader and Writer interfaces for complete CRUD operations

```go
type Repository[T any, ID comparable] interface {
    // contains filtered or unexported methods
}
```

<a name="SQLExecutor"></a>
## type SQLExecutor

SQLExecutor defines the interface for executing SQL queries This can be a \*sql.DB, \*sql.Tx, or any adapter that provides these methods

```go
type SQLExecutor interface {
    ExecContext(ctx context.Context, query string, args ...interface{}) (sql.Result, error)
    QueryContext(ctx context.Context, query string, args ...interface{}) (*sql.Rows, error)
    QueryRowContext(ctx context.Context, query string, args ...interface{}) *sql.Row
}
```

<a name="Sort"></a>
## type Sort

Sort specifies field and direction for sorting results

```go
type Sort struct {
    Field string
    Order SortOrder
}
```

<a name="SortOrder"></a>
## type SortOrder

SortOrder defines the direction of sorting

```go
type SortOrder string
```

<a name="SortAsc"></a>

```go
const (
    SortAsc  SortOrder = "asc"
    SortDesc SortOrder = "desc"
)
```

<a name="Transaction"></a>
## type Transaction

Transaction represents an active database transaction

```go
type Transaction interface {
    // Commit commits the transaction
    Commit() error

    // Rollback rolls back the transaction
    Rollback() error

    // Context returns the context associated with this transaction
    Context() context.Context
}
```

<a name="TransactionManager"></a>
## type TransactionManager

TransactionManager provides transaction management capabilities

```go
type TransactionManager interface {
    // WithTransaction executes the given function within a transaction
    // If the function returns an error, the transaction is rolled back
    // Otherwise, the transaction is committed
    WithTransaction(ctx context.Context, fn func(ctx context.Context) error) error
}
```

<a name="UnitOfWork"></a>
## type UnitOfWork

UnitOfWork provides the ability to begin transactions

```go
type UnitOfWork interface {
    Begin(ctx context.Context) (Transaction, error)
}
```

<a name="Versioned"></a>
## type Versioned

Versioned interface for entities that support optimistic locking

```go
type Versioned interface {
    GetVersion() int64
    SetVersion(version int64)
}
```

<a name="Writer"></a>
## type Writer

Writer provides write operations for entities

```go
type Writer[T any, ID comparable] interface {
    Create(ctx context.Context, entity *T) error
    Update(ctx context.Context, entity *T) error
    Delete(ctx context.Context, id ID) error
}
```

# document

```go
import "github.com/nimburion/nimburion/pkg/repository/document"
```

## Index

- [type DynamoDBExecutor](<#DynamoDBExecutor>)
  - [func NewDynamoDBExecutor\(adapter \*dynamostore.DynamoDBAdapter\) \(\*DynamoDBExecutor, error\)](<#NewDynamoDBExecutor>)
  - [func \(e \*DynamoDBExecutor\) DeleteItem\(ctx context.Context, table string, key map\[string\]types.AttributeValue\) error](<#DynamoDBExecutor.DeleteItem>)
  - [func \(e \*DynamoDBExecutor\) GetItem\(ctx context.Context, table string, key map\[string\]types.AttributeValue, consistentRead bool\) \(map\[string\]types.AttributeValue, error\)](<#DynamoDBExecutor.GetItem>)
  - [func \(e \*DynamoDBExecutor\) PutItem\(ctx context.Context, table string, item map\[string\]types.AttributeValue\) error](<#DynamoDBExecutor.PutItem>)
  - [func \(e \*DynamoDBExecutor\) Query\(ctx context.Context, table string, keyConditionExpression string, expressionNames map\[string\]string, expressionValues map\[string\]types.AttributeValue, limit int32, exclusiveStartKey map\[string\]types.AttributeValue\) \(\[\]map\[string\]types.AttributeValue, map\[string\]types.AttributeValue, error\)](<#DynamoDBExecutor.Query>)
  - [func \(e \*DynamoDBExecutor\) UpdateItem\(ctx context.Context, table string, key map\[string\]types.AttributeValue, updateExpression string, expressionNames map\[string\]string, expressionValues map\[string\]types.AttributeValue\) \(map\[string\]types.AttributeValue, error\)](<#DynamoDBExecutor.UpdateItem>)
- [type DynamoExecutor](<#DynamoExecutor>)
- [type Filter](<#Filter>)
- [type MongoDBExecutor](<#MongoDBExecutor>)
  - [func NewMongoDBExecutor\(adapter \*mongostore.MongoDBAdapter\) \(\*MongoDBExecutor, error\)](<#NewMongoDBExecutor>)
  - [func \(e \*MongoDBExecutor\) DeleteOne\(ctx context.Context, collection string, filter Filter\) \(int64, error\)](<#MongoDBExecutor.DeleteOne>)
  - [func \(e \*MongoDBExecutor\) FindOne\(ctx context.Context, collection string, filter Filter\) \(map\[string\]interface\{\}, error\)](<#MongoDBExecutor.FindOne>)
  - [func \(e \*MongoDBExecutor\) InsertOne\(ctx context.Context, collection string, document map\[string\]interface\{\}\) \(interface\{\}, error\)](<#MongoDBExecutor.InsertOne>)
  - [func \(e \*MongoDBExecutor\) UpdateOne\(ctx context.Context, collection string, filter Filter, update map\[string\]interface\{\}\) \(int64, error\)](<#MongoDBExecutor.UpdateOne>)
- [type MongoExecutor](<#MongoExecutor>)
- [type Pagination](<#Pagination>)
- [type QueryOptions](<#QueryOptions>)
- [type Reader](<#Reader>)
- [type Repository](<#Repository>)
- [type Sort](<#Sort>)
- [type SortOrder](<#SortOrder>)
- [type Writer](<#Writer>)


<a name="DynamoDBExecutor"></a>
## type DynamoDBExecutor

DynamoDBExecutor adapts store/dynamodb adapter to the repository/document executor contract.

```go
type DynamoDBExecutor struct {
    // contains filtered or unexported fields
}
```

<a name="NewDynamoDBExecutor"></a>
### func NewDynamoDBExecutor

```go
func NewDynamoDBExecutor(adapter *dynamostore.DynamoDBAdapter) (*DynamoDBExecutor, error)
```

NewDynamoDBExecutor creates a new DynamoDBExecutor instance.

<a name="DynamoDBExecutor.DeleteItem"></a>
### func \(\*DynamoDBExecutor\) DeleteItem

```go
func (e *DynamoDBExecutor) DeleteItem(ctx context.Context, table string, key map[string]types.AttributeValue) error
```

DeleteItem removes an item from the table.

<a name="DynamoDBExecutor.GetItem"></a>
### func \(\*DynamoDBExecutor\) GetItem

```go
func (e *DynamoDBExecutor) GetItem(ctx context.Context, table string, key map[string]types.AttributeValue, consistentRead bool) (map[string]types.AttributeValue, error)
```

GetItem retrieves an item by its primary key.

<a name="DynamoDBExecutor.PutItem"></a>
### func \(\*DynamoDBExecutor\) PutItem

```go
func (e *DynamoDBExecutor) PutItem(ctx context.Context, table string, item map[string]types.AttributeValue) error
```

PutItem creates or replaces an item in the DynamoDB table.

<a name="DynamoDBExecutor.Query"></a>
### func \(\*DynamoDBExecutor\) Query

```go
func (e *DynamoDBExecutor) Query(ctx context.Context, table string, keyConditionExpression string, expressionNames map[string]string, expressionValues map[string]types.AttributeValue, limit int32, exclusiveStartKey map[string]types.AttributeValue) ([]map[string]types.AttributeValue, map[string]types.AttributeValue, error)
```

Query retrieves a URL query parameter by name.

<a name="DynamoDBExecutor.UpdateItem"></a>
### func \(\*DynamoDBExecutor\) UpdateItem

```go
func (e *DynamoDBExecutor) UpdateItem(ctx context.Context, table string, key map[string]types.AttributeValue, updateExpression string, expressionNames map[string]string, expressionValues map[string]types.AttributeValue) (map[string]types.AttributeValue, error)
```

UpdateItem modifies attributes of an existing item.

<a name="DynamoExecutor"></a>
## type DynamoExecutor

DynamoExecutor defines a minimal document execution contract for DynamoDB\-backed repositories. Expressions are intentionally passed\-through to keep full DynamoDB capabilities available.

```go
type DynamoExecutor interface {
    PutItem(ctx context.Context, table string, item map[string]types.AttributeValue) error
    GetItem(ctx context.Context, table string, key map[string]types.AttributeValue, consistentRead bool) (map[string]types.AttributeValue, error)
    UpdateItem(
        ctx context.Context,
        table string,
        key map[string]types.AttributeValue,
        updateExpression string,
        expressionNames map[string]string,
        expressionValues map[string]types.AttributeValue,
    ) (map[string]types.AttributeValue, error)
    DeleteItem(ctx context.Context, table string, key map[string]types.AttributeValue) error
    Query(
        ctx context.Context,
        table string,
        keyConditionExpression string,
        expressionNames map[string]string,
        expressionValues map[string]types.AttributeValue,
        limit int32,
        exclusiveStartKey map[string]types.AttributeValue,
    ) ([]map[string]types.AttributeValue, map[string]types.AttributeValue, error)
}
```

<a name="Filter"></a>
## type Filter

Filter represents field\-based filtering criteria for document stores.

```go
type Filter map[string]interface{}
```

<a name="MongoDBExecutor"></a>
## type MongoDBExecutor

MongoDBExecutor adapts store/mongodb adapter to the repository/document executor contract.

```go
type MongoDBExecutor struct {
    // contains filtered or unexported fields
}
```

<a name="NewMongoDBExecutor"></a>
### func NewMongoDBExecutor

```go
func NewMongoDBExecutor(adapter *mongostore.MongoDBAdapter) (*MongoDBExecutor, error)
```

NewMongoDBExecutor creates a new MongoDBExecutor instance.

<a name="MongoDBExecutor.DeleteOne"></a>
### func \(\*MongoDBExecutor\) DeleteOne

```go
func (e *MongoDBExecutor) DeleteOne(ctx context.Context, collection string, filter Filter) (int64, error)
```

DeleteOne deletes a single document matching the filter.

<a name="MongoDBExecutor.FindOne"></a>
### func \(\*MongoDBExecutor\) FindOne

```go
func (e *MongoDBExecutor) FindOne(ctx context.Context, collection string, filter Filter) (map[string]interface{}, error)
```

FindOne finds a single document matching the filter.

<a name="MongoDBExecutor.InsertOne"></a>
### func \(\*MongoDBExecutor\) InsertOne

```go
func (e *MongoDBExecutor) InsertOne(ctx context.Context, collection string, document map[string]interface{}) (interface{}, error)
```

InsertOne inserts a document into the collection.

<a name="MongoDBExecutor.UpdateOne"></a>
### func \(\*MongoDBExecutor\) UpdateOne

```go
func (e *MongoDBExecutor) UpdateOne(ctx context.Context, collection string, filter Filter, update map[string]interface{}) (int64, error)
```

UpdateOne updates a single document matching the filter.

<a name="MongoExecutor"></a>
## type MongoExecutor

MongoExecutor defines a minimal document execution contract for MongoDB\-backed repositories.

```go
type MongoExecutor interface {
    InsertOne(ctx context.Context, collection string, document map[string]interface{}) (interface{}, error)
    FindOne(ctx context.Context, collection string, filter Filter) (map[string]interface{}, error)
    UpdateOne(ctx context.Context, collection string, filter Filter, update map[string]interface{}) (int64, error)
    DeleteOne(ctx context.Context, collection string, filter Filter) (int64, error)
}
```

<a name="Pagination"></a>
## type Pagination

Pagination specifies limit\-based pagination for document stores. Cursor is backend\-specific \(e.g. Mongo cursor token, Dynamo LastEvaluatedKey encoding\).

```go
type Pagination struct {
    Limit  int
    Cursor string
}
```

<a name="QueryOptions"></a>
## type QueryOptions

QueryOptions encapsulates filtering, sorting, and pagination options for document queries.

```go
type QueryOptions struct {
    Filter     Filter
    Sort       Sort
    Pagination Pagination
}
```

<a name="Reader"></a>
## type Reader

Reader provides read operations for document entities.

```go
type Reader[T any, ID comparable] interface {
    FindByID(ctx context.Context, id ID) (*T, error)
    FindAll(ctx context.Context, opts QueryOptions) ([]T, error)
    Count(ctx context.Context, filter Filter) (int64, error)
}
```

<a name="Repository"></a>
## type Repository

Repository combines Reader and Writer interfaces for document stores.

```go
type Repository[T any, ID comparable] interface {
    // contains filtered or unexported methods
}
```

<a name="Sort"></a>
## type Sort

Sort specifies field and direction for sorting results.

```go
type Sort struct {
    Field string
    Order SortOrder
}
```

<a name="SortOrder"></a>
## type SortOrder

SortOrder defines the direction of sorting.

```go
type SortOrder string
```

<a name="SortAsc"></a>

```go
const (
    SortAsc  SortOrder = "asc"
    SortDesc SortOrder = "desc"
)
```

<a name="Writer"></a>
## type Writer

Writer provides write operations for document entities.

```go
type Writer[T any, ID comparable] interface {
    Create(ctx context.Context, entity *T) error
    Update(ctx context.Context, entity *T) error
    Delete(ctx context.Context, id ID) error
}
```

Generated by [gomarkdoc](<https://github.com/princjef/gomarkdoc>)
