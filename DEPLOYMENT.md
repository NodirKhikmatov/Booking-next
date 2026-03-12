# Deploy to Vultr (Ubuntu)

This guide deploys the **Booking** (NestJS backend) and **Booking-next** (Next.js frontend) on a Vultr Ubuntu server.

## Prerequisites

- Vultr Ubuntu 22.04 LTS server
- Domain (optional, for SSL)
- SSH access to your server

---

## 1. Initial Server Setup

```bash
# SSH into your Vultr server
ssh root@YOUR_SERVER_IP

# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sh
systemctl enable docker
systemctl start docker

# Install Docker Compose
apt install docker-compose-plugin -y

# Create app user (optional, for security)
adduser deploy
usermod -aG docker deploy
usermod -aG sudo deploy
```

---

## 2. Project Structure on Server

Create the project directory:

```bash
mkdir -p /var/www/booking
cd /var/www/booking
```

You'll have two folders:
- `Booking` — backend (NestJS + MongoDB)
- `Booking-next` — frontend (Next.js)

---

## 3. Backend Deployment (Booking)

### 3.1 Clone and configure

```bash
cd /var/www/booking
git clone YOUR_REPO_URL Booking
cd Booking
```

### 3.2 Create production `.env`

```bash
nano .env
```

```env
# MongoDB (use 'mongodb' hostname when using docker-compose)
MONGO_DEV=mongodb://mongodb:27017/booking
MONGO_PROD=mongodb://mongodb:27017/booking

# JWT
SECRET_TOKEN=your-secure-secret-token-here

# Ports (internal - docker maps to 4001)
PORT_API=3005
```

### 3.3 Deploy with Docker Compose

```bash
docker compose up -d --build
```

Backend will be at `http://YOUR_SERVER_IP:4001` and GraphQL at `http://YOUR_SERVER_IP:4001/graphql`.

---

## 4. Frontend Deployment (Booking-next)

### 4.1 Clone and configure

```bash
cd /var/www/booking
git clone YOUR_REPO_URL Booking-next
cd Booking-next
```

### 4.2 Create `.env` for Docker build (CRITICAL)

**Next.js bakes env vars at BUILD time.** You must pass them when building:

```bash
cp deploy.env.example .env
nano .env
```

Set your actual server IP:
```env
REACT_APP_API_URL=http://YOUR_SERVER_IP:4001
REACT_APP_API_GRAPHQL_URL=http://YOUR_SERVER_IP:4001/graphql
REACT_APP_API_WS=ws://YOUR_SERVER_IP:4001
```

### 4.3 Build and run with Docker

```bash
docker compose up -d --build
```

**Important:** Rebuild after changing `.env` — run `docker compose up -d --build` again.

Frontend will be at `http://YOUR_SERVER_IP:4000`.

---

## 5. Unified Deployment (Recommended)

Create a single `docker-compose.yml` in `/var/www/booking` to run everything:

```yaml
# /var/www/booking/docker-compose.yml
services:
  mongodb:
    image: mongo:7
    container_name: booking-mongodb
    restart: always
    ports:
      - '27017:27017'
    volumes:
      - mongodb_data:/data/db
    networks:
      - booking-network

  backend:
    build:
      context: ./Booking
      dockerfile: Dockerfile
    container_name: booking-backend
    restart: always
    ports:
      - '4001:3005'
    env_file:
      - ./Booking/.env
    environment:
      - MONGO_DEV=mongodb://mongodb:27017/booking
      - MONGO_PROD=mongodb://mongodb:27017/booking
    volumes:
      - ./Booking/uploads:/app/uploads
    depends_on:
      - mongodb
    networks:
      - booking-network

  frontend:
    build:
      context: ./Booking-next
      dockerfile: Dockerfile
    container_name: booking-frontend
    restart: always
    ports:
      - '4000:3000'
    environment:
      - REACT_APP_API_URL=http://YOUR_SERVER_IP:4001
      - REACT_APP_API_GRAPHQL_URL=http://YOUR_SERVER_IP:4001/graphql
      - REACT_APP_API_WS=ws://YOUR_SERVER_IP:4001
    depends_on:
      - backend
    networks:
      - booking-network

networks:
  booking-network:
    driver: bridge

volumes:
  mongodb_data:
```

