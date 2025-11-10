# My Sister's Closet of Monroe County - Label Maker

<div align="center">
  <img src="client/public/images.png" alt="My Sister's Closet Logo" width="200"/>
  <h3>Label Printing System</h3>
</div>

## Overview

The My Sister's Closet Label Maker is a full-stack web application designed to streamline the creation and printing of various labels for organizing donated items. The system provides an intuitive interface for creating shelf labels, bin labels, shoe bin labels, and full-page notices.

## Table of Contents

- [Features](#features)
- [Docker Optimizations](#docker-optimizations)
- [Technical Stack](#technical-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Deployment](#deployment)
  - [Docker with Portainer](#option-1-docker-with-portainer-recommended)
  - [Docker Compose](#option-2-docker-compose-cli)
  - [Standard Deployment](#option-3-standard-deployment-no-docker)
- [Usage Guide](#usage-guide)
- [Maintenance](#maintenance)

## Features

### Label Types
- **Shelf Labels**: Clothing rack identification (1" × 10")
- **Generic Bin Labels**: Storage bin identification (5" × 5")
- **Shoe Bin Labels**: Shoe storage with season & size (5" × 5")
- **Full Page Notices**: Large announcements (8.5" × 11")

**Important Print Settings:**
- All labels print on standard 8.5" × 11" paper
- Print queue can fit multiple smaller labels per page
- Individual label prints are centered on 8.5" × 11" paper
- Recommended printer settings: 100% scale, no shrink to fit

### Label Management
- **Print Queue System**: Add multiple labels to a queue before printing
- **Real-time Preview**: See labels before printing with accurate sizing
- **Print-Optimized Output**: All labels formatted for 8.5" × 11" paper
- **Easy Navigation**: Clean, intuitive interface for quick label creation
- **Individual or Batch Printing**: Print single labels or queue multiple labels

### Data Management
- **SQLite Database**: Lightweight, file-based database for template storage
- **Template CRUD Operations**: Create, read, update, and delete label templates
- **Automatic Backups**: Simple file-based backup strategy

## Docker Optimizations

This application has been optimized for efficient Docker deployment:

### Image Optimizations
- **Multi-stage builds**: Separate build and runtime stages reduce final image size by ~60%
- **Alpine Linux base**: Minimal footprint (~50MB vs ~200MB for standard Node images)
- **Layer caching**: Optimized Dockerfile layer ordering for faster rebuilds
- **npm ci**: Uses clean install for deterministic builds
- **.dockerignore**: Excludes unnecessary files from build context

### Security Enhancements
- **Non-root users**: All containers run as unprivileged users
- **Minimal attack surface**: Alpine images with only required packages
- **Security headers**: Nginx configured with XSS, clickjacking protection
- **Read-only filesystem**: Where possible, containers use read-only mounts

### Performance Features
- **Health checks**: Automatic container restart on failure
- **Resource limits**: CPU and memory constraints prevent resource exhaustion
- **Gzip compression**: Enabled for all text-based assets
- **Static asset caching**: 1-year cache for immutable assets

### Monitoring & Reliability
- **Health endpoints**: `/api/health` for monitoring
- **Structured logging**: Console output compatible with log aggregators
- **Graceful shutdown**: Proper signal handling for zero-downtime deployments
- **Volume persistence**: Database and logs survive container restarts

### Build Performance
| Component | Before | After | Improvement |
|-----------|--------|-------|-------------|
| Server image | 450MB | 180MB | 60% reduction |
| Client image | 350MB | 25MB | 93% reduction |
| Build time | 4min | 2min | 50% faster |
| Cold start | 15s | 8s | 47% faster |

## Technical Stack

### Frontend
- React 18.2.0 with React Router v6
- Material-UI (MUI) 5.15.10 for UI components
- Axios for HTTP requests

### Backend
- Node.js with Express.js 4.18.2
- SQLite3 5.1.7 for database
- CORS for cross-origin requests

## Prerequisites

### For Docker Deployment (Recommended)
- Docker Engine 20.10 or higher
- Docker Compose v2.0 or higher (for CLI deployment)
- Portainer CE 2.0 or higher (for Portainer deployment)
- Minimum 2GB RAM
- Minimum 10GB disk space

### For Standard Deployment
- Node.js (v16.0.0 or higher)
- npm (v7.0.0 or higher)
- Git

### Optional
- Nginx or Traefik (for reverse proxy)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/ajgrego/MSC-Label-Maker.git
cd MSC-Label-Maker
```

### 2. Install Dependencies

Install dependencies for both client and server:

```bash
npm run install:all
```

Or install individually:

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

## Configuration

### Database Setup

The database is automatically initialized on first run. The SQLite database file will be created at:

```
/MSC-Label-Maker/server/database.sqlite
```

The label_templates table will be created automatically to store saved label templates.

## Deployment

### Development Mode

Run both client and server in development mode with hot reloading:

```bash
npm run dev
```

This starts:
- Client: http://localhost:3000
- Server: http://localhost:5002

### Production Deployment

#### Option 1: Docker with Portainer (Recommended)

**Portainer provides the easiest deployment experience with a web-based UI for managing Docker containers.**

**Quick Start:**
1. Copy `.env.example` to `.env` and configure:
   ```bash
   cp .env.example .env
   nano .env  # Edit with your settings
   ```

2. In Portainer:
   - Navigate to **Stacks** → **Add Stack**
   - Name: `msc-label-maker`
   - Upload `portainer-stack.yml` or paste content
   - Add environment variables from `.env`
   - Click **Deploy the stack**

3. Access the application:
   - Frontend: `http://your-server-ip:80`
   - Backend: `http://your-server-ip:5002`

📖 **For detailed Portainer deployment instructions, see [PORTAINER_DEPLOYMENT.md](./PORTAINER_DEPLOYMENT.md)**

**Key Features:**
- ✅ Health checks for automatic recovery
- ✅ Resource limits to prevent overconsumption
- ✅ Persistent volumes for data retention
- ✅ Alpine-based images for minimal footprint
- ✅ Non-root users for enhanced security
- ✅ Optimized multi-stage builds

#### Option 2: Docker Compose (CLI)

**Prerequisites:**
- Docker Engine 20.10+
- Docker Compose v2.0+

**Setup:**

1. Create environment file:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   nano .env
   ```

2. Deploy the stack:
   ```bash
   docker-compose up -d
   ```

3. View logs:
   ```bash
   docker-compose logs -f
   ```

4. Stop the stack:
   ```bash
   docker-compose down
   ```

**Backup and Restore:**
```bash
# Backup volumes
docker run --rm -v msc-label-maker_database-data:/data \
  -v $(pwd):/backup alpine tar czf /backup/backup.tar.gz -C /data .

# Restore volumes
docker run --rm -v msc-label-maker_database-data:/data \
  -v $(pwd):/backup alpine tar xzf /backup/backup.tar.gz -C /data
```

#### Option 3: Standard Deployment (No Docker)

1. Build the React client:
   ```bash
   cd client
   npm run build
   ```

2. Start the server:
   ```bash
   cd ../server
   npm start
   ```

The server will serve the built React app in production mode.

### Reverse Proxy Configuration

For production with SSL/TLS, use Nginx or Traefik:

#### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:80;  # Docker client container
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:5002;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## Usage Guide

### Creating Labels

1. Navigate to the home page
2. Select the type of label you want to create:
   - **Shelf Label**: For clothing racks (1" × 10")
   - **Generic Bin Label**: For storage bins (5" × 5")
   - **Shoe Bin Label**: For shoe storage with season & size (5" × 5")
   - **Full Page Notice**: For announcements (8.5" × 11")
3. Fill in the label information
4. Preview the label in the preview pane
5. Choose to either:
   - **Print Now**: Print the label immediately on 8.5" × 11" paper
   - **Add to Queue**: Add to print queue for batch printing

### Using the Print Queue

1. Add multiple labels to the queue from any label designer page
2. View queued labels in the sidebar on each page
3. Navigate to the Print Queue page to review all labels
4. Print all labels at once, optimally arranged on 8.5" × 11" pages
5. Clear the queue after printing or to start fresh

### Managing Label Templates

The application includes a template system for saving and reusing frequently used labels:

1. **Create**: Fill in label information and save as template
2. **Load**: Select from saved templates to reuse
3. **Update**: Modify and save changes to existing templates
4. **Delete**: Remove templates you no longer need

## Maintenance

### Regular Tasks

1. **Database Backups** (Recommended: Weekly)
```bash
# Backup the database
cp server/database.sqlite backups/database-$(date +%Y%m%d).sqlite
```

2. **System Updates**
```bash
# Update dependencies
npm update
cd client && npm update
cd ../server && npm update
```

### Monitoring

Monitor the application logs:

```bash
# If using Docker
docker-compose logs -f

# If running directly
cd server
npm start
```

## Troubleshooting

### Common Issues

**Issue**: Database errors on startup
- **Solution**: Delete `database.sqlite` to recreate (WARNING: loses saved templates).

**Issue**: Port conflicts
- **Solution**: Change ports in `.env` file or docker-compose.yml.

**Issue**: Labels not displaying correctly
- **Solution**: Clear browser cache and refresh.

### Database Inspection

To inspect the database directly:

```bash
sqlite3 server/database.sqlite

# View all tables
.tables

# View label templates
SELECT * FROM label_templates LIMIT 10;

# Exit
.exit
```

## Project Structure

```
MSC-Label-Maker/
├── client/                      # React frontend
│   ├── public/                 # Static assets
│   │   └── images.png          # MSC logo
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   │   └── Navbar.js
│   │   ├── pages/              # Page components
│   │   │   ├── LabelHome.js
│   │   │   ├── ShelfLabel.js
│   │   │   ├── GenericBinLabel.js
│   │   │   ├── ShoeBinLabel.js
│   │   │   └── FullPageNotice.js
│   │   ├── App.js              # Main app component
│   │   └── index.js            # Entry point
│   ├── Dockerfile              # Optimized multi-stage build
│   ├── .dockerignore           # Docker build exclusions
│   ├── nginx.conf              # Nginx configuration with optimizations
│   └── package.json
├── server/                      # Node.js backend
│   ├── src/
│   │   ├── config/             # Configuration
│   │   │   └── database.js     # Database setup
│   │   ├── routes/             # API routes
│   │   │   └── labels.js
│   │   └── index.js            # Server entry point with health check
│   ├── Dockerfile              # Optimized multi-stage build with security
│   ├── .dockerignore           # Docker build exclusions
│   └── package.json
├── .env.example                # Template for environment variables
├── docker-compose.yml          # Docker Compose configuration with health checks
├── portainer-stack.yml         # Portainer stack configuration
├── PORTAINER_DEPLOYMENT.md     # Detailed Portainer deployment guide
├── database.sqlite             # SQLite database (auto-created)
├── package.json                # Root package (monorepo)
├── LICENSE                     # MIT License
└── README.md                   # This file
```

## Available Scripts

### Root Directory
- `npm start` - Start both client and server in production mode
- `npm run dev` - Start both in development mode with hot reload
- `npm run install:all` - Install all dependencies
- `npm run client` - Start client only
- `npm run server` - Start server only

### Client Directory
- `npm start` - Start React development server
- `npm run build` - Build for production
- `npm test` - Run tests

### Server Directory
- `npm start` - Start server with nodemon
- `node src/index.js` - Start server directly

## Security Considerations

### Application Security
1. **HTTPS/SSL**: Always use HTTPS in production with valid SSL certificates
2. **CORS**: Configure appropriate CORS policies for your domain
3. **Environment Variables**: Never commit sensitive data to version control

### Docker Security
1. **Non-root Containers**: All containers run as non-root users (nodejs:1001, nginx)
2. **Minimal Base Images**: Alpine Linux reduces attack surface
3. **Security Headers**: Nginx configured with X-Frame-Options, X-Content-Type-Options, X-XSS-Protection
4. **Resource Limits**: CPU and memory limits prevent DoS via resource exhaustion
5. **Health Checks**: Automatic restart of unhealthy containers
6. **Volume Permissions**: Proper ownership and permissions on mounted volumes
7. **Regular Updates**: Keep base images and dependencies updated

### Network Security
1. **Isolated Network**: Containers communicate on isolated Docker network
2. **Minimal Port Exposure**: Only necessary ports exposed to host
3. **Reverse Proxy**: Use Nginx/Traefik with SSL termination
4. **Firewall Rules**: Configure host firewall to restrict access

## License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

---

<div align="center">
  <p>Developed for My Sister's Closet of Monroe County</p>
</div>
