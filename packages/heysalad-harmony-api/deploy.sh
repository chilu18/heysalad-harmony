#!/bin/bash

# HeySalad Harmony API - Deployment Script
# This script deploys the Harmony API to Cloudflare Workers

set -e

echo "🚀 HeySalad Harmony API Deployment"
echo "===================================="
echo ""

# Check if we're in the right directory
if [ ! -f "wrangler.toml" ]; then
  echo "❌ Error: wrangler.toml not found. Please run this script from heysalad-harmony-api directory."
  exit 1
fi

# Check if bun is installed
if ! command -v bun &> /dev/null; then
  echo "❌ Error: bun is not installed. Please install bun first."
  exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
bun install

# Check if secrets are set
echo ""
echo "🔐 Checking secrets..."
echo "Please ensure you have set the following secrets:"
echo "  - OPENAI_API_KEY"
echo "  - HEYSALAD_OAUTH_URL (optional)"
echo ""
read -p "Have you set the secrets? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo ""
  echo "To set secrets, run:"
  echo "  npx wrangler secret put OPENAI_API_KEY"
  echo "  npx wrangler secret put HEYSALAD_OAUTH_URL"
  echo ""
  exit 1
fi

# Check if database exists
echo ""
echo "🗄️  Checking database..."
read -p "Have you created the D1 database and run migrations? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo ""
  echo "To create database and run migrations:"
  echo "  npx wrangler d1 create harmony-db"
  echo "  # Update database_id in wrangler.toml"
  echo "  npx wrangler d1 migrations apply harmony-db --remote"
  echo ""
  exit 1
fi

# Deploy
echo ""
echo "🚀 Deploying to Cloudflare Workers..."
npx wrangler deploy

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Your API is now available at:"
echo "  https://heysalad-harmony-api.heysalad-o.workers.dev"
echo ""
echo "Test it with:"
echo "  curl https://heysalad-harmony-api.heysalad-o.workers.dev/"
echo ""
echo "Next steps:"
echo "  1. Get OAuth token from HeySalad OAuth"
echo "  2. Test authentication: curl -H 'Authorization: Bearer <token>' https://heysalad-harmony-api.heysalad-o.workers.dev/api/auth/me"
echo "  3. Create HeySalad Inc. company"
echo "  4. Add Peter as CEO"
echo "  5. Generate employment documents"
echo ""
echo "See OAUTH_INTEGRATION_COMPLETE.md for detailed testing guide."
echo ""
