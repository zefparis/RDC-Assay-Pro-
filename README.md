# RDC Assay Pro

Professional mineral assay and certification platform for the Democratic Republic of Congo.

## 🚀 **Ready for Railway Deployment!**

This full-stack application is configured for deployment on Railway with PostgreSQL database.cratique du Congo (RDC). Cette application offre des services complets d'échantillonnage, d'analyse en laboratoire, de certification numérique et de traçabilité pour l'industrie minière.

## 🌟 Fonctionnalités

### 🔬 Services d'Analyse
- **Échantillonnage contrôlé** : Grab, channel, auger, core drilling
- **Analyses laboratoire** : XRF, AAS, ICP-OES/ICP-MS, LOI, humidité, granulométrie
- **Certification digitale** : Rapports signés, hashés avec QR code
- **Traçabilité complète** : Suivi en temps réel du processus

### 🌐 Interface Bilingue
- Support complet français/anglais
- Détection automatique de la langue
- Commutation facile entre les langues

### 📱 Interface Moderne
- Design responsive et professionnel
- Animations fluides avec Framer Motion
- Composants UI réutilisables
- Thème personnalisable

### 🔐 Sécurité & Conformité
- Authentification sécurisée
- Hachage SHA-256 des rapports
- Conformité ISO
- Traçabilité QR code

## 🚀 Installation

### Prérequis
- Node.js 18.0.0 ou supérieur
- npm ou yarn
- Git

### Installation locale

1. **Cloner le projet**
```bash
git clone https://github.com/votre-org/rdc-assay-pro.git
cd rdc-assay-pro
```

2. **Installer les dépendances**
```bash
npm install
# ou
yarn install
```

3. **Configuration de l'environnement**
```bash
cp .env.example .env.local
```

Modifiez le fichier `.env.local` avec vos configurations :
```env
NEXT_PUBLIC_API_URL=https://api.rdcassay.africa
NEXT_PUBLIC_APP_VERSION=1.0.0
```

4. **Lancer le serveur de développement**
```bash
npm run dev
# ou
yarn dev
```

5. **Ouvrir dans le navigateur**
Visitez [http://localhost:3000](http://localhost:3000)

## 🏗️ Architecture

### Structure du projet
```
src/
├── app/                    # App Router (Next.js 13+)
│   ├── globals.css        # Styles globaux
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Page d'accueil
├── components/            # Composants React
│   ├── ui/               # Composants UI de base
│   ├── layout/           # Composants de mise en page
│   ├── sections/         # Sections de page
│   └── modals/           # Modales
├── hooks/                # Hooks personnalisés
├── lib/                  # Utilitaires et configuration
├── types/                # Types TypeScript
└── utils/                # Fonctions utilitaires
```

### Technologies utilisées
- **Framework** : Next.js 14 avec App Router
- **Language** : TypeScript
- **Styling** : Tailwind CSS
- **Animations** : Framer Motion
- **Icônes** : Lucide React
- **Formulaires** : React Hook Form + Zod
- **État** : React hooks natifs
- **Graphiques** : Recharts

## 🎨 Système de Design

### Palette de couleurs
- **Primary** : Bleu (branding principal)
- **Secondary** : Gris (texte et éléments neutres)
- **Success** : Vert (succès, validation)
- **Warning** : Orange (avertissements)
- **Danger** : Rouge (erreurs, actions destructives)

### Composants UI
- `Button` : Boutons avec variantes et états
- `Card` : Conteneurs avec ombres et bordures
- `Input` : Champs de saisie avec validation
- `Select` : Listes déroulantes
- `Badge` : Étiquettes de statut

## 🌍 Internationalisation

L'application supporte le français et l'anglais :

```typescript
import { useTranslation } from '@/hooks/useTranslation';

function MyComponent() {
  const { t, locale, changeLocale } = useTranslation();
  
  return (
    <div>
      <h1>{t.hero.title}</h1>
      <button onClick={() => changeLocale('en')}>
        Switch to English
      </button>
    </div>
  );
}
```

## 🔌 API Integration

### Mock API (Développement)
L'application utilise actuellement une API mock pour le développement :

```typescript
import { api } from '@/lib/api';

// Rechercher des échantillons
const samples = await api.searchSamples('RC-0001');

// Créer un échantillon
const newSample = await api.createSample({
  mineral: 'Cu',
  site: 'Kolwezi',
  unit: '%',
  mass: 5.2
});
```

### API Réelle (Production)
Pour connecter une vraie API, modifiez `NEXT_PUBLIC_API_URL` dans `.env.local` :

```env
NEXT_PUBLIC_API_URL=https://votre-api.com
```

## 📊 Fonctionnalités Principales

### 1. Suivi d'Échantillons
- Recherche par ID ou site minier
- Timeline de progression
- Statuts en temps réel
- QR code de traçabilité

### 2. Soumission d'Échantillons
- Formulaire validé avec Zod
- Types de minerais multiples
- Unités de mesure flexibles
- Notes et métadonnées

### 3. Rapports et Certificats
- Téléchargement PDF
- Hachage de sécurité
- Filtrage et recherche
- Conformité ISO

### 4. Tableau de Bord
- Statistiques en temps réel
- Graphiques analytiques
- Métriques de performance
- Vue d'ensemble des opérations

## 🚀 Déploiement

### Vercel (Recommandé)
```bash
npm run build
npx vercel --prod
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Build statique
```bash
npm run build
npm run export
```

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests e2e
npm run test:e2e

# Coverage
npm run test:coverage
```

## 🔧 Scripts Disponibles

```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run start        # Serveur de production
npm run lint         # Linting ESLint
npm run type-check   # Vérification TypeScript
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Équipe

- **Développement** : Équipe RDC Assay
- **Design** : UI/UX Team
- **Backend** : API Development Team

## 📞 Support

- **Email** : hello@rdcassay.africa
- **Documentation** : [docs.rdcassay.africa](https://docs.rdcassay.africa)
- **Issues** : [GitHub Issues](https://github.com/votre-org/rdc-assay-pro/issues)

## 🗺️ Roadmap

- [ ] Authentification complète avec rôles
- [ ] API backend complète
- [ ] Module de facturation
- [ ] Application mobile
- [ ] Intégration IoT pour équipements
- [ ] Rapports avancés et analytics
- [ ] Multi-tenant support
- [ ] Intégration blockchain pour traçabilité

---

**RDC Assay Pro** - Certifier la vérité du minerai en RDC 🇨🇩
