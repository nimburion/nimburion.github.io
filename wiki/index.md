---
layout: wiki
title: Wiki
lang: en
description: Nimburion wiki and project documentation entrypoint.
---

<section class="hero-grid">
  <div class="hero-copy">
    <span class="eyebrow">Documentation hub</span>
    <h1>Explore the Nimburion ecosystem with a docs-first workflow.</h1>
    <p class="hero-subtitle">
      Architecture, operations, and implementation guides organized by project,
      with a consistent structure for faster onboarding and safer delivery.
    </p>
    <div class="hero-actions">
      <a class="btn btn-primary" href="{{ '/wiki/nimburion/' | relative_url }}">Start from Nimburion</a>
      <a class="btn btn-secondary" href="https://github.com/nimburion" target="_blank" rel="noopener noreferrer">Browse all repositories</a>
    </div>
  </div>
  <aside class="hero-panel" aria-label="Wiki coverage">
    <div class="hero-panel-block">
      <p class="panel-kicker">What you get</p>
      <p class="panel-text">Project overviews, architecture references, and operations playbooks.</p>
    </div>
    <div class="hero-panel-block">
      <p class="panel-kicker">Best for</p>
      <ul class="panel-list">
        <li>Platform teams</li>
        <li>Service owners</li>
        <li>Engineering leads</li>
      </ul>
    </div>
  </aside>
</section>

<section class="section">
  <div class="section-head">
    <h2>Projects</h2>
    <p>Each area follows the same docs model: overview, architecture and operations.</p>
  </div>
  <div class="project-grid">
    <article class="project-card">
      <div class="project-head">
        <h3>Nimburion</h3>
        <span class="tag">Core</span>
      </div>
      <p>Framework and shared conventions for cloud-native Go microservices.</p>
      <a href="{{ '/wiki/nimburion/' | relative_url }}">Open documentation →</a>
    </article>
    <article class="project-card">
      <div class="project-head">
        <h3>API Gateway</h3>
        <span class="tag">Edge</span>
      </div>
      <p>Routing, policies, and controlled exposure at the service boundary.</p>
      <a href="{{ '/wiki/apigateway/' | relative_url }}">Open documentation →</a>
    </article>
    <article class="project-card">
      <div class="project-head">
        <h3>Bootstrapper</h3>
        <span class="tag">Tooling</span>
      </div>
      <p>Scaffolding, conventions and lifecycle acceleration for new services.</p>
      <a href="{{ '/wiki/bootstrapper/' | relative_url }}">Open documentation →</a>
    </article>
  </div>
</section>

<section class="section cta-panel">
  <div>
    <h2>Need implementation details?</h2>
    <p>Use the Wiki sections above, then jump to repositories for source-level context.</p>
  </div>
  <a class="btn btn-primary" href="https://github.com/nimburion" target="_blank" rel="noopener noreferrer">Go to GitHub</a>
</section>
