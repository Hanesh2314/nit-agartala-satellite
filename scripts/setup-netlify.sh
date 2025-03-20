#!/bin/bash

# Setup script for Netlify deployment

# Display banner
echo "======================================================================================"
echo "NIT Agartala Research Satellite - Netlify Setup"
echo "======================================================================================"
echo ""

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "Installing Netlify CLI..."
    npm install -g netlify-cli
fi

# Create the database table structure
echo "Creating database tables..."
npm run db:push

# Login to Netlify (will open browser)
echo "Please login to your Netlify account..."
netlify login

# Initialize Netlify site
echo "Initializing Netlify site..."
netlify init

# Set environment variables
echo "Setting up environment variables..."
echo "Please enter your DATABASE_URL (PostgreSQL connection string):"
read db_url

netlify env:set DATABASE_URL "$db_url"
netlify env:set SESSION_SECRET "$(openssl rand -hex 32)"

echo "Setting up build hooks..."
netlify build:create

echo "Setup complete! Your site is now configured for Netlify deployment."
echo "Run 'npm run build && netlify deploy --prod' to deploy your site."
echo ""
echo "======================================================================================"