.PHONY: help build up down restart logs clean test

# Default target
help:
	@echo "Claw Autonomous Coding System - Docker Commands"
	@echo "================================================"
	@echo ""
	@echo "Available commands:"
	@echo "  make build    - Build all Docker images"
	@echo "  make up       - Start all services"
	@echo "  make down     - Stop all services"
	@echo "  make restart  - Restart all services"
	@echo "  make logs     - View logs from all services"
	@echo "  make clean    - Remove all containers, volumes, and images"
	@echo "  make test     - Test the Docker setup"
	@echo "  make status   - Show status of all services"
	@echo ""

# Build all images
build:
	@echo "🔨 Building Docker images..."
	docker compose build

# Start services
up:
	@echo "🚀 Starting services..."
	docker compose up -d
	@echo "✅ Services started!"
	@echo "🌐 Access: http://localhost"

# Stop services
down:
	@echo "🛑 Stopping services..."
	docker compose down

# Restart services
restart:
	@echo "🔄 Restarting services..."
	docker compose restart

# View logs
logs:
	@echo "📋 Showing logs (Ctrl+C to exit)..."
	docker compose logs -f

# Clean everything
clean:
	@echo "🧹 Cleaning up Docker resources..."
	docker compose down -v --rmi all
	@echo "✅ Cleanup complete!"

# Test the setup
test:
	@echo "🧪 Testing Docker setup..."
	docker compose config --quiet && echo "✓ Compose file is valid"
	@echo "✓ Docker test passed!"

# Show service status
status:
	@echo "📊 Service Status:"
	docker compose ps

# Build and start in one command
fresh: build up
	@echo "✅ Fresh deployment complete!"

# View backend logs
logs-backend:
	docker compose logs -f backend

# View frontend logs
logs-frontend:
	docker compose logs -f frontend

# View MongoDB logs
logs-mongodb:
	docker compose logs -f mongodb

# Shell into backend container
shell-backend:
	docker compose exec backend sh

# Shell into frontend container
shell-frontend:
	docker compose exec frontend sh

# Shell into MongoDB container
shell-mongodb:
	docker compose exec mongodb mongosh

# Rebuild and restart backend only
rebuild-backend:
	docker compose build backend
	docker compose up -d backend

# Rebuild and restart frontend only
rebuild-frontend:
	docker compose build frontend
	docker compose up -d frontend
