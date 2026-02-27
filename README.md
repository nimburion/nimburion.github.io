# Nimburion Documentation

Documentation site for the Nimburion Go microservices framework.

## GitHub Pages Setup

**Important:** To deploy this site, you must configure GitHub Pages in the repository settings:

1. Go to **Settings** > **Pages**
2. Under **Source**, select **GitHub Actions**
3. The workflow will automatically deploy on push to `main`

## Local Development

```bash
# Install Hugo (macOS)
brew install hugo

# Run development server
hugo server

# Build site
hugo --minify
```

## Site Structure

- `/content` - Markdown content
- `/layouts` - Hugo templates
- `/assets` - CSS and JavaScript
- `/static` - Static files (images, .nojekyll)

## Deployment

The site automatically deploys via GitHub Actions when changes are pushed to `main`.

See `.github/workflows/hugo.yml` for the deployment configuration.
