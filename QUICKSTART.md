# 🚀 Guide de Démarrage Rapide - RDC Assay Pro

## Installation en 5 minutes

### 1. Prérequis
Assurez-vous d'avoir installé :
- **Node.js 18+** : [Télécharger ici](https://nodejs.org/)
- **Git** : [Télécharger ici](https://git-scm.com/)

### 2. Installation
```bash
# Cloner le projet
git clone https://github.com/votre-org/rdc-assay-pro.git
cd rdc-assay-pro

# Installer les dépendances
npm install

# Copier la configuration
cp .env.example .env.local

# Lancer le serveur de développement
npm run dev
```

### 3. Accès à l'application
Ouvrez votre navigateur sur [http://localhost:3000](http://localhost:3000)

## 🎯 Fonctionnalités Principales

### ✅ Démo Authentification
- **Email** : `admin@rdcassay.africa`
- **Mot de passe** : `admin123`

### 🔬 Test des Fonctionnalités

#### 1. Suivi d'Échantillons
- Recherchez `RC-0001` ou `Kolwezi`
- Cliquez sur "Voir le statut" pour voir la timeline

#### 2. Soumission d'Échantillon
- Remplissez le formulaire de soumission
- Testez avec différents minerais (Cu, Co, Li, Au, etc.)

#### 3. Rapports & Certificats
- Consultez les rapports disponibles
- Testez le filtrage par ID, site ou minerai

#### 4. Interface Bilingue
- Cliquez sur le bouton langue (FR/EN) dans l'en-tête
- L'interface bascule automatiquement

## 🛠️ Personnalisation Rapide

### Changer les Couleurs
Modifiez `tailwind.config.js` :
```javascript
colors: {
  primary: {
    600: '#VOTRE_COULEUR', // Couleur principale
  }
}
```

### Ajouter un Nouveau Minerai
Dans `src/lib/constants.ts` :
```typescript
export const MINERAL_TYPES = {
  // ... existants
  Ag: { label: 'Silver', color: '#C0C0C0' }, // Argent
};
```

### Modifier les Traductions
Dans `src/lib/i18n.ts`, ajoutez vos traductions :
```typescript
hero: {
  title: 'Votre nouveau titre',
  // ...
}
```

## 🌐 Configuration API

### API Mock (Développement)
L'application utilise une API simulée par défaut.

### API Réelle (Production)
1. Modifiez `.env.local` :
```env
NEXT_PUBLIC_API_URL=https://votre-api.com
```

2. L'application se connectera automatiquement à votre API.

## 📱 Responsive Design

L'application est entièrement responsive :
- **Mobile** : Navigation hamburger, composants adaptés
- **Tablet** : Grilles optimisées
- **Desktop** : Interface complète

## 🎨 Thème et Styles

### Classes Utilitaires Personnalisées
```css
.glass          /* Effet verre */
.gradient-text  /* Texte dégradé */
.card-hover     /* Effet hover pour cartes */
.skeleton       /* Animation de chargement */
```

### Animations Framer Motion
Toutes les sections utilisent des animations fluides :
- Fade in au scroll
- Hover effects
- Transitions de page

## 🔧 Scripts Utiles

```bash
# Développement
npm run dev          # Serveur de dev avec hot reload

# Production
npm run build        # Build optimisé
npm run start        # Serveur de production

# Qualité de code
npm run lint         # Vérification ESLint
npm run type-check   # Vérification TypeScript

# Utilitaires
npm run clean        # Nettoyer les fichiers de build
```

## 📊 Structure des Données

### Échantillon
```typescript
interface Sample {
  id: string;           // RC-0001
  mineral: MineralType; // Cu, Co, Li, etc.
  site: string;         // Kolwezi
  status: SampleStatus; // Received, Analyzing, etc.
  grade: number | null; // 3.12
  unit: Unit;          // %, g/t, ppm
  // ... autres propriétés
}
```

### Rapport
```typescript
interface Report {
  id: string;      // RC-0001
  grade: number;   // 3.12
  unit: Unit;      // %
  hash: string;    // SHA-256
  certified: boolean;
  // ... autres propriétés
}
```

## 🚀 Déploiement Rapide

### Vercel (Recommandé)
```bash
npm i -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
# Glissez le dossier .next vers Netlify
```

### Docker
```bash
docker build -t rdc-assay-pro .
docker run -p 3000:3000 rdc-assay-pro
```

## 🐛 Résolution de Problèmes

### Erreur de Port
```bash
# Si le port 3000 est occupé
npm run dev -- -p 3001
```

### Erreur de Dépendances
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
```

### Erreur TypeScript
```bash
# Vérifier les types
npm run type-check
```

## 📞 Support Rapide

- **Issues** : [GitHub Issues](https://github.com/votre-org/rdc-assay-pro/issues)
- **Email** : hello@rdcassay.africa
- **Documentation** : [docs.rdcassay.africa](https://docs.rdcassay.africa)

## 🎯 Prochaines Étapes

1. **Personnalisez** les couleurs et le branding
2. **Connectez** votre API backend
3. **Ajoutez** vos propres fonctionnalités
4. **Déployez** en production
5. **Configurez** l'authentification réelle

---

**Temps total d'installation : ~5 minutes** ⚡

Vous êtes maintenant prêt à utiliser RDC Assay Pro ! 🎉
