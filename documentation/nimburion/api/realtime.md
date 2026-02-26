---
layout: documentation
title: pkg/realtime
---


# sse

```go
import "github.com/nimburion/nimburion/pkg/realtime/sse"
```

## Index

- [Variables](<#variables>)
- [type AuthorizeSubscribeFunc](<#AuthorizeSubscribeFunc>)
- [type Bus](<#Bus>)
- [type Client](<#Client>)
  - [func \(c \*Client\) Channel\(\) string](<#Client.Channel>)
  - [func \(c \*Client\) Closed\(\) \<\-chan struct\{\}](<#Client.Closed>)
  - [func \(c \*Client\) Events\(\) \<\-chan Event](<#Client.Events>)
  - [func \(c \*Client\) ID\(\) string](<#Client.ID>)
- [type Event](<#Event>)
- [type EventBusAdapter](<#EventBusAdapter>)
  - [func NewEventBusAdapter\(bus eventbus.EventBus, cfg EventBusConfig\) \(\*EventBusAdapter, error\)](<#NewEventBusAdapter>)
  - [func \(b \*EventBusAdapter\) Close\(\) error](<#EventBusAdapter.Close>)
  - [func \(b \*EventBusAdapter\) Publish\(ctx context.Context, event Event\) error](<#EventBusAdapter.Publish>)
  - [func \(b \*EventBusAdapter\) Subscribe\(ctx context.Context, channel string, handler func\(Event\)\) \(Subscription, error\)](<#EventBusAdapter.Subscribe>)
- [type EventBusConfig](<#EventBusConfig>)
- [type Handler](<#Handler>)
  - [func NewHandler\(cfg HandlerConfig\) \(\*Handler, error\)](<#NewHandler>)
  - [func \(h \*Handler\) Stream\(\) router.HandlerFunc](<#Handler.Stream>)
- [type HandlerConfig](<#HandlerConfig>)
- [type InMemoryBus](<#InMemoryBus>)
  - [func NewInMemoryBus\(\) \*InMemoryBus](<#NewInMemoryBus>)
  - [func \(b \*InMemoryBus\) Close\(\) error](<#InMemoryBus.Close>)
  - [func \(b \*InMemoryBus\) Publish\(\_ context.Context, event Event\) error](<#InMemoryBus.Publish>)
  - [func \(b \*InMemoryBus\) Subscribe\(\_ context.Context, channel string, handler func\(Event\)\) \(Subscription, error\)](<#InMemoryBus.Subscribe>)
- [type InMemoryStore](<#InMemoryStore>)
  - [func NewInMemoryStore\(maxSize int\) \*InMemoryStore](<#NewInMemoryStore>)
  - [func \(s \*InMemoryStore\) Append\(\_ context.Context, event Event\) error](<#InMemoryStore.Append>)
  - [func \(s \*InMemoryStore\) Close\(\) error](<#InMemoryStore.Close>)
  - [func \(s \*InMemoryStore\) GetSince\(\_ context.Context, channel, lastEventID string, limit int\) \(\[\]Event, error\)](<#InMemoryStore.GetSince>)
- [type Manager](<#Manager>)
  - [func NewManager\(cfg ManagerConfig, store Store, bus Bus\) \*Manager](<#NewManager>)
  - [func \(m \*Manager\) Close\(\) error](<#Manager.Close>)
  - [func \(m \*Manager\) Disconnect\(clientID string\) error](<#Manager.Disconnect>)
  - [func \(m \*Manager\) Publish\(ctx context.Context, req PublishRequest\) \(Event, error\)](<#Manager.Publish>)
  - [func \(m \*Manager\) Subscribe\(ctx context.Context, req SubscriptionRequest\) \(\*Client, \[\]Event, error\)](<#Manager.Subscribe>)
- [type ManagerConfig](<#ManagerConfig>)
  - [func DefaultManagerConfig\(\) ManagerConfig](<#DefaultManagerConfig>)
- [type PublishRequest](<#PublishRequest>)
- [type RedisBus](<#RedisBus>)
  - [func NewRedisBus\(cfg RedisBusConfig\) \(\*RedisBus, error\)](<#NewRedisBus>)
  - [func \(b \*RedisBus\) Close\(\) error](<#RedisBus.Close>)
  - [func \(b \*RedisBus\) Publish\(ctx context.Context, event Event\) error](<#RedisBus.Publish>)
  - [func \(b \*RedisBus\) Subscribe\(ctx context.Context, channel string, handler func\(Event\)\) \(Subscription, error\)](<#RedisBus.Subscribe>)
- [type RedisBusConfig](<#RedisBusConfig>)
- [type RedisStore](<#RedisStore>)
  - [func NewRedisStore\(cfg RedisStoreConfig\) \(\*RedisStore, error\)](<#NewRedisStore>)
  - [func \(s \*RedisStore\) Append\(ctx context.Context, event Event\) error](<#RedisStore.Append>)
  - [func \(s \*RedisStore\) Close\(\) error](<#RedisStore.Close>)
  - [func \(s \*RedisStore\) GetSince\(ctx context.Context, channel, lastEventID string, limit int\) \(\[\]Event, error\)](<#RedisStore.GetSince>)
- [type RedisStoreConfig](<#RedisStoreConfig>)
- [type Store](<#Store>)
- [type Subscription](<#Subscription>)
- [type SubscriptionRequest](<#SubscriptionRequest>)


## Variables

<a name="ErrTooManyConnections"></a>

```go
var (
    // ErrTooManyConnections indicates max local SSE connections reached.
    ErrTooManyConnections = errors.New("too many sse connections")
    // ErrInvalidChannel indicates an empty or invalid channel.
    ErrInvalidChannel = errors.New("invalid channel")
)
```

<a name="AuthorizeSubscribeFunc"></a>
## type AuthorizeSubscribeFunc

AuthorizeSubscribeFunc validates subscribe request using app auth context.

```go
type AuthorizeSubscribeFunc func(c router.Context, req SubscriptionRequest) error
```

<a name="Bus"></a>
## type Bus

Bus transports events across instances \(distributed fan\-out\).

```go
type Bus interface {
    Publish(ctx context.Context, event Event) error
    Subscribe(ctx context.Context, channel string, handler func(Event)) (Subscription, error)
    Close() error
}
```

<a name="Client"></a>
## type Client

Client represents a connected SSE subscriber.

```go
type Client struct {
    // contains filtered or unexported fields
}
```

<a name="Client.Channel"></a>
### func \(\*Client\) Channel

```go
func (c *Client) Channel() string
```

Channel returns subscribed channel.

<a name="Client.Closed"></a>
### func \(\*Client\) Closed

```go
func (c *Client) Closed() <-chan struct{}
```

Closed returns a channel closed when client is disconnected.

<a name="Client.Events"></a>
### func \(\*Client\) Events

```go
func (c *Client) Events() <-chan Event
```

Events returns receive\-only event stream for this client.

<a name="Client.ID"></a>
### func \(\*Client\) ID

```go
func (c *Client) ID() string
```

ID returns subscriber id.

<a name="Event"></a>
## type Event

Event is the canonical SSE message used by manager, stores, and buses.

```go
type Event struct {
    ID        string    `json:"id"`
    Channel   string    `json:"channel"`
    TenantID  string    `json:"tenant_id,omitempty"`
    Subject   string    `json:"subject,omitempty"`
    Type      string    `json:"type,omitempty"`
    Data      []byte    `json:"data"`
    RetryMS   int       `json:"retry_ms,omitempty"`
    Timestamp time.Time `json:"timestamp"`
}
```

<a name="EventBusAdapter"></a>
## type EventBusAdapter

EventBusAdapter bridges SSE bus interface to framework eventbus adapters \(Kafka/RabbitMQ/SQS depending on selected eventbus implementation\).

```go
type EventBusAdapter struct {
    // contains filtered or unexported fields
}
```

<a name="NewEventBusAdapter"></a>
### func NewEventBusAdapter

```go
func NewEventBusAdapter(bus eventbus.EventBus, cfg EventBusConfig) (*EventBusAdapter, error)
```

NewEventBusAdapter wraps a framework eventbus into SSE distributed bus.

<a name="EventBusAdapter.Close"></a>
### func \(\*EventBusAdapter\) Close

```go
func (b *EventBusAdapter) Close() error
```

Close closes underlying event bus.

<a name="EventBusAdapter.Publish"></a>
### func \(\*EventBusAdapter\) Publish

```go
func (b *EventBusAdapter) Publish(ctx context.Context, event Event) error
```

Publish sends one SSE event into event bus topic.

<a name="EventBusAdapter.Subscribe"></a>
### func \(\*EventBusAdapter\) Subscribe

```go
func (b *EventBusAdapter) Subscribe(ctx context.Context, channel string, handler func(Event)) (Subscription, error)
```

Subscribe listens to one channel topic and forwards decoded events.

<a name="EventBusConfig"></a>
## type EventBusConfig

EventBusConfig configures generic SSE bus backed by framework eventbus adapters.

```go
type EventBusConfig struct {
    TopicPrefix      string
    OperationTimeout time.Duration
}
```

<a name="Handler"></a>
## type Handler

Handler exposes SSE endpoint adapter for framework routers.

```go
type Handler struct {
    // contains filtered or unexported fields
}
```

<a name="NewHandler"></a>
### func NewHandler

```go
func NewHandler(cfg HandlerConfig) (*Handler, error)
```

NewHandler creates an SSE HTTP handler.

<a name="Handler.Stream"></a>
### func \(\*Handler\) Stream

```go
func (h *Handler) Stream() router.HandlerFunc
```

Stream returns a router\-agnostic SSE endpoint.

<a name="HandlerConfig"></a>
## type HandlerConfig

HandlerConfig configures router\-agnostic SSE HTTP handler.

```go
type HandlerConfig struct {
    Manager *Manager
    // Query key for channel name, default "channel".
    ChannelQueryParam string
    // Query key for optional tenant routing, default "tenant".
    TenantQueryParam string
    // Query key for optional subject routing, default "subject".
    SubjectQueryParam string
    // Query key for explicit Last-Event-ID fallback, default "last_event_id".
    LastEventIDQueryParam string

    AuthorizeSubscribe AuthorizeSubscribeFunc
}
```

<a name="InMemoryBus"></a>
## type InMemoryBus

InMemoryBus is a local\-only pub/sub bus used for tests/dev.

```go
type InMemoryBus struct {
    // contains filtered or unexported fields
}
```

<a name="NewInMemoryBus"></a>
### func NewInMemoryBus

```go
func NewInMemoryBus() *InMemoryBus
```

NewInMemoryBus creates a local in\-memory bus.

<a name="InMemoryBus.Close"></a>
### func \(\*InMemoryBus\) Close

```go
func (b *InMemoryBus) Close() error
```

Close is a no\-op for in\-memory bus.

<a name="InMemoryBus.Publish"></a>
### func \(\*InMemoryBus\) Publish

```go
func (b *InMemoryBus) Publish(_ context.Context, event Event) error
```

Publish delivers event to subscribed handlers on the same process.

<a name="InMemoryBus.Subscribe"></a>
### func \(\*InMemoryBus\) Subscribe

```go
func (b *InMemoryBus) Subscribe(_ context.Context, channel string, handler func(Event)) (Subscription, error)
```

Subscribe registers a channel handler.

<a name="InMemoryStore"></a>
## type InMemoryStore

InMemoryStore keeps replay buffers in memory \(single\-node/dev usage\).

```go
type InMemoryStore struct {
    // contains filtered or unexported fields
}
```

<a name="NewInMemoryStore"></a>
### func NewInMemoryStore

```go
func NewInMemoryStore(maxSize int) *InMemoryStore
```

NewInMemoryStore creates an in\-memory replay store.

<a name="InMemoryStore.Append"></a>
### func \(\*InMemoryStore\) Append

```go
func (s *InMemoryStore) Append(_ context.Context, event Event) error
```

Append stores one event in channel replay buffer.

<a name="InMemoryStore.Close"></a>
### func \(\*InMemoryStore\) Close

```go
func (s *InMemoryStore) Close() error
```

Close is a no\-op for in\-memory store.

<a name="InMemoryStore.GetSince"></a>
### func \(\*InMemoryStore\) GetSince

```go
func (s *InMemoryStore) GetSince(_ context.Context, channel, lastEventID string, limit int) ([]Event, error)
```

GetSince returns events strictly newer than lastEventID, in chronological order.

<a name="Manager"></a>
## type Manager

Manager handles local SSE clients and distributed fan\-out via bus.

```go
type Manager struct {
    // contains filtered or unexported fields
}
```

<a name="NewManager"></a>
### func NewManager

```go
func NewManager(cfg ManagerConfig, store Store, bus Bus) *Manager
```

NewManager creates an SSE manager with optional bus/store.

<a name="Manager.Close"></a>
### func \(\*Manager\) Close

```go
func (m *Manager) Close() error
```

Close closes manager, bus and store.

<a name="Manager.Disconnect"></a>
### func \(\*Manager\) Disconnect

```go
func (m *Manager) Disconnect(clientID string) error
```

Disconnect removes and closes one local connection.

<a name="Manager.Publish"></a>
### func \(\*Manager\) Publish

```go
func (m *Manager) Publish(ctx context.Context, req PublishRequest) (Event, error)
```

Publish app\-level event to replay store and distributed bus/local subscribers.

<a name="Manager.Subscribe"></a>
### func \(\*Manager\) Subscribe

```go
func (m *Manager) Subscribe(ctx context.Context, req SubscriptionRequest) (*Client, []Event, error)
```

Subscribe registers a new local SSE client and returns replay events.

<a name="ManagerConfig"></a>
## type ManagerConfig

ManagerConfig configures SSE connection manager.

```go
type ManagerConfig struct {
    InstanceID         string
    MaxConnections     int
    ClientBuffer       int
    ReplayLimit        int
    DropOnBackpressure bool
    HeartbeatInterval  time.Duration
    DefaultRetryMS     int
}
```

<a name="DefaultManagerConfig"></a>
### func DefaultManagerConfig

```go
func DefaultManagerConfig() ManagerConfig
```

DefaultManagerConfig returns defaults tuned for API SSE usage.

<a name="PublishRequest"></a>
## type PublishRequest

PublishRequest describes an outgoing SSE event.

```go
type PublishRequest struct {
    Channel  string
    TenantID string
    Subject  string
    Type     string
    Data     []byte
    RetryMS  int
}
```

<a name="RedisBus"></a>
## type RedisBus

RedisBus uses Redis pub/sub for distributed fan\-out.

```go
type RedisBus struct {
    // contains filtered or unexported fields
}
```

<a name="NewRedisBus"></a>
### func NewRedisBus

```go
func NewRedisBus(cfg RedisBusConfig) (*RedisBus, error)
```

NewRedisBus creates a Redis\-backed distributed bus.

<a name="RedisBus.Close"></a>
### func \(\*RedisBus\) Close

```go
func (b *RedisBus) Close() error
```

Close closes Redis client.

<a name="RedisBus.Publish"></a>
### func \(\*RedisBus\) Publish

```go
func (b *RedisBus) Publish(ctx context.Context, event Event) error
```

Publish pushes event to redis channel.

<a name="RedisBus.Subscribe"></a>
### func \(\*RedisBus\) Subscribe

```go
func (b *RedisBus) Subscribe(ctx context.Context, channel string, handler func(Event)) (Subscription, error)
```

Subscribe consumes redis pub/sub channel and forwards decoded events.

<a name="RedisBusConfig"></a>
## type RedisBusConfig

RedisBusConfig configures Redis pub/sub distributed bus.

```go
type RedisBusConfig struct {
    URL              string
    Prefix           string
    OperationTimeout time.Duration
    MaxConns         int
}
```

<a name="RedisStore"></a>
## type RedisStore

RedisStore persists replay history in Redis lists.

```go
type RedisStore struct {
    // contains filtered or unexported fields
}
```

<a name="NewRedisStore"></a>
### func NewRedisStore

```go
func NewRedisStore(cfg RedisStoreConfig) (*RedisStore, error)
```

NewRedisStore creates a Redis replay store.

<a name="RedisStore.Append"></a>
### func \(\*RedisStore\) Append

```go
func (s *RedisStore) Append(ctx context.Context, event Event) error
```

Append stores one event and trims replay list to max size.

<a name="RedisStore.Close"></a>
### func \(\*RedisStore\) Close

```go
func (s *RedisStore) Close() error
```

Close closes Redis client.

<a name="RedisStore.GetSince"></a>
### func \(\*RedisStore\) GetSince

```go
func (s *RedisStore) GetSince(ctx context.Context, channel, lastEventID string, limit int) ([]Event, error)
```

GetSince returns chronological replay events newer than lastEventID.

<a name="RedisStoreConfig"></a>
## type RedisStoreConfig

RedisStoreConfig configures Redis replay storage.

```go
type RedisStoreConfig struct {
    URL              string
    Prefix           string
    MaxSize          int64
    OperationTimeout time.Duration
    MaxConns         int
}
```

<a name="Store"></a>
## type Store

Store persists a short replay history for Last\-Event\-ID recovery.

```go
type Store interface {
    Append(ctx context.Context, event Event) error
    GetSince(ctx context.Context, channel, lastEventID string, limit int) ([]Event, error)
    Close() error
}
```

<a name="Subscription"></a>
## type Subscription

Subscription represents a cancelable bus subscription.

```go
type Subscription interface {
    Close() error
}
```

<a name="SubscriptionRequest"></a>
## type SubscriptionRequest

SubscriptionRequest describes channel \+ routing context for new connection.

```go
type SubscriptionRequest struct {
    ClientID    string
    Channel     string
    TenantID    string
    Subject     string
    LastEventID string
}
```

# ws

```go
import "github.com/nimburion/nimburion/pkg/realtime/ws"
```

## Index

- [Constants](<#constants>)
- [func ParseTopics\(raw string, maxCount, maxLen int\) \(\[\]string, error\)](<#ParseTopics>)
- [type Config](<#Config>)
  - [func DefaultConfig\(\) Config](<#DefaultConfig>)
- [type Conn](<#Conn>)
  - [func Upgrade\(w http.ResponseWriter, r \*http.Request, cfg Config\) \(\*Conn, \[\]string, error\)](<#Upgrade>)
  - [func \(c \*Conn\) Close\(\) error](<#Conn.Close>)
  - [func \(c \*Conn\) HandlePingPong\(ctx context.Context\) \<\-chan struct\{\}](<#Conn.HandlePingPong>)
  - [func \(c \*Conn\) ReadFrame\(\) \(byte, \[\]byte, error\)](<#Conn.ReadFrame>)
  - [func \(c \*Conn\) StartKeepalive\(ctx context.Context, interval time.Duration, messageFunc func\(\) interface\{\}\) context.CancelFunc](<#Conn.StartKeepalive>)
  - [func \(c \*Conn\) WriteFrame\(opcode byte, payload \[\]byte\) error](<#Conn.WriteFrame>)
  - [func \(c \*Conn\) WriteJSON\(payload interface\{\}\) error](<#Conn.WriteJSON>)


## Constants

<a name="OpText"></a>

```go
const (
    OpText  byte = 0x1
    OpClose byte = 0x8
    OpPing  byte = 0x9
    OpPong  byte = 0xA
)
```

<a name="ParseTopics"></a>
## func ParseTopics

```go
func ParseTopics(raw string, maxCount, maxLen int) ([]string, error)
```

ParseTopics TODO: add description

<a name="Config"></a>
## type Config

Config configures WebSocket upgrade behavior including origin validation, topic parsing, and keepalive.

```go
type Config struct {
    // Legacy origin allow-list. When OriginPolicy is not set:
    // - empty list means allow all origins (legacy behavior)
    // - non-empty list means exact-match allow-list.
    AllowedOrigins []string
    // OriginPolicy enables advanced origin validation shared with HTTP CORS middleware.
    OriginPolicy     cors.Config
    TopicsQueryParam string
    ReadLimit        int
    WriteTimeout     time.Duration
    MaxTopicCount    int
    MaxTopicLength   int
    // KeepaliveInterval enables automatic keepalive messages. Zero disables keepalive.
    KeepaliveInterval time.Duration
    // RequireAuth requires JWT authentication before upgrade. When true, claims are available in OnConnect.
    RequireAuth bool
}
```

<a name="DefaultConfig"></a>
### func DefaultConfig

```go
func DefaultConfig() Config
```

DefaultConfig returns a Config with sensible defaults for WebSocket connections.

<a name="Conn"></a>
## type Conn

Conn represents an upgraded WebSocket connection with frame\-level read/write operations.

```go
type Conn struct {
    // contains filtered or unexported fields
}
```

<a name="Upgrade"></a>
### func Upgrade

```go
func Upgrade(w http.ResponseWriter, r *http.Request, cfg Config) (*Conn, []string, error)
```

Upgrade upgrades an HTTP connection to WebSocket protocol and returns the connection with parsed topics. Validates origin, WebSocket headers, and extracts topics from query parameters.

<a name="Conn.Close"></a>
### func \(\*Conn\) Close

```go
func (c *Conn) Close() error
```

Close releases all resources held by this instance. Should be called when the instance is no longer needed.

<a name="Conn.HandlePingPong"></a>
### func \(\*Conn\) HandlePingPong

```go
func (c *Conn) HandlePingPong(ctx context.Context) <-chan struct{}
```

HandlePingPong starts a goroutine that automatically responds to ping frames. Returns a channel that closes when the connection is closed or an error occurs.

<a name="Conn.ReadFrame"></a>
### func \(\*Conn\) ReadFrame

```go
func (c *Conn) ReadFrame() (byte, []byte, error)
```

ReadFrame TODO: add description

<a name="Conn.StartKeepalive"></a>
### func \(\*Conn\) StartKeepalive

```go
func (c *Conn) StartKeepalive(ctx context.Context, interval time.Duration, messageFunc func() interface{}) context.CancelFunc
```

StartKeepalive starts a goroutine that sends periodic keepalive messages. Returns a cancel function to stop the keepalive loop.

<a name="Conn.WriteFrame"></a>
### func \(\*Conn\) WriteFrame

```go
func (c *Conn) WriteFrame(opcode byte, payload []byte) error
```

WriteFrame TODO: add description

<a name="Conn.WriteJSON"></a>
### func \(\*Conn\) WriteJSON

```go
func (c *Conn) WriteJSON(payload interface{}) error
```

WriteJSON TODO: add description

Generated by [gomarkdoc](<https://github.com/princjef/gomarkdoc>)
