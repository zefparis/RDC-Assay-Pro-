# 🔧 CHANGELOG - Path Aliases Fix

## 🚨 **Problème Initial**
```
Error: Cannot find module '@/config/environment'
Require stack: /app/backend/dist/server.js
```

## 🔍 **Cause Racine**
Le problème venait de l'utilisation de `tsconfig-paths/register` en production :

1. **TypeScript** compile `@/config/environment` → `require("@/config/environment")` dans `dist/server.js`
2. **Node.js** ne comprend pas les alias `@/` au runtime
3. **`tsconfig-paths/register`** ne fonctionne pas correctement sur Railway en production

## ✅ **Solution Appliquée : tsc-alias**

### **Avant (Problématique)**
```javascript
// dist/server.js (après tsc)
const { config } = require("@/config/environment"); // ❌ ERREUR
```

### **Après (Solution)**
```javascript
// dist/server.js (après tsc + tsc-alias)
const { config } = require("./config/environment"); // ✅ OK
```

## 🔧 **Changements Effectués**

### 1. **package.json**
- ✅ Ajouté `zod` et `tsc-alias` aux dépendances
- ✅ Script build : `tsc -p tsconfig.build.json && tsc-alias -p tsconfig.build.json`
- ✅ Script start : `node dist/server.js` (sans tsconfig-paths)
- ✅ Type : `"commonjs"` explicite

### 2. **tsconfig.build.json** (nouveau)
- ✅ Configuration dédiée au build production
- ✅ `baseUrl: "./src"` et `paths: {"@/*": ["*"]}`
- ✅ `outDir: "./dist"` et `rootDir: "./src"`

### 3. **tsconfig.json**
- ✅ Configuration pour développement avec `ts-node`
- ✅ Mêmes paths aliases pour cohérence
- ✅ `ts-node.require: ["tsconfig-paths/register"]` pour dev uniquement

### 4. **src/config/environment.ts**
- ✅ Réécriture avec `zod` pour validation stricte
- ✅ Import `import * as dotenv` (CommonJS compatible)
- ✅ Export `env` et `config` pour compatibilité

### 5. **Dockerfile**
- ✅ Installation des dev dependencies pour le build
- ✅ Copie de `tsconfig.build.json`
- ✅ Exécution de `npm run build` (avec tsc-alias)

## 🎯 **Processus de Build**

```bash
# 1. TypeScript compile src/ → dist/ avec alias non résolus
tsc -p tsconfig.build.json

# 2. tsc-alias remplace les alias par des chemins relatifs
tsc-alias -p tsconfig.build.json

# 3. Résultat final dans dist/
node dist/server.js  # ✅ Fonctionne sans runtime magic
```

## 📋 **Variables Railway Requises**

```env
DATABASE_URL=postgresql://postgres:xxx@shortline.proxy.rlwy.net:18727/railway
NODE_ENV=production
PORT=5000
JWT_SECRET=your-production-jwt-secret
JWT_REFRESH_SECRET=your-production-refresh-secret
CORS_ORIGIN=*
```

## 🎉 **Avantages de la Solution**

- ✅ **Zéro runtime magic** - pas de `tsconfig-paths/register` en prod
- ✅ **Build déterministe** - les alias sont résolus au build time
- ✅ **Performance** - pas de résolution d'alias au runtime
- ✅ **Compatibilité** - fonctionne sur tous les environnements Node.js
- ✅ **Validation** - Zod valide les variables d'environnement

## 🔍 **Vérification Post-Build**

Après `npm run build`, vérifiez que `dist/server.js` contient :
```javascript
// ✅ Chemins relatifs résolus
const { config } = require("./config/environment");
const { logger } = require("./utils/logger");
// etc.
```

**🚀 Cette solution élimine définitivement les problèmes de path aliases en production !**
