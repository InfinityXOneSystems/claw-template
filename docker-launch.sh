#!/bin/bash
# Claw Autonomous Coding System - Docker Launcher
# This script helps you quickly launch the application with Docker

set -e

echo "🦅 Claw Autonomous Coding System - Docker Launcher"
echo "=================================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker is not installed"
    echo "Please install Docker from https://docs.docker.com/get-docker/"
    exit 1
fi

echo "✓ Docker is installed"

# Check if Docker Compose is installed
if ! docker compose version &> /dev/null; then
    echo "❌ Error: Docker Compose is not installed"
    echo "Please install Docker Compose v2+"
    exit 1
fi

echo "✓ Docker Compose is installed"

# Check if .env file exists
if [ ! -f .env ]; then
    echo ""
    echo "⚙️  Creating .env file from template..."
    cp .env.docker .env
    echo "✓ .env file created"
    echo ""
    echo "📝 IMPORTANT: Edit .env file with your API keys:"
    echo "   - JWT_SECRET: Set a strong secret key"
    echo "   - OPENAI_API_KEY: Add your OpenAI API key (for AI features)"
    echo "   - GITHUB_CLIENT_ID/SECRET: Add for GitHub integration (optional)"
    echo ""
    read -p "Press Enter after editing .env, or continue with defaults..."
fi

echo ""
echo "🚀 Launching Claw with Docker Compose..."
echo ""

# Pull latest images (if any updates)
docker compose pull 2>/dev/null || true

# Build and start services
docker compose up -d --build

echo ""
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check service status
echo ""
echo "📊 Service Status:"
docker compose ps

echo ""
echo "✅ Claw is now running!"
echo ""
echo "🌐 Access the application:"
echo "   Frontend: http://localhost"
echo "   Backend API: http://localhost:5000"
echo "   WebSocket: ws://localhost:5001"
echo ""
echo "📝 Useful commands:"
echo "   View logs: docker compose logs -f"
echo "   Stop: docker compose down"
echo "   Restart: docker compose restart"
echo ""
echo "📚 For more information, see DOCKER.md"
echo ""
