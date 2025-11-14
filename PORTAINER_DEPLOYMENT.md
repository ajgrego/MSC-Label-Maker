# Portainer Deployment Guide - MSC Label Maker

Complete guide for deploying the MSC Label Maker application using Portainer.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Detailed Deployment Steps](#detailed-deployment-steps)
- [Environment Variables](#environment-variables)
- [Post-Deployment Verification](#post-deployment-verification)
- [Troubleshooting](#troubleshooting)
- [Maintenance & Updates](#maintenance--updates)

## Prerequisites

### System Requirements
- **Docker Engine:** 20.10 or higher
- **Portainer:** CE 2.0 or higher
- **Memory:** Minimum 2GB RAM (4GB recommended)
- **Disk Space:** Minimum 10GB free
- **CPU:** 2 cores minimum

### Before You Begin
1. Portainer is installed and accessible
2. You have admin access to your Portainer instance
3. Your code is pushed to a Git repository (GitHub, GitLab, etc.)
4. You have your server IP address ready

---

## Quick Start

### Step 1: Push Code to Git Repository

```bash
git add .
git commit -m "Docker configuration for Portainer deployment"
git push origin main
```

### Step 2: Login to Portainer

Navigate to your Portainer instance:
```
http://YOUR_SERVER_IP:9000
```

### Step 3: Create Stack

1. Click **Stacks** in the left sidebar
2. Click **+ Add stack** button
3. Enter stack name: `msc-label-maker`

### Step 4: Configure Repository

Select **Repository** as build method and enter:

- **Repository URL:** Your Git repository URL
  ```
  https://github.com/yourusername/MSC-Label-Maker.git
  ```
- **Repository reference:** `refs/heads/main`
- **Compose path:** `docker-compose.yml`
- **Authentication:** Enable if private repository

### Step 5: Set Environment Variables

Click **+ Add environment variable** for each:

| Variable | Value | Required |
|----------|-------|----------|
| `JWT_SECRET` | Generate: `openssl rand -base64 32` | **YES** |
| `CLIENT_URL` | `http://YOUR_SERVER_IP` | **YES** |
| `SERVER_PORT` | `5002` | No (default: 5002) |
| `CLIENT_PORT` | `80` | No (default: 80) |

**Example Values:**
```
JWT_SECRET=wX8K3n9mP2vL5qR7tY4uI6oP9aS2dF5gH8jK1lZ3xC
CLIENT_URL=http://192.168.1.230
SERVER_PORT=5002
CLIENT_PORT=80
```

### Step 6: Deploy

1. Click **Deploy the stack**
2. Wait 5-10 minutes for the build to complete
3. Monitor logs for any errors

### Step 7: Access Application

Open your browser to:
```
http://YOUR_SERVER_IP
```

---

## Detailed Deployment Steps

### Method 1: Repository Deployment (Recommended)

This method allows Portainer to pull code directly from your Git repository.

#### 1.1 Prepare Your Repository

Ensure all Docker files are committed:
```bash
git status  # Check what's changed
git add .
git commit -m "Production Docker configuration"
git push origin main
```

#### 1.2 Create Stack in Portainer

**Navigate to Stacks:**
- Portainer Dashboard → **Stacks** → **+ Add stack**

**Configure Stack:**
- **Name:** `msc-label-maker` (use lowercase, hyphens only)
- **Build method:** Select **Repository**

**Repository Settings:**
- **Repository URL:**
  - GitHub: `https://github.com/username/MSC-Label-Maker.git`
  - GitLab: `https://gitlab.com/username/MSC-Label-Maker.git`
- **Repository reference:** `refs/heads/main` (or `refs/heads/master`)
- **Compose path:** `docker-compose.yml`

**For Private Repositories:**
- Enable **Use authentication**
- **Username:** Your Git username
- **Personal access token:** Generate from GitHub/GitLab settings

#### 1.3 Configure Environment Variables

**Required Variables:**

**JWT_SECRET** (REQUIRED)
Generate a secure secret:
```bash
openssl rand -base64 32
```
Example output: `wX8K3n9mP2vL5qR7tY4uI6oP9aS2dF5gH8jK1lZ3xC`

**CLIENT_URL** (REQUIRED)
Your server's IP address or domain:
```
http://192.168.1.230
```
or for production with domain:
```
https://labels.example.com
```

**Optional Variables:**

**SMTP Configuration** (for email features):
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
```

For Gmail, create an app-specific password: https://support.google.com/accounts/answer/185833

#### 1.4 Deploy Stack

1. Review all settings
2. Click **Deploy the stack**
3. Portainer will:
   - Clone your repository
   - Build Docker images (5-10 minutes)
   - Start containers
   - Run health checks

#### 1.5 Monitor Deployment

**View Build Logs:**
- Click on the stack name
- Select each container
- Click **Logs** tab

**Expected Log Messages:**
- **Server:** `Label Maker Server is running on 0.0.0.0:5002`
- **Client:** Nginx access logs

---

### Method 2: Web Editor Deployment

If you prefer not to use Git, paste the docker-compose.yml directly.

#### 2.1 Create Stack

- Go to **Stacks** → **+ Add stack**
- Name: `msc-label-maker`
- Build method: **Web editor**

#### 2.2 Paste Configuration

Copy the entire contents of `docker-compose.yml` and paste into the editor.

#### 2.3 Add Environment Variables

Same as Method 1, Step 1.3

#### 2.4 Deploy

Click **Deploy the stack**

**Note:** This method requires manual updates when code changes.

---

## Environment Variables

### Complete Reference

| Variable | Description | Required | Default | Example |
|----------|-------------|----------|---------|---------|
| `JWT_SECRET` | Secret key for authentication | **YES** | None | `wX8K3n9mP2vL5qR7...` |
| `CLIENT_URL` | Application URL | **YES** | `http://localhost` | `http://192.168.1.230` |
| `SERVER_PORT` | Backend API port | No | `5002` | `5002` |
| `CLIENT_PORT` | Frontend port | No | `80` | `80` or `8080` |
| `SMTP_HOST` | SMTP server | No | Empty | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP port | No | `587` | `587` |
| `SMTP_USER` | Email username | No | Empty | `user@gmail.com` |
| `SMTP_PASS` | Email password | No | Empty | `app-password` |
| `SMTP_FROM` | Sender email | No | Empty | `noreply@example.com` |
| `NODE_ENV` | Environment | No | `production` | `production` |

### Generating JWT_SECRET

**Option 1: OpenSSL (recommended)**
```bash
openssl rand -base64 32
```

**Option 2: Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Option 3: Online Generator**
Use: https://www.grc.com/passwords.htm (Perfect Passwords section)

---

## Post-Deployment Verification

### 1. Check Container Status

**In Portainer:**
- Go to **Stacks** → **msc-label-maker**
- Verify both containers show **running** (green icon)
- Check health status (should be **healthy**)

**Container Names:**
- `msc-server` (backend)
- `msc-client` (frontend/nginx)

### 2. View Container Logs

**Server Logs:**
```bash
docker logs msc-server
```
Expected: `Label Maker Server is running on 0.0.0.0:5002`

**Client Logs:**
```bash
docker logs msc-client
```
Expected: Nginx startup messages

### 3. Test Health Endpoints

**Server Health Check:**
```bash
curl http://YOUR_SERVER_IP:5002/api/health
```
Expected response:
```json
{"status":"ok","timestamp":"2024-11-14T..."}
```

**Client Health Check:**
```bash
curl http://YOUR_SERVER_IP/
```
Expected: HTML content

### 4. Access Application

**Open in Browser:**
```
http://YOUR_SERVER_IP
```

You should see the MSC Label Maker home page.

### 5. Verify API Connection

Check browser console (F12) for any errors. The frontend should successfully connect to the backend API.

---

## Troubleshooting

### Container Fails to Start

**1. Check Logs**

In Portainer:
- Stacks → msc-label-maker
- Click failing container
- View **Logs** tab

**2. Common Issues**

**Build Errors:**
```
Error: Cannot find module 'express'
```
**Solution:** Ensure `package.json` and `package-lock.json` exist in both `client/` and `server/` directories.

**Port Conflicts:**
```
Error: bind: address already in use
```
**Solution:** Change port in environment variables:
```
CLIENT_PORT=8080
SERVER_PORT=5003
```

**Permission Denied:**
```
Error: EACCES: permission denied
```
**Solution:** Check Docker has permission to create volumes. May need to adjust volume paths or run Docker as proper user.

### Client Can't Connect to Server

**Symptom:** Frontend loads but API calls fail (check browser console).

**1. Verify Service Names**

The nginx.conf must match docker-compose.yml service names:
- nginx.conf: `proxy_pass http://msc-server:5002`
- docker-compose.yml: `msc-server:` (service name)

**2. Check Network**

```bash
docker network inspect msc-network
```

Ensure both containers are connected.

**3. Test Server from Client Container**

```bash
docker exec msc-client wget -O- http://msc-server:5002/api/health
```

Should return: `{"status":"ok",...}`

### Health Checks Failing

**Server Health Check:**
```bash
docker exec msc-server node -e "require('http').get('http://localhost:5002/api/health', (r) => {console.log(r.statusCode)})"
```

**Client Health Check:**
```bash
docker exec msc-client curl -f http://localhost/
```

### Stack Won't Deploy

**Authentication Errors:**
- Verify Git credentials
- For private repos, use Personal Access Token
- GitHub: Settings → Developer settings → Personal access tokens
- GitLab: Settings → Access Tokens

**Build Timeout:**
- Increase timeout in Portainer settings
- Or build locally first:
  ```bash
  docker-compose build
  docker-compose push  # If using registry
  ```

### Database Issues

**Reset Database** (⚠️ Deletes all data):
```bash
# Stop containers
docker-compose down

# Remove database volume
docker volume rm msc-database

# Restart
docker-compose up -d
```

**Backup Database:**
```bash
docker run --rm \
  -v msc-database:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/db-backup-$(date +%Y%m%d).tar.gz -C /data .
```

**Restore Database:**
```bash
docker run --rm \
  -v msc-database:/data \
  -v $(pwd):/backup \
  alpine tar xzf /backup/db-backup-YYYYMMDD.tar.gz -C /data
```

### Network/Firewall Issues

**Check Firewall:**
```bash
# Ubuntu/Debian
sudo ufw status
sudo ufw allow 80/tcp
sudo ufw allow 5002/tcp

# CentOS/RHEL
sudo firewall-cmd --list-all
sudo firewall-cmd --add-port=80/tcp --permanent
sudo firewall-cmd --add-port=5002/tcp --permanent
sudo firewall-cmd --reload
```

**Verify Ports:**
```bash
# Check if ports are listening
netstat -tlnp | grep -E '80|5002'

# Or with ss
ss -tlnp | grep -E '80|5002'
```

### Rebuild Stack

**Complete Rebuild:**

1. **Stop and Remove:**
   - Portainer: Stacks → msc-label-maker → **Stop**
   - Click **Delete this stack**
   - ⚠️ Check **Remove associated volumes** ONLY if you want to delete data

2. **Redeploy:**
   - Follow deployment steps again
   - Data persists if volumes weren't deleted

**Force Rebuild (Git Changes):**

1. Go to **Stacks** → **msc-label-maker**
2. Click **Editor** tab
3. Enable **Re-pull image and redeploy**
4. Click **Update the stack**

---

## Maintenance & Updates

### Updating the Application

**Method 1: Git Repository**

1. Push code changes to Git:
   ```bash
   git add .
   git commit -m "Update application"
   git push
   ```

2. In Portainer:
   - Stacks → msc-label-maker → **Editor**
   - Enable **Re-pull image and redeploy**
   - Click **Update the stack**

**Method 2: Manual**

Update `docker-compose.yml` in Portainer editor, then click **Update the stack**.

### Backup Strategy

**Automated Backup Script:**

Create `/scripts/backup-msc.sh`:
```bash
#!/bin/bash
BACKUP_DIR="/backups/msc-label-maker"
DATE=$(date +%Y%m%d-%H%M%S)

mkdir -p "$BACKUP_DIR"

# Backup database
docker run --rm \
  -v msc-database:/data \
  -v "$BACKUP_DIR":/backup \
  alpine tar czf "/backup/database-$DATE.tar.gz" -C /data .

# Backup logs
docker run --rm \
  -v msc-excel-logs:/data \
  -v "$BACKUP_DIR":/backup \
  alpine tar czf "/backup/logs-$DATE.tar.gz" -C /data .

# Keep only last 30 days
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +30 -delete

echo "Backup completed: $DATE"
```

**Schedule with Cron:**
```bash
# Make executable
chmod +x /scripts/backup-msc.sh

# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /scripts/backup-msc.sh >> /var/log/msc-backup.log 2>&1
```

### Monitoring

**View Container Stats:**
- Portainer → Containers → Select container → **Stats**

**View Logs:**
- Portainer → Containers → Select container → **Logs**

**Resource Usage:**
```bash
docker stats msc-server msc-client
```

### Scaling & Performance

**Adjust Resource Limits:**

Edit docker-compose.yml:
```yaml
deploy:
  resources:
    limits:
      cpus: '2.0'      # Increase CPU
      memory: 2G       # Increase memory
```

**Note:** This application uses SQLite and is designed for single-instance deployment. For high-traffic scenarios, consider:
1. Migrate to PostgreSQL/MySQL
2. Implement session storage (Redis)
3. Use load balancer
4. Separate database server

---

## Security Best Practices

### 1. Use HTTPS

**Option A: Reverse Proxy (Recommended)**

Use nginx/Traefik/Caddy with Let's Encrypt:
```bash
# Example with Caddy
caddy reverse-proxy --from labels.example.com --to localhost:80
```

**Option B: Update docker-compose.yml**

Add SSL certificates to nginx container.

### 2. Secure Environment Variables

- Never commit `.env` files to Git
- Use Portainer's secrets management for sensitive data
- Rotate JWT_SECRET periodically

### 3. Firewall Configuration

Restrict access to necessary ports only:
```bash
# Allow only HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Block direct access to backend
sudo ufw deny 5002/tcp
```

### 4. Regular Updates

- Keep Docker updated
- Update base images regularly
- Monitor for security advisories

### 5. Network Isolation

- Use Docker networks to isolate services
- Don't expose ports unless necessary
- Use Portainer's access control features

---

## Architecture Overview

```
┌─────────────────────────────────────────────┐
│           User Browser                      │
└─────────────────┬───────────────────────────┘
                  │ HTTP :80
                  ▼
┌─────────────────────────────────────────────┐
│      msc-client (Nginx + React)             │
│  Container: msc-client                      │
│  - Serves static React build                │
│  - Proxies /api → msc-server:5002           │
└─────────────────┬───────────────────────────┘
                  │ Internal Docker network
                  │ msc-network
                  ▼
┌─────────────────────────────────────────────┐
│      msc-server (Node.js + Express)         │
│  Container: msc-server                      │
│  - REST API on port 5002                    │
│  - SQLite Database                          │
│  - Business logic                           │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│       Docker Volumes (Persistent)           │
│  - msc-database (SQLite data)               │
│  - msc-excel-logs (Application logs)        │
│  - msc-temp (Temporary files)               │
└─────────────────────────────────────────────┘
```

**Service Communication:**
- Client → User: Port 80 (HTTP)
- Client → Server: Internal network (msc-server:5002)
- Server → Volumes: Docker volume mounts

---

## Quick Reference Commands

```bash
# View running containers
docker ps

# View logs
docker logs msc-server
docker logs msc-client
docker logs msc-server --follow  # Follow logs in real-time

# Restart containers
docker restart msc-server msc-client

# Stop containers
docker stop msc-server msc-client

# Start containers
docker start msc-server msc-client

# Execute command in container
docker exec -it msc-server sh
docker exec -it msc-client sh

# View resource usage
docker stats msc-server msc-client

# Inspect network
docker network inspect msc-network

# List volumes
docker volume ls | grep msc

# Inspect volume
docker volume inspect msc-database

# Remove everything (⚠️ DANGER)
docker-compose down -v  # Removes volumes too
```

---

## Support & Resources

**Documentation:**
- [Portainer Docs](https://docs.portainer.io/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Nginx Docs](https://nginx.org/en/docs/)

**Getting Help:**
1. Check container logs first
2. Verify environment variables
3. Test health endpoints
4. Check network connectivity

**Common URLs:**
- Application: `http://YOUR_SERVER_IP`
- Backend API: `http://YOUR_SERVER_IP:5002/api`
- Health Check: `http://YOUR_SERVER_IP:5002/api/health`
- Portainer: `http://YOUR_SERVER_IP:9000`

---

**Last Updated:** November 2024
**Version:** 2.0.0
**Docker Compose Version:** 3.8
