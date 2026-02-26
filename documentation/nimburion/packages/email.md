---
layout: documentation
title: pkg/email
---

# pkg/email

Email sending with pluggable providers.

## Supported Providers

- SMTP
- SendGrid
- AWS SES
- Mailgun

## Send Email

```go
import "github.com/nimburion/nimburion/pkg/email"

sender, _ := email.NewSMTP(cfg.Email)

msg := email.Message{
    To:      []string{"user@example.com"},
    Subject: "Welcome!",
    Body:    "Welcome to our platform!",
    HTML:    true,
}

sender.Send(ctx, msg)
```
