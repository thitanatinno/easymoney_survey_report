#!/bin/bash

# Kobo Excel Report - Quick Start Script

echo "🚀 Kobo Excel Report Generator - Quick Start"
echo "============================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  No .env file found. Creating from template..."
    cp .env.example .env
    echo "✅ Created .env file"
    echo "⚠️  Please edit .env and add your KOBO_API_TOKEN before starting the server"
    echo ""
    read -p "Press Enter to open .env in default editor, or Ctrl+C to exit..."
    open .env 2>/dev/null || vi .env
    echo ""
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
    echo ""
fi

echo "🔍 Checking configuration..."
if grep -q "your_kobo_api_token_here" .env; then
    echo "⚠️  WARNING: KOBO_API_TOKEN not configured in .env"
    echo "   Please add your token before making API requests"
    echo ""
else
    echo "✅ KOBO_API_TOKEN configured"
    echo ""
fi

echo "🌟 Starting server..."
echo "   Endpoint: GET http://localhost:3000/generate/:uid/:id"
echo "   Health:   GET http://localhost:3000/health"
echo ""
echo "   Press Ctrl+C to stop"
echo ""

npm run dev
