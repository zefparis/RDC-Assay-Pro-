# 🚨 URGENT - Railway Fix Immédiat

## Problème
Railway copie frontend ET backend package.json/package-lock.json → Conflits

## ✅ SOLUTION IMMÉDIATE

### 1. Railway Dashboard (PRIORITÉ)
```
1. Railway Dashboard → Votre projet backend
2. Settings → Source → Root Directory: /backend
3. Save → Redeploy
```

### 2. Git Push avec Fix
```bash
git add .
git commit -m "🔧 URGENT: Fix Railway build conflicts"
git push
```

### 3. Fichiers Créés
- ✅ `railway.toml` - Configuration build backend uniquement
- ✅ `.gitignore` mis à jour - Ignore package-lock.json frontend
- ✅ `backend/.railwayignore` - Ignore fichiers frontend
- ✅ `backend/nixpacks.toml` - Build configuration précise

## 🎯 Configuration Railway Finale

```
Root Directory: /backend
Build Command: npm install && npm run build
Start Command: npm run start:prod
Health Check: /health
```

## 📋 Variables d'Environnement Railway
```env
DATABASE_URL=postgresql://postgres:AzcctVMEbLckWcKhAGMzlQzMdAdjGKTU@shortline.proxy.rlwy.net:18727/railway
NODE_ENV=production
PORT=5000
JWT_SECRET=rdc-assay-pro-production-jwt-secret-ultra-secure-2024
JWT_REFRESH_SECRET=rdc-assay-pro-production-refresh-secret-ultra-secure-2024
CORS_ORIGIN=*
```

## 🚀 Après Fix
Le backend va build correctement et se connecter à votre PostgreSQL Railway !

**PRIORITÉ: Configurez Root Directory dans Railway Dashboard !**
