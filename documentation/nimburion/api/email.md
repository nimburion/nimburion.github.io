---
layout: documentation
title: pkg/email
---


# email

```go
import "github.com/nimburion/nimburion/pkg/email"
```

## Index

- [Constants](<#constants>)
- [type BrevoConfig](<#BrevoConfig>)
- [type BrevoProvider](<#BrevoProvider>)
  - [func NewBrevoProvider\(cfg BrevoConfig, log logger.Logger\) \(\*BrevoProvider, error\)](<#NewBrevoProvider>)
  - [func \(p \*BrevoProvider\) Close\(\) error](<#BrevoProvider.Close>)
  - [func \(p \*BrevoProvider\) Send\(ctx context.Context, message Message\) error](<#BrevoProvider.Send>)
- [type Config](<#Config>)
- [type MailchimpConfig](<#MailchimpConfig>)
- [type MailchimpProvider](<#MailchimpProvider>)
  - [func NewMailchimpProvider\(cfg MailchimpConfig, log logger.Logger\) \(\*MailchimpProvider, error\)](<#NewMailchimpProvider>)
  - [func \(p \*MailchimpProvider\) Close\(\) error](<#MailchimpProvider.Close>)
  - [func \(p \*MailchimpProvider\) Send\(ctx context.Context, message Message\) error](<#MailchimpProvider.Send>)
- [type MailerSendConfig](<#MailerSendConfig>)
- [type MailerSendProvider](<#MailerSendProvider>)
  - [func NewMailerSendProvider\(cfg MailerSendConfig, log logger.Logger\) \(\*MailerSendProvider, error\)](<#NewMailerSendProvider>)
  - [func \(p \*MailerSendProvider\) Close\(\) error](<#MailerSendProvider.Close>)
  - [func \(p \*MailerSendProvider\) Send\(ctx context.Context, message Message\) error](<#MailerSendProvider.Send>)
- [type MailgunConfig](<#MailgunConfig>)
- [type MailgunProvider](<#MailgunProvider>)
  - [func NewMailgunProvider\(cfg MailgunConfig, log logger.Logger\) \(\*MailgunProvider, error\)](<#NewMailgunProvider>)
  - [func \(p \*MailgunProvider\) Close\(\) error](<#MailgunProvider.Close>)
  - [func \(p \*MailgunProvider\) Send\(ctx context.Context, message Message\) error](<#MailgunProvider.Send>)
- [type MailjetConfig](<#MailjetConfig>)
- [type MailjetProvider](<#MailjetProvider>)
  - [func NewMailjetProvider\(cfg MailjetConfig, log logger.Logger\) \(\*MailjetProvider, error\)](<#NewMailjetProvider>)
  - [func \(p \*MailjetProvider\) Close\(\) error](<#MailjetProvider.Close>)
  - [func \(p \*MailjetProvider\) Send\(ctx context.Context, message Message\) error](<#MailjetProvider.Send>)
- [type MailtrapConfig](<#MailtrapConfig>)
- [type MailtrapProvider](<#MailtrapProvider>)
  - [func NewMailtrapProvider\(cfg MailtrapConfig, log logger.Logger\) \(\*MailtrapProvider, error\)](<#NewMailtrapProvider>)
  - [func \(p \*MailtrapProvider\) Close\(\) error](<#MailtrapProvider.Close>)
  - [func \(p \*MailtrapProvider\) Send\(ctx context.Context, message Message\) error](<#MailtrapProvider.Send>)
- [type Message](<#Message>)
- [type PostmarkConfig](<#PostmarkConfig>)
- [type PostmarkProvider](<#PostmarkProvider>)
  - [func NewPostmarkProvider\(cfg PostmarkConfig, log logger.Logger\) \(\*PostmarkProvider, error\)](<#NewPostmarkProvider>)
  - [func \(p \*PostmarkProvider\) Close\(\) error](<#PostmarkProvider.Close>)
  - [func \(p \*PostmarkProvider\) Send\(ctx context.Context, message Message\) error](<#PostmarkProvider.Send>)
- [type Provider](<#Provider>)
  - [func NewProvider\(cfg Config, log logger.Logger\) \(Provider, error\)](<#NewProvider>)
- [type SESConfig](<#SESConfig>)
- [type SESProvider](<#SESProvider>)
  - [func NewSESProvider\(cfg SESConfig, log logger.Logger\) \(\*SESProvider, error\)](<#NewSESProvider>)
  - [func \(p \*SESProvider\) Close\(\) error](<#SESProvider.Close>)
  - [func \(p \*SESProvider\) Send\(ctx context.Context, message Message\) error](<#SESProvider.Send>)
- [type SMTP2GOConfig](<#SMTP2GOConfig>)
- [type SMTP2GOProvider](<#SMTP2GOProvider>)
  - [func NewSMTP2GOProvider\(cfg SMTP2GOConfig, log logger.Logger\) \(\*SMTP2GOProvider, error\)](<#NewSMTP2GOProvider>)
  - [func \(p \*SMTP2GOProvider\) Close\(\) error](<#SMTP2GOProvider.Close>)
  - [func \(p \*SMTP2GOProvider\) Send\(ctx context.Context, message Message\) error](<#SMTP2GOProvider.Send>)
- [type SMTPConfig](<#SMTPConfig>)
- [type SMTPProvider](<#SMTPProvider>)
  - [func NewSMTPProvider\(cfg SMTPConfig, log logger.Logger\) \(\*SMTPProvider, error\)](<#NewSMTPProvider>)
  - [func \(p \*SMTPProvider\) Close\(\) error](<#SMTPProvider.Close>)
  - [func \(p \*SMTPProvider\) Send\(ctx context.Context, message Message\) error](<#SMTPProvider.Send>)
- [type SendGridConfig](<#SendGridConfig>)
- [type SendGridProvider](<#SendGridProvider>)
  - [func NewSendGridProvider\(cfg SendGridConfig, log logger.Logger\) \(\*SendGridProvider, error\)](<#NewSendGridProvider>)
  - [func \(p \*SendGridProvider\) Close\(\) error](<#SendGridProvider.Close>)
  - [func \(p \*SendGridProvider\) Send\(ctx context.Context, message Message\) error](<#SendGridProvider.Send>)
- [type SendPulseConfig](<#SendPulseConfig>)
- [type SendPulseProvider](<#SendPulseProvider>)
  - [func NewSendPulseProvider\(cfg SendPulseConfig, log logger.Logger\) \(\*SendPulseProvider, error\)](<#NewSendPulseProvider>)
  - [func \(p \*SendPulseProvider\) Close\(\) error](<#SendPulseProvider.Close>)
  - [func \(p \*SendPulseProvider\) Send\(ctx context.Context, message Message\) error](<#SendPulseProvider.Send>)


## Constants

<a name="ProviderSMTP"></a>

```go
const (
    ProviderSMTP       = "smtp"
    ProviderSES        = "ses"
    ProviderSendGrid   = "sendgrid"
    ProviderMailgun    = "mailgun"
    ProviderMailchimp  = "mailchimp"
    ProviderMailerSend = "mailersend"
    ProviderPostmark   = "postmark"
    ProviderMailtrap   = "mailtrap"
    ProviderSMTP2GO    = "smtp2go"
    ProviderSendPulse  = "sendpulse"
    ProviderBrevo      = "brevo"
    ProviderMailjet    = "mailjet"
)
```

<a name="BrevoConfig"></a>
## type BrevoConfig

BrevoConfig configures the Brevo \(formerly Sendinblue\) email provider.

```go
type BrevoConfig struct {
    APIKey           string
    From             string
    BaseURL          string
    OperationTimeout time.Duration
    HTTPClient       *http.Client
}
```

<a name="BrevoProvider"></a>
## type BrevoProvider

BrevoProvider sends emails via the Brevo API.

```go
type BrevoProvider struct {
    // contains filtered or unexported fields
}
```

<a name="NewBrevoProvider"></a>
### func NewBrevoProvider

```go
func NewBrevoProvider(cfg BrevoConfig, log logger.Logger) (*BrevoProvider, error)
```

NewBrevoProvider creates a new BrevoProvider instance.

<a name="BrevoProvider.Close"></a>
### func \(\*BrevoProvider\) Close

```go
func (p *BrevoProvider) Close() error
```

Close releases all resources held by this instance. Should be called when the instance is no longer needed.

<a name="BrevoProvider.Send"></a>
### func \(\*BrevoProvider\) Send

```go
func (p *BrevoProvider) Send(ctx context.Context, message Message) error
```

Send sends an email message via the provider API.

<a name="Config"></a>
## type Config

Config is the root provider factory configuration.

```go
type Config struct {
    Provider string

    SMTP       SMTPConfig
    SES        SESConfig
    SendGrid   SendGridConfig
    Mailgun    MailgunConfig
    Mailchimp  MailchimpConfig
    MailerSend MailerSendConfig
    Postmark   PostmarkConfig
    Mailtrap   MailtrapConfig
    SMTP2GO    SMTP2GOConfig
    SendPulse  SendPulseConfig
    Brevo      BrevoConfig
    Mailjet    MailjetConfig
}
```

<a name="MailchimpConfig"></a>
## type MailchimpConfig

MailchimpConfig configures Mailchimp Transactional \(Mandrill\) adapter.

```go
type MailchimpConfig struct {
    APIKey           string
    From             string
    BaseURL          string
    OperationTimeout time.Duration
    HTTPClient       *http.Client
}
```

<a name="MailchimpProvider"></a>
## type MailchimpProvider

MailchimpProvider sends email through Mailchimp Transactional API.

```go
type MailchimpProvider struct {
    // contains filtered or unexported fields
}
```

<a name="NewMailchimpProvider"></a>
### func NewMailchimpProvider

```go
func NewMailchimpProvider(cfg MailchimpConfig, log logger.Logger) (*MailchimpProvider, error)
```

NewMailchimpProvider creates a Mailchimp adapter.

<a name="MailchimpProvider.Close"></a>
### func \(\*MailchimpProvider\) Close

```go
func (p *MailchimpProvider) Close() error
```

Close releases resources.

<a name="MailchimpProvider.Send"></a>
### func \(\*MailchimpProvider\) Send

```go
func (p *MailchimpProvider) Send(ctx context.Context, message Message) error
```

Send sends email via Mailchimp Transactional \(Mandrill\).

<a name="MailerSendConfig"></a>
## type MailerSendConfig

MailerSendConfig configures the MailerSend email provider.

```go
type MailerSendConfig struct {
    APIKey           string
    From             string
    BaseURL          string
    OperationTimeout time.Duration
    HTTPClient       *http.Client
}
```

<a name="MailerSendProvider"></a>
## type MailerSendProvider

MailerSendProvider sends emails via the MailerSend API.

```go
type MailerSendProvider struct {
    // contains filtered or unexported fields
}
```

<a name="NewMailerSendProvider"></a>
### func NewMailerSendProvider

```go
func NewMailerSendProvider(cfg MailerSendConfig, log logger.Logger) (*MailerSendProvider, error)
```

NewMailerSendProvider creates a new MailerSendProvider instance.

<a name="MailerSendProvider.Close"></a>
### func \(\*MailerSendProvider\) Close

```go
func (p *MailerSendProvider) Close() error
```

Close releases all resources held by this instance. Should be called when the instance is no longer needed.

<a name="MailerSendProvider.Send"></a>
### func \(\*MailerSendProvider\) Send

```go
func (p *MailerSendProvider) Send(ctx context.Context, message Message) error
```

Send sends an email message via the provider API.

<a name="MailgunConfig"></a>
## type MailgunConfig

MailgunConfig configures Mailgun adapter.

```go
type MailgunConfig struct {
    APIKey           string
    Domain           string
    From             string
    BaseURL          string
    OperationTimeout time.Duration
    HTTPClient       *http.Client
}
```

<a name="MailgunProvider"></a>
## type MailgunProvider

MailgunProvider sends email through Mailgun API.

```go
type MailgunProvider struct {
    // contains filtered or unexported fields
}
```

<a name="NewMailgunProvider"></a>
### func NewMailgunProvider

```go
func NewMailgunProvider(cfg MailgunConfig, log logger.Logger) (*MailgunProvider, error)
```

NewMailgunProvider creates a Mailgun adapter.

<a name="MailgunProvider.Close"></a>
### func \(\*MailgunProvider\) Close

```go
func (p *MailgunProvider) Close() error
```

Close releases resources.

<a name="MailgunProvider.Send"></a>
### func \(\*MailgunProvider\) Send

```go
func (p *MailgunProvider) Send(ctx context.Context, message Message) error
```

Send sends email via Mailgun.

<a name="MailjetConfig"></a>
## type MailjetConfig

MailjetConfig configures the Mailjet email provider.

```go
type MailjetConfig struct {
    APIKey           string
    APISecret        string
    From             string
    BaseURL          string
    OperationTimeout time.Duration
    HTTPClient       *http.Client
}
```

<a name="MailjetProvider"></a>
## type MailjetProvider

MailjetProvider sends emails via the Mailjet API.

```go
type MailjetProvider struct {
    // contains filtered or unexported fields
}
```

<a name="NewMailjetProvider"></a>
### func NewMailjetProvider

```go
func NewMailjetProvider(cfg MailjetConfig, log logger.Logger) (*MailjetProvider, error)
```

NewMailjetProvider creates a new MailjetProvider instance.

<a name="MailjetProvider.Close"></a>
### func \(\*MailjetProvider\) Close

```go
func (p *MailjetProvider) Close() error
```

Close releases all resources held by this instance. Should be called when the instance is no longer needed.

<a name="MailjetProvider.Send"></a>
### func \(\*MailjetProvider\) Send

```go
func (p *MailjetProvider) Send(ctx context.Context, message Message) error
```

Send sends an email message via the provider API.

<a name="MailtrapConfig"></a>
## type MailtrapConfig

MailtrapConfig configures the Mailtrap email provider.

```go
type MailtrapConfig struct {
    Token            string
    From             string
    BaseURL          string
    OperationTimeout time.Duration
    HTTPClient       *http.Client
}
```

<a name="MailtrapProvider"></a>
## type MailtrapProvider

MailtrapProvider sends emails via the Mailtrap API.

```go
type MailtrapProvider struct {
    // contains filtered or unexported fields
}
```

<a name="NewMailtrapProvider"></a>
### func NewMailtrapProvider

```go
func NewMailtrapProvider(cfg MailtrapConfig, log logger.Logger) (*MailtrapProvider, error)
```

NewMailtrapProvider creates a new MailtrapProvider instance.

<a name="MailtrapProvider.Close"></a>
### func \(\*MailtrapProvider\) Close

```go
func (p *MailtrapProvider) Close() error
```

Close releases all resources held by this instance. Should be called when the instance is no longer needed.

<a name="MailtrapProvider.Send"></a>
### func \(\*MailtrapProvider\) Send

```go
func (p *MailtrapProvider) Send(ctx context.Context, message Message) error
```

Send sends an email message via the provider API.

<a name="Message"></a>
## type Message

Message is the normalized email payload accepted by all providers.

```go
type Message struct {
    From     string
    To       []string
    Cc       []string
    Bcc      []string
    ReplyTo  string
    Subject  string
    TextBody string
    HTMLBody string
    Headers  map[string]string
}
```

<a name="PostmarkConfig"></a>
## type PostmarkConfig

PostmarkConfig configures the Postmark email provider.

```go
type PostmarkConfig struct {
    ServerToken      string
    From             string
    BaseURL          string
    OperationTimeout time.Duration
    HTTPClient       *http.Client
}
```

<a name="PostmarkProvider"></a>
## type PostmarkProvider

PostmarkProvider sends emails via the Postmark API.

```go
type PostmarkProvider struct {
    // contains filtered or unexported fields
}
```

<a name="NewPostmarkProvider"></a>
### func NewPostmarkProvider

```go
func NewPostmarkProvider(cfg PostmarkConfig, log logger.Logger) (*PostmarkProvider, error)
```

NewPostmarkProvider creates a new PostmarkProvider instance.

<a name="PostmarkProvider.Close"></a>
### func \(\*PostmarkProvider\) Close

```go
func (p *PostmarkProvider) Close() error
```

Close releases all resources held by this instance. Should be called when the instance is no longer needed.

<a name="PostmarkProvider.Send"></a>
### func \(\*PostmarkProvider\) Send

```go
func (p *PostmarkProvider) Send(ctx context.Context, message Message) error
```

Send sends an email message via the provider API.

<a name="Provider"></a>
## type Provider

Provider is a pluggable email sender implementation.

```go
type Provider interface {
    Send(ctx context.Context, message Message) error
    Close() error
}
```

<a name="NewProvider"></a>
### func NewProvider

```go
func NewProvider(cfg Config, log logger.Logger) (Provider, error)
```

NewProvider creates an email provider adapter from configuration.

<a name="SESConfig"></a>
## type SESConfig

SESConfig configures AWS SES v2 provider.

```go
type SESConfig struct {
    Region           string
    From             string
    Endpoint         string
    AccessKeyID      string
    SecretAccessKey  string
    SessionToken     string
    OperationTimeout time.Duration
    HTTPClient       *http.Client
}
```

<a name="SESProvider"></a>
## type SESProvider

SESProvider sends email through AWS SES v2 API.

```go
type SESProvider struct {
    // contains filtered or unexported fields
}
```

<a name="NewSESProvider"></a>
### func NewSESProvider

```go
func NewSESProvider(cfg SESConfig, log logger.Logger) (*SESProvider, error)
```

NewSESProvider creates a SES adapter.

<a name="SESProvider.Close"></a>
### func \(\*SESProvider\) Close

```go
func (p *SESProvider) Close() error
```

Close releases resources.

<a name="SESProvider.Send"></a>
### func \(\*SESProvider\) Send

```go
func (p *SESProvider) Send(ctx context.Context, message Message) error
```

Send sends email via SES v2 HTTPS API.

<a name="SMTP2GOConfig"></a>
## type SMTP2GOConfig

SMTP2GOConfig configures the SMTP2GO email provider.

```go
type SMTP2GOConfig struct {
    APIKey           string
    From             string
    BaseURL          string
    OperationTimeout time.Duration
    HTTPClient       *http.Client
}
```

<a name="SMTP2GOProvider"></a>
## type SMTP2GOProvider

SMTP2GOProvider sends emails via the SMTP2GO API.

```go
type SMTP2GOProvider struct {
    // contains filtered or unexported fields
}
```

<a name="NewSMTP2GOProvider"></a>
### func NewSMTP2GOProvider

```go
func NewSMTP2GOProvider(cfg SMTP2GOConfig, log logger.Logger) (*SMTP2GOProvider, error)
```

NewSMTP2GOProvider creates a new SMTP2GOProvider instance.

<a name="SMTP2GOProvider.Close"></a>
### func \(\*SMTP2GOProvider\) Close

```go
func (p *SMTP2GOProvider) Close() error
```

Close releases all resources held by this instance. Should be called when the instance is no longer needed.

<a name="SMTP2GOProvider.Send"></a>
### func \(\*SMTP2GOProvider\) Send

```go
func (p *SMTP2GOProvider) Send(ctx context.Context, message Message) error
```

Send sends an email message via the provider API.

<a name="SMTPConfig"></a>
## type SMTPConfig

SMTPConfig configures the SMTP provider.

```go
type SMTPConfig struct {
    Host               string
    Port               int
    Username           string
    Password           string
    From               string
    EnableTLS          bool
    InsecureSkipVerify bool
    OperationTimeout   time.Duration
}
```

<a name="SMTPProvider"></a>
## type SMTPProvider

SMTPProvider sends emails via standard SMTP server.

```go
type SMTPProvider struct {
    // contains filtered or unexported fields
}
```

<a name="NewSMTPProvider"></a>
### func NewSMTPProvider

```go
func NewSMTPProvider(cfg SMTPConfig, log logger.Logger) (*SMTPProvider, error)
```

NewSMTPProvider creates a standard SMTP adapter.

<a name="SMTPProvider.Close"></a>
### func \(\*SMTPProvider\) Close

```go
func (p *SMTPProvider) Close() error
```

Close releases provider resources.

<a name="SMTPProvider.Send"></a>
### func \(\*SMTPProvider\) Send

```go
func (p *SMTPProvider) Send(ctx context.Context, message Message) error
```

Send sends email via SMTP.

<a name="SendGridConfig"></a>
## type SendGridConfig

SendGridConfig configures SendGrid adapter.

```go
type SendGridConfig struct {
    APIKey           string
    From             string
    BaseURL          string
    OperationTimeout time.Duration
    HTTPClient       *http.Client
}
```

<a name="SendGridProvider"></a>
## type SendGridProvider

SendGridProvider sends email through SendGrid API.

```go
type SendGridProvider struct {
    // contains filtered or unexported fields
}
```

<a name="NewSendGridProvider"></a>
### func NewSendGridProvider

```go
func NewSendGridProvider(cfg SendGridConfig, log logger.Logger) (*SendGridProvider, error)
```

NewSendGridProvider creates a SendGrid adapter.

<a name="SendGridProvider.Close"></a>
### func \(\*SendGridProvider\) Close

```go
func (p *SendGridProvider) Close() error
```

Close releases resources.

<a name="SendGridProvider.Send"></a>
### func \(\*SendGridProvider\) Send

```go
func (p *SendGridProvider) Send(ctx context.Context, message Message) error
```

Send sends email via SendGrid.

<a name="SendPulseConfig"></a>
## type SendPulseConfig

SendPulseConfig configures the SendPulse email provider.

```go
type SendPulseConfig struct {
    Token            string
    From             string
    BaseURL          string
    OperationTimeout time.Duration
    HTTPClient       *http.Client
}
```

<a name="SendPulseProvider"></a>
## type SendPulseProvider

SendPulseProvider sends emails via the SendPulse API.

```go
type SendPulseProvider struct {
    // contains filtered or unexported fields
}
```

<a name="NewSendPulseProvider"></a>
### func NewSendPulseProvider

```go
func NewSendPulseProvider(cfg SendPulseConfig, log logger.Logger) (*SendPulseProvider, error)
```

NewSendPulseProvider creates a new SendPulseProvider instance.

<a name="SendPulseProvider.Close"></a>
### func \(\*SendPulseProvider\) Close

```go
func (p *SendPulseProvider) Close() error
```

Close releases all resources held by this instance. Should be called when the instance is no longer needed.

<a name="SendPulseProvider.Send"></a>
### func \(\*SendPulseProvider\) Send

```go
func (p *SendPulseProvider) Send(ctx context.Context, message Message) error
```

Send sends an email message via the provider API.

Generated by [gomarkdoc](<https://github.com/princjef/gomarkdoc>)
