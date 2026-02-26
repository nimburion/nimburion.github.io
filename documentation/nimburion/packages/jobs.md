---
layout: documentation
title: pkg/jobs
---

# pkg/jobs

Background job processing with retries and scheduling.

## Define Job

```go
type SendEmailJob struct {
    To      string `json:"to"`
    Subject string `json:"subject"`
}

func (j *SendEmailJob) Name() string {
    return "send_email"
}

func (j *SendEmailJob) Process(ctx context.Context) error {
    return emailService.Send(j.To, j.Subject)
}
```

## Enqueue Job

```go
import "github.com/nimburion/nimburion/pkg/jobs"

processor := jobs.NewProcessor(backend, cfg.Jobs)

job := &SendEmailJob{
    To:      "user@example.com",
    Subject: "Welcome!",
}

processor.Enqueue(ctx, job)
```

## See Also

- [Background Jobs Guide](/documentation/nimburion/guides/background-jobs/)
