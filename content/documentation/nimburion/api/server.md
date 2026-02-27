---
layout: documentation
title: pkg/server
---


# server

```go
import "github.com/nimburion/nimburion/pkg/server"
```

Package server provides HTTP server implementations with graceful startup and shutdown.

Package server provides HTTP server implementations with graceful startup and shutdown.

Package server provides HTTP server implementations with graceful startup and shutdown.

## Index

- [func LoadTLSConfig\(certFile, keyFile, caFile string\) \(\*tls.Config, error\)](<#LoadTLSConfig>)
- [func RunHTTPServers\(ctx context.Context, servers \*HTTPServers, opts \*RunHTTPServersOptions\) error](<#RunHTTPServers>)
- [func RunHTTPServersWithSignals\(servers \*HTTPServers, opts \*RunHTTPServersOptions, signals ...os.Signal\) error](<#RunHTTPServersWithSignals>)
- [type HTTPServers](<#HTTPServers>)
  - [func BuildHTTPServers\(opts \*RunHTTPServersOptions\) \(\*HTTPServers, error\)](<#BuildHTTPServers>)
- [type LifecycleHook](<#LifecycleHook>)
- [type ManagementServer](<#ManagementServer>)
  - [func NewManagementServer\(cfg config.ManagementConfig, r router.Router, log logger.Logger, healthRegistry \*health.Registry, metricsRegistry \*metrics.Registry, validator auth.JWTValidator\) \(\*ManagementServer, error\)](<#NewManagementServer>)
  - [func \(s \*ManagementServer\) Router\(\) router.Router](<#ManagementServer.Router>)
  - [func \(s \*ManagementServer\) Shutdown\(ctx context.Context\) error](<#ManagementServer.Shutdown>)
  - [func \(s \*ManagementServer\) Start\(ctx context.Context\) error](<#ManagementServer.Start>)
- [type PublicAPIServer](<#PublicAPIServer>)
  - [func NewPublicAPIServer\(cfg config.HTTPConfig, r router.Router, log logger.Logger\) \*PublicAPIServer](<#NewPublicAPIServer>)
  - [func NewPublicAPIServerWithConfig\(cfg config.HTTPConfig, corsCfg config.CORSConfig, securityHeadersCfg config.SecurityHeadersConfig, securityCfg config.SecurityConfig, i18nCfg config.I18nConfig, sessionCfg config.SessionConfig, csrfCfg config.CSRFConfig, sseCfg config.SSEConfig, eventBusCfg config.EventBusConfig, validationCfg config.ValidationConfig, obsCfg config.ObservabilityConfig, r router.Router, log logger.Logger\) \*PublicAPIServer](<#NewPublicAPIServerWithConfig>)
  - [func NewPublicAPIServerWithObservability\(cfg config.HTTPConfig, obsCfg config.ObservabilityConfig, r router.Router, log logger.Logger\) \*PublicAPIServer](<#NewPublicAPIServerWithObservability>)
  - [func \(s \*PublicAPIServer\) Router\(\) \*router.Router](<#PublicAPIServer.Router>)
  - [func \(s \*PublicAPIServer\) Shutdown\(ctx context.Context\) error](<#PublicAPIServer.Shutdown>)
  - [func \(s \*PublicAPIServer\) Start\(ctx context.Context\) error](<#PublicAPIServer.Start>)
- [type RunHTTPServersOptions](<#RunHTTPServersOptions>)
  - [func NewDefaultRunHTTPServersOptions\(\) \*RunHTTPServersOptions](<#NewDefaultRunHTTPServersOptions>)
- [type Server](<#Server>)
  - [func NewServer\(cfg ServerConfig, router router.Router, logger logger.Logger\) \*Server](<#NewServer>)
  - [func \(s \*Server\) Shutdown\(ctx context.Context\) error](<#Server.Shutdown>)
  - [func \(s \*Server\) Start\(ctx context.Context\) error](<#Server.Start>)
- [type ServerConfig](<#ServerConfig>)


<a name="LoadTLSConfig"></a>
## func LoadTLSConfig

```go
func LoadTLSConfig(certFile, keyFile, caFile string) (*tls.Config, error)
```

LoadTLSConfig creates an mTLS\-ready TLS configuration from certificate files.

<a name="RunHTTPServers"></a>
## func RunHTTPServers

```go
func RunHTTPServers(ctx context.Context, servers *HTTPServers, opts *RunHTTPServersOptions) error
```

RunHTTPServers starts public server and \(optionally\) management server.

<a name="RunHTTPServersWithSignals"></a>
## func RunHTTPServersWithSignals

```go
func RunHTTPServersWithSignals(servers *HTTPServers, opts *RunHTTPServersOptions, signals ...os.Signal) error
```

RunHTTPServersWithSignals runs servers with centralized signal handling.

<a name="HTTPServers"></a>
## type HTTPServers

HTTPServers groups the runtime public/management servers.

```go
type HTTPServers struct {
    Public     *PublicAPIServer
    Management *ManagementServer
}
```

<a name="BuildHTTPServers"></a>
### func BuildHTTPServers

```go
func BuildHTTPServers(opts *RunHTTPServersOptions) (*HTTPServers, error)
```

BuildHTTPServers constructs framework HTTP servers from config/options.

<a name="LifecycleHook"></a>
## type LifecycleHook

LifecycleHook defines a named startup/shutdown action.

```go
type LifecycleHook struct {
    Name string
    Fn   func(context.Context) error
}
```

<a name="ManagementServer"></a>
## type ManagementServer

ManagementServer wraps Server for management and admin traffic. It provides a separate HTTP server for health checks, metrics, and admin endpoints on a different port from the public API server.

Requirements: 2.3, 2.4, 2.5, 2.6

```go
type ManagementServer struct {
    *Server
    // contains filtered or unexported fields
}
```

<a name="NewManagementServer"></a>
### func NewManagementServer

```go
func NewManagementServer(cfg config.ManagementConfig, r router.Router, log logger.Logger, healthRegistry *health.Registry, metricsRegistry *metrics.Registry, validator auth.JWTValidator) (*ManagementServer, error)
```

NewManagementServer creates a new ManagementServer instance. It configures the server with the management configuration and sets up standard management endpoints: \- /health: Liveness check \(always returns 200\) \- /ready: Readiness check \(checks dependencies\) \- /metrics: Prometheus metrics endpoint

The middleware stack includes: 1. Request ID \- generates/extracts request IDs for correlation 2. Logging \- logs HTTP requests with structured data 3. Recovery \- catches panics and returns 500 errors

Requirements: 2.3, 2.4, 2.5, 30.1, 30.2, 30.3, 13.1, 13.7

<a name="ManagementServer.Router"></a>
### func \(\*ManagementServer\) Router

```go
func (s *ManagementServer) Router() router.Router
```

Router returns the underlying router instance for registering custom routes and middleware.

<a name="ManagementServer.Shutdown"></a>
### func \(\*ManagementServer\) Shutdown

```go
func (s *ManagementServer) Shutdown(ctx context.Context) error
```

Shutdown gracefully shuts down the management server. It delegates to the underlying Server's Shutdown method.

<a name="ManagementServer.Start"></a>
### func \(\*ManagementServer\) Start

```go
func (s *ManagementServer) Start(ctx context.Context) error
```

Start starts the management server. It delegates to the underlying Server's Start method.

<a name="PublicAPIServer"></a>
## type PublicAPIServer

PublicAPIServer wraps Server for application traffic. It provides the primary HTTP server for handling public API requests with a configured middleware stack for cross\-cutting concerns.

```go
type PublicAPIServer struct {
    *Server
    // contains filtered or unexported fields
}
```

<a name="NewPublicAPIServer"></a>
### func NewPublicAPIServer

```go
func NewPublicAPIServer(cfg config.HTTPConfig, r router.Router, log logger.Logger) *PublicAPIServer
```

NewPublicAPIServer creates a new PublicAPIServer instance. It configures the server with the HTTP configuration and applies the standard middleware stack \(request ID, logging, recovery, metrics\).

The middleware stack is applied in the following order: 1. Request ID \- generates/extracts request IDs for correlation 2. Logging \- logs HTTP requests with structured data 3. Recovery \- catches panics and returns 500 errors 4. Metrics \- records Prometheus metrics for requests

Additional middleware \(auth, rate limiting\) can be added per\-route.

<a name="NewPublicAPIServerWithConfig"></a>
### func NewPublicAPIServerWithConfig

```go
func NewPublicAPIServerWithConfig(cfg config.HTTPConfig, corsCfg config.CORSConfig, securityHeadersCfg config.SecurityHeadersConfig, securityCfg config.SecurityConfig, i18nCfg config.I18nConfig, sessionCfg config.SessionConfig, csrfCfg config.CSRFConfig, sseCfg config.SSEConfig, eventBusCfg config.EventBusConfig, validationCfg config.ValidationConfig, obsCfg config.ObservabilityConfig, r router.Router, log logger.Logger) *PublicAPIServer
```

NewPublicAPIServerWithConfig creates a new PublicAPIServer with CORS and observability\-aware middleware options.

<a name="NewPublicAPIServerWithObservability"></a>
### func NewPublicAPIServerWithObservability

```go
func NewPublicAPIServerWithObservability(cfg config.HTTPConfig, obsCfg config.ObservabilityConfig, r router.Router, log logger.Logger) *PublicAPIServer
```

NewPublicAPIServerWithObservability creates a new PublicAPIServer with observability\-aware middleware options.

<a name="PublicAPIServer.Router"></a>
### func \(\*PublicAPIServer\) Router

```go
func (s *PublicAPIServer) Router() *router.Router
```

Router returns the underlying router instance for registering custom routes and middleware. This allows direct access to the router for advanced configuration beyond the default setup.

<a name="PublicAPIServer.Shutdown"></a>
### func \(\*PublicAPIServer\) Shutdown

```go
func (s *PublicAPIServer) Shutdown(ctx context.Context) error
```

Shutdown gracefully shuts down the public API server. It delegates to the underlying Server's Shutdown method.

<a name="PublicAPIServer.Start"></a>
### func \(\*PublicAPIServer\) Start

```go
func (s *PublicAPIServer) Start(ctx context.Context) error
```

Start starts the public API server. It delegates to the underlying Server's Start method.

<a name="RunHTTPServersOptions"></a>
## type RunHTTPServersOptions

RunHTTPServersOptions defines inputs for building/running framework HTTP servers.

```go
type RunHTTPServersOptions struct {
    Config *config.Config

    // PublicRouter is optional. If nil, a router will be created based on Config.RouterType.
    PublicRouter router.Router
    // ManagementRouter is optional. If nil and management is enabled, a router will be created.
    ManagementRouter router.Router

    Logger logger.Logger

    HealthRegistry  *health.Registry
    MetricsRegistry *metrics.Registry

    ManagementJWTValidator auth.JWTValidator

    StartupHooks        []LifecycleHook
    ShutdownHooks       []LifecycleHook
    ShutdownHookTimeout time.Duration
}
```

<a name="NewDefaultRunHTTPServersOptions"></a>
### func NewDefaultRunHTTPServersOptions

```go
func NewDefaultRunHTTPServersOptions() *RunHTTPServersOptions
```

NewDefaultRunHTTPServersOptions creates a new RunHTTPServersOptions with zero values. All fields are initialized to nil or zero, allowing callers to set only required options.

<a name="Server"></a>
## type Server

Server wraps http.Server with configurable timeouts and graceful lifecycle management. It supports graceful startup, shutdown with timeout, and context cancellation.

```go
type Server struct {
    // contains filtered or unexported fields
}
```

<a name="NewServer"></a>
### func NewServer

```go
func NewServer(cfg ServerConfig, router router.Router, logger logger.Logger) *Server
```

NewServer creates a new Server instance with the provided configuration. The router parameter defines the HTTP routing behavior. The logger parameter is used for structured logging of server lifecycle events.

<a name="Server.Shutdown"></a>
### func \(\*Server\) Shutdown

```go
func (s *Server) Shutdown(ctx context.Context) error
```

Shutdown gracefully stops the HTTP server with a timeout. It stops accepting new connections and waits for in\-flight requests to complete. The shutdown process has a 30\-second timeout. If the timeout is exceeded, the server will be forcefully terminated.

Returns an error if the shutdown process fails.

<a name="Server.Start"></a>
### func \(\*Server\) Start

```go
func (s *Server) Start(ctx context.Context) error
```

Start initializes and starts the HTTP server. It creates an http.Server with configured timeouts and begins listening for requests. The method runs the server in a goroutine and monitors for context cancellation.

If the context is cancelled, Start will call Shutdown to gracefully stop the server. Returns an error if the server fails to start or if shutdown fails.

<a name="ServerConfig"></a>
## type ServerConfig

ServerConfig holds configuration for the HTTP server.

```go
type ServerConfig struct {
    Port         int
    ReadTimeout  time.Duration
    WriteTimeout time.Duration
    IdleTimeout  time.Duration
    TLSConfig    *tls.Config
}
```

# openapi

```go
import "github.com/nimburion/nimburion/pkg/server/openapi"
```

Package openapi provides handlers for serving OpenAPI specifications and Swagger UI.

## Index

- [func Annotate\(handler router.HandlerFunc, annotations EndpointAnnotations\) router.HandlerFunc](<#Annotate>)
- [func WriteSpec\(path string, spec \*Spec\) error](<#WriteSpec>)
- [type EndpointAnnotations](<#EndpointAnnotations>)
- [type Handler](<#Handler>)
  - [func NewHandler\(specPath string\) \*Handler](<#NewHandler>)
  - [func \(h \*Handler\) RegisterRoutes\(r router.Router\)](<#Handler.RegisterRoutes>)
  - [func \(h \*Handler\) ServeSpec\(c router.Context\) error](<#Handler.ServeSpec>)
- [type Operation](<#Operation>)
- [type ParamSchema](<#ParamSchema>)
- [type Parameter](<#Parameter>)
- [type PathItem](<#PathItem>)
- [type Response](<#Response>)
- [type Route](<#Route>)
  - [func CollectRoutes\(register func\(router.Router\)\) \[\]Route](<#CollectRoutes>)
- [type Spec](<#Spec>)
  - [func BuildSpec\(title, version string, routes \[\]Route\) \*Spec](<#BuildSpec>)
- [type SpecInfo](<#SpecInfo>)
- [type SwaggerHandler](<#SwaggerHandler>)
  - [func NewSwaggerHandler\(enabled bool, specPath string\) \*SwaggerHandler](<#NewSwaggerHandler>)
  - [func \(h \*SwaggerHandler\) RegisterRoutes\(r router.Router\)](<#SwaggerHandler.RegisterRoutes>)
  - [func \(h \*SwaggerHandler\) ServeSwaggerUI\(c router.Context\) error](<#SwaggerHandler.ServeSwaggerUI>)


<a name="Annotate"></a>
## func Annotate

```go
func Annotate(handler router.HandlerFunc, annotations EndpointAnnotations) router.HandlerFunc
```

Annotate registers OpenAPI annotations for a specific handler. Pass the returned handler to route registration.

<a name="WriteSpec"></a>
## func WriteSpec

```go
func WriteSpec(path string, spec *Spec) error
```

WriteSpec writes the OpenAPI document as YAML or JSON based on file extension.

<a name="EndpointAnnotations"></a>
## type EndpointAnnotations

EndpointAnnotations customizes generated OpenAPI operation metadata.

```go
type EndpointAnnotations struct {
    Summary     string
    Description string
    Tags        []string
    OperationID string
}
```

<a name="Handler"></a>
## type Handler

Handler serves OpenAPI specification files

```go
type Handler struct {
    // contains filtered or unexported fields
}
```

<a name="NewHandler"></a>
### func NewHandler

```go
func NewHandler(specPath string) *Handler
```

NewHandler creates a new OpenAPI handler

<a name="Handler.RegisterRoutes"></a>
### func \(\*Handler\) RegisterRoutes

```go
func (h *Handler) RegisterRoutes(r router.Router)
```

RegisterRoutes registers OpenAPI routes on the given router

<a name="Handler.ServeSpec"></a>
### func \(\*Handler\) ServeSpec

```go
func (h *Handler) ServeSpec(c router.Context) error
```

ServeSpec serves the OpenAPI specification file

<a name="Operation"></a>
## type Operation

Operation contains minimal operation metadata.

```go
type Operation struct {
    OperationID string               `json:"operationId,omitempty" yaml:"operationId,omitempty"`
    Summary     string               `json:"summary,omitempty" yaml:"summary,omitempty"`
    Description string               `json:"description,omitempty" yaml:"description,omitempty"`
    Tags        []string             `json:"tags,omitempty" yaml:"tags,omitempty"`
    Parameters  []Parameter          `json:"parameters,omitempty" yaml:"parameters,omitempty"`
    Responses   map[string]*Response `json:"responses" yaml:"responses"`
}
```

<a name="ParamSchema"></a>
## type ParamSchema

ParamSchema is the JSON schema for parameters.

```go
type ParamSchema struct {
    Type string `json:"type" yaml:"type"`
}
```

<a name="Parameter"></a>
## type Parameter

Parameter describes one operation parameter.

```go
type Parameter struct {
    Name     string      `json:"name" yaml:"name"`
    In       string      `json:"in" yaml:"in"`
    Required bool        `json:"required" yaml:"required"`
    Schema   ParamSchema `json:"schema" yaml:"schema"`
}
```

<a name="PathItem"></a>
## type PathItem

PathItem groups operations by HTTP method.

```go
type PathItem struct {
    Get    *Operation `json:"get,omitempty" yaml:"get,omitempty"`
    Post   *Operation `json:"post,omitempty" yaml:"post,omitempty"`
    Put    *Operation `json:"put,omitempty" yaml:"put,omitempty"`
    Delete *Operation `json:"delete,omitempty" yaml:"delete,omitempty"`
    Patch  *Operation `json:"patch,omitempty" yaml:"patch,omitempty"`
}
```

<a name="Response"></a>
## type Response

Response describes an operation response.

```go
type Response struct {
    Description string `json:"description" yaml:"description"`
}
```

<a name="Route"></a>
## type Route

Route describes one registered endpoint.

```go
type Route struct {
    Method      string
    Path        string
    Annotations EndpointAnnotations
}
```

<a name="CollectRoutes"></a>
### func CollectRoutes

```go
func CollectRoutes(register func(router.Router)) []Route
```

CollectRoutes executes the provided route registration callback and returns all registered routes in declaration order.

<a name="Spec"></a>
## type Spec

Spec is a minimal OpenAPI v3 document generated from registered routes.

```go
type Spec struct {
    OpenAPI string               `json:"openapi" yaml:"openapi"`
    Info    SpecInfo             `json:"info" yaml:"info"`
    Paths   map[string]*PathItem `json:"paths" yaml:"paths"`
}
```

<a name="BuildSpec"></a>
### func BuildSpec

```go
func BuildSpec(title, version string, routes []Route) *Spec
```

BuildSpec builds an OpenAPI document from collected routes.

<a name="SpecInfo"></a>
## type SpecInfo

SpecInfo contains API metadata.

```go
type SpecInfo struct {
    Title   string `json:"title" yaml:"title"`
    Version string `json:"version" yaml:"version"`
}
```

<a name="SwaggerHandler"></a>
## type SwaggerHandler

SwaggerHandler serves Swagger UI

```go
type SwaggerHandler struct {
    // contains filtered or unexported fields
}
```

<a name="NewSwaggerHandler"></a>
### func NewSwaggerHandler

```go
func NewSwaggerHandler(enabled bool, specPath string) *SwaggerHandler
```

NewSwaggerHandler creates a new Swagger UI handler

<a name="SwaggerHandler.RegisterRoutes"></a>
### func \(\*SwaggerHandler\) RegisterRoutes

```go
func (h *SwaggerHandler) RegisterRoutes(r router.Router)
```

RegisterRoutes registers Swagger UI routes on the given router

<a name="SwaggerHandler.ServeSwaggerUI"></a>
### func \(\*SwaggerHandler\) ServeSwaggerUI

```go
func (h *SwaggerHandler) ServeSwaggerUI(c router.Context) error
```

ServeSwaggerUI serves the Swagger UI HTML page

# router

```go
import "github.com/nimburion/nimburion/pkg/server/router"
```

Package router provides an abstraction layer for HTTP routing. It defines interfaces that allow pluggable router implementations \(net/http, gin\-gonic, gorilla/mux\).

## Index

- [type Context](<#Context>)
- [type HandlerFunc](<#HandlerFunc>)
- [type MiddlewareFunc](<#MiddlewareFunc>)
- [type ResponseWriter](<#ResponseWriter>)
- [type Router](<#Router>)


<a name="Context"></a>
## type Context

Context provides access to request and response in a router\-agnostic way.

```go
type Context interface {
    // Request returns the underlying HTTP request
    Request() *http.Request

    // SetRequest sets the HTTP request (useful for middleware that modifies the request)
    SetRequest(r *http.Request)

    // Response returns the response writer
    Response() ResponseWriter

    // SetResponse sets the HTTP response writer (useful for middleware that wraps responses)
    SetResponse(w ResponseWriter)

    // Param returns a URL parameter by name (e.g., /users/:id)
    Param(name string) string

    // Query returns a query parameter by name (e.g., /users?name=john)
    Query(name string) string

    // Bind parses the request body into the provided struct
    Bind(v interface{}) error

    // JSON sends a JSON response with the given status code
    JSON(code int, v interface{}) error

    // String sends a plain text response with the given status code
    String(code int, s string) error

    // Get retrieves a value from the context by key
    Get(key string) interface{}

    // Set stores a value in the context by key
    Set(key string, value interface{})
}
```

<a name="HandlerFunc"></a>
## type HandlerFunc

HandlerFunc is the function signature for route handlers. It receives a Context and returns an error.

```go
type HandlerFunc func(Context) error
```

<a name="MiddlewareFunc"></a>
## type MiddlewareFunc

MiddlewareFunc is the function signature for middleware. It wraps a HandlerFunc and returns a new HandlerFunc.

```go
type MiddlewareFunc func(HandlerFunc) HandlerFunc
```

<a name="ResponseWriter"></a>
## type ResponseWriter

ResponseWriter wraps http.ResponseWriter to track response status.

```go
type ResponseWriter interface {
    http.ResponseWriter

    // Status returns the HTTP status code of the response
    Status() int

    // Written returns whether the response has been written
    Written() bool
}
```

<a name="Router"></a>
## type Router

Router defines the interface for HTTP routing. Implementations can use different underlying routers \(net/http, gin\-gonic, gorilla/mux\).

```go
type Router interface {
    // HTTP method handlers
    GET(path string, handler HandlerFunc, middleware ...MiddlewareFunc)
    POST(path string, handler HandlerFunc, middleware ...MiddlewareFunc)
    PUT(path string, handler HandlerFunc, middleware ...MiddlewareFunc)
    DELETE(path string, handler HandlerFunc, middleware ...MiddlewareFunc)
    PATCH(path string, handler HandlerFunc, middleware ...MiddlewareFunc)

    // Group creates a route group with common prefix and middleware
    Group(prefix string, middleware ...MiddlewareFunc) Router

    // Use applies middleware to all routes
    Use(middleware ...MiddlewareFunc)

    // ServeHTTP implements http.Handler
    ServeHTTP(w http.ResponseWriter, r *http.Request)
}
```

# contract

```go
import "github.com/nimburion/nimburion/pkg/server/router/contract"
```

## Index

- [func TestRouterContract\(t \*testing.T, createRouter func\(\) router.Router\)](<#TestRouterContract>)


<a name="TestRouterContract"></a>
## func TestRouterContract

```go
func TestRouterContract(t *testing.T, createRouter func() router.Router)
```

TestRouterContract runs the shared router conformance suite.

# factory

```go
import "github.com/nimburion/nimburion/pkg/server/router/factory"
```

Package factory creates router implementations from configuration.

## Index

- [func NewRouter\(routerType string\) \(router.Router, error\)](<#NewRouter>)
- [func SupportedTypes\(\) \[\]string](<#SupportedTypes>)


<a name="NewRouter"></a>
## func NewRouter

```go
func NewRouter(routerType string) (router.Router, error)
```

NewRouter creates a router from type.

<a name="SupportedTypes"></a>
## func SupportedTypes

```go
func SupportedTypes() []string
```

SupportedTypes returns the supported router types.

# gin

```go
import "github.com/nimburion/nimburion/pkg/server/router/gin"
```

Package gin provides a gin\-gonic based implementation of the router.Router interface.

## Index

- [type GinRouter](<#GinRouter>)
  - [func NewRouter\(\) \*GinRouter](<#NewRouter>)
  - [func \(r \*GinRouter\) DELETE\(path string, handler router.HandlerFunc, middleware ...router.MiddlewareFunc\)](<#GinRouter.DELETE>)
  - [func \(r \*GinRouter\) GET\(path string, handler router.HandlerFunc, middleware ...router.MiddlewareFunc\)](<#GinRouter.GET>)
  - [func \(r \*GinRouter\) Group\(prefix string, middleware ...router.MiddlewareFunc\) router.Router](<#GinRouter.Group>)
  - [func \(r \*GinRouter\) PATCH\(path string, handler router.HandlerFunc, middleware ...router.MiddlewareFunc\)](<#GinRouter.PATCH>)
  - [func \(r \*GinRouter\) POST\(path string, handler router.HandlerFunc, middleware ...router.MiddlewareFunc\)](<#GinRouter.POST>)
  - [func \(r \*GinRouter\) PUT\(path string, handler router.HandlerFunc, middleware ...router.MiddlewareFunc\)](<#GinRouter.PUT>)
  - [func \(r \*GinRouter\) ServeHTTP\(w http.ResponseWriter, req \*http.Request\)](<#GinRouter.ServeHTTP>)
  - [func \(r \*GinRouter\) Use\(middleware ...router.MiddlewareFunc\)](<#GinRouter.Use>)


<a name="GinRouter"></a>
## type GinRouter

GinRouter implements router.Router using gin\-gonic/gin.

```go
type GinRouter struct {
    // contains filtered or unexported fields
}
```

<a name="NewRouter"></a>
### func NewRouter

```go
func NewRouter() *GinRouter
```

NewRouter creates a new GinRouter.

<a name="GinRouter.DELETE"></a>
### func \(\*GinRouter\) DELETE

```go
func (r *GinRouter) DELETE(path string, handler router.HandlerFunc, middleware ...router.MiddlewareFunc)
```

DELETE registers a handler for HTTP DELETE requests at the specified path.

<a name="GinRouter.GET"></a>
### func \(\*GinRouter\) GET

```go
func (r *GinRouter) GET(path string, handler router.HandlerFunc, middleware ...router.MiddlewareFunc)
```

GET registers a handler for HTTP GET requests at the specified path.

<a name="GinRouter.Group"></a>
### func \(\*GinRouter\) Group

```go
func (r *GinRouter) Group(prefix string, middleware ...router.MiddlewareFunc) router.Router
```

Group creates a route group with common prefix and middleware.

<a name="GinRouter.PATCH"></a>
### func \(\*GinRouter\) PATCH

```go
func (r *GinRouter) PATCH(path string, handler router.HandlerFunc, middleware ...router.MiddlewareFunc)
```

PATCH registers a handler for HTTP PATCH requests at the specified path.

<a name="GinRouter.POST"></a>
### func \(\*GinRouter\) POST

```go
func (r *GinRouter) POST(path string, handler router.HandlerFunc, middleware ...router.MiddlewareFunc)
```

POST registers a handler for HTTP POST requests at the specified path.

<a name="GinRouter.PUT"></a>
### func \(\*GinRouter\) PUT

```go
func (r *GinRouter) PUT(path string, handler router.HandlerFunc, middleware ...router.MiddlewareFunc)
```

PUT registers a handler for HTTP PUT requests at the specified path.

<a name="GinRouter.ServeHTTP"></a>
### func \(\*GinRouter\) ServeHTTP

```go
func (r *GinRouter) ServeHTTP(w http.ResponseWriter, req *http.Request)
```

ServeHTTP implements http.Handler.

<a name="GinRouter.Use"></a>
### func \(\*GinRouter\) Use

```go
func (r *GinRouter) Use(middleware ...router.MiddlewareFunc)
```

Use applies middleware to all routes.

# gorilla

```go
import "github.com/nimburion/nimburion/pkg/server/router/gorilla"
```

Package gorilla provides a gorilla/mux based implementation of the router.Router interface.

## Index

- [type GorillaRouter](<#GorillaRouter>)
  - [func NewRouter\(\) \*GorillaRouter](<#NewRouter>)
  - [func \(r \*GorillaRouter\) DELETE\(path string, handler router.HandlerFunc, middleware ...router.MiddlewareFunc\)](<#GorillaRouter.DELETE>)
  - [func \(r \*GorillaRouter\) GET\(path string, handler router.HandlerFunc, middleware ...router.MiddlewareFunc\)](<#GorillaRouter.GET>)
  - [func \(r \*GorillaRouter\) Group\(prefix string, middleware ...router.MiddlewareFunc\) router.Router](<#GorillaRouter.Group>)
  - [func \(r \*GorillaRouter\) PATCH\(path string, handler router.HandlerFunc, middleware ...router.MiddlewareFunc\)](<#GorillaRouter.PATCH>)
  - [func \(r \*GorillaRouter\) POST\(path string, handler router.HandlerFunc, middleware ...router.MiddlewareFunc\)](<#GorillaRouter.POST>)
  - [func \(r \*GorillaRouter\) PUT\(path string, handler router.HandlerFunc, middleware ...router.MiddlewareFunc\)](<#GorillaRouter.PUT>)
  - [func \(r \*GorillaRouter\) ServeHTTP\(w http.ResponseWriter, req \*http.Request\)](<#GorillaRouter.ServeHTTP>)
  - [func \(r \*GorillaRouter\) Use\(middleware ...router.MiddlewareFunc\)](<#GorillaRouter.Use>)


<a name="GorillaRouter"></a>
## type GorillaRouter

GorillaRouter implements router.Router using gorilla/mux.

```go
type GorillaRouter struct {
    // contains filtered or unexported fields
}
```

<a name="NewRouter"></a>
### func NewRouter

```go
func NewRouter() *GorillaRouter
```

NewRouter creates a new GorillaRouter.

<a name="GorillaRouter.DELETE"></a>
### func \(\*GorillaRouter\) DELETE

```go
func (r *GorillaRouter) DELETE(path string, handler router.HandlerFunc, middleware ...router.MiddlewareFunc)
```

DELETE registers a handler for HTTP DELETE requests at the specified path.

<a name="GorillaRouter.GET"></a>
### func \(\*GorillaRouter\) GET

```go
func (r *GorillaRouter) GET(path string, handler router.HandlerFunc, middleware ...router.MiddlewareFunc)
```

GET registers a handler for HTTP GET requests at the specified path.

<a name="GorillaRouter.Group"></a>
### func \(\*GorillaRouter\) Group

```go
func (r *GorillaRouter) Group(prefix string, middleware ...router.MiddlewareFunc) router.Router
```

Group creates a route group with common prefix and middleware.

<a name="GorillaRouter.PATCH"></a>
### func \(\*GorillaRouter\) PATCH

```go
func (r *GorillaRouter) PATCH(path string, handler router.HandlerFunc, middleware ...router.MiddlewareFunc)
```

PATCH registers a handler for HTTP PATCH requests at the specified path.

<a name="GorillaRouter.POST"></a>
### func \(\*GorillaRouter\) POST

```go
func (r *GorillaRouter) POST(path string, handler router.HandlerFunc, middleware ...router.MiddlewareFunc)
```

POST registers a handler for HTTP POST requests at the specified path.

<a name="GorillaRouter.PUT"></a>
### func \(\*GorillaRouter\) PUT

```go
func (r *GorillaRouter) PUT(path string, handler router.HandlerFunc, middleware ...router.MiddlewareFunc)
```

PUT registers a handler for HTTP PUT requests at the specified path.

<a name="GorillaRouter.ServeHTTP"></a>
### func \(\*GorillaRouter\) ServeHTTP

```go
func (r *GorillaRouter) ServeHTTP(w http.ResponseWriter, req *http.Request)
```

ServeHTTP implements http.Handler.

<a name="GorillaRouter.Use"></a>
### func \(\*GorillaRouter\) Use

```go
func (r *GorillaRouter) Use(middleware ...router.MiddlewareFunc)
```

Use applies middleware to all routes.

# nethttp

```go
import "github.com/nimburion/nimburion/pkg/server/router/nethttp"
```

Package nethttp provides a net/http\-based implementation of the router.Router interface.

## Index

- [type NetHTTPRouter](<#NetHTTPRouter>)
  - [func NewRouter\(\) \*NetHTTPRouter](<#NewRouter>)
  - [func \(r \*NetHTTPRouter\) DELETE\(path string, handler router.HandlerFunc, middleware ...router.MiddlewareFunc\)](<#NetHTTPRouter.DELETE>)
  - [func \(r \*NetHTTPRouter\) GET\(path string, handler router.HandlerFunc, middleware ...router.MiddlewareFunc\)](<#NetHTTPRouter.GET>)
  - [func \(r \*NetHTTPRouter\) Group\(prefix string, middleware ...router.MiddlewareFunc\) router.Router](<#NetHTTPRouter.Group>)
  - [func \(r \*NetHTTPRouter\) PATCH\(path string, handler router.HandlerFunc, middleware ...router.MiddlewareFunc\)](<#NetHTTPRouter.PATCH>)
  - [func \(r \*NetHTTPRouter\) POST\(path string, handler router.HandlerFunc, middleware ...router.MiddlewareFunc\)](<#NetHTTPRouter.POST>)
  - [func \(r \*NetHTTPRouter\) PUT\(path string, handler router.HandlerFunc, middleware ...router.MiddlewareFunc\)](<#NetHTTPRouter.PUT>)
  - [func \(r \*NetHTTPRouter\) ServeHTTP\(w http.ResponseWriter, req \*http.Request\)](<#NetHTTPRouter.ServeHTTP>)
  - [func \(r \*NetHTTPRouter\) Use\(middleware ...router.MiddlewareFunc\)](<#NetHTTPRouter.Use>)


<a name="NetHTTPRouter"></a>
## type NetHTTPRouter

NetHTTPRouter implements router.Router using net/http and a simple pattern matcher.

```go
type NetHTTPRouter struct {
    // contains filtered or unexported fields
}
```

<a name="NewRouter"></a>
### func NewRouter

```go
func NewRouter() *NetHTTPRouter
```

NewRouter creates a new NetHTTPRouter.

<a name="NetHTTPRouter.DELETE"></a>
### func \(\*NetHTTPRouter\) DELETE

```go
func (r *NetHTTPRouter) DELETE(path string, handler router.HandlerFunc, middleware ...router.MiddlewareFunc)
```

DELETE registers a DELETE route.

<a name="NetHTTPRouter.GET"></a>
### func \(\*NetHTTPRouter\) GET

```go
func (r *NetHTTPRouter) GET(path string, handler router.HandlerFunc, middleware ...router.MiddlewareFunc)
```

GET registers a GET route.

<a name="NetHTTPRouter.Group"></a>
### func \(\*NetHTTPRouter\) Group

```go
func (r *NetHTTPRouter) Group(prefix string, middleware ...router.MiddlewareFunc) router.Router
```

Group creates a route group with common prefix and middleware.

<a name="NetHTTPRouter.PATCH"></a>
### func \(\*NetHTTPRouter\) PATCH

```go
func (r *NetHTTPRouter) PATCH(path string, handler router.HandlerFunc, middleware ...router.MiddlewareFunc)
```

PATCH registers a PATCH route.

<a name="NetHTTPRouter.POST"></a>
### func \(\*NetHTTPRouter\) POST

```go
func (r *NetHTTPRouter) POST(path string, handler router.HandlerFunc, middleware ...router.MiddlewareFunc)
```

POST registers a POST route.

<a name="NetHTTPRouter.PUT"></a>
### func \(\*NetHTTPRouter\) PUT

```go
func (r *NetHTTPRouter) PUT(path string, handler router.HandlerFunc, middleware ...router.MiddlewareFunc)
```

PUT registers a PUT route.

<a name="NetHTTPRouter.ServeHTTP"></a>
### func \(\*NetHTTPRouter\) ServeHTTP

```go
func (r *NetHTTPRouter) ServeHTTP(w http.ResponseWriter, req *http.Request)
```

ServeHTTP implements http.Handler.

<a name="NetHTTPRouter.Use"></a>
### func \(\*NetHTTPRouter\) Use

```go
func (r *NetHTTPRouter) Use(middleware ...router.MiddlewareFunc)
```

Use applies middleware to all routes.

Generated by [gomarkdoc](<https://github.com/princjef/gomarkdoc>)
