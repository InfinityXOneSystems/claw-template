# 🐳 Docker Quick Reference

## Launch Commands

```bash
# Method 1: Using the launch script (recommended)
./docker-launch.sh

# Method 2: Using Docker Compose directly
docker compose up -d

# Method 3: Using Make
make up
```

## Essential Commands

### Start & Stop
```bash
docker compose up -d              # Start all services
docker compose down               # Stop all services
docker compose restart            # Restart all services
```

### Logs & Monitoring
```bash
docker compose logs -f            # View all logs
docker compose logs -f backend    # View backend logs only
docker compose logs -f frontend   # View frontend logs only
docker compose ps                 # Show service status
docker stats                      # Show resource usage
```

### Rebuild & Update
```bash
docker compose up -d --build      # Rebuild and restart
docker compose pull               # Pull latest images
docker compose build              # Build images
```

### Cleanup
```bash
docker compose down               # Stop and remove containers
docker compose down -v            # Also remove volumes (data)
docker compose down --rmi all     # Remove everything
```

## Service Access

| Service  | URL                      | Purpose                |
|----------|--------------------------|------------------------|
| Frontend | http://localhost         | Web interface          |
| Backend  | http://localhost:5000    | REST API               |
| WebSocket| ws://localhost:5001      | Real-time features     |
| MongoDB  | mongodb://localhost:27017| Database               |

## Troubleshooting

### Services won't start
```bash
# Check logs
docker compose logs

# Verify configuration
docker compose config

# Check ports are free
netstat -tuln | grep -E '80|5000|5001|27017'
```

### MongoDB connection issues
```bash
# Check MongoDB health
docker compose exec mongodb mongosh --eval "db.runCommand({ ping: 1 })"

# View MongoDB logs
docker compose logs mongodb
```

### Frontend can't reach backend
```bash
# Test network connectivity
docker compose exec frontend ping backend

# Check backend health
curl http://localhost:5000/health
```

### Reset everything
```bash
# Nuclear option - removes all data
docker compose down -v
docker compose up -d --build
```

## Development Tips

### Hot Reload for Backend
Add volume mount to docker-compose.yml:
```yaml
backend:
  volumes:
    - ./server:/app/server
  command: npx nodemon server/index.js
```

### View Container Internals
```bash
# Backend shell
docker compose exec backend sh

# Frontend shell
docker compose exec frontend sh

# MongoDB shell
docker compose exec mongodb mongosh
```

### Update Environment Variables
```bash
# Edit .env file
nano .env

# Restart services to apply
docker compose restart
```

## Production Deployment

### Use Production Settings
```bash
# Set secure values in .env
JWT_SECRET=<generate-strong-secret>
OPENAI_API_KEY=<your-actual-key>

# Deploy
docker compose up -d
```

### SSL/TLS with Let's Encrypt
Add to docker-compose.yml:
```yaml
services:
  certbot:
    image: certbot/certbot
    volumes:
      - ./certbot:/etc/letsencrypt
```

### Scale Services
```bash
# Run multiple backend instances
docker compose up -d --scale backend=3
```

## Backup & Restore

### Backup MongoDB
```bash
docker compose exec mongodb mongodump \
  --db claw-autonomous \
  --out /data/backup

docker cp claw-mongodb:/data/backup ./backup
```

### Restore MongoDB
```bash
docker cp ./backup claw-mongodb:/data/backup

docker compose exec mongodb mongorestore \
  --db claw-autonomous \
  /data/backup/claw-autonomous
```

## Health Checks

All services include health checks:

```bash
# Check all service health
docker compose ps

# Manual health checks
curl http://localhost:5000/health  # Backend
curl http://localhost/             # Frontend
```

## Resource Management

### View Resource Usage
```bash
docker stats
docker system df
```

### Limit Resources
Add to docker-compose.yml:
```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
```

### Clean Up Unused Resources
```bash
docker system prune -a
docker volume prune
```

## Useful Make Commands

```bash
make help              # Show all commands
make build             # Build images
make up                # Start services
make down              # Stop services
make logs              # View logs
make clean             # Clean everything
make test              # Test configuration
make status            # Show service status
make fresh             # Build and start fresh
```

## Support

- 📚 Full Documentation: [DOCKER.md](DOCKER.md)
- 🚀 Quick Start: [QUICKSTART.md](QUICKSTART.md)
- 📖 Main README: [README.md](README.md)

---

**Quick Start in 3 Commands:**
```bash
cp .env.docker .env
# Edit .env with your keys
docker compose up -d
```
