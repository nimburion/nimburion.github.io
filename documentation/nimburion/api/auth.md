---
layout: documentation
title: pkg/auth
---


# auth

```go
import "github.com/nimburion/nimburion/pkg/auth"
```

## Index

- [func BuildAuthorizeURL\(cfg OAuth2Config, state string\) \(string, error\)](<#BuildAuthorizeURL>)
- [func ValidateOAuth2Config\(cfg OAuth2Config\) error](<#ValidateOAuth2Config>)
- [func WithClaims\(ctx context.Context, claims \*Claims\) context.Context](<#WithClaims>)
- [type Claims](<#Claims>)
  - [func GetClaims\(ctx context.Context\) \*Claims](<#GetClaims>)
- [type JWK](<#JWK>)
- [type JWKSClient](<#JWKSClient>)
  - [func NewJWKSClient\(jwksURL string, cacheTTL time.Duration, logger logger.Logger\) \*JWKSClient](<#NewJWKSClient>)
  - [func \(c \*JWKSClient\) GetKey\(ctx context.Context, kid string\) \(interface\{\}, error\)](<#JWKSClient.GetKey>)
- [type JWKSResponse](<#JWKSResponse>)
- [type JWKSValidator](<#JWKSValidator>)
  - [func NewJWKSValidator\(jwksClient \*JWKSClient, issuer, audience string, logger logger.Logger, opts ...JWKSValidatorOption\) \*JWKSValidator](<#NewJWKSValidator>)
  - [func \(v \*JWKSValidator\) Validate\(ctx context.Context, tokenString string\) \(\*Claims, error\)](<#JWKSValidator.Validate>)
- [type JWKSValidatorOption](<#JWKSValidatorOption>)
  - [func WithClaimMappings\(mappings map\[string\]\[\]string\) JWKSValidatorOption](<#WithClaimMappings>)
- [type JWTValidator](<#JWTValidator>)
- [type OAuth2Config](<#OAuth2Config>)
- [type OAuth2TokenResponse](<#OAuth2TokenResponse>)
  - [func ExchangeAuthorizationCode\(ctx context.Context, httpClient \*http.Client, cfg OAuth2Config, code string\) \(\*OAuth2TokenResponse, error\)](<#ExchangeAuthorizationCode>)
  - [func ExchangeRefreshToken\(ctx context.Context, httpClient \*http.Client, cfg OAuth2Config, refreshToken string\) \(\*OAuth2TokenResponse, error\)](<#ExchangeRefreshToken>)


<a name="BuildAuthorizeURL"></a>
## func BuildAuthorizeURL

```go
func BuildAuthorizeURL(cfg OAuth2Config, state string) (string, error)
```

BuildAuthorizeURL builds an OAuth2 authorization URL with common query parameters. Audience is included only when configured.

<a name="ValidateOAuth2Config"></a>
## func ValidateOAuth2Config

```go
func ValidateOAuth2Config(cfg OAuth2Config) error
```

ValidateOAuth2Config validates the minimum required OAuth2 configuration.

<a name="WithClaims"></a>
## func WithClaims

```go
func WithClaims(ctx context.Context, claims *Claims) context.Context
```

WithClaims stores claims in the context.

<a name="Claims"></a>
## type Claims

Claims represents the extracted claims from a validated JWT token.

```go
type Claims struct {
    Subject   string                 // Subject (sub) - typically user ID
    Issuer    string                 // Issuer (iss) - token issuer
    Audience  []string               // Audience (aud) - intended recipients
    ExpiresAt time.Time              // Expiration time (exp)
    IssuedAt  time.Time              // Issued at (iat)
    TenantID  string                 // Tenant identifier (tenant_id)
    Scopes    []string               // OAuth2 scopes
    Roles     []string               // Roles extracted from role/roles claims
    Custom    map[string]interface{} // Custom claims
}
```

<a name="GetClaims"></a>
### func GetClaims

```go
func GetClaims(ctx context.Context) *Claims
```

GetClaims retrieves claims from the context. Returns nil if no claims are found.

<a name="JWK"></a>
## type JWK

JWK represents a JSON Web Key from the JWKS endpoint.

```go
type JWK struct {
    Kid string `json:"kid"` // Key ID
    Kty string `json:"kty"` // Key Type (e.g., "RSA")
    Use string `json:"use"` // Public Key Use (e.g., "sig")
    Alg string `json:"alg"` // Algorithm (e.g., "RS256")
    N   string `json:"n"`   // RSA modulus
    E   string `json:"e"`   // RSA exponent
}
```

<a name="JWKSClient"></a>
## type JWKSClient

JWKSClient fetches and caches JSON Web Key Sets for JWT signature verification. It implements thread\-safe caching with configurable TTL to reduce external calls.

```go
type JWKSClient struct {
    // contains filtered or unexported fields
}
```

<a name="NewJWKSClient"></a>
### func NewJWKSClient

```go
func NewJWKSClient(jwksURL string, cacheTTL time.Duration, logger logger.Logger) *JWKSClient
```

NewJWKSClient creates a new JWKS client with the specified configuration. The client will fetch keys from jwksURL and cache them for cacheTTL duration.

<details><summary>Example</summary>
<p>

This example demonstrates how to create and use a JWKS client to fetch and cache public keys for JWT validation.

```go
package main

import (
	"context"
	"fmt"
	"time"

	"github.com/nimburion/nimburion/pkg/auth"
	"github.com/nimburion/nimburion/pkg/observability/logger"
)

func main() {
	// Create a logger (use your actual logger implementation)
	var log logger.Logger // = logger.NewZapLogger(...)

	// Create JWKS client with 1 hour cache TTL
	jwksURL := "https://your-auth-server.com/.well-known/jwks.json"
	cacheTTL := 1 * time.Hour
	client := auth.NewJWKSClient(jwksURL, cacheTTL, log)

	// Get a public key by its key ID (kid)
	ctx := context.Background()
	kid := "key-id-from-jwt-header"
	publicKey, err := client.GetKey(ctx, kid)
	if err != nil {
		fmt.Printf("Failed to get key: %v\n", err)
		return
	}

	// Use the public key to verify JWT signature
	_ = publicKey // Use with jwt.Parse or similar
}
```

</p>
</details>

<a name="JWKSClient.GetKey"></a>
### func \(\*JWKSClient\) GetKey

```go
func (c *JWKSClient) GetKey(ctx context.Context, kid string) (interface{}, error)
```

GetKey retrieves a public key by its key ID \(kid\). It first checks the cache, and if not found or expired, fetches fresh keys from the JWKS endpoint.

<a name="JWKSResponse"></a>
## type JWKSResponse

JWKSResponse represents the response from a JWKS endpoint.

```go
type JWKSResponse struct {
    Keys []JWK `json:"keys"`
}
```

<a name="JWKSValidator"></a>
## type JWKSValidator

JWKSValidator validates JWT tokens using JWKS for signature verification. It validates the signature, issuer, audience, and expiration.

```go
type JWKSValidator struct {
    // contains filtered or unexported fields
}
```

<a name="NewJWKSValidator"></a>
### func NewJWKSValidator

```go
func NewJWKSValidator(jwksClient *JWKSClient, issuer, audience string, logger logger.Logger, opts ...JWKSValidatorOption) *JWKSValidator
```

NewJWKSValidator creates a new JWT validator that uses JWKS for signature verification.

<a name="JWKSValidator.Validate"></a>
### func \(\*JWKSValidator\) Validate

```go
func (v *JWKSValidator) Validate(ctx context.Context, tokenString string) (*Claims, error)
```

Validate validates a JWT token and extracts its claims. It performs the following validations: \- Signature verification using JWKS public key \- Issuer validation \- Audience validation \- Expiration validation

<a name="JWKSValidatorOption"></a>
## type JWKSValidatorOption

JWKSValidatorOption configures optional behavior for JWKS validator instances.

```go
type JWKSValidatorOption func(*JWKSValidator)
```

<a name="WithClaimMappings"></a>
### func WithClaimMappings

```go
func WithClaimMappings(mappings map[string][]string) JWKSValidatorOption
```

WithClaimMappings overrides claim alias mappings used during claim extraction. Example: map\["tenant\_id"\] = \[\]string\{"tenant\_id","tenantId","https://example.com/tenant_id"\}.

<a name="JWTValidator"></a>
## type JWTValidator

JWTValidator validates JWT tokens and extracts claims.

```go
type JWTValidator interface {
    Validate(ctx context.Context, token string) (*Claims, error)
}
```

<a name="OAuth2Config"></a>
## type OAuth2Config

OAuth2Config is a provider\-agnostic OAuth2 configuration used for authorization\-code and refresh\-token flows.

```go
type OAuth2Config struct {
    AuthorizeURL string
    TokenURL     string
    ClientID     string
    ClientSecret string
    RedirectURL  string
    Audience     string
    Scopes       []string
}
```

<a name="OAuth2TokenResponse"></a>
## type OAuth2TokenResponse

OAuth2TokenResponse models a standard token endpoint response.

```go
type OAuth2TokenResponse struct {
    AccessToken      string `json:"access_token"`
    RefreshToken     string `json:"refresh_token"`
    ExpiresIn        int    `json:"expires_in"`
    RefreshExpiresIn int    `json:"refresh_expires_in"`
    TokenType        string `json:"token_type"`
    Scope            string `json:"scope"`
}
```

<a name="ExchangeAuthorizationCode"></a>
### func ExchangeAuthorizationCode

```go
func ExchangeAuthorizationCode(ctx context.Context, httpClient *http.Client, cfg OAuth2Config, code string) (*OAuth2TokenResponse, error)
```

ExchangeAuthorizationCode exchanges an authorization code for tokens.

<a name="ExchangeRefreshToken"></a>
### func ExchangeRefreshToken

```go
func ExchangeRefreshToken(ctx context.Context, httpClient *http.Client, cfg OAuth2Config, refreshToken string) (*OAuth2TokenResponse, error)
```

ExchangeRefreshToken exchanges a refresh token for a new access token.

Generated by [gomarkdoc](<https://github.com/princjef/gomarkdoc>)
