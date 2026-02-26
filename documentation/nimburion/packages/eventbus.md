---
layout: documentation
title: pkg/eventbus
---

# pkg/eventbus

Event bus adapters for asynchronous messaging.

## Supported Brokers

- Kafka
- RabbitMQ
- AWS SQS
- In-Memory (testing)

## Publishing

```go
import "github.com/nimburion/nimburion/pkg/eventbus/kafka"

bus, _ := kafka.New(cfg.EventBus)

event := UserCreated{
    UserID: "123",
    Email:  "alice@example.com",
}

bus.Publish(ctx, event)
```

## Consuming

```go
bus.Subscribe("user.created", func(ctx context.Context, msg eventbus.Message) error {
    var event UserCreated
    msg.Decode(&event)
    
    // Process event
    return nil
})

bus.Start(ctx)
```

## See Also

- [Event-Driven Guide](/documentation/nimburion/guides/event-driven/)
