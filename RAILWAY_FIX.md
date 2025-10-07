# 🚨 Fix Railway Build Error

## Problème
Railway détecte des conflits entre frontend et backend `package-lock.json`

## ✅ Solution Immédiate

### Option 1: Configuration Railway (Recommandée)
1. **Railway Dashboard** → Votre projet backend
2. **Settings** → **Source**
3. **Root Directory**: Changez `/` vers `/backend`
4. **Deploy** → Redéployer

### Option 2: Fichier de configuration
Créez un `railway.toml` à la racine :

```toml
[build]
builder = "nixpacks"
buildCommand = "cd backend && npm install && npm run build"

[deploy]
startCommand = "cd backend && npm run start:prod"
healthcheckPath = "/health"
```

### Option 3: Suppression temporaire
```bash
# Supprimez temporairement le package-lock.json frontend
mv package-lock.json package-lock.json.backup

# Committez et poussez
git add .
git commit -m "🔧 Fix Railway build conflict"
git push

# Après déploiement, restaurez
mv package-lock.json.backup package-lock.json
```

## ⚡ Fix Rapide
```bash
# Dans Railway Dashboard:
# Root Directory: /backend
# Build Command: npm install && npm run build  
# Start Command: npm run start:prod
```

## 🎯 Variables d'Environnement Railway
```env
DATABASE_URL=postgresql://postgres:AzcctVMEbLckWcKhAGMzlQzMdAdjGKTU@shortline.proxy.rlwy.net:18727/railway
NODE_ENV=production
PORT=5000
JWT_SECRET=votre-secret-ultra-secure
JWT_REFRESH_SECRET=votre-refresh-secret-ultra-secure
CORS_ORIGIN=*
```

Le problème sera résolu ! 🚀
