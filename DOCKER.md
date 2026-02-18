# Docker Deployment Guide

## Quick Start with Docker

### Prerequisites
- Docker Engine 20.10+
- Docker Compose 2.0+

### Launch the Application

1. **Clone and navigate to the repository:**
   ```bash
   git clone https://github.com/InfinityXOneSystems/claw-template.git
   cd claw-template
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.docker .env
   # Edit .env with your API keys and secrets
   nano .env
   ```

3. **Build and launch with Docker Compose:**
   ```bash
   docker-compose up -d
   ```

4. **Access the application:**
   - Frontend: http://localhost
   - Backend API: http://localhost:5000
   - WebSocket: ws://localhost:5001

### Docker Commands

**Start all services:**
```bash
docker-compose up -d
```

**Stop all services:**
```bash
docker-compose down
```

**View logs:**
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

**Rebuild after code changes:**
```bash
docker-compose up -d --build
```

**Reset everything (including data):**
```bash
docker-compose down -v
```

### Service Architecture

The Docker setup includes:

1. **MongoDB** (port 27017)
   - Database for storing user data and sessions
   - Persistent volume: `mongodb_data`

2. **Backend** (ports 5000, 5001)
   - Express.js API server
   - WebSocket server for real-time features
   - Connects to MongoDB

3. **Frontend** (port 80)
   - React application served by Nginx
   - Proxies API calls to backend
   - Proxies WebSocket connections

### Network Configuration

All services communicate via the `claw-network` bridge network:
- Frontend → Backend: `http://backend:5000`
- Backend → MongoDB: `mongodb://mongodb:27017`

### Health Checks

All services include health checks:
- **MongoDB**: Checks database connectivity
- **Backend**: HTTP check on `/health` endpoint
- **Frontend**: HTTP check on root URL

### Volumes

**Persistent data:**
- `mongodb_data`: MongoDB database files
- `mongodb_config`: MongoDB configuration
- `./server/uploads`: Backend file uploads

### Environment Variables

Key environment variables in docker-compose.yml:

**Backend:**
- `NODE_ENV=production`
- `MONGODB_URI=mongodb://mongodb:27017/claw-autonomous`
- `JWT_SECRET`: Set in .env file
- `OPENAI_API_KEY`: Set in .env file
- `CLIENT_URL=http://localhost`

**Frontend:**
- `REACT_APP_API_URL=http://localhost:5000`
- `REACT_APP_WS_URL=ws://localhost:5001`

### Production Deployment

For production deployment:

1. **Update environment variables:**
   ```bash
   # Set secure values
   JWT_SECRET=<strong-random-secret>
   OPENAI_API_KEY=<your-key>
   ```

2. **Use production domain:**
   ```yaml
   # In docker-compose.yml
   environment:
     CLIENT_URL: https://your-domain.com
   ```

3. **Add SSL/TLS:**
   - Use a reverse proxy (nginx, traefik)
   - Or add SSL certificates to nginx service

4. **Scale services:**
   ```bash
   docker-compose up -d --scale backend=3
   ```

### Troubleshooting

**MongoDB connection issues:**
```bash
# Check MongoDB logs
docker-compose logs mongodb

# Verify MongoDB is healthy
docker-compose ps
```

**Backend not starting:**
```bash
# Check backend logs
docker-compose logs backend

# Verify environment variables
docker-compose exec backend env
```

**Frontend can't connect to backend:**
```bash
# Check network connectivity
docker-compose exec frontend ping backend

# Verify nginx configuration
docker-compose exec frontend cat /etc/nginx/conf.d/default.conf
```

**Rebuild specific service:**
```bash
docker-compose build backend
docker-compose up -d backend
```

### Data Backup

**Backup MongoDB data:**
```bash
docker-compose exec mongodb mongodump \
  --db claw-autonomous \
  --out /data/backup

docker cp claw-mongodb:/data/backup ./backup
```

**Restore MongoDB data:**
```bash
docker cp ./backup claw-mongodb:/data/backup

docker-compose exec mongodb mongorestore \
  --db claw-autonomous \
  /data/backup/claw-autonomous
```

### Development with Docker

For development with hot-reload:

1. **Use volume mounts:**
   ```yaml
   # Add to backend service
   volumes:
     - ./server:/app/server
     - /app/node_modules
   ```

2. **Use nodemon:**
   ```yaml
   # Change backend command
   command: npx nodemon server/index.js
   ```

### Resource Limits

Add resource limits in docker-compose.yml:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
```

### Security Best Practices

1. **Never commit .env files**
2. **Use secrets management** for production
3. **Keep images updated**: `docker-compose pull`
4. **Scan for vulnerabilities**: `docker scan claw-backend`
5. **Use non-root users** in Dockerfiles (already implemented)
6. **Limit container privileges**

### Monitoring

**View container stats:**
```bash
docker stats
```

**View service status:**
```bash
docker-compose ps
```

**Inspect service:**
```bash
docker inspect claw-backend
```

---

## Quick Commands Reference

```bash
# Start
docker-compose up -d

# Stop
docker-compose down

# Logs
docker-compose logs -f

# Rebuild
docker-compose up -d --build

# Reset
docker-compose down -v

# Shell access
docker-compose exec backend sh
docker-compose exec frontend sh
docker-compose exec mongodb mongosh

# Update images
docker-compose pull
docker-compose up -d
```

---

For more information, see the main [README.md](README.md) and [QUICKSTART.md](QUICKSTART.md).
