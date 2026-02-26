---
layout: documentation
title: pkg/realtime
---

# pkg/realtime

Server-Sent Events (SSE) and WebSocket support.

## SSE

```go
import "github.com/nimburion/nimburion/pkg/realtime"

func sseHandler(c *gin.Context) {
    stream := realtime.NewSSEStream(c.Writer)
    
    stream.Send(realtime.Event{
        Event: "message",
        Data:  "Hello!",
    })
}
```

## WebSocket

```go
import "github.com/gorilla/websocket"

var upgrader = websocket.Upgrader{}

func wsHandler(c *gin.Context) {
    conn, _ := upgrader.Upgrade(c.Writer, c.Request, nil)
    defer conn.Close()
    
    for {
        _, message, _ := conn.ReadMessage()
        conn.WriteMessage(websocket.TextMessage, message)
    }
}
```

## See Also

- [Realtime Channels Guide](/documentation/nimburion/guides/realtime-channels/)
