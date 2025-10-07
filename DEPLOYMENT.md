# 🚀 Guide de Déploiement - RDC Assay Pro

## 📋 Prérequis de Déploiement

### Environnement de Production
- **Node.js** : Version 18.0.0 ou supérieure
- **Mémoire** : Minimum 1GB RAM
- **Stockage** : 500MB d'espace libre
- **Réseau** : Accès HTTPS recommandé

### Variables d'Environnement
Configurez ces variables pour la production :

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://api.rdcassay.africa
NEXT_PUBLIC_APP_VERSION=1.0.0

# Security
NEXTAUTH_SECRET=votre-cle-secrete-super-longue-et-aleatoire
NEXTAUTH_URL=https://votre-domaine.com

# Database (quand implémentée)
DATABASE_URL=postgresql://user:password@host:5432/rdcassay

# External Services
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@rdcassay.africa
SMTP_PASS=votre-mot-de-passe-app

# File Storage
AWS_ACCESS_KEY_ID=votre-access-key
AWS_SECRET_ACCESS_KEY=votre-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=rdcassay-production

# Monitoring
GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
SENTRY_DSN=https://votre-sentry-dsn
```

## 🌐 Options de Déploiement

### 1. Vercel (Recommandé) ⭐

**Avantages** :
- Déploiement automatique depuis Git
- CDN global intégré
- HTTPS automatique
- Scaling automatique

**Étapes** :
```bash
# Installation de Vercel CLI
npm i -g vercel

# Connexion à votre compte
vercel login

# Déploiement
vercel --prod
```

**Configuration Vercel** :
1. Connectez votre repository GitHub
2. Configurez les variables d'environnement dans le dashboard
3. Le déploiement se fait automatiquement à chaque push

### 2. Netlify

**Avantages** :
- Interface simple
- Déploiement continu
- Fonctions serverless

**Étapes** :
```bash
# Build de production
npm run build
npm run export

# Déploiement via Netlify CLI
npm i -g netlify-cli
netlify deploy --prod --dir=out
```

### 3. Docker + Cloud Provider

**Dockerfile** :
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

**Déploiement** :
```bash
# Build de l'image
docker build -t rdc-assay-pro .

# Run local
docker run -p 3000:3000 rdc-assay-pro

# Push vers registry
docker tag rdc-assay-pro your-registry/rdc-assay-pro
docker push your-registry/rdc-assay-pro
```

### 4. VPS/Serveur Dédié

**Avec PM2** :
```bash
# Installation PM2
npm install -g pm2

# Configuration ecosystem
# ecosystem.config.js
module.exports = {
  apps: [{
    name: 'rdc-assay-pro',
    script: 'npm',
    args: 'start',
    cwd: '/path/to/app',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}

# Démarrage
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

**Avec Nginx** :
```nginx
server {
    listen 80;
    server_name rdcassay.africa www.rdcassay.africa;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name rdcassay.africa www.rdcassay.africa;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

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

## 🔒 Sécurité en Production

### HTTPS/SSL
```bash
# Avec Certbot (Let's Encrypt)
sudo certbot --nginx -d rdcassay.africa -d www.rdcassay.africa
```

### Headers de Sécurité
Dans `next.config.js` :
```javascript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
          }
        ]
      }
    ]
  }
}
```

### Variables Sensibles
- Utilisez des services comme **AWS Secrets Manager** ou **HashiCorp Vault**
- Ne jamais commiter les clés dans Git
- Rotation régulière des secrets

## 📊 Monitoring et Observabilité

### Logs
```javascript
// lib/logger.js
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

### Métriques
```javascript
// Avec Sentry
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### Health Check
```javascript
// pages/api/health.js
export default function handler(req, res) {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.NEXT_PUBLIC_APP_VERSION
  });
}
```

## 🚀 CI/CD Pipeline

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build application
      run: npm run build
      env:
        NEXT_PUBLIC_API_URL: ${{ secrets.API_URL }}
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

## 📈 Performance en Production

### Optimisations
```javascript
// next.config.js
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  
  images: {
    domains: ['api.rdcassay.africa'],
    formats: ['image/webp', 'image/avif'],
  },
  
  experimental: {
    optimizeCss: true,
    optimizeImages: true,
  }
}
```

### Cache Strategy
```javascript
// Avec Redis
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export async function getCachedData(key) {
  const cached = await redis.get(key);
  return cached ? JSON.parse(cached) : null;
}

export async function setCachedData(key, data, ttl = 3600) {
  await redis.setex(key, ttl, JSON.stringify(data));
}
```

## 🔧 Maintenance

### Backup
```bash
# Script de sauvegarde quotidienne
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > backup_$DATE.sql
aws s3 cp backup_$DATE.sql s3://rdcassay-backups/
```

### Updates
```bash
# Mise à jour sécurisée
npm audit
npm update
npm run build
npm test
```

### Monitoring
- **Uptime** : UptimeRobot, Pingdom
- **Performance** : New Relic, DataDog
- **Errors** : Sentry, Bugsnag
- **Analytics** : Google Analytics, Mixpanel

## 📞 Support Post-Déploiement

### Checklist de Déploiement
- [ ] Variables d'environnement configurées
- [ ] HTTPS activé
- [ ] Monitoring en place
- [ ] Backups configurés
- [ ] DNS configuré
- [ ] Tests de charge effectués
- [ ] Documentation mise à jour

### Contacts d'Urgence
- **Technique** : tech@rdcassay.africa
- **Ops** : ops@rdcassay.africa
- **Support** : support@rdcassay.africa

---

**Temps de déploiement estimé : 2-4 heures selon la plateforme choisie**
