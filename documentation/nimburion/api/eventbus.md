---
layout: documentation
title: pkg/eventbus
---


# eventbus

```go
import "github.com/nimburion/nimburion/pkg/eventbus"
```

## Index

- [Constants](<#constants>)
- [Variables](<#variables>)
- [func ConsumeWithRetry\(ctx context.Context, consumerTopic string, message \*Message, handler MessageHandler, producer Producer, config RetryDLQConfig, log logger.Logger, metrics \*RetryDLQMetrics\) error](<#ConsumeWithRetry>)
- [func ExecuteTransactionalOutbox\(ctx context.Context, executor TransactionalOutboxExecutor, entry \*OutboxEntry, businessFn func\(ctx context.Context\) error\) error](<#ExecuteTransactionalOutbox>)
- [func NextAggregateVersion\(current int64\) \(int64, error\)](<#NextAggregateVersion>)
- [func PartitionKey\(tenantID, aggregateID string\) string](<#PartitionKey>)
- [func ProcessOnceTransactional\(ctx context.Context, executor ProcessedEventTxExecutor, consumerName, eventID string, handler func\(ctx context.Context\) error\) \(bool, error\)](<#ProcessOnceTransactional>)
- [type ActorType](<#ActorType>)
- [type AggregateVersionStore](<#AggregateVersionStore>)
- [type AggregateVersionTracker](<#AggregateVersionTracker>)
  - [func NewAggregateVersionTracker\(store AggregateVersionStore, log logger.Logger\) \(\*AggregateVersionTracker, error\)](<#NewAggregateVersionTracker>)
  - [func \(t \*AggregateVersionTracker\) CheckAndAdvance\(ctx context.Context, tenantID, aggregateID string, receivedVersion int64\) \(VersionCheck, error\)](<#AggregateVersionTracker.CheckAndAdvance>)
- [type Consumer](<#Consumer>)
- [type DLQPayload](<#DLQPayload>)
- [type DataClass](<#DataClass>)
- [type EventBus](<#EventBus>)
- [type EventEnvelope](<#EventEnvelope>)
  - [func DeserializeEventEnvelope\(data \[\]byte\) \(\*EventEnvelope, error\)](<#DeserializeEventEnvelope>)
  - [func EventEnvelopeFromMessage\(msg \*Message\) \(\*EventEnvelope, error\)](<#EventEnvelopeFromMessage>)
  - [func \(e \*EventEnvelope\) EnsurePartitionKey\(\)](<#EventEnvelope.EnsurePartitionKey>)
  - [func \(e \*EventEnvelope\) Serialize\(\) \(\[\]byte, error\)](<#EventEnvelope.Serialize>)
  - [func \(e \*EventEnvelope\) ToMessage\(\) \(\*Message, error\)](<#EventEnvelope.ToMessage>)
  - [func \(e \*EventEnvelope\) Validate\(\) error](<#EventEnvelope.Validate>)
- [type IdempotencyGuard](<#IdempotencyGuard>)
  - [func NewIdempotencyGuard\(store ProcessedEventStore\) \(\*IdempotencyGuard, error\)](<#NewIdempotencyGuard>)
  - [func \(g \*IdempotencyGuard\) ProcessOnce\(ctx context.Context, consumerName, eventID string, handler func\(ctx context.Context\) error\) \(bool, error\)](<#IdempotencyGuard.ProcessOnce>)
- [type JSONSerializer](<#JSONSerializer>)
  - [func NewJSONSerializer\(\) \*JSONSerializer](<#NewJSONSerializer>)
  - [func \(s \*JSONSerializer\) ContentType\(\) string](<#JSONSerializer.ContentType>)
  - [func \(s \*JSONSerializer\) Deserialize\(data \[\]byte, target interface\{\}\) error](<#JSONSerializer.Deserialize>)
  - [func \(s \*JSONSerializer\) Serialize\(v interface\{\}\) \(\[\]byte, error\)](<#JSONSerializer.Serialize>)
- [type Message](<#Message>)
- [type MessageHandler](<#MessageHandler>)
- [type OutboxEntry](<#OutboxEntry>)
  - [func \(e \*OutboxEntry\) Validate\(\) error](<#OutboxEntry.Validate>)
- [type OutboxMetrics](<#OutboxMetrics>)
  - [func NewOutboxMetrics\(registry \*prometheus.Registry, namespace string\) \(\*OutboxMetrics, error\)](<#NewOutboxMetrics>)
  - [func \(m \*OutboxMetrics\) IncFailed\(\)](<#OutboxMetrics.IncFailed>)
  - [func \(m \*OutboxMetrics\) IncPublished\(\)](<#OutboxMetrics.IncPublished>)
  - [func \(m \*OutboxMetrics\) Snapshot\(ctx context.Context, store OutboxStore, now time.Time\)](<#OutboxMetrics.Snapshot>)
- [type OutboxPublisher](<#OutboxPublisher>)
  - [func NewOutboxPublisher\(store OutboxStore, producer Producer, log logger.Logger, metrics \*OutboxMetrics, config OutboxPublisherConfig\) \(\*OutboxPublisher, error\)](<#NewOutboxPublisher>)
  - [func \(p \*OutboxPublisher\) Run\(ctx context.Context\) error](<#OutboxPublisher.Run>)
- [type OutboxPublisherConfig](<#OutboxPublisherConfig>)
- [type OutboxStore](<#OutboxStore>)
- [type OutboxWriter](<#OutboxWriter>)
- [type ProcessedEventStore](<#ProcessedEventStore>)
- [type ProcessedEventTxExecutor](<#ProcessedEventTxExecutor>)
- [type ProcessedEventTxStore](<#ProcessedEventTxStore>)
- [type ProcessedEventsCleaner](<#ProcessedEventsCleaner>)
  - [func NewProcessedEventsCleaner\(store ProcessedEventStore, config ProcessedEventsCleanerConfig\) \(\*ProcessedEventsCleaner, error\)](<#NewProcessedEventsCleaner>)
  - [func \(c \*ProcessedEventsCleaner\) Run\(ctx context.Context\) error](<#ProcessedEventsCleaner.Run>)
- [type ProcessedEventsCleanerConfig](<#ProcessedEventsCleanerConfig>)
- [type Producer](<#Producer>)
- [type ProtobufSerializer](<#ProtobufSerializer>)
  - [func NewProtobufSerializer\(\) \*ProtobufSerializer](<#NewProtobufSerializer>)
  - [func \(s \*ProtobufSerializer\) ContentType\(\) string](<#ProtobufSerializer.ContentType>)
  - [func \(s \*ProtobufSerializer\) Deserialize\(data \[\]byte, target interface\{\}\) error](<#ProtobufSerializer.Deserialize>)
  - [func \(s \*ProtobufSerializer\) Serialize\(v interface\{\}\) \(\[\]byte, error\)](<#ProtobufSerializer.Serialize>)
- [type RetryDLQConfig](<#RetryDLQConfig>)
- [type RetryDLQMetrics](<#RetryDLQMetrics>)
  - [func NewRetryDLQMetrics\(registry \*prometheus.Registry, namespace string\) \(\*RetryDLQMetrics, error\)](<#NewRetryDLQMetrics>)
  - [func \(m \*RetryDLQMetrics\) SetDLQHealth\(size, growthRate float64\)](<#RetryDLQMetrics.SetDLQHealth>)
- [type Serializer](<#Serializer>)
- [type TransactionalOutboxExecutor](<#TransactionalOutboxExecutor>)
- [type VersionCheck](<#VersionCheck>)
  - [func ValidateAggregateVersion\(lastSeenVersion, receivedVersion int64\) VersionCheck](<#ValidateAggregateVersion>)
- [type VersionStatus](<#VersionStatus>)


## Constants

<a name="DefaultProcessedEventsRetention"></a>

```go
const (
    DefaultProcessedEventsRetention = 30 * 24 * time.Hour
    DefaultProcessedEventsCleanup   = time.Hour
    DefaultProcessedEventsBatchSize = 1000
)
```

<a name="DefaultOutboxPollInterval"></a>

```go
const (
    DefaultOutboxPollInterval   = time.Second
    DefaultOutboxBatchSize      = 100
    DefaultOutboxCleanupEvery   = time.Minute
    DefaultOutboxCleanupRetain  = 7 * 24 * time.Hour
    DefaultOutboxInitialBackoff = time.Second
    DefaultOutboxMaxBackoff     = time.Minute
)
```

<a name="DefaultRetryMaxRetries"></a>

```go
const (
    DefaultRetryMaxRetries             = 5
    DefaultRetryInitialBackoff         = time.Second
    DefaultRetryMaxBackoff             = 60 * time.Second
    DefaultRetryAttemptTimeout         = 30 * time.Second
    DefaultRetryCircuitBreakerFailures = 5
    DefaultRetryCircuitBreakerReset    = 30 * time.Second
    DefaultDLQTopicSuffix              = ".dlq"
)
```

<a name="AggregateVersionColumnSQL"></a>

```go
const (
    // AggregateVersionColumnSQL is the SQL column definition to add optimistic aggregate versioning.
    AggregateVersionColumnSQL = "aggregate_version BIGINT NOT NULL DEFAULT 0"
)
```

<a name="CreateOutboxTablePostgres"></a>CreateOutboxTablePostgres defines a reference PostgreSQL schema for transactional outbox.

```go
const CreateOutboxTablePostgres = `
CREATE TABLE IF NOT EXISTS outbox (
  id TEXT PRIMARY KEY,
  topic TEXT NOT NULL,
  message_key TEXT NOT NULL,
  payload BYTEA NOT NULL,
  headers JSONB NOT NULL DEFAULT '{}'::jsonb,
  content_type TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  available_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  retry_count INTEGER NOT NULL DEFAULT 0,
  last_error TEXT
);

CREATE INDEX IF NOT EXISTS idx_outbox_pending ON outbox (published, available_at);
CREATE INDEX IF NOT EXISTS idx_outbox_created_at ON outbox (created_at);
`
```

<a name="CreateProcessedEventsTablePostgres"></a>CreateProcessedEventsTablePostgres defines a reference PostgreSQL schema for idempotency tracking.

```go
const CreateProcessedEventsTablePostgres = `
CREATE TABLE IF NOT EXISTS processed_events (
  consumer_name TEXT NOT NULL,
  event_id TEXT NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (consumer_name, event_id)
);

CREATE INDEX IF NOT EXISTS idx_processed_events_processed_at ON processed_events (processed_at);
`
```

<a name="EventEnvelopeContentType"></a>

```go
const (
    EventEnvelopeContentType = "application/json"
)
```

## Variables

<a name="ErrInvalidData"></a>Common serialization errors

```go
var (
    // ErrInvalidData is returned when the data cannot be serialized or deserialized
    ErrInvalidData = errors.New("invalid data for serialization")

    // ErrUnsupportedType is returned when the type is not supported by the serializer
    ErrUnsupportedType = errors.New("unsupported type for serialization")
)
```

<a name="ConsumeWithRetry"></a>
## func ConsumeWithRetry

```go
func ConsumeWithRetry(ctx context.Context, consumerTopic string, message *Message, handler MessageHandler, producer Producer, config RetryDLQConfig, log logger.Logger, metrics *RetryDLQMetrics) error
```

ConsumeWithRetry runs a message handler with retries, exponential backoff and DLQ fallback.

<a name="ExecuteTransactionalOutbox"></a>
## func ExecuteTransactionalOutbox

```go
func ExecuteTransactionalOutbox(ctx context.Context, executor TransactionalOutboxExecutor, entry *OutboxEntry, businessFn func(ctx context.Context) error) error
```

ExecuteTransactionalOutbox applies business changes and outbox insert atomically through the provided transaction executor.

<a name="NextAggregateVersion"></a>
## func NextAggregateVersion

```go
func NextAggregateVersion(current int64) (int64, error)
```

NextAggregateVersion increments an aggregate version for producer\-side event emission.

<a name="PartitionKey"></a>
## func PartitionKey

```go
func PartitionKey(tenantID, aggregateID string) string
```

PartitionKey returns the stable partition key for ordering guarantees.

<a name="ProcessOnceTransactional"></a>
## func ProcessOnceTransactional

```go
func ProcessOnceTransactional(ctx context.Context, executor ProcessedEventTxExecutor, consumerName, eventID string, handler func(ctx context.Context) error) (bool, error)
```

ProcessOnceTransactional executes business logic and event\-marking atomically in one transaction. Returns true if handler ran, false if event was already processed.

<a name="ActorType"></a>
## type ActorType

ActorType identifies who triggered the event.

```go
type ActorType string
```

<a name="ActorTypeUser"></a>

```go
const (
    ActorTypeUser    ActorType = "user"
    ActorTypeService ActorType = "service"
)
```

<a name="AggregateVersionStore"></a>
## type AggregateVersionStore

AggregateVersionStore persists consumer\-side last\-seen versions.

```go
type AggregateVersionStore interface {
    GetLastSeenVersion(ctx context.Context, tenantID, aggregateID string) (int64, error)
    SetLastSeenVersion(ctx context.Context, tenantID, aggregateID string, version int64) error
}
```

<a name="AggregateVersionTracker"></a>
## type AggregateVersionTracker

AggregateVersionTracker validates ordering and advances last\-seen version on successful sequence.

```go
type AggregateVersionTracker struct {
    // contains filtered or unexported fields
}
```

<a name="NewAggregateVersionTracker"></a>
### func NewAggregateVersionTracker

```go
func NewAggregateVersionTracker(store AggregateVersionStore, log logger.Logger) (*AggregateVersionTracker, error)
```

NewAggregateVersionTracker constructs a tracker using an external store.

<a name="AggregateVersionTracker.CheckAndAdvance"></a>
### func \(\*AggregateVersionTracker\) CheckAndAdvance

```go
func (t *AggregateVersionTracker) CheckAndAdvance(ctx context.Context, tenantID, aggregateID string, receivedVersion int64) (VersionCheck, error)
```

CheckAndAdvance validates a version and persists it when sequence is valid.

<a name="Consumer"></a>
## type Consumer

Consumer defines the interface for subscribing to topics and consuming messages. Implementations must support multiple concurrent subscriptions.

```go
type Consumer interface {
    // Subscribe registers a message handler for the specified topic.
    // The handler will be invoked for each message received on the topic.
    // Returns an error if the subscription fails.
    Subscribe(ctx context.Context, topic string, handler MessageHandler) error

    // Unsubscribe removes the subscription for the specified topic.
    // Returns an error if the unsubscribe operation fails.
    Unsubscribe(topic string) error

    // Close gracefully shuts down the consumer, acknowledging any pending messages.
    // Returns an error if the shutdown fails.
    Close() error
}
```

<a name="DLQPayload"></a>
## type DLQPayload

DLQPayload describes the payload forwarded to dead\-letter topic.

```go
type DLQPayload struct {
    OriginalTopic  string            `json:"original_topic"`
    OriginalID     string            `json:"original_id"`
    OriginalKey    string            `json:"original_key"`
    OriginalBody   []byte            `json:"original_body"`
    OriginalHeader map[string]string `json:"original_header,omitempty"`
    FailureReason  string            `json:"failure_reason"`
    StackTrace     string            `json:"stack_trace"`
    AttemptCount   int               `json:"attempt_count"`
    FailedAt       time.Time         `json:"failed_at"`
}
```

<a name="DataClass"></a>
## type DataClass

DataClass identifies the PII sensitivity of an event.

```go
type DataClass string
```

<a name="DataClassPublic"></a>

```go
const (
    DataClassPublic     DataClass = "public"
    DataClassInternal   DataClass = "internal"
    DataClassRestricted DataClass = "restricted"
)
```

<a name="EventBus"></a>
## type EventBus

EventBus combines Producer and Consumer interfaces with health checking. This is the primary interface for event bus adapters \(Kafka, RabbitMQ, SQS\).

```go
type EventBus interface {
    Producer
    Consumer

    // HealthCheck verifies connectivity to the message broker.
    // Returns an error if the broker is unreachable or unhealthy.
    HealthCheck(ctx context.Context) error
}
```

<a name="EventEnvelope"></a>
## type EventEnvelope

EventEnvelope defines a generic, structured event envelope.

Core required fields \(17\): id, type, domain, event\_name, version, tenant\_id, aggregate\_id, aggregate\_type, aggregate\_version, producer, partition\_key, correlation\_id, actor\_id, actor\_type, occurred\_at, payload, data\_class.

Optional fields: causation\_id, schema\_id, schema\_hash, metadata.

```go
type EventEnvelope struct {
    ID               string            `json:"id"`
    Type             string            `json:"type"`
    Domain           string            `json:"domain"`
    EventName        string            `json:"event_name"`
    Version          string            `json:"version"`
    TenantID         string            `json:"tenant_id"`
    AggregateID      string            `json:"aggregate_id"`
    AggregateType    string            `json:"aggregate_type"`
    AggregateVersion int64             `json:"aggregate_version"`
    Producer         string            `json:"producer"`
    PartitionKey     string            `json:"partition_key"`
    CorrelationID    string            `json:"correlation_id"`
    CausationID      *string           `json:"causation_id,omitempty"`
    ActorID          string            `json:"actor_id"`
    ActorType        ActorType         `json:"actor_type"`
    OccurredAt       time.Time         `json:"occurred_at"`
    Payload          json.RawMessage   `json:"payload"`
    SchemaID         string            `json:"schema_id,omitempty"`
    SchemaHash       string            `json:"schema_hash,omitempty"`
    DataClass        DataClass         `json:"data_class"`
    Metadata         map[string]string `json:"metadata,omitempty"`
}
```

<a name="DeserializeEventEnvelope"></a>
### func DeserializeEventEnvelope

```go
func DeserializeEventEnvelope(data []byte) (*EventEnvelope, error)
```

DeserializeEventEnvelope unmarshals and validates an envelope from JSON.

<a name="EventEnvelopeFromMessage"></a>
### func EventEnvelopeFromMessage

```go
func EventEnvelopeFromMessage(msg *Message) (*EventEnvelope, error)
```

EventEnvelopeFromMessage decodes an event envelope from a consumed message.

<a name="EventEnvelope.EnsurePartitionKey"></a>
### func \(\*EventEnvelope\) EnsurePartitionKey

```go
func (e *EventEnvelope) EnsurePartitionKey()
```

EnsurePartitionKey sets partition\_key to "\{tenant\_id\}:\{aggregate\_id\}" if empty.

<a name="EventEnvelope.Serialize"></a>
### func \(\*EventEnvelope\) Serialize

```go
func (e *EventEnvelope) Serialize() ([]byte, error)
```

Serialize marshals the envelope to JSON.

<a name="EventEnvelope.ToMessage"></a>
### func \(\*EventEnvelope\) ToMessage

```go
func (e *EventEnvelope) ToMessage() (*Message, error)
```

ToMessage converts the envelope into an eventbus message.

<a name="EventEnvelope.Validate"></a>
### func \(\*EventEnvelope\) Validate

```go
func (e *EventEnvelope) Validate() error
```

Validate checks whether the envelope contains all required core fields.

<a name="IdempotencyGuard"></a>
## type IdempotencyGuard

IdempotencyGuard ensures handlers process each event only once.

```go
type IdempotencyGuard struct {
    // contains filtered or unexported fields
}
```

<a name="NewIdempotencyGuard"></a>
### func NewIdempotencyGuard

```go
func NewIdempotencyGuard(store ProcessedEventStore) (*IdempotencyGuard, error)
```

NewIdempotencyGuard creates a guard with a backing store.

<a name="IdempotencyGuard.ProcessOnce"></a>
### func \(\*IdempotencyGuard\) ProcessOnce

```go
func (g *IdempotencyGuard) ProcessOnce(ctx context.Context, consumerName, eventID string, handler func(ctx context.Context) error) (bool, error)
```

ProcessOnce executes handler only if the event was not previously processed. It returns true when handler executed, false when event was a duplicate.

<a name="JSONSerializer"></a>
## type JSONSerializer

JSONSerializer implements the Serializer interface using encoding/json. It provides JSON serialization for message payloads.

```go
type JSONSerializer struct{}
```

<a name="NewJSONSerializer"></a>
### func NewJSONSerializer

```go
func NewJSONSerializer() *JSONSerializer
```

NewJSONSerializer creates a new JSON serializer.

<a name="JSONSerializer.ContentType"></a>
### func \(\*JSONSerializer\) ContentType

```go
func (s *JSONSerializer) ContentType() string
```

ContentType returns the MIME type for JSON serialization.

<a name="JSONSerializer.Deserialize"></a>
### func \(\*JSONSerializer\) Deserialize

```go
func (s *JSONSerializer) Deserialize(data []byte, target interface{}) error
```

Deserialize converts JSON bytes back to a Go object. The target parameter must be a pointer to the destination object.

<a name="JSONSerializer.Serialize"></a>
### func \(\*JSONSerializer\) Serialize

```go
func (s *JSONSerializer) Serialize(v interface{}) ([]byte, error)
```

Serialize converts a Go object to JSON bytes.

<a name="Message"></a>
## type Message

Message represents a message to be published or consumed from a topic. It includes metadata such as headers, content type, and timestamp.

```go
type Message struct {
    // ID is a unique identifier for the message.
    ID  string

    // Key is used for partitioning in systems like Kafka.
    // Messages with the same key are guaranteed to be delivered to the same partition.
    Key string

    // Value is the serialized message payload.
    Value []byte

    // Headers contains arbitrary key-value metadata for the message.
    Headers map[string]string

    // ContentType indicates the serialization format (e.g., "application/json", "application/protobuf").
    ContentType string

    // Timestamp is when the message was created.
    Timestamp time.Time
}
```

<a name="MessageHandler"></a>
## type MessageHandler

MessageHandler is a function type for processing consumed messages. Implementations should return an error if message processing fails, which may trigger retry logic or dead letter queue handling.

```go
type MessageHandler func(ctx context.Context, msg *Message) error
```

<a name="OutboxEntry"></a>
## type OutboxEntry

OutboxEntry is a queued message to publish through the event bus.

```go
type OutboxEntry struct {
    ID          string
    Topic       string
    Message     *Message
    CreatedAt   time.Time
    AvailableAt time.Time
    Published   bool
    PublishedAt *time.Time
    RetryCount  int
    LastError   string
}
```

<a name="OutboxEntry.Validate"></a>
### func \(\*OutboxEntry\) Validate

```go
func (e *OutboxEntry) Validate() error
```

Validate checks that an outbox entry is complete.

<a name="OutboxMetrics"></a>
## type OutboxMetrics

OutboxMetrics publishes outbox health and throughput metrics.

```go
type OutboxMetrics struct {
    // contains filtered or unexported fields
}
```

<a name="NewOutboxMetrics"></a>
### func NewOutboxMetrics

```go
func NewOutboxMetrics(registry *prometheus.Registry, namespace string) (*OutboxMetrics, error)
```

NewOutboxMetrics registers outbox metrics in the provided registry.

<a name="OutboxMetrics.IncFailed"></a>
### func \(\*OutboxMetrics\) IncFailed

```go
func (m *OutboxMetrics) IncFailed()
```

IncFailed increments failed publish attempts.

<a name="OutboxMetrics.IncPublished"></a>
### func \(\*OutboxMetrics\) IncPublished

```go
func (m *OutboxMetrics) IncPublished()
```

IncPublished increments successful publishes.

<a name="OutboxMetrics.Snapshot"></a>
### func \(\*OutboxMetrics\) Snapshot

```go
func (m *OutboxMetrics) Snapshot(ctx context.Context, store OutboxStore, now time.Time)
```

Snapshot updates pending\-size and oldest\-age gauges from store state.

<a name="OutboxPublisher"></a>
## type OutboxPublisher

OutboxPublisher publishes pending outbox entries to the broker.

```go
type OutboxPublisher struct {
    // contains filtered or unexported fields
}
```

<a name="NewOutboxPublisher"></a>
### func NewOutboxPublisher

```go
func NewOutboxPublisher(store OutboxStore, producer Producer, log logger.Logger, metrics *OutboxMetrics, config OutboxPublisherConfig) (*OutboxPublisher, error)
```

NewOutboxPublisher creates an outbox publisher with normalized config.

<a name="OutboxPublisher.Run"></a>
### func \(\*OutboxPublisher\) Run

```go
func (p *OutboxPublisher) Run(ctx context.Context) error
```

Run starts the polling loop and blocks until context cancellation.

<a name="OutboxPublisherConfig"></a>
## type OutboxPublisherConfig

OutboxPublisherConfig controls outbox polling and retry behavior.

```go
type OutboxPublisherConfig struct {
    PollInterval     time.Duration
    BatchSize        int
    CleanupEvery     time.Duration
    CleanupRetention time.Duration
    InitialBackoff   time.Duration
    MaxBackoff       time.Duration
}
```

<a name="OutboxStore"></a>
## type OutboxStore

OutboxStore is the persistence contract for outbox entries.

```go
type OutboxStore interface {
    Insert(ctx context.Context, entry *OutboxEntry) error
    FetchPending(ctx context.Context, limit int, now time.Time) ([]*OutboxEntry, error)
    MarkPublished(ctx context.Context, id string, publishedAt time.Time) error
    MarkFailed(ctx context.Context, id string, retryCount int, nextAttemptAt time.Time, reason string) error
    CleanupPublishedBefore(ctx context.Context, before time.Time, limit int) (int, error)
    PendingCount(ctx context.Context, now time.Time) (int, error)
    OldestPendingAgeSeconds(ctx context.Context, now time.Time) (float64, error)
}
```

<a name="OutboxWriter"></a>
## type OutboxWriter

OutboxWriter writes outbox entries within a transaction boundary.

```go
type OutboxWriter interface {
    Insert(ctx context.Context, entry *OutboxEntry) error
}
```

<a name="ProcessedEventStore"></a>
## type ProcessedEventStore

ProcessedEventStore persists event processing markers.

```go
type ProcessedEventStore interface {
    IsProcessed(ctx context.Context, consumerName, eventID string) (bool, error)
    MarkProcessed(ctx context.Context, consumerName, eventID string, processedAt time.Time) error
    CleanupProcessedBefore(ctx context.Context, before time.Time, limit int) (int, error)
}
```

<a name="ProcessedEventTxExecutor"></a>
## type ProcessedEventTxExecutor

ProcessedEventTxExecutor executes a callback in a transaction boundary.

```go
type ProcessedEventTxExecutor interface {
    WithTransaction(ctx context.Context, fn func(ctx context.Context, txStore ProcessedEventTxStore) error) error
}
```

<a name="ProcessedEventTxStore"></a>
## type ProcessedEventTxStore

ProcessedEventTxStore stores idempotency markers inside a transaction.

```go
type ProcessedEventTxStore interface {
    IsProcessed(ctx context.Context, consumerName, eventID string) (bool, error)
    MarkProcessed(ctx context.Context, consumerName, eventID string, processedAt time.Time) error
}
```

<a name="ProcessedEventsCleaner"></a>
## type ProcessedEventsCleaner

ProcessedEventsCleaner periodically deletes stale processed\-event markers.

```go
type ProcessedEventsCleaner struct {
    // contains filtered or unexported fields
}
```

<a name="NewProcessedEventsCleaner"></a>
### func NewProcessedEventsCleaner

```go
func NewProcessedEventsCleaner(store ProcessedEventStore, config ProcessedEventsCleanerConfig) (*ProcessedEventsCleaner, error)
```

NewProcessedEventsCleaner creates a cleanup service for idempotency markers.

<a name="ProcessedEventsCleaner.Run"></a>
### func \(\*ProcessedEventsCleaner\) Run

```go
func (c *ProcessedEventsCleaner) Run(ctx context.Context) error
```

Run starts a periodic cleanup loop until context cancellation.

<a name="ProcessedEventsCleanerConfig"></a>
## type ProcessedEventsCleanerConfig

ProcessedEventsCleanerConfig configures periodic cleanup of old markers.

```go
type ProcessedEventsCleanerConfig struct {
    CleanupEvery time.Duration
    Retention    time.Duration
    BatchSize    int
}
```

<a name="Producer"></a>
## type Producer

Producer defines the interface for publishing messages to topics. Implementations must support both single and batch publishing operations.

```go
type Producer interface {
    // Publish sends a single message to the specified topic.
    // Returns an error if the publish operation fails.
    Publish(ctx context.Context, topic string, message *Message) error

    // PublishBatch sends multiple messages to the specified topic in a single operation.
    // Batch operations are more efficient for high-throughput scenarios.
    // Returns an error if any message in the batch fails to publish.
    PublishBatch(ctx context.Context, topic string, messages []*Message) error

    // Close gracefully shuts down the producer, flushing any pending messages.
    // Returns an error if the shutdown fails.
    Close() error
}
```

<a name="ProtobufSerializer"></a>
## type ProtobufSerializer

ProtobufSerializer implements the Serializer interface using Protocol Buffers. It provides efficient binary serialization for protobuf message types.

```go
type ProtobufSerializer struct{}
```

<a name="NewProtobufSerializer"></a>
### func NewProtobufSerializer

```go
func NewProtobufSerializer() *ProtobufSerializer
```

NewProtobufSerializer creates a new Protocol Buffers serializer.

<a name="ProtobufSerializer.ContentType"></a>
### func \(\*ProtobufSerializer\) ContentType

```go
func (s *ProtobufSerializer) ContentType() string
```

ContentType returns the MIME type for Protocol Buffers serialization.

<a name="ProtobufSerializer.Deserialize"></a>
### func \(\*ProtobufSerializer\) Deserialize

```go
func (s *ProtobufSerializer) Deserialize(data []byte, target interface{}) error
```

Deserialize converts protobuf bytes back to a message. The target parameter must be a pointer to a proto.Message.

<a name="ProtobufSerializer.Serialize"></a>
### func \(\*ProtobufSerializer\) Serialize

```go
func (s *ProtobufSerializer) Serialize(v interface{}) ([]byte, error)
```

Serialize converts a protobuf message to bytes. The value must implement proto.Message interface.

<a name="RetryDLQConfig"></a>
## type RetryDLQConfig

RetryDLQConfig controls retry and dead\-letter behavior.

```go
type RetryDLQConfig struct {
    MaxRetries             int
    InitialBackoff         time.Duration
    MaxBackoff             time.Duration
    AttemptTimeout         time.Duration
    CircuitBreakerFailures int
    CircuitBreakerReset    time.Duration
    DLQTopicSuffix         string
}
```

<a name="RetryDLQMetrics"></a>
## type RetryDLQMetrics

RetryDLQMetrics exports retry and DLQ signals.

```go
type RetryDLQMetrics struct {
    // contains filtered or unexported fields
}
```

<a name="NewRetryDLQMetrics"></a>
### func NewRetryDLQMetrics

```go
func NewRetryDLQMetrics(registry *prometheus.Registry, namespace string) (*RetryDLQMetrics, error)
```

NewRetryDLQMetrics registers retry \+ DLQ metrics in a Prometheus registry.

<a name="RetryDLQMetrics.SetDLQHealth"></a>
### func \(\*RetryDLQMetrics\) SetDLQHealth

```go
func (m *RetryDLQMetrics) SetDLQHealth(size, growthRate float64)
```

SetDLQHealth updates gauge metrics for DLQ size and growth rate.

<a name="Serializer"></a>
## type Serializer

Serializer defines the interface for message serialization. Implementations must support serializing Go objects to bytes and deserializing bytes back to objects.

```go
type Serializer interface {
    // Serialize converts a Go object to bytes.
    // Returns the serialized bytes and an error if serialization fails.
    Serialize(v interface{}) ([]byte, error)

    // Deserialize converts bytes back to a Go object.
    // The target parameter must be a pointer to the destination object.
    // Returns an error if deserialization fails.
    Deserialize(data []byte, target interface{}) error

    // ContentType returns the MIME type for this serializer.
    // Examples: "application/json", "application/protobuf", "application/avro"
    ContentType() string
}
```

<a name="TransactionalOutboxExecutor"></a>
## type TransactionalOutboxExecutor

TransactionalOutboxExecutor executes a function inside a transaction and commits only when the function returns nil.

```go
type TransactionalOutboxExecutor interface {
    WithTransaction(ctx context.Context, fn func(ctx context.Context, writer OutboxWriter) error) error
}
```

<a name="VersionCheck"></a>
## type VersionCheck

VersionCheck holds the result of validating a received event version.

```go
type VersionCheck struct {
    Status   VersionStatus
    Expected int64
    Received int64
    GapSize  int64
}
```

<a name="ValidateAggregateVersion"></a>
### func ValidateAggregateVersion

```go
func ValidateAggregateVersion(lastSeenVersion, receivedVersion int64) VersionCheck
```

ValidateAggregateVersion compares received version against the expected next version.

<a name="VersionStatus"></a>
## type VersionStatus

VersionStatus describes ordering quality for a received event version.

```go
type VersionStatus string
```

<a name="VersionStatusOK"></a>

```go
const (
    VersionStatusOK         VersionStatus = "ok"
    VersionStatusDuplicate  VersionStatus = "duplicate"
    VersionStatusOutOfOrder VersionStatus = "out_of_order"
    VersionStatusGap        VersionStatus = "gap"
)
```

# factory

```go
import "github.com/nimburion/nimburion/pkg/eventbus/factory"
```

## Index

- [func NewEventBusAdapter\(cfg config.EventBusConfig, log logger.Logger\) \(eventbus.EventBus, error\)](<#NewEventBusAdapter>)
- [func NewEventBusAdapterWithValidation\(cfg config.EventBusConfig, validationCfg config.KafkaValidationConfig, log logger.Logger\) \(eventbus.EventBus, error\)](<#NewEventBusAdapterWithValidation>)


<a name="NewEventBusAdapter"></a>
## func NewEventBusAdapter

```go
func NewEventBusAdapter(cfg config.EventBusConfig, log logger.Logger) (eventbus.EventBus, error)
```

Cosa fa: seleziona e inizializza l'event bus adapter in base alla config. Cosa NON fa: non supporta multipli bus attivi nella stessa factory call. Esempio minimo: bus, err := eventbus.NewEventBusAdapter\(cfg.EventBus, log\)

<a name="NewEventBusAdapterWithValidation"></a>
## func NewEventBusAdapterWithValidation

```go
func NewEventBusAdapterWithValidation(cfg config.EventBusConfig, validationCfg config.KafkaValidationConfig, log logger.Logger) (eventbus.EventBus, error)
```

NewEventBusAdapterWithValidation creates an adapter and optionally applies schema validation hooks.

# kafka

```go
import "github.com/nimburion/nimburion/pkg/eventbus/kafka"
```

## Index

- [type Config](<#Config>)
- [type KafkaAdapter](<#KafkaAdapter>)
  - [func NewKafkaAdapter\(cfg Config, logger logger.Logger\) \(\*KafkaAdapter, error\)](<#NewKafkaAdapter>)
  - [func \(a \*KafkaAdapter\) Close\(\) error](<#KafkaAdapter.Close>)
  - [func \(a \*KafkaAdapter\) HealthCheck\(ctx context.Context\) error](<#KafkaAdapter.HealthCheck>)
  - [func \(a \*KafkaAdapter\) Publish\(ctx context.Context, topic string, message \*eventbus.Message\) error](<#KafkaAdapter.Publish>)
  - [func \(a \*KafkaAdapter\) PublishBatch\(ctx context.Context, topic string, messages \[\]\*eventbus.Message\) error](<#KafkaAdapter.PublishBatch>)
  - [func \(a \*KafkaAdapter\) Subscribe\(ctx context.Context, topic string, handler eventbus.MessageHandler\) error](<#KafkaAdapter.Subscribe>)
  - [func \(a \*KafkaAdapter\) Unsubscribe\(topic string\) error](<#KafkaAdapter.Unsubscribe>)


<a name="Config"></a>
## type Config

Config holds the configuration for the Kafka adapter.

```go
type Config struct {
    // Brokers is the list of Kafka broker addresses (e.g., ["localhost:9092"])
    Brokers []string

    // OperationTimeout is the timeout for publish and subscribe operations
    OperationTimeout time.Duration

    // MaxRetries is the maximum number of retry attempts for failed operations
    MaxRetries int

    // RetryBackoff is the initial backoff duration for retries (exponential backoff)
    RetryBackoff time.Duration

    // GroupID is the consumer group ID for subscriptions
    GroupID string
}
```

<a name="KafkaAdapter"></a>
## type KafkaAdapter

KafkaAdapter implements the eventbus.EventBus interface for Apache Kafka. It manages a single producer for publishing messages and multiple consumers for subscribing to topics.

```go
type KafkaAdapter struct {
    // contains filtered or unexported fields
}
```

<a name="NewKafkaAdapter"></a>
### func NewKafkaAdapter

```go
func NewKafkaAdapter(cfg Config, logger logger.Logger) (*KafkaAdapter, error)
```

NewKafkaAdapter creates a new Kafka adapter with the specified configuration. It initializes a producer for publishing messages and prepares for consumer subscriptions.

Parameters:

- cfg: Configuration for the Kafka adapter
- logger: Logger instance for structured logging

Returns:

- \*KafkaAdapter: The initialized Kafka adapter
- error: An error if initialization fails

<a name="KafkaAdapter.Close"></a>
### func \(\*KafkaAdapter\) Close

```go
func (a *KafkaAdapter) Close() error
```

Close gracefully shuts down the Kafka adapter. It closes the producer and all active consumers.

Returns:

- error: An error if the shutdown fails

<a name="KafkaAdapter.HealthCheck"></a>
### func \(\*KafkaAdapter\) HealthCheck

```go
func (a *KafkaAdapter) HealthCheck(ctx context.Context) error
```

HealthCheck verifies connectivity to the Kafka brokers. It attempts to list topics to verify the connection is working.

Parameters:

- ctx: Context for cancellation and timeout

Returns:

- error: An error if the health check fails

<a name="KafkaAdapter.Publish"></a>
### func \(\*KafkaAdapter\) Publish

```go
func (a *KafkaAdapter) Publish(ctx context.Context, topic string, message *eventbus.Message) error
```

Publish sends a single message to the specified topic. It converts the eventbus.Message to a Kafka message and publishes it.

Parameters:

- ctx: Context for cancellation and timeout
- topic: The topic to publish to
- message: The message to publish

Returns:

- error: An error if the publish operation fails

<a name="KafkaAdapter.PublishBatch"></a>
### func \(\*KafkaAdapter\) PublishBatch

```go
func (a *KafkaAdapter) PublishBatch(ctx context.Context, topic string, messages []*eventbus.Message) error
```

PublishBatch sends multiple messages to the specified topic in a single operation. Batch operations are more efficient for high\-throughput scenarios.

Parameters:

- ctx: Context for cancellation and timeout
- topic: The topic to publish to
- messages: The messages to publish

Returns:

- error: An error if any message in the batch fails to publish

<a name="KafkaAdapter.Subscribe"></a>
### func \(\*KafkaAdapter\) Subscribe

```go
func (a *KafkaAdapter) Subscribe(ctx context.Context, topic string, handler eventbus.MessageHandler) error
```

Subscribe registers a message handler for the specified topic. It creates a new Kafka consumer for the topic and starts consuming messages in a background goroutine.

Parameters:

- ctx: Context for cancellation
- topic: The topic to subscribe to
- handler: The message handler function

Returns:

- error: An error if the subscription fails

<a name="KafkaAdapter.Unsubscribe"></a>
### func \(\*KafkaAdapter\) Unsubscribe

```go
func (a *KafkaAdapter) Unsubscribe(topic string) error
```

Unsubscribe removes the subscription for the specified topic. It closes the consumer and removes it from the consumer map.

Parameters:

- topic: The topic to unsubscribe from

Returns:

- error: An error if the unsubscribe operation fails

# rabbitmq

```go
import "github.com/nimburion/nimburion/pkg/eventbus/rabbitmq"
```

## Index

- [type Config](<#Config>)
- [type RabbitMQAdapter](<#RabbitMQAdapter>)
  - [func NewRabbitMQAdapter\(cfg Config, log logger.Logger\) \(\*RabbitMQAdapter, error\)](<#NewRabbitMQAdapter>)
  - [func \(a \*RabbitMQAdapter\) Close\(\) error](<#RabbitMQAdapter.Close>)
  - [func \(a \*RabbitMQAdapter\) HealthCheck\(ctx context.Context\) error](<#RabbitMQAdapter.HealthCheck>)
  - [func \(a \*RabbitMQAdapter\) Publish\(ctx context.Context, topic string, message \*eventbus.Message\) error](<#RabbitMQAdapter.Publish>)
  - [func \(a \*RabbitMQAdapter\) PublishBatch\(ctx context.Context, topic string, messages \[\]\*eventbus.Message\) error](<#RabbitMQAdapter.PublishBatch>)
  - [func \(a \*RabbitMQAdapter\) Subscribe\(ctx context.Context, topic string, handler eventbus.MessageHandler\) error](<#RabbitMQAdapter.Subscribe>)
  - [func \(a \*RabbitMQAdapter\) Unsubscribe\(topic string\) error](<#RabbitMQAdapter.Unsubscribe>)


<a name="Config"></a>
## type Config

Config holds RabbitMQ adapter configuration.

```go
type Config struct {
    URL              string
    Exchange         string
    ExchangeType     string
    QueueName        string
    RoutingKey       string
    OperationTimeout time.Duration
    ConsumerTag      string
}
```

<a name="RabbitMQAdapter"></a>
## type RabbitMQAdapter

RabbitMQAdapter implements eventbus.EventBus for RabbitMQ.

```go
type RabbitMQAdapter struct {
    // contains filtered or unexported fields
}
```

<a name="NewRabbitMQAdapter"></a>
### func NewRabbitMQAdapter

```go
func NewRabbitMQAdapter(cfg Config, log logger.Logger) (*RabbitMQAdapter, error)
```

Cosa fa: crea connessione/channel RabbitMQ e prepara publish/subscribe. Cosa NON fa: non crea policy broker o dead\-letter exchange. Esempio minimo: adapter, err := rabbitmq.NewRabbitMQAdapter\(cfg, log\)

<a name="RabbitMQAdapter.Close"></a>
### func \(\*RabbitMQAdapter\) Close

```go
func (a *RabbitMQAdapter) Close() error
```

Close releases all resources held by this instance. Should be called when the instance is no longer needed.

<a name="RabbitMQAdapter.HealthCheck"></a>
### func \(\*RabbitMQAdapter\) HealthCheck

```go
func (a *RabbitMQAdapter) HealthCheck(ctx context.Context) error
```

HealthCheck verifies the component is operational and can perform its intended function.

<a name="RabbitMQAdapter.Publish"></a>
### func \(\*RabbitMQAdapter\) Publish

```go
func (a *RabbitMQAdapter) Publish(ctx context.Context, topic string, message *eventbus.Message) error
```

Publish sends a message to the specified topic.

<a name="RabbitMQAdapter.PublishBatch"></a>
### func \(\*RabbitMQAdapter\) PublishBatch

```go
func (a *RabbitMQAdapter) PublishBatch(ctx context.Context, topic string, messages []*eventbus.Message) error
```

PublishBatch TODO: add description

<a name="RabbitMQAdapter.Subscribe"></a>
### func \(\*RabbitMQAdapter\) Subscribe

```go
func (a *RabbitMQAdapter) Subscribe(ctx context.Context, topic string, handler eventbus.MessageHandler) error
```

Subscribe creates a queue, binds it to the topic, and processes messages in a background goroutine. The handler is invoked for each message. Messages are auto\-acked on success or nacked on error.

<a name="RabbitMQAdapter.Unsubscribe"></a>
### func \(\*RabbitMQAdapter\) Unsubscribe

```go
func (a *RabbitMQAdapter) Unsubscribe(topic string) error
```

Unsubscribe removes the subscription for the specified topic.

# schema

```go
import "github.com/nimburion/nimburion/pkg/eventbus/schema"
```

## Index

- [type CompatibilityPolicy](<#CompatibilityPolicy>)
- [type ConsumerValidator](<#ConsumerValidator>)
- [type Descriptor](<#Descriptor>)
- [type LocalRegistry](<#LocalRegistry>)
  - [func NewLocalRegistry\(descriptorPath string\) \(\*LocalRegistry, error\)](<#NewLocalRegistry>)
  - [func \(r \*LocalRegistry\) Resolve\(subject, version string, headers map\[string\]string\) \(\*Descriptor, error\)](<#LocalRegistry.Resolve>)
  - [func \(r \*LocalRegistry\) ValidateHeaders\(desc \*Descriptor, headers map\[string\]string\) error](<#LocalRegistry.ValidateHeaders>)
  - [func \(r \*LocalRegistry\) ValidatePayload\(desc \*Descriptor, payload \[\]byte\) error](<#LocalRegistry.ValidatePayload>)
- [type MessageConsumerValidator](<#MessageConsumerValidator>)
  - [func NewMessageConsumerValidator\(registry Registry, mode ValidationMode\) \*MessageConsumerValidator](<#NewMessageConsumerValidator>)
  - [func \(v \*MessageConsumerValidator\) ValidateAfterConsume\(ctx context.Context, topic string, msg \*eventbus.Message\) error](<#MessageConsumerValidator.ValidateAfterConsume>)
- [type MessageProducerValidator](<#MessageProducerValidator>)
  - [func NewMessageProducerValidator\(registry Registry, mode ValidationMode\) \*MessageProducerValidator](<#NewMessageProducerValidator>)
  - [func \(v \*MessageProducerValidator\) ValidateBeforePublish\(ctx context.Context, topic string, msg \*eventbus.Message\) error](<#MessageProducerValidator.ValidateBeforePublish>)
- [type ProducerValidator](<#ProducerValidator>)
- [type Registry](<#Registry>)
- [type ValidationError](<#ValidationError>)
  - [func \(e \*ValidationError\) Error\(\) string](<#ValidationError.Error>)
  - [func \(e \*ValidationError\) Unwrap\(\) error](<#ValidationError.Unwrap>)
- [type ValidationMode](<#ValidationMode>)


<a name="CompatibilityPolicy"></a>
## type CompatibilityPolicy

CompatibilityPolicy defines schema evolution compatibility.

```go
type CompatibilityPolicy string
```

<a name="CompatibilityBackward"></a>

```go
const (
    CompatibilityBackward CompatibilityPolicy = "BACKWARD"
    CompatibilityFull     CompatibilityPolicy = "FULL"
)
```

<a name="ConsumerValidator"></a>
## type ConsumerValidator

ConsumerValidator validates inbound messages before business processing.

```go
type ConsumerValidator interface {
    ValidateAfterConsume(ctx context.Context, topic string, msg *eventbus.Message) error
}
```

<a name="Descriptor"></a>
## type Descriptor

Descriptor identifies one concrete schema version for an event subject.

```go
type Descriptor struct {
    Subject    string
    Version    string
    SchemaID   string
    SchemaHash string
    Message    string
}
```

<a name="LocalRegistry"></a>
## type LocalRegistry

LocalRegistry provides in\-process schema resolution from a protobuf descriptor set.

```go
type LocalRegistry struct {
    // contains filtered or unexported fields
}
```

<a name="NewLocalRegistry"></a>
### func NewLocalRegistry

```go
func NewLocalRegistry(descriptorPath string) (*LocalRegistry, error)
```

NewLocalRegistry builds a schema registry from a descriptor\-set file.

<a name="LocalRegistry.Resolve"></a>
### func \(\*LocalRegistry\) Resolve

```go
func (r *LocalRegistry) Resolve(subject, version string, headers map[string]string) (*Descriptor, error)
```

Resolve selects a descriptor by subject/version and optional headers.

<a name="LocalRegistry.ValidateHeaders"></a>
### func \(\*LocalRegistry\) ValidateHeaders

```go
func (r *LocalRegistry) ValidateHeaders(desc *Descriptor, headers map[string]string) error
```

ValidateHeaders checks schema\-related header consistency.

<a name="LocalRegistry.ValidatePayload"></a>
### func \(\*LocalRegistry\) ValidatePayload

```go
func (r *LocalRegistry) ValidatePayload(desc *Descriptor, payload []byte) error
```

ValidatePayload checks whether payload can be decoded as protobuf \(binary or JSON\) for the descriptor message.

<a name="MessageConsumerValidator"></a>
## type MessageConsumerValidator

MessageConsumerValidator validates inbound messages before business handling.

```go
type MessageConsumerValidator struct {
    Registry       Registry
    Mode           ValidationMode
    DefaultVersion string
}
```

<a name="NewMessageConsumerValidator"></a>
### func NewMessageConsumerValidator

```go
func NewMessageConsumerValidator(registry Registry, mode ValidationMode) *MessageConsumerValidator
```

NewMessageConsumerValidator creates a consumer validator instance.

<a name="MessageConsumerValidator.ValidateAfterConsume"></a>
### func \(\*MessageConsumerValidator\) ValidateAfterConsume

```go
func (v *MessageConsumerValidator) ValidateAfterConsume(ctx context.Context, topic string, msg *eventbus.Message) error
```

ValidateAfterConsume validates consumed messages before handler execution.

<a name="MessageProducerValidator"></a>
## type MessageProducerValidator

MessageProducerValidator validates outbound messages and enriches schema headers.

```go
type MessageProducerValidator struct {
    Registry       Registry
    Mode           ValidationMode
    DefaultVersion string
}
```

<a name="NewMessageProducerValidator"></a>
### func NewMessageProducerValidator

```go
func NewMessageProducerValidator(registry Registry, mode ValidationMode) *MessageProducerValidator
```

NewMessageProducerValidator creates a producer validator instance.

<a name="MessageProducerValidator.ValidateBeforePublish"></a>
### func \(\*MessageProducerValidator\) ValidateBeforePublish

```go
func (v *MessageProducerValidator) ValidateBeforePublish(ctx context.Context, topic string, msg *eventbus.Message) error
```

ValidateBeforePublish validates outbound messages before broker publish.

<a name="ProducerValidator"></a>
## type ProducerValidator

ProducerValidator validates and enriches outbound messages before publish.

```go
type ProducerValidator interface {
    ValidateBeforePublish(ctx context.Context, topic string, msg *eventbus.Message) error
}
```

<a name="Registry"></a>
## type Registry

Registry resolves and validates event schemas using in\-process descriptors.

```go
type Registry interface {
    Resolve(subject, version string, headers map[string]string) (*Descriptor, error)
    ValidatePayload(desc *Descriptor, payload []byte) error
    ValidateHeaders(desc *Descriptor, headers map[string]string) error
}
```

<a name="ValidationError"></a>
## type ValidationError

ValidationError represents a stable schema validation failure.

```go
type ValidationError struct {
    Code    string
    Subject string
    Version string
    Details map[string]interface{}
    Cause   error
}
```

<a name="ValidationError.Error"></a>
### func \(\*ValidationError\) Error

```go
func (e *ValidationError) Error() string
```

Error implements the error interface.

<a name="ValidationError.Unwrap"></a>
### func \(\*ValidationError\) Unwrap

```go
func (e *ValidationError) Unwrap() error
```

Unwrap exposes the wrapped cause.

<a name="ValidationMode"></a>
## type ValidationMode

ValidationMode controls runtime behavior on schema validation failures.

```go
type ValidationMode string
```

<a name="ValidationModeWarn"></a>

```go
const (
    ValidationModeWarn    ValidationMode = "warn"
    ValidationModeEnforce ValidationMode = "enforce"
)
```

# sqs

```go
import "github.com/nimburion/nimburion/pkg/eventbus/sqs"
```

## Index

- [type Config](<#Config>)
- [type SQSAdapter](<#SQSAdapter>)
  - [func NewSQSAdapter\(cfg Config, log logger.Logger\) \(\*SQSAdapter, error\)](<#NewSQSAdapter>)
  - [func \(a \*SQSAdapter\) Close\(\) error](<#SQSAdapter.Close>)
  - [func \(a \*SQSAdapter\) HealthCheck\(ctx context.Context\) error](<#SQSAdapter.HealthCheck>)
  - [func \(a \*SQSAdapter\) Publish\(ctx context.Context, topic string, message \*eventbus.Message\) error](<#SQSAdapter.Publish>)
  - [func \(a \*SQSAdapter\) PublishBatch\(ctx context.Context, topic string, messages \[\]\*eventbus.Message\) error](<#SQSAdapter.PublishBatch>)
  - [func \(a \*SQSAdapter\) Subscribe\(ctx context.Context, topic string, handler eventbus.MessageHandler\) error](<#SQSAdapter.Subscribe>)
  - [func \(a \*SQSAdapter\) Unsubscribe\(topic string\) error](<#SQSAdapter.Unsubscribe>)


<a name="Config"></a>
## type Config

Config holds SQS adapter configuration.

```go
type Config struct {
    Region            string
    QueueURL          string
    Endpoint          string
    AccessKeyID       string
    SecretAccessKey   string
    SessionToken      string
    OperationTimeout  time.Duration
    WaitTimeSeconds   int32
    MaxMessages       int32
    VisibilityTimeout int32
}
```

<a name="SQSAdapter"></a>
## type SQSAdapter

SQSAdapter implements eventbus.EventBus for AWS SQS.

```go
type SQSAdapter struct {
    // contains filtered or unexported fields
}
```

<a name="NewSQSAdapter"></a>
### func NewSQSAdapter

```go
func NewSQSAdapter(cfg Config, log logger.Logger) (*SQSAdapter, error)
```

Cosa fa: crea adapter SQS con supporto endpoint custom e long polling. Cosa NON fa: non crea code o policy IAM. Esempio minimo: adapter, err := sqs.NewSQSAdapter\(cfg, log\)

<a name="SQSAdapter.Close"></a>
### func \(\*SQSAdapter\) Close

```go
func (a *SQSAdapter) Close() error
```

Close releases all resources held by this instance. Should be called when the instance is no longer needed.

<a name="SQSAdapter.HealthCheck"></a>
### func \(\*SQSAdapter\) HealthCheck

```go
func (a *SQSAdapter) HealthCheck(ctx context.Context) error
```

HealthCheck verifies the component is operational and can perform its intended function.

<a name="SQSAdapter.Publish"></a>
### func \(\*SQSAdapter\) Publish

```go
func (a *SQSAdapter) Publish(ctx context.Context, topic string, message *eventbus.Message) error
```

Publish sends a message to the specified topic.

<a name="SQSAdapter.PublishBatch"></a>
### func \(\*SQSAdapter\) PublishBatch

```go
func (a *SQSAdapter) PublishBatch(ctx context.Context, topic string, messages []*eventbus.Message) error
```

PublishBatch sends multiple messages to the topic in batches of up to 10 messages per SQS API call. This is more efficient than calling Publish multiple times for bulk operations.

<a name="SQSAdapter.Subscribe"></a>
### func \(\*SQSAdapter\) Subscribe

```go
func (a *SQSAdapter) Subscribe(ctx context.Context, topic string, handler eventbus.MessageHandler) error
```

Subscribe starts polling the SQS queue in a background goroutine and invokes the handler for each message. Messages are automatically deleted from the queue after successful processing.

<a name="SQSAdapter.Unsubscribe"></a>
### func \(\*SQSAdapter\) Unsubscribe

```go
func (a *SQSAdapter) Unsubscribe(topic string) error
```

Unsubscribe removes the subscription for the specified topic.

Generated by [gomarkdoc](<https://github.com/princjef/gomarkdoc>)
