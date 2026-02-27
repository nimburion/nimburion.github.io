---
layout: documentation
title: pkg/config
---


# config

```go
import "github.com/nimburion/nimburion/pkg/config"
```

## Index

- [Constants](<#constants>)
- [func RegisterFlagsFromStruct\(flags \*pflag.FlagSet, target interface\{\}\) error](<#RegisterFlagsFromStruct>)
- [type AsyncLoggingConfig](<#AsyncLoggingConfig>)
- [type AuthClaimRule](<#AuthClaimRule>)
- [type AuthClaimsConfig](<#AuthClaimsConfig>)
- [type AuthConfig](<#AuthConfig>)
- [type CORSConfig](<#CORSConfig>)
- [type CSRFConfig](<#CSRFConfig>)
- [type CacheConfig](<#CacheConfig>)
- [type Config](<#Config>)
  - [func DefaultConfig\(\) \*Config](<#DefaultConfig>)
  - [func \(c \*Config\) Redacted\(secrets \*Config\) string](<#Config.Redacted>)
  - [func \(c \*Config\) String\(\) string](<#Config.String>)
  - [func \(c \*Config\) Validate\(\) error](<#Config.Validate>)
- [type ConfigProvider](<#ConfigProvider>)
  - [func NewConfigProvider\(configFile, envPrefix string\) \*ConfigProvider](<#NewConfigProvider>)
  - [func \(p \*ConfigProvider\) AllSettings\(\) map\[string\]interface\{\}](<#ConfigProvider.AllSettings>)
  - [func \(p \*ConfigProvider\) ConfigFile\(\) string](<#ConfigProvider.ConfigFile>)
  - [func \(p \*ConfigProvider\) Load\(core \*Config, extensions ...interface\{\}\) error](<#ConfigProvider.Load>)
  - [func \(p \*ConfigProvider\) LoadWithSecrets\(core \*Config, extensions ...interface\{\}\) \(map\[string\]interface\{\}, error\)](<#ConfigProvider.LoadWithSecrets>)
  - [func \(p \*ConfigProvider\) WithFlags\(flags \*pflag.FlagSet\) \*ConfigProvider](<#ConfigProvider.WithFlags>)
  - [func \(p \*ConfigProvider\) WithServiceNameDefault\(serviceName string\) \*ConfigProvider](<#ConfigProvider.WithServiceNameDefault>)
- [type DatabaseConfig](<#DatabaseConfig>)
- [type EmailConfig](<#EmailConfig>)
- [type EmailMailgunConfig](<#EmailMailgunConfig>)
- [type EmailMailjetConfig](<#EmailMailjetConfig>)
- [type EmailPostmarkConfig](<#EmailPostmarkConfig>)
- [type EmailSESConfig](<#EmailSESConfig>)
- [type EmailSMTPConfig](<#EmailSMTPConfig>)
- [type EmailTokenConfig](<#EmailTokenConfig>)
- [type EventBusConfig](<#EventBusConfig>)
- [type HTTPConfig](<#HTTPConfig>)
- [type HTTPSignatureConfig](<#HTTPSignatureConfig>)
- [type I18nConfig](<#I18nConfig>)
- [type JobsConfig](<#JobsConfig>)
- [type JobsDLQConfig](<#JobsDLQConfig>)
- [type JobsRedisConfig](<#JobsRedisConfig>)
- [type JobsRetryConfig](<#JobsRetryConfig>)
- [type JobsWorkerConfig](<#JobsWorkerConfig>)
- [type KafkaValidationConfig](<#KafkaValidationConfig>)
- [type Loader](<#Loader>)
- [type ManagementConfig](<#ManagementConfig>)
- [type ObjectStorageConfig](<#ObjectStorageConfig>)
- [type ObjectStorageS3Config](<#ObjectStorageS3Config>)
- [type ObservabilityConfig](<#ObservabilityConfig>)
- [type RateLimitConfig](<#RateLimitConfig>)
- [type RateLimitRedisConfig](<#RateLimitRedisConfig>)
- [type RequestLogPathPolicy](<#RequestLogPathPolicy>)
- [type RequestLoggingConfig](<#RequestLoggingConfig>)
- [type RequestTimeoutConfig](<#RequestTimeoutConfig>)
- [type RequestTimeoutPathPolicy](<#RequestTimeoutPathPolicy>)
- [type RequestTracePathPolicy](<#RequestTracePathPolicy>)
- [type RequestTracingConfig](<#RequestTracingConfig>)
- [type SSEConfig](<#SSEConfig>)
- [type SSEEventBusConfig](<#SSEEventBusConfig>)
- [type SSERedisConfig](<#SSERedisConfig>)
- [type SchedulerConfig](<#SchedulerConfig>)
- [type SchedulerPostgresConfig](<#SchedulerPostgresConfig>)
- [type SchedulerRedisConfig](<#SchedulerRedisConfig>)
- [type SchedulerTaskConfig](<#SchedulerTaskConfig>)
- [type SearchConfig](<#SearchConfig>)
- [type SecurityConfig](<#SecurityConfig>)
- [type SecurityHeadersConfig](<#SecurityHeadersConfig>)
- [type ServiceConfig](<#ServiceConfig>)
- [type SessionConfig](<#SessionConfig>)
- [type SessionMemcachedConfig](<#SessionMemcachedConfig>)
- [type SessionRedisConfig](<#SessionRedisConfig>)
- [type SwaggerConfig](<#SwaggerConfig>)
- [type ValidationConfig](<#ValidationConfig>)
- [type ViperLoader](<#ViperLoader>)
  - [func NewViperLoader\(configFile, envPrefix string\) \*ViperLoader](<#NewViperLoader>)
  - [func \(l \*ViperLoader\) Load\(\) \(\*Config, error\)](<#ViperLoader.Load>)
  - [func \(l \*ViperLoader\) LoadWithSecrets\(\) \(\*Config, \*Config, error\)](<#ViperLoader.LoadWithSecrets>)
  - [func \(l \*ViperLoader\) Validate\(cfg \*Config\) error](<#ViperLoader.Validate>)
  - [func \(l \*ViperLoader\) WithServiceNameDefault\(serviceName string\) \*ViperLoader](<#ViperLoader.WithServiceNameDefault>)


## Constants

<a name="DatabaseTypePostgres"></a>

```go
const (
    DatabaseTypePostgres = "postgres"
    DatabaseTypeMySQL    = "mysql"
    DatabaseTypeMongoDB  = "mongodb"
    DatabaseTypeDynamoDB = "dynamodb"
)
```

<a name="EventBusTypeKafka"></a>

```go
const (
    EventBusTypeKafka    = "kafka"
    EventBusTypeRabbitMQ = "rabbitmq"
    EventBusTypeSQS      = "sqs"
)
```

<a name="JobsBackendEventBus"></a>

```go
const (
    JobsBackendEventBus = "eventbus"
    JobsBackendRedis    = "redis"
)
```

<a name="SchedulerLockProviderRedis"></a>

```go
const (
    SchedulerLockProviderRedis    = "redis"
    SchedulerLockProviderPostgres = "postgres"
)
```

<a name="RegisterFlagsFromStruct"></a>
## func RegisterFlagsFromStruct

```go
func RegisterFlagsFromStruct(flags *pflag.FlagSet, target interface{}) error
```

RegisterFlagsFromStruct automatically creates pflags for all struct fields with \`flag\` tags. Supports string, bool, int, duration, and string slice types. Flag names and defaults are derived from struct tags.

<a name="AsyncLoggingConfig"></a>
## type AsyncLoggingConfig

AsyncLoggingConfig configures optional asynchronous logger dispatching.

```go
type AsyncLoggingConfig struct {
    Enabled      bool `mapstructure:"enabled"`
    QueueSize    int  `mapstructure:"queue_size"`
    WorkerCount  int  `mapstructure:"worker_count"`
    DropWhenFull bool `mapstructure:"drop_when_full"`
}
```

<a name="AuthClaimRule"></a>
## type AuthClaimRule

AuthClaimRule configures one declarative claim guard rule.

```go
type AuthClaimRule struct {
    Claim    string   `mapstructure:"claim"`
    Aliases  []string `mapstructure:"aliases"`
    Source   string   `mapstructure:"source"`   // route, header, query
    Key      string   `mapstructure:"key"`      // parameter/header/query key
    Operator string   `mapstructure:"operator"` // required, equals, one_of, regex
    Values   []string `mapstructure:"values"`
    Optional bool     `mapstructure:"optional"`
}
```

<a name="AuthClaimsConfig"></a>
## type AuthClaimsConfig

AuthClaimsConfig configures claim mappings and declarative guard rules.

```go
type AuthClaimsConfig struct {
    Rules    []AuthClaimRule     `mapstructure:"rules"`
    Mappings map[string][]string `mapstructure:"mappings"`
}
```

<a name="AuthConfig"></a>
## type AuthConfig

AuthConfig configures OAuth2/OIDC authentication

```go
type AuthConfig struct {
    Enabled      bool             `mapstructure:"enabled"`
    Issuer       string           `mapstructure:"issuer"`
    JWKSUrl      string           `mapstructure:"jwks_url"`
    JWKSCacheTTL time.Duration    `mapstructure:"jwks_cache_ttl"`
    Audience     string           `mapstructure:"audience"`
    Claims       AuthClaimsConfig `mapstructure:"claims"`
}
```

<a name="CORSConfig"></a>
## type CORSConfig

CORSConfig configures CORS middleware for browser\-based clients.

```go
type CORSConfig struct {
    Enabled                   bool          `mapstructure:"enabled"`
    AllowAllOrigins           bool          `mapstructure:"allow_all_origins"`
    AllowOrigins              []string      `mapstructure:"allow_origins"`
    AllowMethods              []string      `mapstructure:"allow_methods"`
    AllowPrivateNetwork       bool          `mapstructure:"allow_private_network"`
    AllowHeaders              []string      `mapstructure:"allow_headers"`
    ExposeHeaders             []string      `mapstructure:"expose_headers"`
    AllowCredentials          bool          `mapstructure:"allow_credentials"`
    MaxAge                    time.Duration `mapstructure:"max_age"`
    AllowWildcard             bool          `mapstructure:"allow_wildcard"`
    AllowBrowserExtensions    bool          `mapstructure:"allow_browser_extensions"`
    CustomSchemas             []string      `mapstructure:"custom_schemas"`
    AllowWebSockets           bool          `mapstructure:"allow_websockets"`
    AllowFiles                bool          `mapstructure:"allow_files"`
    OptionsResponseStatusCode int           `mapstructure:"options_response_status_code"`
}
```

<a name="CSRFConfig"></a>
## type CSRFConfig

CSRFConfig configures CSRF middleware for cookie/session authentication.

```go
type CSRFConfig struct {
    Enabled        bool          `mapstructure:"enabled"`
    HeaderName     string        `mapstructure:"header_name"`
    CookieName     string        `mapstructure:"cookie_name"`
    CookiePath     string        `mapstructure:"cookie_path"`
    CookieDomain   string        `mapstructure:"cookie_domain"`
    CookieSecure   bool          `mapstructure:"cookie_secure"`
    CookieSameSite string        `mapstructure:"cookie_same_site"` // lax, strict, none
    CookieTTL      time.Duration `mapstructure:"cookie_ttl"`
    ExemptMethods  []string      `mapstructure:"exempt_methods"`
    ExemptPaths    []string      `mapstructure:"exempt_paths"`
}
```

<a name="CacheConfig"></a>
## type CacheConfig

CacheConfig configures cache connections

```go
type CacheConfig struct {
    Type             string        `mapstructure:"type"` // redis, inmemory
    URL              string        `mapstructure:"url"`
    MaxConns         int           `mapstructure:"max_conns"`
    OperationTimeout time.Duration `mapstructure:"operation_timeout"`
}
```

<a name="Config"></a>
## type Config

Config is the root configuration structure for the microservice framework

```go
type Config struct {
    RouterType      string `mapstructure:"router_type"`
    Service         ServiceConfig
    HTTP            HTTPConfig
    Management      ManagementConfig
    CORS            CORSConfig
    SecurityHeaders SecurityHeadersConfig `mapstructure:"security_headers"`
    Security        SecurityConfig        `mapstructure:"security"`
    I18n            I18nConfig            `mapstructure:"i18n"`
    Session         SessionConfig         `mapstructure:"session"`
    CSRF            CSRFConfig            `mapstructure:"csrf"`
    SSE             SSEConfig             `mapstructure:"sse"`
    Email           EmailConfig           `mapstructure:"email"`
    Auth            AuthConfig
    Database        DatabaseConfig
    Cache           CacheConfig
    ObjectStorage   ObjectStorageConfig `mapstructure:"object_storage"`
    Search          SearchConfig
    EventBus        EventBusConfig  `mapstructure:"eventbus"`
    Jobs            JobsConfig      `mapstructure:"jobs"`
    Scheduler       SchedulerConfig `mapstructure:"scheduler"`
    Validation      ValidationConfig
    Observability   ObservabilityConfig
    Swagger         SwaggerConfig
    RateLimit       RateLimitConfig
}
```

<a name="DefaultConfig"></a>
### func DefaultConfig

```go
func DefaultConfig() *Config
```

DefaultConfig returns a Config with sensible default values

<a name="Config.Redacted"></a>
### func \(\*Config\) Redacted

```go
func (c *Config) Redacted(secrets *Config) string
```

Redacted returns the configuration with secrets masked. Pass the secrets Config returned by LoadWithSecrets\(\) to mask those values.

<a name="Config.String"></a>
### func \(\*Config\) String

```go
func (c *Config) String() string
```

String returns the full configuration as a formatted string

<a name="Config.Validate"></a>
### func \(\*Config\) Validate

```go
func (c *Config) Validate() error
```

Validate checks if the configuration is valid

<a name="ConfigProvider"></a>
## type ConfigProvider

ConfigProvider manages configuration loading from files, environment variables, and flags. It supports core configuration and optional extension structs with automatic binding.

```go
type ConfigProvider struct {
    // contains filtered or unexported fields
}
```

<a name="NewConfigProvider"></a>
### func NewConfigProvider

```go
func NewConfigProvider(configFile, envPrefix string) *ConfigProvider
```

NewConfigProvider creates a new ConfigProvider instance.

<a name="ConfigProvider.AllSettings"></a>
### func \(\*ConfigProvider\) AllSettings

```go
func (p *ConfigProvider) AllSettings() map[string]interface{}
```

AllSettings returns the effective merged settings currently held by the provider.

<a name="ConfigProvider.ConfigFile"></a>
### func \(\*ConfigProvider\) ConfigFile

```go
func (p *ConfigProvider) ConfigFile() string
```

ConfigFile returns the path to the config file that was loaded, or empty string if none.

<a name="ConfigProvider.Load"></a>
### func \(\*ConfigProvider\) Load

```go
func (p *ConfigProvider) Load(core *Config, extensions ...interface{}) error
```

Load loads configuration from file, environment variables, and flags with precedence order: defaults \< config file \< env vars \< flags. Validates the final configuration.

<a name="ConfigProvider.LoadWithSecrets"></a>
### func \(\*ConfigProvider\) LoadWithSecrets

```go
func (p *ConfigProvider) LoadWithSecrets(core *Config, extensions ...interface{}) (map[string]interface{}, error)
```

LoadWithSecrets loads core \+ extension config including secrets merge. Returns the raw secrets map used for redaction \(nil when no secrets file was loaded\).

<a name="ConfigProvider.WithFlags"></a>
### func \(\*ConfigProvider\) WithFlags

```go
func (p *ConfigProvider) WithFlags(flags *pflag.FlagSet) *ConfigProvider
```

WithFlags registers pflags that will be bound to configuration fields during Load. Flags take highest precedence in the configuration hierarchy. Returns self for chaining.

<a name="ConfigProvider.WithServiceNameDefault"></a>
### func \(\*ConfigProvider\) WithServiceNameDefault

```go
func (p *ConfigProvider) WithServiceNameDefault(serviceName string) *ConfigProvider
```

WithServiceNameDefault sets a fallback service name used when service.name is not configured. Returns self for chaining.

<a name="DatabaseConfig"></a>
## type DatabaseConfig

DatabaseConfig configures database connections

```go
type DatabaseConfig struct {
    Type            string        `mapstructure:"type"` // postgres, mysql, mongodb, dynamodb
    URL             string        `mapstructure:"url"`
    MaxOpenConns    int           `mapstructure:"max_open_conns"`
    MaxIdleConns    int           `mapstructure:"max_idle_conns"`
    ConnMaxLifetime time.Duration `mapstructure:"conn_max_lifetime"`
    ConnMaxIdleTime time.Duration `mapstructure:"conn_max_idle_time"`
    QueryTimeout    time.Duration `mapstructure:"query_timeout"`
    DatabaseName    string        `mapstructure:"database_name"`
    ConnectTimeout  time.Duration `mapstructure:"connect_timeout"`
    Region          string        `mapstructure:"region"`
    Endpoint        string        `mapstructure:"endpoint"`
    AccessKeyID     string        `mapstructure:"access_key_id"`
    SecretAccessKey string        `mapstructure:"secret_access_key"`
    SessionToken    string        `mapstructure:"session_token"`
}
```

<a name="EmailConfig"></a>
## type EmailConfig

EmailConfig configures pluggable outbound email providers.

```go
type EmailConfig struct {
    Enabled  bool   `mapstructure:"enabled"`
    Provider string `mapstructure:"provider"` // smtp, ses, sendgrid, mailgun, mailchimp, mailersend, postmark, mailtrap, smtp2go, sendpulse, brevo, mailjet

    SMTP       EmailSMTPConfig     `mapstructure:"smtp"`
    SES        EmailSESConfig      `mapstructure:"ses"`
    SendGrid   EmailTokenConfig    `mapstructure:"sendgrid"`
    Mailgun    EmailMailgunConfig  `mapstructure:"mailgun"`
    Mailchimp  EmailTokenConfig    `mapstructure:"mailchimp"`
    MailerSend EmailTokenConfig    `mapstructure:"mailersend"`
    Postmark   EmailPostmarkConfig `mapstructure:"postmark"`
    Mailtrap   EmailTokenConfig    `mapstructure:"mailtrap"`
    SMTP2GO    EmailTokenConfig    `mapstructure:"smtp2go"`
    SendPulse  EmailTokenConfig    `mapstructure:"sendpulse"`
    Brevo      EmailTokenConfig    `mapstructure:"brevo"`
    Mailjet    EmailMailjetConfig  `mapstructure:"mailjet"`
}
```

<a name="EmailMailgunConfig"></a>
## type EmailMailgunConfig

EmailMailgunConfig configures Mailgun provider.

```go
type EmailMailgunConfig struct {
    Token            string        `mapstructure:"token"`
    Domain           string        `mapstructure:"domain"`
    From             string        `mapstructure:"from"`
    BaseURL          string        `mapstructure:"base_url"`
    OperationTimeout time.Duration `mapstructure:"operation_timeout"`
}
```

<a name="EmailMailjetConfig"></a>
## type EmailMailjetConfig

EmailMailjetConfig configures Mailjet provider.

```go
type EmailMailjetConfig struct {
    APIKey           string        `mapstructure:"api_key"`
    APISecret        string        `mapstructure:"api_secret"`
    From             string        `mapstructure:"from"`
    BaseURL          string        `mapstructure:"base_url"`
    OperationTimeout time.Duration `mapstructure:"operation_timeout"`
}
```

<a name="EmailPostmarkConfig"></a>
## type EmailPostmarkConfig

EmailPostmarkConfig configures Postmark provider.

```go
type EmailPostmarkConfig struct {
    ServerToken      string        `mapstructure:"server_token"`
    From             string        `mapstructure:"from"`
    BaseURL          string        `mapstructure:"base_url"`
    OperationTimeout time.Duration `mapstructure:"operation_timeout"`
}
```

<a name="EmailSESConfig"></a>
## type EmailSESConfig

EmailSESConfig configures AWS SES provider.

```go
type EmailSESConfig struct {
    Region           string        `mapstructure:"region"`
    Endpoint         string        `mapstructure:"endpoint"`
    AccessKeyID      string        `mapstructure:"access_key_id"`
    SecretAccessKey  string        `mapstructure:"secret_access_key"`
    SessionToken     string        `mapstructure:"session_token"`
    From             string        `mapstructure:"from"`
    OperationTimeout time.Duration `mapstructure:"operation_timeout"`
}
```

<a name="EmailSMTPConfig"></a>
## type EmailSMTPConfig

EmailSMTPConfig configures SMTP provider.

```go
type EmailSMTPConfig struct {
    Host               string        `mapstructure:"host"`
    Port               int           `mapstructure:"port"`
    Username           string        `mapstructure:"username"`
    Password           string        `mapstructure:"password"`
    From               string        `mapstructure:"from"`
    EnableTLS          bool          `mapstructure:"enable_tls"`
    InsecureSkipVerify bool          `mapstructure:"insecure_skip_verify"`
    OperationTimeout   time.Duration `mapstructure:"operation_timeout"`
}
```

<a name="EmailTokenConfig"></a>
## type EmailTokenConfig

EmailTokenConfig configures token\-based HTTP email providers.

```go
type EmailTokenConfig struct {
    Token            string        `mapstructure:"token"`
    From             string        `mapstructure:"from"`
    BaseURL          string        `mapstructure:"base_url"`
    OperationTimeout time.Duration `mapstructure:"operation_timeout"`
}
```

<a name="EventBusConfig"></a>
## type EventBusConfig

EventBusConfig configures message broker connections

```go
type EventBusConfig struct {
    Type              string        `mapstructure:"type"` // kafka, rabbitmq, sqs
    Brokers           []string      `mapstructure:"brokers"`
    Serializer        string        `mapstructure:"serializer"` // json, protobuf, avro
    OperationTimeout  time.Duration `mapstructure:"operation_timeout"`
    GroupID           string        `mapstructure:"group_id"`
    URL               string        `mapstructure:"url"`
    Exchange          string        `mapstructure:"exchange"`
    ExchangeType      string        `mapstructure:"exchange_type"`
    QueueName         string        `mapstructure:"queue_name"`
    RoutingKey        string        `mapstructure:"routing_key"`
    ConsumerTag       string        `mapstructure:"consumer_tag"`
    Region            string        `mapstructure:"region"`
    QueueURL          string        `mapstructure:"queue_url"`
    Endpoint          string        `mapstructure:"endpoint"`
    AccessKeyID       string        `mapstructure:"access_key_id"`
    SecretAccessKey   string        `mapstructure:"secret_access_key"`
    SessionToken      string        `mapstructure:"session_token"`
    WaitTimeSeconds   int32         `mapstructure:"wait_time_seconds"`
    MaxMessages       int32         `mapstructure:"max_messages"`
    VisibilityTimeout int32         `mapstructure:"visibility_timeout"`
}
```

<a name="HTTPConfig"></a>
## type HTTPConfig

HTTPConfig configures the public API server

```go
type HTTPConfig struct {
    Port           int           `mapstructure:"port"`
    ReadTimeout    time.Duration `mapstructure:"read_timeout"`
    WriteTimeout   time.Duration `mapstructure:"write_timeout"`
    IdleTimeout    time.Duration `mapstructure:"idle_timeout"`
    MaxRequestSize int64         `mapstructure:"max_request_size"`
}
```

<a name="HTTPSignatureConfig"></a>
## type HTTPSignatureConfig

HTTPSignatureConfig configures HMAC request signing verification.

```go
type HTTPSignatureConfig struct {
    Enabled              bool              `mapstructure:"enabled"`
    KeyIDHeader          string            `mapstructure:"key_id_header"`
    TimestampHeader      string            `mapstructure:"timestamp_header"`
    NonceHeader          string            `mapstructure:"nonce_header"`
    SignatureHeader      string            `mapstructure:"signature_header"`
    MaxClockSkew         time.Duration     `mapstructure:"max_clock_skew"`
    NonceTTL             time.Duration     `mapstructure:"nonce_ttl"`
    RequireNonce         bool              `mapstructure:"require_nonce"`
    ExcludedPathPrefixes []string          `mapstructure:"excluded_path_prefixes"`
    StaticKeys           map[string]string `mapstructure:"static_keys"`
}
```

<a name="I18nConfig"></a>
## type I18nConfig

I18nConfig configures locale resolution and translation catalogs.

```go
type I18nConfig struct {
    Enabled          bool     `mapstructure:"enabled"`
    DefaultLocale    string   `mapstructure:"default_locale"`
    SupportedLocales []string `mapstructure:"supported_locales"`
    QueryParam       string   `mapstructure:"query_param"`
    HeaderName       string   `mapstructure:"header_name"`
    FallbackMode     string   `mapstructure:"fallback_mode"` // base, default
    CatalogPath      string   `mapstructure:"catalog_path"`
}
```

<a name="JobsConfig"></a>
## type JobsConfig

JobsConfig configures jobs runtime backend selection.

```go
type JobsConfig struct {
    Backend      string           `mapstructure:"backend"`       // eventbus, redis
    DefaultQueue string           `mapstructure:"default_queue"` // default
    Worker       JobsWorkerConfig `mapstructure:"worker"`
    Retry        JobsRetryConfig  `mapstructure:"retry"`
    DLQ          JobsDLQConfig    `mapstructure:"dlq"`
    Redis        JobsRedisConfig  `mapstructure:"redis"`
}
```

<a name="JobsDLQConfig"></a>
## type JobsDLQConfig

JobsDLQConfig configures dead\-letter queue behavior.

```go
type JobsDLQConfig struct {
    Enabled     bool   `mapstructure:"enabled"`
    QueueSuffix string `mapstructure:"queue_suffix"`
}
```

<a name="JobsRedisConfig"></a>
## type JobsRedisConfig

JobsRedisConfig configures Redis backend for jobs runtime.

```go
type JobsRedisConfig struct {
    URL              string        `mapstructure:"url"`
    Prefix           string        `mapstructure:"prefix"`
    OperationTimeout time.Duration `mapstructure:"operation_timeout"`
}
```

<a name="JobsRetryConfig"></a>
## type JobsRetryConfig

JobsRetryConfig configures retry strategy for failed jobs.

```go
type JobsRetryConfig struct {
    MaxAttempts    int           `mapstructure:"max_attempts"`
    InitialBackoff time.Duration `mapstructure:"initial_backoff"`
    MaxBackoff     time.Duration `mapstructure:"max_backoff"`
    AttemptTimeout time.Duration `mapstructure:"attempt_timeout"`
}
```

<a name="JobsWorkerConfig"></a>
## type JobsWorkerConfig

JobsWorkerConfig configures jobs worker lifecycle.

```go
type JobsWorkerConfig struct {
    Concurrency    int           `mapstructure:"concurrency"`
    LeaseTTL       time.Duration `mapstructure:"lease_ttl"`
    ReserveTimeout time.Duration `mapstructure:"reserve_timeout"`
    StopTimeout    time.Duration `mapstructure:"stop_timeout"`
}
```

<a name="KafkaValidationConfig"></a>
## type KafkaValidationConfig

KafkaValidationConfig configures local schema validation for Kafka events.

```go
type KafkaValidationConfig struct {
    Enabled        bool              `mapstructure:"enabled"`
    Mode           string            `mapstructure:"mode"` // warn, enforce
    DescriptorPath string            `mapstructure:"descriptor_path"`
    DefaultPolicy  string            `mapstructure:"default_policy"` // BACKWARD, FULL
    Subjects       map[string]string `mapstructure:"subjects"`       // subject -> compatibility policy
}
```

<a name="Loader"></a>
## type Loader

Loader defines the interface for loading configuration

```go
type Loader interface {
    Load() (*Config, error)
    Validate(*Config) error
}
```

<a name="ManagementConfig"></a>
## type ManagementConfig

ManagementConfig configures the management server

```go
type ManagementConfig struct {
    Enabled      bool          `mapstructure:"enabled"`
    Port         int           `mapstructure:"port"`
    ReadTimeout  time.Duration `mapstructure:"read_timeout"`
    WriteTimeout time.Duration `mapstructure:"write_timeout"`
    AuthEnabled  bool          `mapstructure:"auth_enabled"`
    MTLSEnabled  bool          `mapstructure:"mtls_enabled"`
    TLSCertFile  string        `mapstructure:"tls_cert_file"`
    TLSKeyFile   string        `mapstructure:"tls_key_file"`
    TLSCAFile    string        `mapstructure:"tls_ca_file"`
}
```

<a name="ObjectStorageConfig"></a>
## type ObjectStorageConfig

ObjectStorageConfig configures object storage backends.

```go
type ObjectStorageConfig struct {
    Enabled bool                  `mapstructure:"enabled"`
    Type    string                `mapstructure:"type"` // s3
    S3      ObjectStorageS3Config `mapstructure:"s3"`
}
```

<a name="ObjectStorageS3Config"></a>
## type ObjectStorageS3Config

ObjectStorageS3Config configures S3\-compatible object storage.

```go
type ObjectStorageS3Config struct {
    Bucket           string        `mapstructure:"bucket"`
    Region           string        `mapstructure:"region"`
    Endpoint         string        `mapstructure:"endpoint"`
    AccessKeyID      string        `mapstructure:"access_key_id"`
    SecretAccessKey  string        `mapstructure:"secret_access_key"`
    SessionToken     string        `mapstructure:"session_token"`
    UsePathStyle     bool          `mapstructure:"use_path_style"`
    OperationTimeout time.Duration `mapstructure:"operation_timeout"`
    PresignExpiry    time.Duration `mapstructure:"presign_expiry"`
}
```

<a name="ObservabilityConfig"></a>
## type ObservabilityConfig

ObservabilityConfig configures logging, metrics, and tracing

```go
type ObservabilityConfig struct {
    LogLevel          string               `mapstructure:"log_level"`
    LogFormat         string               `mapstructure:"log_format"` // json, text
    ServiceName       string               `mapstructure:"service_name"`
    TracingEnabled    bool                 `mapstructure:"tracing_enabled"`
    TracingSampleRate float64              `mapstructure:"tracing_sample_rate"`
    TracingEndpoint   string               `mapstructure:"tracing_endpoint"`
    AsyncLogging      AsyncLoggingConfig   `mapstructure:"async_logging"`
    RequestLogging    RequestLoggingConfig `mapstructure:"request_logging"`
    RequestTracing    RequestTracingConfig `mapstructure:"request_tracing"`
    RequestTimeout    RequestTimeoutConfig `mapstructure:"request_timeout"`
}
```

<a name="RateLimitConfig"></a>
## type RateLimitConfig

RateLimitConfig configures the rate limit middleware.

```go
type RateLimitConfig struct {
    Enabled           bool                 `mapstructure:"enabled"`
    Type              string               `mapstructure:"type"` // local, redis (future memcached)
    RequestsPerSecond int                  `mapstructure:"requests_per_second"`
    Burst             int                  `mapstructure:"burst"`
    Window            time.Duration        `mapstructure:"window"`
    Redis             RateLimitRedisConfig `mapstructure:"redis"`
}
```

<a name="RateLimitRedisConfig"></a>
## type RateLimitRedisConfig

RateLimitRedisConfig configures the Redis\-backed rate limiter backend.

```go
type RateLimitRedisConfig struct {
    URL              string        `mapstructure:"url"`
    MaxConns         int           `mapstructure:"max_conns"`
    OperationTimeout time.Duration `mapstructure:"operation_timeout"`
    Prefix           string        `mapstructure:"prefix"`
}
```

<a name="RequestLogPathPolicy"></a>
## type RequestLogPathPolicy

RequestLogPathPolicy configures request logging mode for a path prefix.

```go
type RequestLogPathPolicy struct {
    PathPrefix string `mapstructure:"path_prefix"`
    Mode       string `mapstructure:"mode"` // off, minimal, full
}
```

<a name="RequestLoggingConfig"></a>
## type RequestLoggingConfig

RequestLoggingConfig configures HTTP request logging middleware behavior.

```go
type RequestLoggingConfig struct {
    Enabled              bool                   `mapstructure:"enabled"`
    LogStart             bool                   `mapstructure:"log_start"`
    Output               string                 `mapstructure:"output"` // logger, stdout, stderr
    Fields               []string               `mapstructure:"fields"`
    ExcludedPathPrefixes []string               `mapstructure:"excluded_path_prefixes"`
    PathPolicies         []RequestLogPathPolicy `mapstructure:"path_policies"`
}
```

<a name="RequestTimeoutConfig"></a>
## type RequestTimeoutConfig

RequestTimeoutConfig configures HTTP timeout middleware behavior.

```go
type RequestTimeoutConfig struct {
    Enabled              bool                       `mapstructure:"enabled"`
    Default              time.Duration              `mapstructure:"default"`
    ExcludedPathPrefixes []string                   `mapstructure:"excluded_path_prefixes"`
    PathPolicies         []RequestTimeoutPathPolicy `mapstructure:"path_policies"`
}
```

<a name="RequestTimeoutPathPolicy"></a>
## type RequestTimeoutPathPolicy

RequestTimeoutPathPolicy configures timeout mode for a path prefix.

```go
type RequestTimeoutPathPolicy struct {
    PathPrefix string `mapstructure:"path_prefix"`
    Mode       string `mapstructure:"mode"` // off, on
}
```

<a name="RequestTracePathPolicy"></a>
## type RequestTracePathPolicy

RequestTracePathPolicy configures tracing mode for a path prefix.

```go
type RequestTracePathPolicy struct {
    PathPrefix string `mapstructure:"path_prefix"`
    Mode       string `mapstructure:"mode"` // off, minimal, full
}
```

<a name="RequestTracingConfig"></a>
## type RequestTracingConfig

RequestTracingConfig configures HTTP tracing middleware behavior.

```go
type RequestTracingConfig struct {
    Enabled              bool                     `mapstructure:"enabled"`
    ExcludedPathPrefixes []string                 `mapstructure:"excluded_path_prefixes"`
    PathPolicies         []RequestTracePathPolicy `mapstructure:"path_policies"`
}
```

<a name="SSEConfig"></a>
## type SSEConfig

SSEConfig configures Server\-Sent Events runtime.

```go
type SSEConfig struct {
    Enabled               bool              `mapstructure:"enabled"`
    Endpoint              string            `mapstructure:"endpoint"`
    Store                 string            `mapstructure:"store"` // inmemory, redis
    Bus                   string            `mapstructure:"bus"`   // none, inmemory, redis, eventbus
    ReplayLimit           int               `mapstructure:"replay_limit"`
    ClientBuffer          int               `mapstructure:"client_buffer"`
    MaxConnections        int               `mapstructure:"max_connections"`
    HeartbeatInterval     time.Duration     `mapstructure:"heartbeat_interval"`
    DefaultRetryMS        int               `mapstructure:"default_retry_ms"`
    DropOnBackpressure    bool              `mapstructure:"drop_on_backpressure"`
    ChannelQueryParam     string            `mapstructure:"channel_query_param"`
    TenantQueryParam      string            `mapstructure:"tenant_query_param"`
    SubjectQueryParam     string            `mapstructure:"subject_query_param"`
    LastEventIDQueryParam string            `mapstructure:"last_event_id_query_param"`
    Redis                 SSERedisConfig    `mapstructure:"redis"`
    EventBus              SSEEventBusConfig `mapstructure:"eventbus"`
}
```

<a name="SSEEventBusConfig"></a>
## type SSEEventBusConfig

SSEEventBusConfig configures framework eventbus bridge for SSE fan\-out.

```go
type SSEEventBusConfig struct {
    TopicPrefix      string        `mapstructure:"topic_prefix"`
    OperationTimeout time.Duration `mapstructure:"operation_timeout"`
}
```

<a name="SSERedisConfig"></a>
## type SSERedisConfig

SSERedisConfig configures Redis store/bus for SSE.

```go
type SSERedisConfig struct {
    URL              string        `mapstructure:"url"`
    MaxConns         int           `mapstructure:"max_conns"`
    OperationTimeout time.Duration `mapstructure:"operation_timeout"`
    HistoryPrefix    string        `mapstructure:"history_prefix"`
    PubSubPrefix     string        `mapstructure:"pubsub_prefix"`
}
```

<a name="SchedulerConfig"></a>
## type SchedulerConfig

SchedulerConfig configures distributed scheduler behavior.

```go
type SchedulerConfig struct {
    Enabled         bool                    `mapstructure:"enabled"`
    Timezone        string                  `mapstructure:"timezone"`
    LockProvider    string                  `mapstructure:"lock_provider"` // redis, postgres
    LockTTL         time.Duration           `mapstructure:"lock_ttl"`
    DispatchTimeout time.Duration           `mapstructure:"dispatch_timeout"`
    Redis           SchedulerRedisConfig    `mapstructure:"redis"`
    Postgres        SchedulerPostgresConfig `mapstructure:"postgres"`
    Tasks           []SchedulerTaskConfig   `mapstructure:"tasks"`
}
```

<a name="SchedulerPostgresConfig"></a>
## type SchedulerPostgresConfig

SchedulerPostgresConfig configures Postgres lock provider.

```go
type SchedulerPostgresConfig struct {
    URL              string        `mapstructure:"url"`
    Table            string        `mapstructure:"table"`
    OperationTimeout time.Duration `mapstructure:"operation_timeout"`
}
```

<a name="SchedulerRedisConfig"></a>
## type SchedulerRedisConfig

SchedulerRedisConfig configures Redis lock provider.

```go
type SchedulerRedisConfig struct {
    URL              string        `mapstructure:"url"`
    Prefix           string        `mapstructure:"prefix"`
    OperationTimeout time.Duration `mapstructure:"operation_timeout"`
}
```

<a name="SchedulerTaskConfig"></a>
## type SchedulerTaskConfig

SchedulerTaskConfig describes one scheduler task from configuration.

```go
type SchedulerTaskConfig struct {
    Name           string            `mapstructure:"name"`
    Cron           string            `mapstructure:"cron"`
    Queue          string            `mapstructure:"queue"`
    JobName        string            `mapstructure:"job_name"`
    Payload        string            `mapstructure:"payload"`
    Headers        map[string]string `mapstructure:"headers"`
    TenantID       string            `mapstructure:"tenant_id"`
    IdempotencyKey string            `mapstructure:"idempotency_key"`
    Timezone       string            `mapstructure:"timezone"`
    LockTTL        time.Duration     `mapstructure:"lock_ttl"`
    MisfirePolicy  string            `mapstructure:"misfire_policy"` // skip, fire_once
}
```

<a name="SearchConfig"></a>
## type SearchConfig

SearchConfig configures OpenSearch/Elasticsearch connections.

```go
type SearchConfig struct {
    Type             string        `mapstructure:"type"`   // opensearch, elasticsearch
    Driver           string        `mapstructure:"driver"` // http, opensearch-sdk, elasticsearch-sdk
    URL              string        `mapstructure:"url"`
    URLs             []string      `mapstructure:"urls"`
    Username         string        `mapstructure:"username"`
    Password         string        `mapstructure:"password"`
    APIKey           string        `mapstructure:"api_key"`
    AWSAuthEnabled   bool          `mapstructure:"aws_auth_enabled"`
    AWSRegion        string        `mapstructure:"aws_region"`
    AWSService       string        `mapstructure:"aws_service"`
    AWSAccessKeyID   string        `mapstructure:"aws_access_key_id"`
    AWSSecretKey     string        `mapstructure:"aws_secret_access_key"`
    AWSSessionToken  string        `mapstructure:"aws_session_token"`
    MaxConns         int           `mapstructure:"max_conns"`
    OperationTimeout time.Duration `mapstructure:"operation_timeout"`
}
```

<a name="SecurityConfig"></a>
## type SecurityConfig

SecurityConfig configures non\-header security middleware.

```go
type SecurityConfig struct {
    HTTPSignature HTTPSignatureConfig `mapstructure:"http_signature"`
}
```

<a name="SecurityHeadersConfig"></a>
## type SecurityHeadersConfig

SecurityHeadersConfig configures transport/header hardening middleware.

```go
type SecurityHeadersConfig struct {
    Enabled                   bool              `mapstructure:"enabled"`
    IsDevelopment             bool              `mapstructure:"is_development"`
    AllowedHosts              []string          `mapstructure:"allowed_hosts"`
    SSLRedirect               bool              `mapstructure:"ssl_redirect"`
    SSLTemporaryRedirect      bool              `mapstructure:"ssl_temporary_redirect"`
    SSLHost                   string            `mapstructure:"ssl_host"`
    SSLProxyHeaders           map[string]string `mapstructure:"ssl_proxy_headers"`
    DontRedirectIPV4Hostnames bool              `mapstructure:"dont_redirect_ipv4_hostnames"`
    STSSeconds                int64             `mapstructure:"sts_seconds"`
    STSIncludeSubdomains      bool              `mapstructure:"sts_include_subdomains"`
    STSPreload                bool              `mapstructure:"sts_preload"`
    CustomFrameOptions        string            `mapstructure:"custom_frame_options"`
    ContentTypeNosniff        bool              `mapstructure:"content_type_nosniff"`
    ContentSecurityPolicy     string            `mapstructure:"content_security_policy"`
    ReferrerPolicy            string            `mapstructure:"referrer_policy"`
    PermissionsPolicy         string            `mapstructure:"permissions_policy"`
    IENoOpen                  bool              `mapstructure:"ie_no_open"`
    XDNSPrefetchControl       string            `mapstructure:"x_dns_prefetch_control"`
    CrossOriginOpenerPolicy   string            `mapstructure:"cross_origin_opener_policy"`
    CrossOriginResourcePolicy string            `mapstructure:"cross_origin_resource_policy"`
    CrossOriginEmbedderPolicy string            `mapstructure:"cross_origin_embedder_policy"`
    CustomHeaders             map[string]string `mapstructure:"custom_headers"`
}
```

<a name="ServiceConfig"></a>
## type ServiceConfig

ServiceConfig configures service identity metadata.

```go
type ServiceConfig struct {
    Name        string `mapstructure:"name"`
    Environment string `mapstructure:"environment"`
}
```

<a name="SessionConfig"></a>
## type SessionConfig

SessionConfig configures server\-side session management.

```go
type SessionConfig struct {
    Enabled        bool                   `mapstructure:"enabled"`
    Store          string                 `mapstructure:"store"` // inmemory, redis, memcached
    TTL            time.Duration          `mapstructure:"ttl"`
    IdleTimeout    time.Duration          `mapstructure:"idle_timeout"`
    CookieName     string                 `mapstructure:"cookie_name"`
    CookiePath     string                 `mapstructure:"cookie_path"`
    CookieDomain   string                 `mapstructure:"cookie_domain"`
    CookieSecure   bool                   `mapstructure:"cookie_secure"`
    CookieHTTPOnly bool                   `mapstructure:"cookie_http_only"`
    CookieSameSite string                 `mapstructure:"cookie_same_site"` // lax, strict, none
    AutoCreate     bool                   `mapstructure:"auto_create"`
    Redis          SessionRedisConfig     `mapstructure:"redis"`
    Memcached      SessionMemcachedConfig `mapstructure:"memcached"`
}
```

<a name="SessionMemcachedConfig"></a>
## type SessionMemcachedConfig

SessionMemcachedConfig configures memcached\-backed sessions.

```go
type SessionMemcachedConfig struct {
    Addresses []string      `mapstructure:"addresses"`
    Timeout   time.Duration `mapstructure:"timeout"`
    Prefix    string        `mapstructure:"prefix"`
}
```

<a name="SessionRedisConfig"></a>
## type SessionRedisConfig

SessionRedisConfig configures Redis\-backed sessions.

```go
type SessionRedisConfig struct {
    URL              string        `mapstructure:"url"`
    MaxConns         int           `mapstructure:"max_conns"`
    OperationTimeout time.Duration `mapstructure:"operation_timeout"`
    Prefix           string        `mapstructure:"prefix"`
}
```

<a name="SwaggerConfig"></a>
## type SwaggerConfig

SwaggerConfig configures API documentation

```go
type SwaggerConfig struct {
    Enabled  bool   `mapstructure:"enabled"`
    SpecPath string `mapstructure:"spec_path"`
}
```

<a name="ValidationConfig"></a>
## type ValidationConfig

ValidationConfig configures strong schema validation for Kafka.

```go
type ValidationConfig struct {
    Kafka KafkaValidationConfig `mapstructure:"kafka"`
}
```

<a name="ViperLoader"></a>
## type ViperLoader

ViperLoader implements Loader using Viper for configuration management

```go
type ViperLoader struct {
    // contains filtered or unexported fields
}
```

<a name="NewViperLoader"></a>
### func NewViperLoader

```go
func NewViperLoader(configFile, envPrefix string) *ViperLoader
```

NewViperLoader creates a new ViperLoader configFile: path to configuration file \(optional, can be empty\) envPrefix: prefix for environment variables \(e.g., "APP"\)

<a name="ViperLoader.Load"></a>
### func \(\*ViperLoader\) Load

```go
func (l *ViperLoader) Load() (*Config, error)
```

Load loads configuration with precedence: ENV \> file \> defaults

<a name="ViperLoader.LoadWithSecrets"></a>
### func \(\*ViperLoader\) LoadWithSecrets

```go
func (l *ViperLoader) LoadWithSecrets() (*Config, *Config, error)
```

LoadWithSecrets loads configuration with separate secrets file support. Precedence: ENV \> secrets file \> config file \> defaults

Example:

```
config.yaml:
  database:
    type: postgres
    host: localhost

secrets.yaml:
  database:
    url: postgres://user:password@localhost:5432/db
```

The secrets file is optional and automatically discovered: \- If configFile is "config.yaml", looks for "secrets.yaml" in same directory \- Can be explicitly set via \<ENV\_PREFIX\>\_SECRETS\_FILE \(defaults to APP\_SECRETS\_FILE\)

<a name="ViperLoader.Validate"></a>
### func \(\*ViperLoader\) Validate

```go
func (l *ViperLoader) Validate(cfg *Config) error
```

Validate validates the configuration and returns detailed errors

<a name="ViperLoader.WithServiceNameDefault"></a>
### func \(\*ViperLoader\) WithServiceNameDefault

```go
func (l *ViperLoader) WithServiceNameDefault(serviceName string) *ViperLoader
```

WithServiceNameDefault sets the default service.name used when no config/env override is provided.

Generated by [gomarkdoc](<https://github.com/princjef/gomarkdoc>)
