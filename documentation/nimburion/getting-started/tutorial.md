---
layout: documentation
title: End-to-End Tutorial
---

# End-to-End Tutorial: Building a Task Management API

Complete tutorial for building a production-ready task management API with Nimburion.

## What We'll Build

A RESTful API with:
- User authentication (JWT)
- Task CRUD operations
- Real-time notifications (SSE)
- Background job processing
- Event-driven architecture
- Full observability

## Prerequisites

- Go 1.23+
- PostgreSQL
- Redis
- Kafka (optional, can use in-memory)

## Step 1: Project Setup

Create new service with nimbctl:

```bash
nimbctl new task-api
cd task-api
```

Generated structure:
```
task-api/
├── main.go
├── config.yaml
├── go.mod
├── internal/
│   ├── handlers/
│   ├── services/
│   ├── models/
│   └── repository/
└── migrations/
```

## Step 2: Database Schema

Create migration `migrations/001_create_tables.sql`:

```sql
-- +migrate Up
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

CREATE TABLE tasks (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    due_date TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);

-- +migrate Down
DROP TABLE tasks;
DROP TABLE users;
```

## Step 3: Domain Models

Create `internal/models/user.go`:

```go
package models

import "time"

type User struct {
    ID           string    `json:"id"`
    Email        string    `json:"email"`
    Name         string    `json:"name"`
    PasswordHash string    `json:"-"`
    CreatedAt    time.Time `json:"createdAt"`
    UpdatedAt    time.Time `json:"updatedAt,omitempty"`
}
```

Create `internal/models/task.go`:

```go
package models

import "time"

type Task struct {
    ID          string    `json:"id"`
    UserID      string    `json:"userId"`
    Title       string    `json:"title"`
    Description string    `json:"description"`
    Status      string    `json:"status"`
    DueDate     time.Time `json:"dueDate,omitempty"`
    CreatedAt   time.Time `json:"createdAt"`
    UpdatedAt   time.Time `json:"updatedAt,omitempty"`
}

const (
    StatusPending    = "pending"
    StatusInProgress = "in_progress"
    StatusCompleted  = "completed"
)
```

## Step 4: Repository Layer

Create `internal/repository/task_repository.go`:

