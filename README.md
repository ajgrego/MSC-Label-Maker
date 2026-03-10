# MSC Label Maker

<div align="center">
  <img src="client/public/images.png" alt="My Sister's Closet Logo" width="160"/>
  <h3>Label Printing System for My Sister's Closet of Monroe County</h3>
  <p>A full-stack web application for creating and printing organizational labels</p>
</div>

---

## Overview

MSC Label Maker is a purpose-built internal tool for **My Sister's Closet**, a non-profit thrift store. Staff use it to design, preview, and batch-print shelf labels, bin labels, shoe bin labels, and full-page notices — all optimized for standard 8.5" × 11" paper with minimal cutting required.

The application runs fully in-browser for printing; the backend provides a REST API for persisting label templates via a lightweight SQLite database.

## Table of Contents

- [Features](#features)
- [Skills Demonstrated](#skills-demonstrated)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Running Locally](#running-locally)
- [Docker Deployment](#docker-deployment)
- [Portainer Deployment](#portainer-deployment)
- [Environment Variables](#environment-variables)
- [Usage Guide](#usage-guide)
- [Troubleshooting](#troubleshooting)

## Features

| Label Type | Size | Description |
|---|---|---|
| **Shelf Label** | 10" × 1" | Clothing rack identification; size field can be toggled off |
| **Generic Bin Label** | 4.25" × 5.5" | Free-text storage bin label |
| **Shoe Bin Label** | 4.25" × 5.5" | Structured label with season, size range, and category |
| **Full Page Notice** | 8.5" × 11" | Large-format announcement with auto-sizing text |

- **Live preview** — see exact label appearance before printing
- **Print queue** — add labels from any page, then batch-print in one shot
- **4-per-page layout** — bin and shoe labels print in a 2×2 grid for easy cutting
- **Consistent multi-page alignment** — all pages start at the same position
- **Blank label support** — queue placeholder labels for manual writing
- **Label template storage** — save and reload frequently used labels via REST API

## Skills Demonstrated

- **React 18** — functional components, hooks (`useState`, `useCallback`, `useMemo`, `useContext`), Context API for global state
- **Material UI v5** — theme customization, responsive Grid layout, form controls
- **Print CSS** — `@page` sizing, `page-break-*`, flex-based multi-label layouts, hiding UI chrome during print
- **Node.js / Express** — RESTful API design, SQLite persistence, health check endpoint
- **Docker** — multi-stage builds (Node → Nginx), non-root users, Alpine images, health checks, named volumes
- **Portainer** — stack deployment from Git, environment variable management
- **Project hygiene** — monorepo structure, `.dockerignore`, clean gitignore, zero unused dependencies

## Tech Stack

**Frontend:** React 18 · React Router v6 · Material UI v5 · CSS print media queries
**Backend:** Node.js · Express 4 · SQLite3 · CORS
**Infrastructure:** Docker · Nginx · Portainer · Docker Compose

## Project Structure

```
MSC-Label-Maker/
├── client/                      # React frontend
│   ├── public/                  # Static assets (logo, manifest)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js        # App header
│   │   │   └── PrintQueueSidebar.js  # Sticky queue panel
│   │   ├── context/
│   │   │   └── PrintQueueContext.js  # Global print queue state
│   │   ├── pages/
│   │   │   ├── LabelHome.js     # Landing page / label type selector
│   │   │   ├── ShelfLabel.js    # Shelf label designer
│   │   │   ├── GenericBinLabel.js    # Generic bin label designer
│   │   │   ├── ShoeBinLabel.js  # Shoe bin label designer
│   │   │   ├── FullPageNotice.js     # Full-page notice designer
│   │   │   └── PrintQueue.js    # Batch print view
│   │   ├── utils/
│   │   │   └── printStyles.js   # @media print CSS for all label types
│   │   ├── App.js               # Router + theme setup
│   │   └── index.js             # React entry point
│   ├── Dockerfile               # Multi-stage build (Node build → Nginx serve)
│   ├── nginx.conf               # SPA routing + gzip + cache headers
│   └── package.json
├── server/                      # Node.js API
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js      # SQLite init
│   │   ├── routes/
│   │   │   └── labels.js        # CRUD endpoints for label templates
│   │   └── index.js             # Express app + /api/health endpoint
│   ├── Dockerfile               # Multi-stage build with non-root user
│   └── package.json
├── docker-compose.yml           # Orchestrates client + server with health checks
├── stack.env.example            # Environment variable reference
├── .env.example                 # Local development env template
├── package.json                 # Monorepo root (concurrently)
└── LICENSE
```

## Running Locally

**Prerequisites:** Node.js v16+, npm v7+

```bash
# 1. Clone the repo
git clone https://github.com/ajgrego/MSC-Label-Maker.git
cd MSC-Label-Maker

# 2. Install all dependencies
npm run install:all

# 3. Start client + server in development mode
npm run dev
```

- React client: http://localhost:3000
- API server:  http://localhost:5002

The SQLite database is created automatically at `server/data/database.sqlite` on first run.

## Docker Deployment

```bash
# Build and start both containers
docker compose up --build -d

# View logs
docker compose logs -f

# Stop
docker compose down
```

- Web UI:   http://localhost:80
- API:      http://localhost:5002

The `msc-database` named volume persists the SQLite database across container restarts.

### Docker highlights
- **Multi-stage builds** — Node build stage produces artifacts; Nginx/Node runtime stage stays lean (~25 MB client, ~180 MB server)
- **Non-root users** — server runs as `nodejs:1001`, client as `nginx`
- **Health checks** — `/api/health` endpoint; client container waits for server to be healthy before starting
- **Resource limits** — CPU and memory caps defined in Compose

## Portainer Deployment

1. In Portainer, go to **Stacks → Add Stack → Repository**
2. Enter the Git repository URL
3. Set the **Compose file path** to `docker-compose.yml`
4. Optionally override `SERVER_PORT` and `CLIENT_PORT` in the environment variables panel
5. Click **Deploy the stack**

No secrets are required — the application does not use authentication.

## Environment Variables

All variables are optional. Defaults work out of the box.

| Variable | Default | Description |
|---|---|---|
| `SERVER_PORT` | `5002` | Host port for the API server |
| `CLIENT_PORT` | `80` | Host port for the web client |

See `stack.env.example` for a ready-to-use template.

## Usage Guide

### Designing a label
1. Choose a label type from the home page
2. Fill in the fields (size, category, text, etc.)
3. Preview updates live — what you see is what prints

### Printing immediately
Click **Print Now** on any designer page to open the browser print dialog and print directly.

### Using the print queue
1. Click **Add to Queue** on any designer page — the sidebar shows your queue
2. Continue adding labels of any type (except notices can't be mixed with other types)
3. Click **Print All Labels** in the sidebar to navigate to the Print Queue page
4. Review, then click **Print All Labels** to send to your printer

### Print tips
- Set scale to **100%** and margins to **None** or **Minimum** in the browser print dialog
- Bin/shoe labels print 4 per page in a 2×2 grid — one horizontal cut + one vertical cut separates all four labels
- Shelf labels print in landscape; stack pages and make one cut per label strip

## Troubleshooting

**Labels misaligned on first page** — ensure browser print margins are set to **None**

**Port already in use** — change `SERVER_PORT` or `CLIENT_PORT` in `.env` / Portainer env vars

**Database errors on startup** — delete `server/data/database.sqlite` to recreate it (templates will be lost)

**Inspect the database directly:**
```bash
sqlite3 server/data/database.sqlite
.tables
SELECT * FROM label_templates;
.exit
```

## License

MIT — see [LICENSE](./LICENSE)
