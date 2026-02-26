---
layout: documentation
title: pkg/store
---


# store

```go
import "github.com/nimburion/nimburion/pkg/store"
```

## Index

- [type Adapter](<#Adapter>)
  - [func NewObjectStorageAdapter\(cfg config.ObjectStorageConfig, log logger.Logger\) \(Adapter, error\)](<#NewObjectStorageAdapter>)
  - [func NewSearchAdapter\(cfg config.SearchConfig, log logger.Logger\) \(Adapter, error\)](<#NewSearchAdapter>)
  - [func NewStorageAdapter\(cfg config.DatabaseConfig, log logger.Logger\) \(Adapter, error\)](<#NewStorageAdapter>)


<a name="Adapter"></a>
## type Adapter

Adapter is the minimal lifecycle and health contract for storage adapters.

```go
type Adapter interface {
    HealthCheck(ctx context.Context) error
    Close() error
}
```

<a name="NewObjectStorageAdapter"></a>
### func NewObjectStorageAdapter

```go
func NewObjectStorageAdapter(cfg config.ObjectStorageConfig, log logger.Logger) (Adapter, error)
```

NewObjectStorageAdapter selects and initializes an object storage adapter from config.

<a name="NewSearchAdapter"></a>
### func NewSearchAdapter

```go
func NewSearchAdapter(cfg config.SearchConfig, log logger.Logger) (Adapter, error)
```

NewSearchAdapter selects and initializes a search store adapter from config.

<a name="NewStorageAdapter"></a>
### func NewStorageAdapter

```go
func NewStorageAdapter(cfg config.DatabaseConfig, log logger.Logger) (Adapter, error)
```

Cosa fa: seleziona e inizializza lo storage adapter in base alla config. Cosa NON fa: non gestisce fallback tra provider diversi. Esempio minimo: adp, err := store.NewStorageAdapter\(cfg.Database, log\)

# dynamodb

```go
import "github.com/nimburion/nimburion/pkg/store/dynamodb"
```

## Index

- [func IsThrottlingError\(err error\) bool](<#IsThrottlingError>)
- [type Config](<#Config>)
- [type DynamoDBAdapter](<#DynamoDBAdapter>)
  - [func NewDynamoDBAdapter\(cfg Config, log logger.Logger\) \(\*DynamoDBAdapter, error\)](<#NewDynamoDBAdapter>)
  - [func \(a \*DynamoDBAdapter\) Client\(\) \*dynamodb.Client](<#DynamoDBAdapter.Client>)
  - [func \(a \*DynamoDBAdapter\) Close\(\) error](<#DynamoDBAdapter.Close>)
  - [func \(a \*DynamoDBAdapter\) DeleteItem\(ctx context.Context, input \*dynamodb.DeleteItemInput\) \(\*dynamodb.DeleteItemOutput, error\)](<#DynamoDBAdapter.DeleteItem>)
  - [func \(a \*DynamoDBAdapter\) GetItem\(ctx context.Context, input \*dynamodb.GetItemInput\) \(\*dynamodb.GetItemOutput, error\)](<#DynamoDBAdapter.GetItem>)
  - [func \(a \*DynamoDBAdapter\) HealthCheck\(ctx context.Context\) error](<#DynamoDBAdapter.HealthCheck>)
  - [func \(a \*DynamoDBAdapter\) Ping\(ctx context.Context\) error](<#DynamoDBAdapter.Ping>)
  - [func \(a \*DynamoDBAdapter\) PutItem\(ctx context.Context, input \*dynamodb.PutItemInput\) \(\*dynamodb.PutItemOutput, error\)](<#DynamoDBAdapter.PutItem>)
  - [func \(a \*DynamoDBAdapter\) Query\(ctx context.Context, input \*dynamodb.QueryInput\) \(\*dynamodb.QueryOutput, error\)](<#DynamoDBAdapter.Query>)
  - [func \(a \*DynamoDBAdapter\) UpdateItem\(ctx context.Context, input \*dynamodb.UpdateItemInput\) \(\*dynamodb.UpdateItemOutput, error\)](<#DynamoDBAdapter.UpdateItem>)


<a name="IsThrottlingError"></a>
## func IsThrottlingError

```go
func IsThrottlingError(err error) bool
```

IsThrottlingError returns true if the error is a DynamoDB throttling error.

<a name="Config"></a>
## type Config

Config holds DynamoDB adapter configuration.

```go
type Config struct {
    Region           string
    Endpoint         string
    AccessKeyID      string
    SecretAccessKey  string
    SessionToken     string
    OperationTimeout time.Duration
}
```

<a name="DynamoDBAdapter"></a>
## type DynamoDBAdapter

DynamoDBAdapter provides DynamoDB connectivity.

```go
type DynamoDBAdapter struct {
    // contains filtered or unexported fields
}
```

<a name="NewDynamoDBAdapter"></a>
### func NewDynamoDBAdapter

```go
func NewDynamoDBAdapter(cfg Config, log logger.Logger) (*DynamoDBAdapter, error)
```

Cosa fa: costruisce client DynamoDB \(AWS SDK v2\) con supporto endpoint custom. Cosa NON fa: non crea tabelle o throughput policy. Esempio minimo: adapter, err := dynamodb.NewDynamoDBAdapter\(cfg, log\)

<a name="DynamoDBAdapter.Client"></a>
### func \(\*DynamoDBAdapter\) Client

```go
func (a *DynamoDBAdapter) Client() *dynamodb.Client
```

Client returns the underlying DynamoDB client for advanced operations.

<a name="DynamoDBAdapter.Close"></a>
### func \(\*DynamoDBAdapter\) Close

```go
func (a *DynamoDBAdapter) Close() error
```

Close releases all resources held by this instance. Should be called when the instance is no longer needed.

<a name="DynamoDBAdapter.DeleteItem"></a>
### func \(\*DynamoDBAdapter\) DeleteItem

```go
func (a *DynamoDBAdapter) DeleteItem(ctx context.Context, input *dynamodb.DeleteItemInput) (*dynamodb.DeleteItemOutput, error)
```

DeleteItem removes an item from the table.

<a name="DynamoDBAdapter.GetItem"></a>
### func \(\*DynamoDBAdapter\) GetItem

```go
func (a *DynamoDBAdapter) GetItem(ctx context.Context, input *dynamodb.GetItemInput) (*dynamodb.GetItemOutput, error)
```

GetItem retrieves an item by its primary key.

<a name="DynamoDBAdapter.HealthCheck"></a>
### func \(\*DynamoDBAdapter\) HealthCheck

```go
func (a *DynamoDBAdapter) HealthCheck(ctx context.Context) error
```

HealthCheck verifies the component is operational and can perform its intended function.

<a name="DynamoDBAdapter.Ping"></a>
### func \(\*DynamoDBAdapter\) Ping

```go
func (a *DynamoDBAdapter) Ping(ctx context.Context) error
```

Ping performs a basic connectivity check to verify the service is reachable.

<a name="DynamoDBAdapter.PutItem"></a>
### func \(\*DynamoDBAdapter\) PutItem

```go
func (a *DynamoDBAdapter) PutItem(ctx context.Context, input *dynamodb.PutItemInput) (*dynamodb.PutItemOutput, error)
```

PutItem creates or replaces an item in the table.

<a name="DynamoDBAdapter.Query"></a>
### func \(\*DynamoDBAdapter\) Query

```go
func (a *DynamoDBAdapter) Query(ctx context.Context, input *dynamodb.QueryInput) (*dynamodb.QueryOutput, error)
```

Query retrieves a URL query parameter by name.

<a name="DynamoDBAdapter.UpdateItem"></a>
### func \(\*DynamoDBAdapter\) UpdateItem

```go
func (a *DynamoDBAdapter) UpdateItem(ctx context.Context, input *dynamodb.UpdateItemInput) (*dynamodb.UpdateItemOutput, error)
```

UpdateItem modifies attributes of an existing item.

# memcached

```go
import "github.com/nimburion/nimburion/pkg/store/memcached"
```

## Index

- [type Adapter](<#Adapter>)
  - [func NewMemcachedAdapter\(addresses \[\]string, timeout time.Duration\) \(\*Adapter, error\)](<#NewMemcachedAdapter>)
  - [func \(c \*Adapter\) Close\(\) error](<#Adapter.Close>)
  - [func \(c \*Adapter\) Delete\(ctx context.Context, key string\) error](<#Adapter.Delete>)
  - [func \(c \*Adapter\) Get\(ctx context.Context, key string\) \(\[\]byte, error\)](<#Adapter.Get>)
  - [func \(c \*Adapter\) Set\(ctx context.Context, key string, value \[\]byte, ttl time.Duration\) error](<#Adapter.Set>)
  - [func \(c \*Adapter\) Touch\(ctx context.Context, key string, ttl time.Duration\) error](<#Adapter.Touch>)


<a name="Adapter"></a>
## type Adapter

Adapter is a lightweight Memcached text\-protocol adapter.

```go
type Adapter struct {
    // contains filtered or unexported fields
}
```

<a name="NewMemcachedAdapter"></a>
### func NewMemcachedAdapter

```go
func NewMemcachedAdapter(addresses []string, timeout time.Duration) (*Adapter, error)
```

NewMemcachedAdapter creates a concrete memcached adapter using TCP text protocol.

<a name="Adapter.Close"></a>
### func \(\*Adapter\) Close

```go
func (c *Adapter) Close() error
```

Close closes the client \(no\-op: each operation uses short\-lived TCP connection\).

<a name="Adapter.Delete"></a>
### func \(\*Adapter\) Delete

```go
func (c *Adapter) Delete(ctx context.Context, key string) error
```

Delete removes a value by key.

<a name="Adapter.Get"></a>
### func \(\*Adapter\) Get

```go
func (c *Adapter) Get(ctx context.Context, key string) ([]byte, error)
```

Get fetches a value by key.

<a name="Adapter.Set"></a>
### func \(\*Adapter\) Set

```go
func (c *Adapter) Set(ctx context.Context, key string, value []byte, ttl time.Duration) error
```

Set stores a value with TTL.

<a name="Adapter.Touch"></a>
### func \(\*Adapter\) Touch

```go
func (c *Adapter) Touch(ctx context.Context, key string, ttl time.Duration) error
```

Touch refreshes TTL for an existing key.

# mongodb

```go
import "github.com/nimburion/nimburion/pkg/store/mongodb"
```

## Index

- [type Config](<#Config>)
- [type MongoDBAdapter](<#MongoDBAdapter>)
  - [func NewMongoDBAdapter\(cfg Config, log logger.Logger\) \(\*MongoDBAdapter, error\)](<#NewMongoDBAdapter>)
  - [func \(a \*MongoDBAdapter\) Client\(\) \*mongo.Client](<#MongoDBAdapter.Client>)
  - [func \(a \*MongoDBAdapter\) Close\(\) error](<#MongoDBAdapter.Close>)
  - [func \(a \*MongoDBAdapter\) Collection\(name string\) \*mongo.Collection](<#MongoDBAdapter.Collection>)
  - [func \(a \*MongoDBAdapter\) Database\(\) \*mongo.Database](<#MongoDBAdapter.Database>)
  - [func \(a \*MongoDBAdapter\) DeleteOne\(ctx context.Context, collection string, filter interface\{\}\) \(\*mongo.DeleteResult, error\)](<#MongoDBAdapter.DeleteOne>)
  - [func \(a \*MongoDBAdapter\) EnsureCollection\(ctx context.Context, name string\) error](<#MongoDBAdapter.EnsureCollection>)
  - [func \(a \*MongoDBAdapter\) FindOne\(ctx context.Context, collection string, filter interface\{\}, result interface\{\}\) error](<#MongoDBAdapter.FindOne>)
  - [func \(a \*MongoDBAdapter\) HealthCheck\(ctx context.Context\) error](<#MongoDBAdapter.HealthCheck>)
  - [func \(a \*MongoDBAdapter\) InsertOne\(ctx context.Context, collection string, doc interface\{\}\) \(\*mongo.InsertOneResult, error\)](<#MongoDBAdapter.InsertOne>)
  - [func \(a \*MongoDBAdapter\) Ping\(ctx context.Context\) error](<#MongoDBAdapter.Ping>)
  - [func \(a \*MongoDBAdapter\) UpdateOne\(ctx context.Context, collection string, filter, update interface\{\}\) \(\*mongo.UpdateResult, error\)](<#MongoDBAdapter.UpdateOne>)


<a name="Config"></a>
## type Config

Config holds MongoDB adapter configuration.

```go
type Config struct {
    URL              string
    Database         string
    ConnectTimeout   time.Duration
    OperationTimeout time.Duration
}
```

<a name="MongoDBAdapter"></a>
## type MongoDBAdapter

MongoDBAdapter provides MongoDB connectivity.

```go
type MongoDBAdapter struct {
    // contains filtered or unexported fields
}
```

<a name="NewMongoDBAdapter"></a>
### func NewMongoDBAdapter

```go
func NewMongoDBAdapter(cfg Config, log logger.Logger) (*MongoDBAdapter, error)
```

Cosa fa: inizializza un adapter MongoDB e verifica connettività via ping. Cosa NON fa: non crea indici o collezioni automaticamente. Esempio minimo: adapter, err := mongodb.NewMongoDBAdapter\(cfg, log\)

<a name="MongoDBAdapter.Client"></a>
### func \(\*MongoDBAdapter\) Client

```go
func (a *MongoDBAdapter) Client() *mongo.Client
```

Client returns the underlying MongoDB client for advanced operations.

<a name="MongoDBAdapter.Close"></a>
### func \(\*MongoDBAdapter\) Close

```go
func (a *MongoDBAdapter) Close() error
```

Close releases all resources held by this instance. Should be called when the instance is no longer needed.

<a name="MongoDBAdapter.Collection"></a>
### func \(\*MongoDBAdapter\) Collection

```go
func (a *MongoDBAdapter) Collection(name string) *mongo.Collection
```

Collection returns a MongoDB collection by name.

<a name="MongoDBAdapter.Database"></a>
### func \(\*MongoDBAdapter\) Database

```go
func (a *MongoDBAdapter) Database() *mongo.Database
```

Database returns the MongoDB database instance.

<a name="MongoDBAdapter.DeleteOne"></a>
### func \(\*MongoDBAdapter\) DeleteOne

```go
func (a *MongoDBAdapter) DeleteOne(ctx context.Context, collection string, filter interface{}) (*mongo.DeleteResult, error)
```

DeleteOne deletes a single document matching the filter.

<a name="MongoDBAdapter.EnsureCollection"></a>
### func \(\*MongoDBAdapter\) EnsureCollection

```go
func (a *MongoDBAdapter) EnsureCollection(ctx context.Context, name string) error
```

EnsureCollection creates the collection if it does not exist.

<a name="MongoDBAdapter.FindOne"></a>
### func \(\*MongoDBAdapter\) FindOne

```go
func (a *MongoDBAdapter) FindOne(ctx context.Context, collection string, filter interface{}, result interface{}) error
```

FindOne finds a single document matching the filter.

<a name="MongoDBAdapter.HealthCheck"></a>
### func \(\*MongoDBAdapter\) HealthCheck

```go
func (a *MongoDBAdapter) HealthCheck(ctx context.Context) error
```

HealthCheck verifies the component is operational and can perform its intended function.

<a name="MongoDBAdapter.InsertOne"></a>
### func \(\*MongoDBAdapter\) InsertOne

```go
func (a *MongoDBAdapter) InsertOne(ctx context.Context, collection string, doc interface{}) (*mongo.InsertOneResult, error)
```

Cosa fa: inserisce un documento nella collection target. Cosa NON fa: non valida lo schema del documento. Esempio minimo: \_, err := adapter.InsertOne\(ctx, "users", doc\)

<a name="MongoDBAdapter.Ping"></a>
### func \(\*MongoDBAdapter\) Ping

```go
func (a *MongoDBAdapter) Ping(ctx context.Context) error
```

Ping performs a basic connectivity check to verify the service is reachable.

<a name="MongoDBAdapter.UpdateOne"></a>
### func \(\*MongoDBAdapter\) UpdateOne

```go
func (a *MongoDBAdapter) UpdateOne(ctx context.Context, collection string, filter, update interface{}) (*mongo.UpdateResult, error)
```

UpdateOne updates a single document matching the filter.

# mysql

```go
import "github.com/nimburion/nimburion/pkg/store/mysql"
```

## Index

- [func GetTx\(ctx context.Context\) \(\*sql.Tx, bool\)](<#GetTx>)
- [type Config](<#Config>)
- [type MySQLAdapter](<#MySQLAdapter>)
  - [func NewMySQLAdapter\(cfg Config, log logger.Logger\) \(\*MySQLAdapter, error\)](<#NewMySQLAdapter>)
  - [func \(a \*MySQLAdapter\) Close\(\) error](<#MySQLAdapter.Close>)
  - [func \(a \*MySQLAdapter\) DB\(\) \*sql.DB](<#MySQLAdapter.DB>)
  - [func \(a \*MySQLAdapter\) ExecContext\(ctx context.Context, query string, args ...interface\{\}\) \(sql.Result, error\)](<#MySQLAdapter.ExecContext>)
  - [func \(a \*MySQLAdapter\) HealthCheck\(ctx context.Context\) error](<#MySQLAdapter.HealthCheck>)
  - [func \(a \*MySQLAdapter\) Ping\(ctx context.Context\) error](<#MySQLAdapter.Ping>)
  - [func \(a \*MySQLAdapter\) QueryContext\(ctx context.Context, query string, args ...interface\{\}\) \(\*sql.Rows, error\)](<#MySQLAdapter.QueryContext>)
  - [func \(a \*MySQLAdapter\) QueryRowContext\(ctx context.Context, query string, args ...interface\{\}\) \*sql.Row](<#MySQLAdapter.QueryRowContext>)
  - [func \(a \*MySQLAdapter\) WithTransaction\(ctx context.Context, fn func\(context.Context\) error\) error](<#MySQLAdapter.WithTransaction>)


<a name="GetTx"></a>
## func GetTx

```go
func GetTx(ctx context.Context) (*sql.Tx, bool)
```

GetTx returns the current transaction or nil if not in a transaction.

<a name="Config"></a>
## type Config

Config holds MySQL configuration.

```go
type Config struct {
    URL             string
    MaxOpenConns    int
    MaxIdleConns    int
    ConnMaxLifetime time.Duration
    ConnMaxIdleTime time.Duration
    QueryTimeout    time.Duration
}
```

<a name="MySQLAdapter"></a>
## type MySQLAdapter

MySQLAdapter provides MySQL connectivity with pooled connections.

```go
type MySQLAdapter struct {
    // contains filtered or unexported fields
}
```

<a name="NewMySQLAdapter"></a>
### func NewMySQLAdapter

```go
func NewMySQLAdapter(cfg Config, log logger.Logger) (*MySQLAdapter, error)
```

Cosa fa: inizializza un adapter MySQL con validazione e ping iniziale. Cosa NON fa: non esegue migrazioni schema né provisioning database. Esempio minimo: adapter, err := mysql.NewMySQLAdapter\(cfg, log\)

<a name="MySQLAdapter.Close"></a>
### func \(\*MySQLAdapter\) Close

```go
func (a *MySQLAdapter) Close() error
```

Close releases all resources held by this instance. Should be called when the instance is no longer needed.

<a name="MySQLAdapter.DB"></a>
### func \(\*MySQLAdapter\) DB

```go
func (a *MySQLAdapter) DB() *sql.DB
```

DB returns the underlying sql.DB for advanced operations.

<a name="MySQLAdapter.ExecContext"></a>
### func \(\*MySQLAdapter\) ExecContext

```go
func (a *MySQLAdapter) ExecContext(ctx context.Context, query string, args ...interface{}) (sql.Result, error)
```

ExecContext executes a query without returning rows.

<a name="MySQLAdapter.HealthCheck"></a>
### func \(\*MySQLAdapter\) HealthCheck

```go
func (a *MySQLAdapter) HealthCheck(ctx context.Context) error
```

HealthCheck verifies the component is operational and can perform its intended function.

<a name="MySQLAdapter.Ping"></a>
### func \(\*MySQLAdapter\) Ping

```go
func (a *MySQLAdapter) Ping(ctx context.Context) error
```

Ping performs a basic connectivity check to verify the service is reachable.

<a name="MySQLAdapter.QueryContext"></a>
### func \(\*MySQLAdapter\) QueryContext

```go
func (a *MySQLAdapter) QueryContext(ctx context.Context, query string, args ...interface{}) (*sql.Rows, error)
```

QueryContext executes a query that returns rows.

<a name="MySQLAdapter.QueryRowContext"></a>
### func \(\*MySQLAdapter\) QueryRowContext

```go
func (a *MySQLAdapter) QueryRowContext(ctx context.Context, query string, args ...interface{}) *sql.Row
```

QueryRowContext executes a query that returns at most one row.

<a name="MySQLAdapter.WithTransaction"></a>
### func \(\*MySQLAdapter\) WithTransaction

```go
func (a *MySQLAdapter) WithTransaction(ctx context.Context, fn func(context.Context) error) error
```

Cosa fa: esegue fn in transazione con commit/rollback automatici. Cosa NON fa: non gestisce retry applicativi su deadlock o timeout. Esempio minimo: err := adapter.WithTransaction\(ctx, func\(txCtx context.Context\) error \{ return nil \}\)

# opensearch

```go
import "github.com/nimburion/nimburion/pkg/store/opensearch"
```

## Index

- [type Config](<#Config>)
- [type ElasticsearchSDKAdapter](<#ElasticsearchSDKAdapter>)
  - [func NewElasticsearchSDKAdapter\(cfg Config, log logger.Logger\) \(\*ElasticsearchSDKAdapter, error\)](<#NewElasticsearchSDKAdapter>)
  - [func \(a \*ElasticsearchSDKAdapter\) Close\(\) error](<#ElasticsearchSDKAdapter.Close>)
  - [func \(a \*ElasticsearchSDKAdapter\) HealthCheck\(ctx context.Context\) error](<#ElasticsearchSDKAdapter.HealthCheck>)
- [type OpenSearchAdapter](<#OpenSearchAdapter>)
  - [func NewOpenSearchAdapter\(cfg Config, log logger.Logger\) \(\*OpenSearchAdapter, error\)](<#NewOpenSearchAdapter>)
  - [func \(a \*OpenSearchAdapter\) Close\(\) error](<#OpenSearchAdapter.Close>)
  - [func \(a \*OpenSearchAdapter\) DeleteDocument\(ctx context.Context, index, id string\) error](<#OpenSearchAdapter.DeleteDocument>)
  - [func \(a \*OpenSearchAdapter\) HealthCheck\(ctx context.Context\) error](<#OpenSearchAdapter.HealthCheck>)
  - [func \(a \*OpenSearchAdapter\) IndexDocument\(ctx context.Context, index, id string, document interface\{\}\) error](<#OpenSearchAdapter.IndexDocument>)
  - [func \(a \*OpenSearchAdapter\) Ping\(ctx context.Context\) error](<#OpenSearchAdapter.Ping>)
  - [func \(a \*OpenSearchAdapter\) Search\(ctx context.Context, index string, query interface\{\}\) \(json.RawMessage, error\)](<#OpenSearchAdapter.Search>)
- [type OpenSearchSDKAdapter](<#OpenSearchSDKAdapter>)
  - [func NewOpenSearchSDKAdapter\(cfg Config, log logger.Logger\) \(\*OpenSearchSDKAdapter, error\)](<#NewOpenSearchSDKAdapter>)
  - [func \(a \*OpenSearchSDKAdapter\) Close\(\) error](<#OpenSearchSDKAdapter.Close>)
  - [func \(a \*OpenSearchSDKAdapter\) HealthCheck\(ctx context.Context\) error](<#OpenSearchSDKAdapter.HealthCheck>)


<a name="Config"></a>
## type Config

Config holds OpenSearch/Elasticsearch adapter configuration.

```go
type Config struct {
    URL              string
    URLs             []string
    Username         string
    Password         string
    APIKey           string
    AWSAuthEnabled   bool
    AWSRegion        string
    AWSService       string
    AWSAccessKeyID   string
    AWSSecretKey     string
    AWSSessionToken  string
    MaxConns         int
    OperationTimeout time.Duration
}
```

<a name="ElasticsearchSDKAdapter"></a>
## type ElasticsearchSDKAdapter

ElasticsearchSDKAdapter is available when built with the \`elasticsearch\_sdk\` tag.

```go
type ElasticsearchSDKAdapter struct{}
```

<a name="NewElasticsearchSDKAdapter"></a>
### func NewElasticsearchSDKAdapter

```go
func NewElasticsearchSDKAdapter(cfg Config, log logger.Logger) (*ElasticsearchSDKAdapter, error)
```

NewElasticsearchSDKAdapter returns an explanatory error when SDK support is not compiled in.

<a name="ElasticsearchSDKAdapter.Close"></a>
### func \(\*ElasticsearchSDKAdapter\) Close

```go
func (a *ElasticsearchSDKAdapter) Close() error
```

Close releases all resources held by this instance. Should be called when the instance is no longer needed.

<a name="ElasticsearchSDKAdapter.HealthCheck"></a>
### func \(\*ElasticsearchSDKAdapter\) HealthCheck

```go
func (a *ElasticsearchSDKAdapter) HealthCheck(ctx context.Context) error
```

HealthCheck verifies the component is operational and can perform its intended function.

<a name="OpenSearchAdapter"></a>
## type OpenSearchAdapter

OpenSearchAdapter provides OpenSearch/Elasticsearch connectivity.

```go
type OpenSearchAdapter struct {
    // contains filtered or unexported fields
}
```

<a name="NewOpenSearchAdapter"></a>
### func NewOpenSearchAdapter

```go
func NewOpenSearchAdapter(cfg Config, log logger.Logger) (*OpenSearchAdapter, error)
```

NewOpenSearchAdapter creates a new OpenSearch/Elasticsearch adapter.

<a name="OpenSearchAdapter.Close"></a>
### func \(\*OpenSearchAdapter\) Close

```go
func (a *OpenSearchAdapter) Close() error
```

Close gracefully closes idle HTTP connections.

<a name="OpenSearchAdapter.DeleteDocument"></a>
### func \(\*OpenSearchAdapter\) DeleteDocument

```go
func (a *OpenSearchAdapter) DeleteDocument(ctx context.Context, index, id string) error
```

DeleteDocument deletes a document by ID.

<a name="OpenSearchAdapter.HealthCheck"></a>
### func \(\*OpenSearchAdapter\) HealthCheck

```go
func (a *OpenSearchAdapter) HealthCheck(ctx context.Context) error
```

HealthCheck verifies the OpenSearch/Elasticsearch cluster is healthy.

<a name="OpenSearchAdapter.IndexDocument"></a>
### func \(\*OpenSearchAdapter\) IndexDocument

```go
func (a *OpenSearchAdapter) IndexDocument(ctx context.Context, index, id string, document interface{}) error
```

IndexDocument upserts a JSON document in the target index by ID.

<a name="OpenSearchAdapter.Ping"></a>
### func \(\*OpenSearchAdapter\) Ping

```go
func (a *OpenSearchAdapter) Ping(ctx context.Context) error
```

Ping verifies the OpenSearch/Elasticsearch connection is alive.

<a name="OpenSearchAdapter.Search"></a>
### func \(\*OpenSearchAdapter\) Search

```go
func (a *OpenSearchAdapter) Search(ctx context.Context, index string, query interface{}) (json.RawMessage, error)
```

Search executes a JSON query and returns the raw JSON response.

<a name="OpenSearchSDKAdapter"></a>
## type OpenSearchSDKAdapter

OpenSearchSDKAdapter is available when built with the \`opensearch\_sdk\` tag.

```go
type OpenSearchSDKAdapter struct{}
```

<a name="NewOpenSearchSDKAdapter"></a>
### func NewOpenSearchSDKAdapter

```go
func NewOpenSearchSDKAdapter(cfg Config, log logger.Logger) (*OpenSearchSDKAdapter, error)
```

NewOpenSearchSDKAdapter returns an explanatory error when SDK support is not compiled in.

<a name="OpenSearchSDKAdapter.Close"></a>
### func \(\*OpenSearchSDKAdapter\) Close

```go
func (a *OpenSearchSDKAdapter) Close() error
```

Close releases all resources held by this instance. Should be called when the instance is no longer needed.

<a name="OpenSearchSDKAdapter.HealthCheck"></a>
### func \(\*OpenSearchSDKAdapter\) HealthCheck

```go
func (a *OpenSearchSDKAdapter) HealthCheck(ctx context.Context) error
```

HealthCheck verifies the component is operational and can perform its intended function.

# postgres

```go
import "github.com/nimburion/nimburion/pkg/store/postgres"
```

## Index

- [func GetTx\(ctx context.Context\) \(\*sql.Tx, bool\)](<#GetTx>)
- [type Config](<#Config>)
- [type PostgreSQLAdapter](<#PostgreSQLAdapter>)
  - [func NewPostgreSQLAdapter\(cfg Config, log logger.Logger\) \(\*PostgreSQLAdapter, error\)](<#NewPostgreSQLAdapter>)
  - [func \(a \*PostgreSQLAdapter\) Close\(\) error](<#PostgreSQLAdapter.Close>)
  - [func \(a \*PostgreSQLAdapter\) DB\(\) \*sql.DB](<#PostgreSQLAdapter.DB>)
  - [func \(a \*PostgreSQLAdapter\) ExecContext\(ctx context.Context, query string, args ...interface\{\}\) \(sql.Result, error\)](<#PostgreSQLAdapter.ExecContext>)
  - [func \(a \*PostgreSQLAdapter\) HealthCheck\(ctx context.Context\) error](<#PostgreSQLAdapter.HealthCheck>)
  - [func \(a \*PostgreSQLAdapter\) Ping\(ctx context.Context\) error](<#PostgreSQLAdapter.Ping>)
  - [func \(a \*PostgreSQLAdapter\) QueryContext\(ctx context.Context, query string, args ...interface\{\}\) \(\*sql.Rows, error\)](<#PostgreSQLAdapter.QueryContext>)
  - [func \(a \*PostgreSQLAdapter\) QueryRowContext\(ctx context.Context, query string, args ...interface\{\}\) \*sql.Row](<#PostgreSQLAdapter.QueryRowContext>)
  - [func \(a \*PostgreSQLAdapter\) WithTransaction\(ctx context.Context, fn func\(ctx context.Context\) error\) error](<#PostgreSQLAdapter.WithTransaction>)


<a name="GetTx"></a>
## func GetTx

```go
func GetTx(ctx context.Context) (*sql.Tx, bool)
```

GetTx extracts a transaction from the context, if present This allows nested operations to use the same transaction

<a name="Config"></a>
## type Config

Config holds PostgreSQL connection configuration

```go
type Config struct {
    URL             string
    MaxOpenConns    int
    MaxIdleConns    int
    ConnMaxLifetime time.Duration
    ConnMaxIdleTime time.Duration
    QueryTimeout    time.Duration
}
```

<a name="PostgreSQLAdapter"></a>
## type PostgreSQLAdapter

PostgreSQLAdapter provides PostgreSQL database connectivity with connection pooling

```go
type PostgreSQLAdapter struct {
    // contains filtered or unexported fields
}
```

<a name="NewPostgreSQLAdapter"></a>
### func NewPostgreSQLAdapter

```go
func NewPostgreSQLAdapter(cfg Config, log logger.Logger) (*PostgreSQLAdapter, error)
```

NewPostgreSQLAdapter creates a new PostgreSQL adapter with connection pooling

<a name="PostgreSQLAdapter.Close"></a>
### func \(\*PostgreSQLAdapter\) Close

```go
func (a *PostgreSQLAdapter) Close() error
```

Close gracefully closes the database connection

<a name="PostgreSQLAdapter.DB"></a>
### func \(\*PostgreSQLAdapter\) DB

```go
func (a *PostgreSQLAdapter) DB() *sql.DB
```

DB returns the underlying \*sql.DB for direct access when needed

<a name="PostgreSQLAdapter.ExecContext"></a>
### func \(\*PostgreSQLAdapter\) ExecContext

```go
func (a *PostgreSQLAdapter) ExecContext(ctx context.Context, query string, args ...interface{}) (sql.Result, error)
```

ExecContext executes a query with the transaction from context if available Otherwise uses the regular database connection

<a name="PostgreSQLAdapter.HealthCheck"></a>
### func \(\*PostgreSQLAdapter\) HealthCheck

```go
func (a *PostgreSQLAdapter) HealthCheck(ctx context.Context) error
```

HealthCheck verifies the database connection is healthy with a timeout

<a name="PostgreSQLAdapter.Ping"></a>
### func \(\*PostgreSQLAdapter\) Ping

```go
func (a *PostgreSQLAdapter) Ping(ctx context.Context) error
```

Ping verifies the database connection is alive

<a name="PostgreSQLAdapter.QueryContext"></a>
### func \(\*PostgreSQLAdapter\) QueryContext

```go
func (a *PostgreSQLAdapter) QueryContext(ctx context.Context, query string, args ...interface{}) (*sql.Rows, error)
```

QueryContext executes a query with the transaction from context if available Otherwise uses the regular database connection

<a name="PostgreSQLAdapter.QueryRowContext"></a>
### func \(\*PostgreSQLAdapter\) QueryRowContext

```go
func (a *PostgreSQLAdapter) QueryRowContext(ctx context.Context, query string, args ...interface{}) *sql.Row
```

QueryRowContext executes a query that returns a single row with the transaction from context if available Otherwise uses the regular database connection

<a name="PostgreSQLAdapter.WithTransaction"></a>
### func \(\*PostgreSQLAdapter\) WithTransaction

```go
func (a *PostgreSQLAdapter) WithTransaction(ctx context.Context, fn func(ctx context.Context) error) error
```

WithTransaction executes the given function within a database transaction If the function returns an error, the transaction is rolled back Otherwise, the transaction is committed

# redis

```go
import "github.com/nimburion/nimburion/pkg/store/redis"
```

## Index

- [type Config](<#Config>)
- [type RedisAdapter](<#RedisAdapter>)
  - [func NewRedisAdapter\(cfg Config, log logger.Logger\) \(\*RedisAdapter, error\)](<#NewRedisAdapter>)
  - [func \(a \*RedisAdapter\) Client\(\) \*redis.Client](<#RedisAdapter.Client>)
  - [func \(a \*RedisAdapter\) Close\(\) error](<#RedisAdapter.Close>)
  - [func \(a \*RedisAdapter\) Decr\(ctx context.Context, key string\) \(int64, error\)](<#RedisAdapter.Decr>)
  - [func \(a \*RedisAdapter\) DecrBy\(ctx context.Context, key string, value int64\) \(int64, error\)](<#RedisAdapter.DecrBy>)
  - [func \(a \*RedisAdapter\) Delete\(ctx context.Context, keys ...string\) error](<#RedisAdapter.Delete>)
  - [func \(a \*RedisAdapter\) Get\(ctx context.Context, key string\) \(string, error\)](<#RedisAdapter.Get>)
  - [func \(a \*RedisAdapter\) HealthCheck\(ctx context.Context\) error](<#RedisAdapter.HealthCheck>)
  - [func \(a \*RedisAdapter\) Incr\(ctx context.Context, key string\) \(int64, error\)](<#RedisAdapter.Incr>)
  - [func \(a \*RedisAdapter\) IncrBy\(ctx context.Context, key string, value int64\) \(int64, error\)](<#RedisAdapter.IncrBy>)
  - [func \(a \*RedisAdapter\) Ping\(ctx context.Context\) error](<#RedisAdapter.Ping>)
  - [func \(a \*RedisAdapter\) Set\(ctx context.Context, key string, value interface\{\}\) error](<#RedisAdapter.Set>)
  - [func \(a \*RedisAdapter\) SetWithTTL\(ctx context.Context, key string, value interface\{\}, ttl time.Duration\) error](<#RedisAdapter.SetWithTTL>)


<a name="Config"></a>
## type Config

Config holds Redis connection configuration

```go
type Config struct {
    URL              string
    MaxConns         int
    OperationTimeout time.Duration
}
```

<a name="RedisAdapter"></a>
## type RedisAdapter

RedisAdapter provides Redis cache connectivity with connection pooling

```go
type RedisAdapter struct {
    // contains filtered or unexported fields
}
```

<a name="NewRedisAdapter"></a>
### func NewRedisAdapter

```go
func NewRedisAdapter(cfg Config, log logger.Logger) (*RedisAdapter, error)
```

NewRedisAdapter creates a new Redis adapter with connection pooling

<a name="RedisAdapter.Client"></a>
### func \(\*RedisAdapter\) Client

```go
func (a *RedisAdapter) Client() *redis.Client
```

Client returns the underlying \*redis.Client for direct access when needed

<a name="RedisAdapter.Close"></a>
### func \(\*RedisAdapter\) Close

```go
func (a *RedisAdapter) Close() error
```

Close gracefully closes the Redis connection

<a name="RedisAdapter.Decr"></a>
### func \(\*RedisAdapter\) Decr

```go
func (a *RedisAdapter) Decr(ctx context.Context, key string) (int64, error)
```

Decr atomically decrements the value of a key by 1

<a name="RedisAdapter.DecrBy"></a>
### func \(\*RedisAdapter\) DecrBy

```go
func (a *RedisAdapter) DecrBy(ctx context.Context, key string, value int64) (int64, error)
```

DecrBy atomically decrements the value of a key by the specified amount

<a name="RedisAdapter.Delete"></a>
### func \(\*RedisAdapter\) Delete

```go
func (a *RedisAdapter) Delete(ctx context.Context, keys ...string) error
```

Delete removes a key from Redis

<a name="RedisAdapter.Get"></a>
### func \(\*RedisAdapter\) Get

```go
func (a *RedisAdapter) Get(ctx context.Context, key string) (string, error)
```

Get retrieves a value from Redis by key

<a name="RedisAdapter.HealthCheck"></a>
### func \(\*RedisAdapter\) HealthCheck

```go
func (a *RedisAdapter) HealthCheck(ctx context.Context) error
```

HealthCheck verifies the Redis connection is healthy with a timeout

<a name="RedisAdapter.Incr"></a>
### func \(\*RedisAdapter\) Incr

```go
func (a *RedisAdapter) Incr(ctx context.Context, key string) (int64, error)
```

Incr atomically increments the value of a key by 1

<a name="RedisAdapter.IncrBy"></a>
### func \(\*RedisAdapter\) IncrBy

```go
func (a *RedisAdapter) IncrBy(ctx context.Context, key string, value int64) (int64, error)
```

IncrBy atomically increments the value of a key by the specified amount

<a name="RedisAdapter.Ping"></a>
### func \(\*RedisAdapter\) Ping

```go
func (a *RedisAdapter) Ping(ctx context.Context) error
```

Ping verifies the Redis connection is alive

<a name="RedisAdapter.Set"></a>
### func \(\*RedisAdapter\) Set

```go
func (a *RedisAdapter) Set(ctx context.Context, key string, value interface{}) error
```

Set stores a key\-value pair in Redis without expiration

<a name="RedisAdapter.SetWithTTL"></a>
### func \(\*RedisAdapter\) SetWithTTL

```go
func (a *RedisAdapter) SetWithTTL(ctx context.Context, key string, value interface{}, ttl time.Duration) error
```

SetWithTTL stores a key\-value pair in Redis with expiration

# s3

```go
import "github.com/nimburion/nimburion/pkg/store/s3"
```

## Index

- [type Config](<#Config>)
- [type ObjectInfo](<#ObjectInfo>)
- [type S3Adapter](<#S3Adapter>)
  - [func NewS3Adapter\(cfg Config, log logger.Logger\) \(\*S3Adapter, error\)](<#NewS3Adapter>)
  - [func \(a \*S3Adapter\) Close\(\) error](<#S3Adapter.Close>)
  - [func \(a \*S3Adapter\) Delete\(ctx context.Context, key string\) error](<#S3Adapter.Delete>)
  - [func \(a \*S3Adapter\) Download\(ctx context.Context, key string\) \(\[\]byte, string, error\)](<#S3Adapter.Download>)
  - [func \(a \*S3Adapter\) HealthCheck\(ctx context.Context\) error](<#S3Adapter.HealthCheck>)
  - [func \(a \*S3Adapter\) List\(ctx context.Context, prefix string, maxKeys int32\) \(\[\]ObjectInfo, error\)](<#S3Adapter.List>)
  - [func \(a \*S3Adapter\) Ping\(ctx context.Context\) error](<#S3Adapter.Ping>)
  - [func \(a \*S3Adapter\) PresignGetURL\(ctx context.Context, key string, expiry time.Duration\) \(string, error\)](<#S3Adapter.PresignGetURL>)
  - [func \(a \*S3Adapter\) Upload\(ctx context.Context, key string, body io.Reader, contentType string, metadata map\[string\]string\) \(string, error\)](<#S3Adapter.Upload>)
  - [func \(a \*S3Adapter\) UploadBytes\(ctx context.Context, key string, payload \[\]byte, contentType string, metadata map\[string\]string\) \(string, error\)](<#S3Adapter.UploadBytes>)


<a name="Config"></a>
## type Config

Config defines S3 adapter configuration.

```go
type Config struct {
    Bucket           string
    Region           string
    Endpoint         string
    AccessKeyID      string
    SecretAccessKey  string
    SessionToken     string
    UsePathStyle     bool
    OperationTimeout time.Duration
    PresignExpiry    time.Duration
}
```

<a name="ObjectInfo"></a>
## type ObjectInfo

ObjectInfo represents a minimal S3 object descriptor for list responses.

```go
type ObjectInfo struct {
    Key          string
    ETag         string
    Size         int64
    LastModified time.Time
}
```

<a name="S3Adapter"></a>
## type S3Adapter

S3Adapter provides object storage operations backed by AWS S3 API.

```go
type S3Adapter struct {
    // contains filtered or unexported fields
}
```

<a name="NewS3Adapter"></a>
### func NewS3Adapter

```go
func NewS3Adapter(cfg Config, log logger.Logger) (*S3Adapter, error)
```

NewS3Adapter creates a new S3 adapter and verifies bucket accessibility.

<a name="S3Adapter.Close"></a>
### func \(\*S3Adapter\) Close

```go
func (a *S3Adapter) Close() error
```

Close marks the adapter as closed.

<a name="S3Adapter.Delete"></a>
### func \(\*S3Adapter\) Delete

```go
func (a *S3Adapter) Delete(ctx context.Context, key string) error
```

Delete removes an object by key.

<a name="S3Adapter.Download"></a>
### func \(\*S3Adapter\) Download

```go
func (a *S3Adapter) Download(ctx context.Context, key string) ([]byte, string, error)
```

Download fetches an object payload and returns bytes \+ content type.

<a name="S3Adapter.HealthCheck"></a>
### func \(\*S3Adapter\) HealthCheck

```go
func (a *S3Adapter) HealthCheck(ctx context.Context) error
```

HealthCheck verifies the adapter can reach the bucket within a short timeout.

<a name="S3Adapter.List"></a>
### func \(\*S3Adapter\) List

```go
func (a *S3Adapter) List(ctx context.Context, prefix string, maxKeys int32) ([]ObjectInfo, error)
```

List returns object metadata for a prefix.

<a name="S3Adapter.Ping"></a>
### func \(\*S3Adapter\) Ping

```go
func (a *S3Adapter) Ping(ctx context.Context) error
```

Ping verifies that the configured bucket is accessible.

<a name="S3Adapter.PresignGetURL"></a>
### func \(\*S3Adapter\) PresignGetURL

```go
func (a *S3Adapter) PresignGetURL(ctx context.Context, key string, expiry time.Duration) (string, error)
```

PresignGetURL generates a temporary download URL.

<a name="S3Adapter.Upload"></a>
### func \(\*S3Adapter\) Upload

```go
func (a *S3Adapter) Upload(ctx context.Context, key string, body io.Reader, contentType string, metadata map[string]string) (string, error)
```

Upload stores an object and returns its ETag \(without quotes when present\).

<a name="S3Adapter.UploadBytes"></a>
### func \(\*S3Adapter\) UploadBytes

```go
func (a *S3Adapter) UploadBytes(ctx context.Context, key string, payload []byte, contentType string, metadata map[string]string) (string, error)
```

UploadBytes stores an object from an in\-memory byte slice.

Generated by [gomarkdoc](<https://github.com/princjef/gomarkdoc>)
