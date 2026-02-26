---
layout: documentation
title: Installation
lang: en
---

# Installation

## Requirements

- **Go 1.23 or later**
- **Git**
- **nimbctl** - Nimburion CLI tool

## Install nimbctl

The Nimburion CLI tool (`nimbctl`) is used to scaffold new services and manage Nimburion projects.

### Install via Go

```bash
go install github.com/nimburion/nimbctl@latest
```

### Verify Installation

```bash
nimbctl version
```

Expected output:
```
nimbctl version 0.1.0
```

### Add to PATH

Make sure `$GOPATH/bin` is in your PATH:

```bash
# Add to ~/.bashrc or ~/.zshrc
export PATH=$PATH:$(go env GOPATH)/bin
```

## Verify Go Version

Nimburion requires Go 1.23 or later:

```bash
go version
```

If you need to upgrade:

**macOS (Homebrew)**
```bash
brew upgrade go
```

**Linux**
```bash
# Download from https://go.dev/dl/
wget https://go.dev/dl/go1.23.0.linux-amd64.tar.gz
sudo rm -rf /usr/local/go
sudo tar -C /usr/local -xzf go1.23.0.linux-amd64.tar.gz
```

**Windows**
Download installer from [https://go.dev/dl/](https://go.dev/dl/)

## Create Your First Service

Once `nimbctl` is installed:

```bash
nimbctl new my-service
cd my-service
go mod tidy
```

## Framework Dependencies

Nimburion uses these key dependencies (automatically managed via Go modules):

- **Gin** - HTTP routing and middleware
- **Viper** - Configuration management
- **Zap** - Structured logging
- **Prometheus client** - Metrics collection
- **OpenTelemetry** - Distributed tracing

All dependencies are downloaded automatically when you run:

```bash
go mod download
```

## IDE Setup

### VS Code

Install the Go extension:
```bash
code --install-extension golang.go
```

### GoLand

GoLand has built-in Go support. Just open the project directory.

### Vim/Neovim

Install `vim-go`:
```vim
Plug 'fatih/vim-go'
```

## Next Steps

- [Create your first service](/documentation/nimburion/getting-started/) - Quick start guide
- [First service deep dive](/documentation/nimburion/getting-started/first-service/) - Understand the generated code