```go
package repository

import (
    "context"
    "github.com/google/uuid"
    "github.com/nimburion/nimburion/pkg/store"
    "task-api/internal/models"
)

type TaskRepository interface {
    Create(ctx context.Context, task *models.Task) error
    FindByID(ctx context.Context, id string) (*models.Task, error)
    FindByUserID(ctx context.Context, userID string) ([]*models.Task, error)
    Update(ctx context.Context, task *models.Task) error
    Delete(ctx context.Context, id string) error
}

type taskRepository struct {
    db store.Store
}

func NewTaskRepository(db store.Store) TaskRepository {
    return &taskRepository{db: db}
}

func (r *taskRepository) Create(ctx context.Context, task *models.Task) error {
    task.ID = uuid.New().String()
    
    query := `
        INSERT INTO tasks (id, user_id, title, description, status, due_date, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
    `
    _, err := r.db.Exec(ctx, query,
        task.ID, task.UserID, task.Title, task.Description,
        task.Status, task.DueDate, task.CreatedAt,
    )
    return err
}

func (r *taskRepository) FindByUserID(ctx context.Context, userID string) ([]*models.Task, error) {
    query := `
        SELECT id, user_id, title, description, status, due_date, created_at, updated_at
        FROM tasks
        WHERE user_id = $1
        ORDER BY created_at DESC
    `
    rows, err := r.db.Query(ctx, query, userID)
    if err != nil {
        return nil, err
    }
    defer rows.Close()
    
    var tasks []*models.Task
    for rows.Next() {
        var task models.Task
        err := rows.Scan(
            &task.ID, &task.UserID, &task.Title, &task.Description,
            &task.Status, &task.DueDate, &task.CreatedAt, &task.UpdatedAt,
        )
        if err != nil {
            return nil, err
        }
        tasks = append(tasks, &task)
    }
    
    return tasks, nil
}
```

## Step 5: Event Definitions

Create `internal/events/task_events.go`:

```go
package events

import "time"

type TaskCreated struct {
    TaskID    string    `json:"taskId"`
    UserID    string    `json:"userId"`
    Title     string    `json:"title"`
    CreatedAt time.Time `json:"createdAt"`
}

func (e TaskCreated) Topic() string {
    return "tasks.created"
}

type TaskCompleted struct {
    TaskID      string    `json:"taskId"`
    UserID      string    `json:"userId"`
    CompletedAt time.Time `json:"completedAt"`
}

func (e TaskCompleted) Topic() string {
    return "tasks.completed"
}
```

## Step 6: Background Jobs

Create `internal/jobs/notification_job.go`:

```go
package jobs

import (
    "context"
    "fmt"
    "log"
)

type SendNotificationJob struct {
    UserID  string `json:"userId"`
    Message string `json:"message"`
}

func (j *SendNotificationJob) Name() string {
    return "send_notification"
}

func (j *SendNotificationJob) Process(ctx context.Context) error {
    log.Printf("Sending notification to user %s: %s", j.UserID, j.Message)
    
    // Send via email, push notification, etc.
    // For demo, just log
    
    return nil
}
```

## Step 7: HTTP Handlers

Create `internal/handlers/task_handler.go`:

```go
package handlers

import (
    "time"
    "github.com/gin-gonic/gin"
    "github.com/nimburion/nimburion/pkg/auth"
    "github.com/nimburion/nimburion/pkg/eventbus"
    "github.com/nimburion/nimburion/pkg/jobs"
    "task-api/internal/events"
    "task-api/internal/models"
    "task-api/internal/repository"
    myjobs "task-api/internal/jobs"
)

type TaskHandler struct {
    repo      repository.TaskRepository
    bus       eventbus.EventBus
    processor jobs.Processor
}

func NewTaskHandler(repo repository.TaskRepository, bus eventbus.EventBus, processor jobs.Processor) *TaskHandler {
    return &TaskHandler{
        repo:      repo,
        bus:       bus,
        processor: processor,
    }
}

func (h *TaskHandler) Create(c *gin.Context) {
    userID := auth.GetUserID(c)
    
    var req struct {
        Title       string    `json:"title" binding:"required"`
        Description string    `json:"description"`
        DueDate     time.Time `json:"dueDate"`
    }
    
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(400, gin.H{"error": err.Error()})
        return
    }
    
    task := &models.Task{
        UserID:      userID,
        Title:       req.Title,
        Description: req.Description,
        Status:      models.StatusPending,
        DueDate:     req.DueDate,
        CreatedAt:   time.Now(),
    }
    
    if err := h.repo.Create(c.Request.Context(), task); err != nil {
        c.JSON(500, gin.H{"error": "failed to create task"})
        return
    }
    
    // Publish event
    event := events.TaskCreated{
        TaskID:    task.ID,
        UserID:    task.UserID,
        Title:     task.Title,
        CreatedAt: task.CreatedAt,
    }
    h.bus.Publish(c.Request.Context(), event)
    
    // Enqueue notification job
    job := &myjobs.SendNotificationJob{
        UserID:  task.UserID,
        Message: fmt.Sprintf("Task created: %s", task.Title),
    }
    h.processor.Enqueue(c.Request.Context(), job)
    
    c.JSON(201, task)
}

func (h *TaskHandler) List(c *gin.Context) {
    userID := auth.GetUserID(c)
    
    tasks, err := h.repo.FindByUserID(c.Request.Context(), userID)
    if err != nil {
        c.JSON(500, gin.H{"error": "failed to fetch tasks"})
        return
    }
    
    c.JSON(200, tasks)
}

func (h *TaskHandler) Complete(c *gin.Context) {
    taskID := c.Param("id")
    userID := auth.GetUserID(c)
    
    task, err := h.repo.FindByID(c.Request.Context(), taskID)
    if err != nil {
        c.JSON(404, gin.H{"error": "task not found"})
        return
    }
    
    if task.UserID != userID {
        c.JSON(403, gin.H{"error": "forbidden"})
        return
    }
    
    task.Status = models.StatusCompleted
    task.UpdatedAt = time.Now()
    
    if err := h.repo.Update(c.Request.Context(), task); err != nil {
        c.JSON(500, gin.H{"error": "failed to update task"})
        return
    }
    
    // Publish event
    event := events.TaskCompleted{
        TaskID:      task.ID,
        UserID:      task.UserID,
        CompletedAt: task.UpdatedAt,
    }
    h.bus.Publish(c.Request.Context(), event)
    
    c.JSON(200, task)
}
```

## Step 8: Real-time Notifications

Create `internal/handlers/notification_handler.go`:

```go
package handlers

import (
    "fmt"
    "github.com/gin-gonic/gin"
    "github.com/nimburion/nimburion/pkg/auth"
    "github.com/nimburion/nimburion/pkg/eventbus"
    "github.com/nimburion/nimburion/pkg/realtime"
)

type NotificationHandler struct {
    bus eventbus.EventBus
}

func NewNotificationHandler(bus eventbus.EventBus) *NotificationHandler {
    return &NotificationHandler{bus: bus}
}

func (h *NotificationHandler) Stream(c *gin.Context) {
    userID := auth.GetUserID(c)
    stream := realtime.NewSSEStream(c.Writer)
    
    c.Header("Content-Type", "text/event-stream")
    c.Header("Cache-Control", "no-cache")
    c.Header("Connection", "keep-alive")
    
    // Subscribe to user-specific events
    sub := h.bus.Subscribe(fmt.Sprintf("tasks.*.%s", userID))
    defer sub.Close()
    
    for {
        select {
        case <-c.Request.Context().Done():
            return
        case msg := <-sub.Messages():
            stream.Send(realtime.Event{
                Event: msg.Topic(),
                Data:  string(msg.Payload),
            })
        }
    }
}
```

## Step 9: Main Application

Update `main.go`:

```go
package main

import (
    "context"
    "log"
    "github.com/nimburion/nimburion/pkg/config"
    "github.com/nimburion/nimburion/pkg/eventbus/kafka"
    "github.com/nimburion/nimburion/pkg/jobs"
    "github.com/nimburion/nimburion/pkg/jobs/redis"
    "github.com/nimburion/nimburion/pkg/migrate"
    "github.com/nimburion/nimburion/pkg/server"
    "github.com/nimburion/nimburion/pkg/store/postgres"
    "task-api/internal/handlers"
    "task-api/internal/repository"
)

func main() {
    cfg := config.Load()
    
    // Initialize database
    db, err := postgres.New(cfg.Store)
    if err != nil {
        log.Fatal(err)
    }
    defer db.Close()
    
    // Run migrations
    migrator := migrate.New(db, "migrations")
    if err := migrator.Up(); err != nil {
        log.Fatal(err)
    }
    
    // Initialize event bus
    bus, err := kafka.New(cfg.EventBus)
    if err != nil {
        log.Fatal(err)
    }
    defer bus.Close()
    
    // Initialize job processor
    jobBackend, err := redis.New(cfg.Jobs.Redis)
    if err != nil {
        log.Fatal(err)
    }
    processor := jobs.NewProcessor(jobBackend, cfg.Jobs)
    
    // Bootstrap application
    app := server.Bootstrap(cfg)
    app.SetStore(db)
    app.SetEventBus(bus)
    app.SetJobProcessor(processor)
    
    // Initialize repositories
    taskRepo := repository.NewTaskRepository(db)
    
    // Initialize handlers
    taskHandler := handlers.NewTaskHandler(taskRepo, bus, processor)
    notifHandler := handlers.NewNotificationHandler(bus)
    
    // Register routes
    api := app.Public.Group("/api/v1")
    {
        tasks := api.Group("/tasks")
        tasks.Use(auth.Required())
        {
            tasks.POST("", taskHandler.Create)
            tasks.GET("", taskHandler.List)
            tasks.POST("/:id/complete", taskHandler.Complete)
        }
        
        api.GET("/notifications", auth.Required(), notifHandler.Stream)
    }
    
    // Health checks
    app.Management.AddHealthCheck("database", func() error {
        return db.Ping()
    })
    
    app.Management.AddHealthCheck("eventbus", func() error {
        return bus.Ping()
    })
    
    // Start application
    app.Run()
}
```

## Step 10: Configuration

Update `config.yaml`:

```yaml
public:
  port: 8080

management:
  port: 9090

log:
  level: info
  format: json

store:
  type: postgres
  host: localhost
  port: 5432
  database: taskapi
  username: postgres
  password: ${DB_PASSWORD}

eventbus:
  type: kafka
  brokers:
    - localhost:9092
  groupId: task-api

jobs:
  backend: redis
  redis:
    addr: localhost:6379
  concurrency: 10

auth:
  enabled: true
  issuer: https://auth.example.com
  audience: task-api

tracing:
  enabled: true
  endpoint: http://jaeger:4318
```

## Step 11: Run the Application

```bash
# Set environment variables
export APP_STORE_PASSWORD=postgres
export APP_AUTH_ISSUER=https://your-auth-provider.com

# Run application
go run main.go
```

## Step 12: Test the API

```bash
# Create task
curl -X POST http://localhost:8080/api/v1/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete tutorial",
    "description": "Finish the Nimburion tutorial",
    "dueDate": "2026-03-01T00:00:00Z"
  }'

# List tasks
curl http://localhost:8080/api/v1/tasks \
  -H "Authorization: Bearer $TOKEN"

# Complete task
curl -X POST http://localhost:8080/api/v1/tasks/{id}/complete \
  -H "Authorization: Bearer $TOKEN"

# Stream notifications (SSE)
curl http://localhost:8080/api/v1/notifications \
  -H "Authorization: Bearer $TOKEN"

# Check health
curl http://localhost:9090/health

# View metrics
curl http://localhost:9090/metrics
```

## What We Built

✅ RESTful API with authentication  
✅ PostgreSQL database with migrations  
✅ Repository pattern for data access  
✅ Event-driven architecture with Kafka  
✅ Background job processing with Redis  
✅ Real-time notifications with SSE  
✅ Health checks and metrics  
✅ Structured logging and tracing  

## Next Steps

- Add more endpoints (update, delete)
- Implement user registration and login
- Add task filtering and pagination
- Implement WebSocket for real-time updates
- Add rate limiting and caching
- Deploy to Kubernetes
- Set up CI/CD pipeline

## See Also

- [Authentication Guide](/documentation/nimburion/guides/authentication/)
- [Database Access Guide](/documentation/nimburion/guides/database-access/)
- [Event-Driven Guide](/documentation/nimburion/guides/event-driven/)
- [Background Jobs Guide](/documentation/nimburion/guides/background-jobs/)
- [Deployment Guide](/documentation/nimburion/getting-started/deployment/)
