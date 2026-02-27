---
layout: documentation
title: API Gateway
lang: en
---

<section class="hero-grid">
  <div class="hero-copy">
    <span class="eyebrow">Edge project</span>
    <h1>API Gateway documentation for routing and policy control.</h1>
    <p class="hero-subtitle">
      HTTP/WebSocket gateway built on Nimburion with controlled exposure,
      policy enforcement, and operational visibility at the edge.
    </p>
    <div class="hero-actions">
      <a class="btn btn-primary" href="{{ '/documentation/apigateway/overview/' | relative_url }}">Open overview</a>
      <a class="btn btn-secondary" href="https://github.com/nimburion/apigateway" target="_blank" rel="noopener noreferrer">Open repository</a>
    </div>
  </div>
  <aside class="hero-panel" aria-label="API Gateway docs sections">
    <div class="hero-panel-block">
      <p class="panel-kicker">Start path</p>
      <ul class="panel-list">
        <li>Overview</li>
        <li>Operations</li>
        <li>Routing and Policies</li>
      </ul>
    </div>
  </aside>
</section>

<section class="section">
  <div class="section-head">
    <h2>Start here</h2>
    <p>Read conceptual pages first, then move to routing and policy specifics.</p>
  </div>
  <div class="project-grid">
    <article class="project-card">
      <div class="project-head">
        <h3>Overview</h3>
        <span class="tag">1</span>
      </div>
      <p>Purpose, system role, and high-level capability map of the gateway.</p>
      <a href="{{ '/documentation/apigateway/overview/' | relative_url }}">Open page →</a>
    </article>
    <article class="project-card">
      <div class="project-head">
        <h3>Operations</h3>
        <span class="tag">2</span>
      </div>
      <p>Runbook, reliability practices, and production operations guidance.</p>
      <a href="{{ '/documentation/apigateway/operations/' | relative_url }}">Open page →</a>
    </article>
    <article class="project-card">
      <div class="project-head">
        <h3>Routing and Policies</h3>
        <span class="tag">3</span>
      </div>
      <p>Routing model, policy chain, and contract-driven edge behavior.</p>
      <a href="{{ '/documentation/apigateway/routing-and-policies/' | relative_url }}">Open page →</a>
    </article>
  </div>
</section>

## Quick start
```bash
go run ./cmd --config-file config/config.yaml
```

## Main commands
```bash
go run ./cmd routes show --config-file config/config.yaml
go run ./cmd routes validate --config-file config/config.yaml
go run ./cmd openapi generate --config-file config/config.yaml --output config/openapi/openapi.yml
```

<section class="section cta-panel">
  <div>
    <h2>Back to ecosystem index</h2>
    <p>Return to Documentation Home to switch project area.</p>
  </div>
  <a class="btn btn-secondary" href="{{ '/documentation/' | relative_url }}">Open Documentation Home</a>
</section>
