---
layout: documentation
title: pkg/scheduler
---

# pkg/scheduler

Cron-style job scheduling.

## Schedule Jobs

```go
import "github.com/nimburion/nimburion/pkg/scheduler"

sched := scheduler.New(processor)

// Daily at 2 AM
sched.Schedule("0 2 * * *", &DailyReportJob{})

// Every hour
sched.Schedule("0 * * * *", &CleanupJob{})

// Every 5 minutes
sched.Schedule("*/5 * * * *", &HealthCheckJob{})

sched.Start()
```

## See Also

- [Background Jobs Guide](/documentation/nimburion/guides/background-jobs/)
