# VPS Deployment Guide with PM2

This guide will walk you through deploying the Zeritu application on a VPS using PM2 for process management.

## Prerequisites

- Ubuntu/Debian VPS (or similar Linux distribution)
- Root or sudo access
- Domain name pointing to your VPS (optional but recommended)
- PostgreSQL database (can be on the same VPS or remote)

## Step 1: Initial Server Setup

### 1.1 Update System Packages

```bash
sudo apt update && sudo apt upgrade -y
```

### 1.2 Install Node.js (18+)

```bash
# Install Node.js 20.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

### 1.3 Install PostgreSQL

```bash
sudo apt install -y postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql
```

Inside PostgreSQL shell:
```sql
CREATE DATABASE zeritu_db;
CREATE USER zeritu_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE zeritu_db TO zeritu_user;
\q
```

### 1.4 Install PM2 Globally

```bash
sudo npm install -g pm2
```

### 1.5 Install Nginx (for reverse proxy)

```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 1.6 Install Git

```bash
sudo apt install -y git
```

## Step 2: Clone and Setup Project

### 2.1 Create Application Directory

```bash
# Create directory for the application
sudo mkdir -p /var/www/zeritu
sudo chown -R $USER:$USER /var/www/zeritu
cd /var/www/zeritu
```

### 2.2 Clone Repository

```bash
git clone git@github.com:gemBekele/zeritu.git .
# Or using HTTPS:
# git clone https://github.com/gemBekele/zeritu.git .
```

## Step 3: Backend Setup

### 3.1 Install Backend Dependencies

```bash
cd /var/www/zeritu/zeritu_backend
npm install --production=false
```

### 3.2 Configure Environment Variables

```bash
# Create .env file
nano .env
```

Add the following configuration:

```env
# Database
DATABASE_URL="postgresql://zeritu_user:your_secure_password@localhost:5432/zeritu_db?schema=public"

# BetterAuth - Generate with: openssl rand -base64 32
BETTER_AUTH_SECRET="your-random-secret-here"
BETTER_AUTH_URL="https://yourdomain.com"
BETTER_AUTH_BASE_URL="https://yourdomain.com"

# OAuth (Optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Chapa Payment
CHAPA_SECRET_KEY="your-chapa-secret-key"
CHAPA_PUBLIC_KEY="your-chapa-public-key"
CHAPA_WEBHOOK_SECRET="your-webhook-secret"

# Server
PORT=3001
NODE_ENV=production

# Frontend URL (for CORS)
FRONTEND_URL="https://yourdomain.com"

# File Upload
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE=5242880
```

**Important:** Replace placeholder values with your actual credentials and domain.

### 3.3 Setup Database

```bash
# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate
# Or use db:push for development
# npm run db:push

# (Optional) Seed database
npm run db:seed
```

### 3.4 Create Uploads Directory

```bash
mkdir -p uploads
chmod 755 uploads
```

### 3.5 Build Backend

```bash
npm run build
```

### 3.6 Create Admin User (Optional)

```bash
node create-admin.js
```

## Step 4: Frontend Setup

### 4.1 Install Frontend Dependencies

```bash
cd /var/www/zeritu/zeritu_web
npm install
```

### 4.2 Configure Environment Variables

Create `.env.local` or `.env.production`:

```bash
nano .env.local
```

Add:

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
# Or if backend is on same domain:
# NEXT_PUBLIC_API_URL=https://yourdomain.com/api
```

### 4.3 Build Frontend

```bash
npm run build
```

## Step 5: PM2 Configuration

### 5.1 Create PM2 Ecosystem File

Create a PM2 ecosystem file in the project root:

```bash
cd /var/www/zeritu
nano ecosystem.config.js
```

Add the following configuration:

```javascript
module.exports = {
  apps: [
    {
      name: 'zeritu-backend',
      cwd: '/var/www/zeritu/zeritu_backend',
      script: 'npm',
      args: 'start',
      interpreter: 'none',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      error_file: '/var/www/zeritu/logs/backend-error.log',
      out_file: '/var/www/zeritu/logs/backend-out.log',
      log_file: '/var/www/zeritu/logs/backend-combined.log',
      time: true,
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    },
    {
      name: 'zeritu-frontend',
      cwd: '/var/www/zeritu/zeritu_web',
      script: 'npm',
      args: 'start',
      interpreter: 'none',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '/var/www/zeritu/logs/frontend-error.log',
      out_file: '/var/www/zeritu/logs/frontend-out.log',
      log_file: '/var/www/zeritu/logs/frontend-combined.log',
      time: true,
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    }
  ]
};
```

### 5.2 Create Logs Directory

```bash
mkdir -p /var/www/zeritu/logs
```

### 5.3 Start Applications with PM2

```bash
cd /var/www/zeritu
pm2 start ecosystem.config.js
```

### 5.4 Save PM2 Configuration

```bash
pm2 save
pm2 startup
```

The `pm2 startup` command will generate a command to run as root. Execute that command to enable PM2 on system reboot.

## Step 6: Nginx Configuration (Reverse Proxy)

### 6.1 Configure Nginx for Backend

```bash
sudo nano /etc/nginx/sites-available/zeritu-backend
```

Add:

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;  # Or yourdomain.com/api

    client_max_body_size 10M;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 6.2 Configure Nginx for Frontend

```bash
sudo nano /etc/nginx/sites-available/zeritu-frontend
```

Add:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 6.3 Enable Sites

```bash
sudo ln -s /etc/nginx/sites-available/zeritu-backend /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/zeritu-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Step 7: SSL Certificate (Optional but Recommended)

