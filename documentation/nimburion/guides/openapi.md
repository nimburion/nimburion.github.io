---
layout: documentation
title: OpenAPI
---

# OpenAPI

Generate and validate OpenAPI specifications from your Nimburion service.

## Overview

Nimburion provides automatic OpenAPI (Swagger) generation from route definitions, request/response structs, and validation tags.

## Basic Setup

```go
import "github.com/nimburion/nimburion/pkg/server/openapi"

func main() {
    cfg := config.Load()
    app := server.Bootstrap(cfg)
    
    // Generate OpenAPI spec
    spec := openapi.Generate(app.Public, openapi.Config{
        Title:       "Task API",
        Description: "Task management API",
        Version:     "1.0.0",
    })
    
    // Serve spec and Swagger UI
    app.Public.GET("/openapi.json", func(c *gin.Context) {
        c.JSON(200, spec)
    })
    app.Public.GET("/docs", openapi.SwaggerUI("/openapi.json"))
    
    app.Run()
}
```

## Annotate Handlers

```go
// CreateTaskRequest represents task creation payload
type CreateTaskRequest struct {
    Title       string `json:"title" binding:"required" example:"Complete tutorial"`
    Description string `json:"description"`
}

// @Summary Create task
// @Tags tasks
// @Accept json
// @Produce json
// @Param request body CreateTaskRequest true "Task details"
// @Success 201 {object} TaskResponse
// @Security BearerAuth
// @Router /tasks [post]
func (h *TaskHandler) CreateTask(c *gin.Context) {
    // Handler implementation
}
```

## Request Validation

```go
import "github.com/nimburion/nimburion/pkg/middleware"

// Validate requests against OpenAPI spec
app.Public.Use(middleware.OpenAPIValidation(spec))
```

## See Also

- [HTTP Servers Guide](/documentation/nimburion/guides/http-servers/)
