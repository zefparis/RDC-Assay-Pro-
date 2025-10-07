# 🚀 Déploiement Complet Railway - RDC Assay Pro

## 📋 **Vue d'Ensemble**

Déploiement **Frontend Next.js** + **Backend Express.js** sur Railway avec PostgreSQL.

## 🎯 **Architecture de Déploiement**

```
Railway Projects:
├── 🖥️  Frontend (Next.js)     → https://rdc-assay-frontend.railway.app
├── ⚙️  Backend (Express.js)   → https://rdc-assay-backend.railway.app
└── 🗄️  Database (PostgreSQL)  → Déjà configurée
```

## 🚀 **Étapes de Déploiement**

### **Phase 1: Préparation Git**

```bash
# 1. Initialiser Git (si pas déjà fait)
git init

# 2. Ajouter tous les fichiers
git add .

# 3. Commit initial
git commit -m "🎉 Initial commit - RDC Assay Pro Full Stack"

# 4. Créer repo GitHub
# Créez un repo sur GitHub: rdc-assay-pro

# 5. Pousser vers GitHub
git remote add origin https://github.com/votre-username/rdc-assay-pro.git
git branch -M main
git push -u origin main
```

### **Phase 2: Déploiement Backend**

#### **2.1 Créer Projet Railway Backend**
1. Allez sur [railway.app](https://railway.app)
2. **New Project** → **Deploy from GitHub repo**
3. Sélectionnez votre repo `rdc-assay-pro`
4. **Root Directory**: `/backend`
5. Nommez: `rdc-assay-backend`

#### **2.2 Variables d'Environnement Backend**
Dans Railway Dashboard → Variables:

```env
DATABASE_URL=postgresql://postgres:AzcctVMEbLckWcKhAGMzlQzMdAdjGKTU@shortline.proxy.rlwy.net:18727/railway
NODE_ENV=production
PORT=5000
JWT_SECRET=rdc-assay-pro-production-jwt-secret-ultra-secure-2024
JWT_REFRESH_SECRET=rdc-assay-pro-production-refresh-secret-ultra-secure-2024
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
CORS_ORIGIN=*
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
LOG_FILE=./logs/app.log
API_DOCS_ENABLED=true
BCRYPT_ROUNDS=12
SESSION_SECRET=rdc-assay-pro-session-secret-production-2024
```

#### **2.3 Configuration Build Backend**
- **Build Command**: `npm run build`
- **Start Command**: `npm run start:prod`
- **Health Check**: `/health`

### **Phase 3: Déploiement Frontend**

#### **3.1 Créer Projet Railway Frontend**
1. **New Project** → **Deploy from GitHub repo**
2. Sélectionnez votre repo `rdc-assay-pro`
3. **Root Directory**: `/` (racine)
4. Nommez: `rdc-assay-frontend`

#### **3.2 Variables d'Environnement Frontend**
Dans Railway Dashboard → Variables:

```env
NEXT_PUBLIC_API_URL=https://rdc-assay-backend.railway.app/api/v1
NEXT_PUBLIC_APP_VERSION=1.0.0
NODE_ENV=production
```

⚠️ **IMPORTANT**: Remplacez `rdc-assay-backend.railway.app` par votre vraie URL backend Railway !

#### **3.3 Configuration Build Frontend**
- **Build Command**: `npm run build`
- **Start Command**: `npm start`

### **Phase 4: Configuration CORS**

Une fois le frontend déployé, mettez à jour le CORS du backend :

```env
# Backend Railway Variables
CORS_ORIGIN=https://rdc-assay-frontend.railway.app
```

## 🔧 **Vérifications Post-Déploiement**

### **Backend Health Checks**
```bash
# Health check
curl https://rdc-assay-backend.railway.app/health

# API Documentation
https://rdc-assay-backend.railway.app/api-docs

# Test login
curl -X POST https://rdc-assay-backend.railway.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@rdcassay.africa","password":"admin123"}'
```

### **Frontend Checks**
```bash
# Page d'accueil
https://rdc-assay-frontend.railway.app

# Test de connexion avec les credentials:
# admin@rdcassay.africa / admin123
```

## 🗄️ **Base de Données**

### **Migrations Automatiques**
Le backend exécute automatiquement :
1. `prisma generate`
2. `prisma migrate deploy`
3. `seed` (données de test)

### **Credentials de Test**
```
Admin: admin@rdcassay.africa / admin123
Analyst: analyst@rdcassay.africa / analyst123
Client: client@mining-corp.cd / client123
```

## 🔄 **Workflow de Développement**

### **Développement Local**
```bash
# Backend
cd backend
npm run dev  # http://localhost:5000

# Frontend (nouveau terminal)
cd ../
npm run dev  # http://localhost:3000
```

### **Déploiement Continu**
```bash
# Faire des changements
git add .
git commit -m "✨ Nouvelle fonctionnalité"
git push

# Railway redéploie automatiquement !
```

## 🛡️ **Sécurité Production**

### **✅ Configuré**
- JWT avec clés sécurisées
- CORS configuré
- Rate limiting activé
- Variables d'environnement sécurisées
- HTTPS automatique (Railway)

### **🔄 À Faire Après Déploiement**
- [ ] Changer tous les secrets par défaut
- [ ] Configurer domaine personnalisé
- [ ] Activer monitoring/alertes
- [ ] Backup base de données

## 📊 **Monitoring**

### **Railway Dashboard**
- CPU/RAM usage
- Logs en temps réel
- Métriques de trafic
- Status des déploiements

### **Logs**
```bash
# Backend logs
railway logs --service rdc-assay-backend

# Frontend logs  
railway logs --service rdc-assay-frontend
```

## 🚨 **Dépannage**

### **Erreurs Communes**

1. **CORS Error**
   - Vérifiez `CORS_ORIGIN` dans backend
   - Doit pointer vers URL frontend Railway

2. **API Connection Failed**
   - Vérifiez `NEXT_PUBLIC_API_URL` dans frontend
   - Doit pointer vers URL backend Railway

3. **Database Connection**
   - Vérifiez `DATABASE_URL` dans backend
   - Testez avec `npm run prisma:studio`

4. **Build Failed**
   - Vérifiez les logs Railway
   - Testez build localement

## ✅ **Checklist Final**

### **Avant Git Push**
- [ ] ✅ `.env` dans `.gitignore`
- [ ] ✅ `.env.example` mis à jour
- [ ] ✅ `package.json` scripts corrects
- [ ] ✅ `railway.json` configuré
- [ ] ✅ Variables d'environnement prêtes

### **Après Déploiement Backend**
- [ ] ✅ Health check OK
- [ ] ✅ API docs accessibles
- [ ] ✅ Login test fonctionnel
- [ ] ✅ Base de données connectée

### **Après Déploiement Frontend**
- [ ] ✅ Site accessible
- [ ] ✅ Login interface fonctionne
- [ ] ✅ API calls réussissent
- [ ] ✅ Données s'affichent

### **Configuration Finale**
- [ ] ✅ CORS configuré
- [ ] ✅ URLs mises à jour
- [ ] ✅ Secrets changés
- [ ] ✅ Tests complets OK

## 🎉 **Succès !**

Votre **RDC Assay Pro** sera déployé avec :

- 🖥️ **Frontend Next.js** sur Railway
- ⚙️ **Backend Express.js** sur Railway  
- 🗄️ **PostgreSQL** Railway
- 🔐 **Authentification** complète
- 📊 **API** documentée
- 🛡️ **Sécurité** production

**🇨🇩 Prêt à révolutionner l'industrie minière de la RDC !**

---

## 📞 **Support**

En cas de problème :
1. Vérifiez les logs Railway
2. Testez localement d'abord
3. Vérifiez les variables d'environnement
4. Consultez la documentation Railway