Install Certbot for Let's Encrypt SSL certificates:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com
```

Follow the prompts to complete the setup. Certbot will automatically configure Nginx for HTTPS.

## Step 8: Firewall Configuration

```bash
# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable
```

## Useful PM2 Commands

### Monitoring

```bash
# View all processes
pm2 list

# View logs
pm2 logs
pm2 logs zeritu-backend
pm2 logs zeritu-frontend

# Monitor resources
pm2 monit
```

### Process Management

```bash
# Stop an app
pm2 stop zeritu-backend
pm2 stop zeritu-frontend

# Restart an app
pm2 restart zeritu-backend
pm2 restart zeritu-frontend

# Stop all apps
pm2 stop all

# Restart all apps
pm2 restart all

# Delete an app from PM2
pm2 delete zeritu-backend

# Reload an app (zero-downtime)
pm2 reload zeritu-backend
```

### Updates and Maintenance

```bash
# Pull latest changes
cd /var/www/zeritu
git pull

# Update backend
cd zeritu_backend
npm install --production=false
npm run build
pm2 restart zeritu-backend

# Update frontend
cd ../zeritu_web
npm install
npm run build
pm2 restart zeritu-frontend
```

### Database Migrations

```bash
cd /var/www/zeritu/zeritu_backend
npm run db:migrate
```

## Troubleshooting

### Check Application Logs

```bash
# PM2 logs
pm2 logs

# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Application logs
tail -f /var/www/zeritu/logs/backend-error.log
tail -f /var/www/zeritu/logs/frontend-error.log
```

### Check Service Status

```bash
# PM2 status
pm2 status

# PostgreSQL status
sudo systemctl status postgresql

# Nginx status
sudo systemctl status nginx
```

### Common Issues

1. **Port already in use**: Check if another process is using ports 3000 or 3001
   ```bash
   sudo lsof -i :3000
   sudo lsof -i :3001
   ```

2. **Database connection errors**: Verify PostgreSQL is running and credentials are correct
   ```bash
   sudo systemctl status postgresql
   sudo -u postgres psql -c "SELECT version();"
   ```

3. **Permission errors**: Ensure proper ownership of directories
   ```bash
   sudo chown -R $USER:$USER /var/www/zeritu
   ```

4. **Build errors**: Make sure all dependencies are installed
   ```bash
   cd zeritu_backend && npm install
   cd ../zeritu_web && npm install
   ```

## Security Recommendations

1. **Keep system updated**: Regularly run `sudo apt update && sudo apt upgrade`
2. **Use strong passwords**: Especially for database and application secrets
3. **Enable firewall**: Configure UFW to allow only necessary ports
4. **Use SSL/HTTPS**: Always use HTTPS in production
5. **Regular backups**: Set up automated database backups
6. **Monitor logs**: Regularly check application and system logs
7. **Limit SSH access**: Use SSH keys instead of passwords
8. **Keep dependencies updated**: Regularly update npm packages

## Backup Strategy

### Database Backup

```bash
# Create backup script
sudo nano /usr/local/bin/backup-zeritu-db.sh
```

Add:

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/zeritu"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

sudo -u postgres pg_dump zeritu_db > $BACKUP_DIR/zeritu_db_$DATE.sql
# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
```

Make executable:

```bash
sudo chmod +x /usr/local/bin/backup-zeritu-db.sh
```

Add to crontab for daily backups:

```bash
sudo crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-zeritu-db.sh
```

## Next Steps

1. Set up monitoring (e.g., PM2 Plus, New Relic, or similar)
2. Configure automated deployments (CI/CD)
3. Set up error tracking (Sentry, LogRocket, etc.)
4. Configure CDN for static assets
5. Set up automated database backups
6. Configure email notifications for critical errors

## Support

For issues or questions, refer to:
- PM2 documentation: https://pm2.keymetrics.io/docs/
- Nginx documentation: https://nginx.org/en/docs/
- Next.js deployment: https://nextjs.org/docs/deployment

