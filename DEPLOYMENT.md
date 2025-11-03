# Deployment Guide

## Prerequisites

- Node.js 20.x or higher
- npm or yarn
- Git
- Backend API running and accessible

## Environment Setup

### 1. Clone and Install

```bash
git clone <repository-url>
cd dashboard-enterprise
npm install
```

### 2. Environment Variables

Create `.env.local` file:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_APP_NAME=Dashboard Enterprise

# Authentication (if needed)
NEXTAUTH_URL=https://dashboard.yourdomain.com
NEXTAUTH_SECRET=your-secret-key

# Analytics (optional)
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

## Development

```bash
npm run dev
```

Access at `http://localhost:3000`

## Build for Production

```bash
npm run build
npm run start
```

## Deployment Options

### Option 1: Vercel (Recommended)

1. **Connect Repository**
   ```bash
   npm i -g vercel
   vercel login
   vercel
   ```

2. **Configure Environment Variables**
   - Go to Vercel dashboard → Settings → Environment Variables
   - Add all variables from `.env.local`

3. **Deploy**
   - Push to `main` branch triggers auto-deployment
   - Or manual: `vercel --prod`

### Option 2: Docker

1. **Build Image**
   ```bash
   docker build -t dashboard-enterprise .
   ```

2. **Run Container**
   ```bash
   docker run -p 3000:3000 \
     -e NEXT_PUBLIC_API_URL=https://api.yourdomain.com \
     dashboard-enterprise
   ```

3. **Docker Compose**
   ```yaml
   version: '3.8'
   services:
     dashboard:
       build: .
       ports:
         - "3000:3000"
       environment:
         - NEXT_PUBLIC_API_URL=https://api.yourdomain.com
   ```

### Option 3: Manual Server

1. **Build**
   ```bash
   npm run build
   ```

2. **Copy files to server**
   - `.next/` folder
   - `public/` folder
   - `package.json`
   - `node_modules/` (or run `npm ci --production`)

3. **Start with PM2**
   ```bash
   npm install -g pm2
   pm2 start npm --name "dashboard" -- start
   pm2 save
   pm2 startup
   ```

### Option 4: Netlify

1. **Configure**
   - Build command: `npm run build`
   - Publish directory: `.next`

2. **Deploy**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod
   ```

## CI/CD Pipeline

Automated deployment configured in `.github/workflows/ci-cd.yml`

### Staging (develop branch)
- Runs tests
- Builds application
- Deploys to staging environment

### Production (main branch)
- Runs full test suite
- Security checks
- Builds application
- Deploys to production

## Performance Optimization

### 1. Enable Caching
```nginx
# Nginx example
location /_next/static {
  expires 365d;
  add_header Cache-Control "public, immutable";
}
```

### 2. Enable Compression
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

### 3. CDN Configuration
- Upload static assets to CDN
- Update `NEXT_PUBLIC_CDN_URL` if needed

## SSL/TLS

### Let's Encrypt (Certbot)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d dashboard.yourdomain.com
```

## Monitoring

### Health Checks
- Endpoint: `/api/health`
- Expected: 200 OK

### Logging
- Application logs in `/logs` directory
- Configure log rotation

### Error Tracking
- Sentry integration in `app/providers.tsx`
- Configure DSN in environment variables

## Scaling

### Horizontal Scaling
- Deploy multiple instances behind load balancer
- Use Redis for session storage (if applicable)

### Load Balancer (Nginx)
```nginx
upstream dashboard {
  server 10.0.0.1:3000;
  server 10.0.0.2:3000;
  server 10.0.0.3:3000;
}

server {
  listen 80;
  server_name dashboard.yourdomain.com;

  location / {
    proxy_pass http://dashboard;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

## Rollback Strategy

### Vercel
```bash
vercel rollback
```

### PM2
```bash
pm2 reload dashboard --update-env
```

### Docker
```bash
docker pull dashboard-enterprise:previous-tag
docker-compose up -d
```

## Troubleshooting

### Build Fails
- Check Node.js version: `node --version`
- Clear cache: `rm -rf .next node_modules && npm install`
- Check environment variables

### Runtime Errors
- Check logs: `pm2 logs dashboard`
- Verify API connectivity
- Check browser console for client-side errors

### Performance Issues
- Enable production build: `NODE_ENV=production`
- Check bundle size: `npm run analyze`
- Optimize images

## Security Checklist

- [ ] Environment variables secured
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Rate limiting implemented
- [ ] CORS properly configured
- [ ] Dependencies updated
- [ ] Secrets rotated regularly

## Backup

### Database Backup
Handled by backend API

### Static Files
```bash
# Backup uploaded files
tar -czf files-backup-$(date +%Y%m%d).tar.gz public/uploads
```

## Support

For issues, create a ticket in the issue tracker or contact the development team.
