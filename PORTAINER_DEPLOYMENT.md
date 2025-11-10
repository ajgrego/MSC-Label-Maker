# Portainer Deployment Guide

This guide provides detailed instructions for deploying the My Sister's Closet Label Maker application using Portainer.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Deployment Methods](#deployment-methods)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)
- [Maintenance](#maintenance)

## Prerequisites

### System Requirements
- Docker Engine 20.10 or higher
- Portainer CE 2.0 or higher
- Minimum 2GB RAM
- Minimum 10GB disk space

### Before You Begin
1. Ensure Portainer is installed and accessible
2. Have admin access to your Portainer instance
3. Prepare your environment variables (see Configuration section)

## Quick Start

### Method 1: Deploy from Git Repository (Recommended)

1. **Login to Portainer**
   - Navigate to your Portainer web interface
   - Login with your admin credentials

2. **Create New Stack**
   - Go to **Stacks** → **Add Stack**
   - Name: `msc-label-maker`

3. **Configure Stack**
   - Select **Repository** as build method
   - Repository URL: `https://github.com/ajgrego/MSC-Label-Maker`
   - Reference: `main`
   - Compose path: `docker-compose.yml`

4. **Set Environment Variables**
   Click "Add an environment variable" and add:
   ```
   SERVER_PORT=5002
   CLIENT_PORT=80
   ```

5. **Deploy Stack**
   - Click **Deploy the stack**
   - Wait for containers to start (check health status)

### Method 2: Deploy from Stack File

1. **Copy Stack Configuration**
   - Copy the contents of `portainer-stack.yml` from the repository

2. **Create New Stack in Portainer**
   - Go to **Stacks** → **Add Stack**
   - Name: `msc-label-maker`
   - Select **Web editor**
   - Paste the stack configuration

3. **Configure Environment Variables**
   (Same as Method 1, step 4)

4. **Deploy Stack**
   - Click **Deploy the stack**

### Method 3: Deploy Pre-built Images

If you have pre-built images in a registry:

1. Update `portainer-stack.yml` image references:
   ```yaml
   server:
     image: your-registry.com/msc-server:latest
   
   client:
     image: your-registry.com/msc-client:latest
   ```

2. Follow Method 2 steps above

## Configuration

### Environment Variables

#### Port Configuration
Default ports can be changed:
```
SERVER_PORT=5002    # Backend API port
CLIENT_PORT=80      # Frontend web port (use 8080 if 80 is taken)
```

## Deployment Options

### Local Network Deployment

For deployment on a local network:
```
CLIENT_PORT=8080
```

Access the app at: `http://192.168.1.100:8080`

### Production Deployment with Reverse Proxy

For production with Nginx/Traefik reverse proxy:

1. Remove port exposure from client service in stack
2. Configure reverse proxy to forward to container

### High Availability Setup

For high availability:
1. Use external database volume on NFS/CIFS
2. Configure volume driver in stack:
   ```yaml
   volumes:
     msc-database:
       driver: local
       driver_opts:
         type: nfs
         o: addr=your-nas-ip,rw
         device: ":/path/to/share"
   ```

## Accessing the Application

### After Deployment

1. **Check Stack Status**
   - Go to **Stacks** → Select your stack
   - Verify all containers are **running** and **healthy**

2. **Access the Application**
   - Frontend: `http://your-server-ip:80`
   - Backend API: `http://your-server-ip:5002/api/health`

## Troubleshooting

### Container Fails to Start

1. **Check Logs**
   - Stacks → Select Stack → Select Container → Logs
   - Look for error messages

2. **Common Issues**
   - Port conflicts: Change SERVER_PORT or CLIENT_PORT
   - Image pull errors: Check network connectivity

### Health Check Failures

**Server Unhealthy:**
```bash
# Check if server is responding
docker exec msc-server wget -O- http://localhost:5002/api/health
```

**Client Unhealthy:**
```bash
# Check nginx status
docker exec msc-client curl -f http://localhost:80/
```

### Database Issues

**Reset Database (⚠️ Deletes all data):**
```bash
# Stop stack
# Delete volume
docker volume rm msc-label-maker_database-data
# Restart stack
```

**Backup Database:**
```bash
# Create backup
docker run --rm -v msc-label-maker_database-data:/data \
  -v $(pwd):/backup alpine \
  tar czf /backup/database-backup-$(date +%Y%m%d).tar.gz -C /data .
```

**Restore Database:**
```bash
# Restore from backup
docker run --rm -v msc-label-maker_database-data:/data \
  -v $(pwd):/backup alpine \
  tar xzf /backup/database-backup-YYYYMMDD.tar.gz -C /data
```

### Cannot Access Application

1. **Check Firewall**
   ```bash
   # Allow ports through firewall
   sudo ufw allow 80/tcp
   sudo ufw allow 5002/tcp
   ```

2. **Verify Port Binding**
   - Go to Containers → msc-client
   - Check Published Ports section

3. **Check Network**
   - Ensure both containers are on `msc-network`
   - Verify network connectivity between containers

## Maintenance

### Updating the Application

1. **Pull Latest Changes**
   - Stacks → Select Stack → Editor
   - Click **Pull and redeploy**

2. **Manual Update**
   ```bash
   # In Portainer terminal or SSH
   docker pull your-registry/msc-server:latest
   docker pull your-registry/msc-client:latest
   ```
   - Stacks → Select Stack → **Update the stack**

### Backup Strategy

**Automated Backup Script:**
```bash
#!/bin/bash
# backup-msc.sh
BACKUP_DIR="/backups/msc-label-maker"
DATE=$(date +%Y%m%d-%H%M%S)

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Backup database
docker run --rm \
  -v msc-label-maker_database-data:/data \
  -v "$BACKUP_DIR":/backup \
  alpine tar czf "/backup/database-$DATE.tar.gz" -C /data .

# Keep only last 30 days of backups
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +30 -delete

echo "Backup completed: $DATE"
```

**Schedule with Cron:**
```bash
# Run daily at 2 AM
0 2 * * * /path/to/backup-msc.sh >> /var/log/msc-backup.log 2>&1
```

### Monitoring

**View Container Stats:**
- Portainer → Containers → Select Container → Stats

**View Logs:**
- Portainer → Containers → Select Container → Logs

**Set Up Alerts:**
- Portainer → Settings → Notifications
- Configure webhook for container failures

### Resource Management

**Adjust Resource Limits:**

Edit stack YAML to modify:
```yaml
deploy:
  resources:
    limits:
      cpus: '2.0'      # Increase CPU
      memory: 2G       # Increase memory
    reservations:
      cpus: '1.0'
      memory: 1G
```

### Scaling Considerations

This application uses SQLite and is designed for single-instance deployment. For high-traffic scenarios:

1. Consider migrating to PostgreSQL/MySQL
2. Implement session storage (Redis)
3. Use load balancer for client service
4. Separate database to dedicated server

## Security Best Practices

1. **Use HTTPS**
   - Deploy behind reverse proxy with SSL/TLS
   - Use Let's Encrypt for free certificates

2. **Restrict Access**
   - Use Portainer's access control
   - Limit port exposure to necessary services only
   - Consider network isolation if on public network

3. **Regular Updates**
   - Keep Docker images updated
   - Monitor security advisories

4. **Secure Environment Variables**
   - Never commit .env files to git
   - Use Portainer's secrets management for sensitive data

5. **Network Isolation**
   - Keep application network isolated
   - Use Portainer's network management

## Support

For issues specific to:
- **Application**: Create issue on GitHub repository
- **Portainer**: Check Portainer documentation
- **Docker**: Refer to Docker documentation

## Additional Resources

- [Portainer Documentation](https://docs.portainer.io/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Application README](./README.md)