**Note:** Replace `YOUR_SERVER_IP` with your actual server IP. For Next.js, env vars must be set at **build time**, so you may need to pass them during build (see section 7).

---

## 6. Nginx Reverse Proxy (Optional, for production)

Install Nginx for SSL, custom domains, and single port:

```bash
apt install nginx certbot python3-certbot-nginx -y
```

Example Nginx config (`/etc/nginx/sites-available/booking`):

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend
    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /graphql {
        proxy_pass http://127.0.0.1:4001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /uploads {
        proxy_pass http://127.0.0.1:4001;
    }
}
```

```bash
ln -s /etc/nginx/sites-available/booking /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx

# Get SSL certificate
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 7. Next.js Build-Time Environment Variables

Next.js bakes `REACT_APP_*` vars into the build. Update `Booking-next/Dockerfile`:

```dockerfile
FROM node:20.10.0

WORKDIR /app

COPY . .

# Pass build args for env vars
ARG REACT_APP_API_URL
ARG REACT_APP_API_GRAPHQL_URL
ARG REACT_APP_API_WS

ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_API_GRAPHQL_URL=$REACT_APP_API_GRAPHQL_URL
ENV REACT_APP_API_WS=$REACT_APP_API_WS

RUN yarn
RUN yarn build

EXPOSE 3000

CMD ["yarn", "start", "-H", "0.0.0.0"]
```

Build with:

```bash
docker build --build-arg REACT_APP_API_URL=http://YOUR_IP:4001 \
  --build-arg REACT_APP_API_GRAPHQL_URL=http://YOUR_IP:4001/graphql \
  --build-arg REACT_APP_API_WS=ws://YOUR_IP:4001 \
  -t booking-frontend .
```

---

## 8. Firewall

```bash
ufw allow 22    # SSH
ufw allow 80     # HTTP
ufw allow 443    # HTTPS
ufw allow 4000   # Frontend (if not using Nginx)
ufw allow 4001   # Backend (if not using Nginx)
ufw enable
```

---

## 9. Quick Deploy Script

Save as `deploy.sh` in `/var/www/booking`:

```bash
#!/bin/bash
cd /var/www/booking

# Pull latest
git -C Booking pull
git -C Booking-next pull

# Rebuild and restart
docker compose down
docker compose up -d --build
```

---

## Summary

| Service   | Port | URL                          |
|----------|------|------------------------------|
| Frontend | 4000 | http://YOUR_IP:4000          |
| Backend  | 4001 | http://YOUR_IP:4001/graphql |
| MongoDB  | 27017| localhost only               |

After deployment, open `http://YOUR_SERVER_IP:4000` in your browser.

---

## Troubleshooting: "Data not coming from backend"

### 1. Rebuild frontend with correct API URL

The frontend embeds the API URL at **build time**. If you built without the correct `.env`, rebuild:

```bash
cd /var/www/booking/Booking-next

# Create .env with your server IP
echo "REACT_APP_API_URL=http://YOUR_IP:4001" > .env
echo "REACT_APP_API_GRAPHQL_URL=http://YOUR_IP:4001/graphql" >> .env
echo "REACT_APP_API_WS=ws://YOUR_IP:4001" >> .env

# Rebuild (--no-cache ensures fresh build with new env)
docker compose build --no-cache
docker compose up -d
```

### 2. Verify backend is reachable

From your local machine or server:
```bash
curl http://YOUR_SERVER_IP:4001/graphql -X POST -H "Content-Type: application/json" -d '{"query":"{ __typename }"}'
```
Should return GraphQL response, not connection refused.

### 3. Check firewall

```bash
ufw status
# Ensure 4000 and 4001 are allowed
ufw allow 4000
ufw allow 4001
ufw reload
```

### 4. Check browser console

Open DevTools (F12) → Network tab. Look for failed requests to `/graphql`. If URL shows `undefined/graphql` or `localhost`, the frontend was built with wrong env — rebuild with correct `.env`.
