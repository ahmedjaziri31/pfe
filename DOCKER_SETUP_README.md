# Korpor Docker Setup Guide

This Docker setup runs all Korpor application components conveniently in a coordinated environment.

## 🏗️ Architecture Overview

The setup includes the following services:

| Service | Port | Description |
|---------|------|-------------|
| **AI Flask Service** | 5001 | Machine learning models, chatbot, recommendations |
| **Backend API** | 5000 | Main Node.js API server |
| **Front-Backoffice** | 5173 | React admin dashboard |
| **Front-Mobile** | 19000 | React Native Expo app |
| **MySQL Database** | 3306 | Database with `korpor_dev` |

## 🚀 Quick Start

1. **Copy environment variables:**
   ```bash
   cp .env.example .env
   ```

2. **Configure your `.env` file:**
   ```bash
   # Required: Add your OpenAI API key
   OPENAI_API_KEY=sk-your-actual-openai-key-here
   
   # Optional: Customize database credentials
   MYSQL_ROOT_PASSWORD=rootpassword
   MYSQL_USER=korpor_user
   MYSQL_PASSWORD=korpor_password
   ```

3. **Start all services:**
   ```bash
   ./docker-start.sh
   ```

   Or manually:
   ```bash
   docker-compose up --build
   ```

## 📱 Mobile Development

For React Native Expo development:

1. **Install Expo CLI globally:**
   ```bash
   npm install -g @expo/cli
   ```

2. **Access Expo DevTools:**
   - Open http://localhost:19000 in your browser
   - Scan QR code with Expo Go app on your phone

3. **Custom Expo command is already configured:**
   ```bash
   npx expo start --dev-client --scheme korpor-front
   ```

## 🔧 Development Commands

### Starting Services
```bash
# Start all services in background
docker-compose up -d

# Start with logs visible
docker-compose up

# Start specific service
docker-compose up ai-service
```

### Managing Services
```bash
# View logs
docker-compose logs -f [service-name]

# Restart a service
docker-compose restart backend

# Stop all services
docker-compose down

# Remove all data (careful!)
docker-compose down -v
```

### Database Access
```bash
# Access MySQL shell
docker-compose exec mysql mysql -u korpor_user -p korpor_dev

# View database logs
docker-compose logs mysql
```

## 🌐 Service Communication

Services communicate internally using Docker network:
- Backend → AI Service: `http://ai-service:5001`
- Frontend → Backend: `http://localhost:5000`
- Frontend → AI Service: `http://localhost:5001`

## 🛠️ Troubleshooting

### Common Issues

1. **Port conflicts:**
   ```bash
   # Check what's using ports
   netstat -tulpn | grep :5000
   
   # Kill processes if needed
   sudo lsof -ti:5000 | xargs kill -9
   ```

2. **Permission issues:**
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   ```

3. **Database connection issues:**
   ```bash
   # Check MySQL is running
   docker-compose logs mysql
   
   # Restart database
   docker-compose restart mysql
   ```

4. **AI Service fails to start:**
   - Ensure OpenAI API key is set in `.env`
   - Check AI service logs: `docker-compose logs ai-service`

### Rebuilding Services

```bash
# Rebuild specific service
docker-compose build ai-service

# Rebuild all services
docker-compose build

# Clean rebuild (removes cache)
docker-compose build --no-cache
```

## 📊 Service Health Checks

All services include health checks:
- **AI Service**: `http://localhost:5001/api/health`
- **Backend**: `http://localhost:5000/health`  
- **Backoffice**: `http://localhost:5173/`
- **MySQL**: Internal mysqladmin ping

Check status:
```bash
docker-compose ps
```

## 🔒 Security Notes

- Change default passwords in production
- Use environment variables for sensitive data
- Enable SSL/TLS for production deployments
- Consider using Docker secrets for production

## 📝 Development Tips

1. **Hot Reload**: All services support hot reload during development
2. **Database Persistence**: MySQL data persists in Docker volumes
3. **Node Modules**: Cached in separate volumes for faster builds
4. **Logs**: Use `docker-compose logs -f` to monitor service output

## 🎯 Production Deployment

For production deployment:
1. Update environment variables for production
2. Use production Docker targets
3. Set up reverse proxy (nginx)
4. Configure SSL certificates
5. Set up monitoring and logging
6. Use Docker Swarm or Kubernetes for orchestration

## 📚 Additional Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Expo Documentation](https://docs.expo.dev/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices) 