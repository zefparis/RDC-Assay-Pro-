# 🚀 Déploiement Railway - RDC Assay Pro Backend

## 📋 Configuration Complète

Votre backend est maintenant **prêt pour Railway** avec votre base de données PostgreSQL configurée.

## 🗄️ **Base de Données Configurée**

```
DATABASE_URL="postgresql://postgres:AzcctVMEbLckWcKhAGMzlQzMdAdjGKTU@shortline.proxy.rlwy.net:18727/railway"
```

## 🚀 **Étapes de Déploiement**

### **1. Préparer le Projet**

```bash
cd backend

# Installer les dépendances
npm install

# Tester localement avec la DB Railway
npm run prisma:generate
npm run prisma:deploy
npm run seed
npm run dev
```

### **2. Déployer sur Railway**

#### **Option A: Via Railway CLI**
```bash
# Installer Railway CLI
npm install -g @railway/cli

# Se connecter
railway login

# Initialiser le projet
railway init

# Déployer
railway up
```

#### **Option B: Via GitHub**
1. **Push** votre code sur GitHub
2. **Connecter** Railway à votre repo GitHub
3. **Sélectionner** le dossier `backend`
4. **Déployer** automatiquement

### **3. Variables d'Environnement Railway**

Configurez ces variables dans Railway Dashboard :

```env
# Database (déjà configurée)
DATABASE_URL=postgresql://postgres:AzcctVMEbLckWcKhAGMzlQzMdAdjGKTU@shortline.proxy.rlwy.net:18727/railway

# Server
NODE_ENV=production
PORT=5000

# JWT - CHANGEZ CES CLÉS !
JWT_SECRET=votre-cle-jwt-super-secrete-production
JWT_REFRESH_SECRET=votre-cle-refresh-super-secrete-production

# CORS - Votre domaine frontend
CORS_ORIGIN=https://votre-frontend.vercel.app

# API Documentation
API_DOCS_ENABLED=true
```

## 🔧 **Configuration Railway**

### **Build Command**
```bash
npm run build
```

### **Start Command**
```bash
npm run start:prod
```

### **Health Check**
```
/health
```

## 📁 **Structure de Déploiement**

```
backend/
├── 📄 railway.json          # Configuration Railway
├── 📄 .env                  # Variables d'environnement
├── 📄 package.json          # Scripts de déploiement
├── 🗂️ src/                  # Code source
├── 🗂️ prisma/               # Schema et migrations
└── 🗂️ dist/                 # Code compilé (généré)
```

## 🎯 **Scripts de Déploiement**

### **Build Automatique**
```json
"build": "prisma generate && tsc"
```

### **Démarrage Production**
```json
"start:prod": "npm run build && npm run prisma:deploy && npm start"
```

### **Déploiement Complet**
```json
"deploy:railway": "npm run build && npm run prisma:deploy && npm run seed"
```

## 🔍 **Vérification du Déploiement**

### **1. Health Check**
```
GET https://votre-app.railway.app/health
```

### **2. API Documentation**
```
GET https://votre-app.railway.app/api-docs
```

### **3. Test Login**
```bash
curl -X POST https://votre-app.railway.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@rdcassay.africa","password":"admin123"}'
```

## 🛡️ **Sécurité Production**

### **Variables Sensibles**
- ✅ **JWT_SECRET** : Clé unique et complexe
- ✅ **JWT_REFRESH_SECRET** : Clé différente du JWT_SECRET
- ✅ **DATABASE_URL** : Déjà sécurisée par Railway
- ✅ **CORS_ORIGIN** : Domaine spécifique du frontend

### **Recommandations**
- 🔐 **Changez** toutes les clés par défaut
- 🌐 **Configurez** CORS pour votre domaine frontend
- 📊 **Activez** les logs pour monitoring
- 🔄 **Testez** tous les endpoints après déploiement

## 🔗 **Connexion Frontend**

Une fois déployé, mettez à jour votre frontend :

```env
# .env.local (frontend)
NEXT_PUBLIC_API_URL=https://votre-app.railway.app/api/v1
```

## 📊 **Monitoring**

### **Logs Railway**
```bash
railway logs
```

### **Métriques**
- **CPU/RAM** usage dans Railway Dashboard
- **Database** connections
- **API** response times

## 🚨 **Dépannage**

### **Erreurs Communes**

1. **Build Failed**
   ```bash
   npm run build
   # Vérifier les erreurs TypeScript
   ```

2. **Database Connection**
   ```bash
   npm run prisma:generate
   npm run prisma:deploy
   ```

3. **Port Issues**
   ```env
   PORT=5000  # Railway assigne automatiquement
   ```

## ✅ **Checklist Déploiement**

- [ ] ✅ Base de données Railway configurée
- [ ] ✅ Variables d'environnement définies
- [ ] ✅ Scripts de build/start configurés
- [ ] ✅ CORS configuré pour frontend
- [ ] ✅ JWT secrets changés
- [ ] ✅ Health check fonctionnel
- [ ] ✅ API documentation accessible
- [ ] ✅ Tests d'authentification passés
- [ ] ✅ Frontend connecté à la nouvelle URL

## 🎉 **Succès !**

Votre **RDC Assay Pro Backend** sera déployé sur Railway avec :

- 🗄️ **Base de données PostgreSQL** Railway
- 🔐 **Authentification JWT** sécurisée
- 📊 **API complète** documentée
- 🚀 **Performance** optimisée
- 🛡️ **Sécurité** production

**🇨🇩 Prêt à servir l'industrie minière de la RDC !**
