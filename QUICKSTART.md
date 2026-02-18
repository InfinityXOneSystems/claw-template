# Quick Start Guide

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- (Optional) MongoDB for data persistence

## Installation Steps

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### 2. Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

**Required Configuration:**
- `JWT_SECRET`: Change to a secure random string
- `OPENAI_API_KEY`: Add your OpenAI API key (for AI features)
- `MONGODB_URI`: Update if using a custom MongoDB instance

### 3. Start Development Servers

```bash
# Option 1: Start both frontend and backend together
npm run dev

# Option 2: Start separately in different terminals
# Terminal 1 - Backend
npm run server:dev

# Terminal 2 - Frontend
npm run client:dev
```

### 4. Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/health
- **WebSocket**: ws://localhost:5001

## First Steps

1. **Create an Account**
   - Navigate to http://localhost:3000
   - Click "Register" and create an account
   - You'll be automatically logged in

2. **Explore the Dashboard**
   - View your statistics and recent activity
   - Access quick actions for common tasks

3. **Try the AI Chat**
   - Click on "AI Chat" in the navigation
   - Ask coding questions or request help
   - Note: Requires valid OpenAI API key

4. **Use the Code Editor**
   - Click on "Editor" in the navigation
   - Enter a prompt to generate code
   - Use the analyze and fix features

5. **Manage Repositories**
   - Click on "Repos" in the navigation
   - Add your GitHub token (Settings button)
   - View and sync your repositories

## Common Commands

```bash
# Install all dependencies
npm run install:all

# Run development servers
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Lint code
npm run lint
```

## Troubleshooting

### Port Already in Use
If ports 3000, 5000, or 5001 are already in use:

```bash
# Change ports in .env file
PORT=5001
WS_PORT=5002

# And in client/package.json, add:
"start": "PORT=3001 react-scripts start"
```

### MongoDB Connection Error
If MongoDB is not installed or running:

```bash
# Install MongoDB (macOS)
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env
```

### AI Features Not Working
Ensure your OpenAI API key is valid:

```bash
# Test the API key
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## Next Steps

- Read the full [README](./README.md) for detailed documentation
- Explore the [API Documentation](./README.md#api-documentation)
- Check out the [Architecture](./README.md#architecture)
- Join our community for support

## Production Deployment

### Build the Application

```bash
# Build the React frontend
cd client
npm run build
cd ..
```

### Set Environment Variables

```bash
# Set production environment
export NODE_ENV=production
export PORT=80
export JWT_SECRET=your-production-secret
export OPENAI_API_KEY=your-api-key
export MONGODB_URI=your-production-db-uri
```

### Start the Server

```bash
# Start with PM2 (recommended)
npm install -g pm2
pm2 start server/index.js --name claw-backend

# Or start directly
npm start
```

### Deploy to Cloud

**Heroku:**
```bash
heroku create your-app-name
git push heroku main
heroku config:set JWT_SECRET=your-secret
heroku config:set OPENAI_API_KEY=your-key
```

**Vercel (Frontend):**
```bash
cd client
vercel
```

**Docker:**
```bash
# Build image
docker build -t claw-autonomous .

# Run container
docker run -p 5000:5000 -e JWT_SECRET=secret claw-autonomous
```

## Need Help?

- 📧 Email: support@infinityxone.systems
- 💬 Discord: [Join our community](https://discord.gg/infinityxone)
- 🐛 Issues: [GitHub Issues](https://github.com/InfinityXOneSystems/claw-template/issues)

---

**Happy Coding!** 🚀
