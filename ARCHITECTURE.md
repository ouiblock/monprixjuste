# 🏗️ Architecture MonPrixJuste - Monorepo Multi-Vertical

## 📐 Vue d'Ensemble

MonPrixJuste est une plateforme d'estimation hybride multi-verticale construite avec une architecture monorepo moderne utilisant Turborepo et pnpm workspaces.

### Principes Architecturaux

1. **Séparation des Préoccupations** : Chaque vertical (immobilier, automobile) est un package indépendant
2. **Réutilisabilité** : Composants UI et logique métier partagés via packages dédiés
3. **Scalabilité** : Ajout facile de nouveaux verticaux sans impacter l'existant
4. **Type Safety** : TypeScript strict avec chemins d'alias configurés
5. **Performance** : Build optimisé avec Turborepo cache et parallel execution

## 📦 Structure des Packages

### `apps/web` - Application Principale

**Rôle** : Point d'entrée unique de la plateforme, gère le routing et l'orchestration des verticaux.

**Responsabilités** :
- Landing page avec sélection de vertical
- Layout global (header, footer)
- Routing entre verticaux
- Gestion du thème (dark mode)
- Configuration Tailwind globale

**Technologies** :
- Vite + React 18 + TypeScript
- React Router DOM
- Zustand (state global)
- Tailwind CSS v4

### `packages/ui` - Composants UI Partagés

**Rôle** : Bibliothèque de composants réutilisables avec design system cohérent.

**Composants Créés** :
- `Button` : Bouton avec variants (primary, secondary, outline, ghost)
- `Card` : Carte avec header, title, content
- `Input` : Input avec label, error, helper text

**À Ajouter** :
- `Select`, `Checkbox`, `Radio`
- `Modal`, `Drawer`, `Tooltip`
- `Badge`, `Alert`, `Toast`
- `Table`, `Pagination`
- `Spinner`, `Skeleton`

**Configuration** :
- Tailwind config de base (couleurs, thème)
- Exportable et extensible par les autres packages

### `packages/core` - Logique Métier Partagée

**Rôle** : Utilitaires, types et fonctions communes à tous les verticaux.

**Modules** :

#### Types (`src/types/`)
- `Vertical` : Type union des verticaux disponibles
- `UnifiedEstimation` : Format unifié pour l'historique
- `ConfidenceScoreParams` : Paramètres de calcul de confiance
- `PDFExportOptions` : Options d'export PDF

#### Utilitaires (`src/utils/`)
- **formatters.ts** : `formatEuro()`, `formatNumber()`, `formatDate()`
- **confidence.ts** : `calculateConfidenceScore()` - Algorithme générique
- **history.ts** : Gestion de l'historique unifié (LocalStorage)
  - `saveEstimation()`
  - `getHistory()`
  - `getHistoryByVertical()`
  - `deleteEstimation()`
  - `clearHistory()`

**Clé de Storage** : `monprixjuste_history` (max 20 items)

### `packages/immobilier` - Vertical Immobilier

**Statut** : ⚠️ À CRÉER (migration depuis code existant)

**Structure Prévue** :
```
packages/immobilier/
├── src/
│   ├── ImmobilierApp.tsx          # Point d'entrée
│   ├── components/                 # Composants spécifiques
│   │   ├── NewEstimation.tsx
│   │   ├── EstimationForm.tsx
│   │   ├── EstimationResults.tsx
│   │   ├── AddressAutocomplete.tsx
│   │   ├── ComparablesSection.tsx
│   │   ├── WeightsSection.tsx
│   │   ├── CharacteristicsSection.tsx
│   │   └── ResultsChart.tsx
│   ├── stores/                     # Zustand stores
│   │   └── useImmobilierStore.ts
│   ├── calculation/                # Logique de calcul
│   │   └── index.ts
│   ├── services/                   # Services API
│   │   └── addressService.ts
│   ├── types/                      # Types spécifiques
│   │   └── index.ts
│   ├── i18n/                       # Traductions
│   │   └── translations.ts
│   └── index.ts
└── package.json
```

**Fonctionnalités** :
- Sélection manuelle de comparables (4 sources : DVF, Particulier, Agence, Estimations)
- Pondération configurable des sources
- 17 caractéristiques qualitatives ajustables
- Autocomplétion d'adresse (API Géoplateforme + Geoapify fallback)
- Score de confiance détaillé
- Graphiques interactifs (Chart.js)
- Export PDF professionnel

### `packages/automobile` - Vertical Automobile

**Statut** : 🔜 À DÉVELOPPER

**Structure Prévue** : Similaire à immobilier

**Fonctionnalités Prévues** :
- Comparables depuis Leboncoin, La Centrale, AutoScout24
- Ajustements selon kilométrage, état, options
- Historique des prix et tendances
- Export PDF

## 🔄 Flux de Données

### 1. Navigation Utilisateur

```
Landing Page (/)
    ↓
Sélection Vertical
    ↓
/immobilier → ImmobilierApp
    ↓
Formulaire → Calcul → Résultats → Sauvegarde Historique
```

### 2. Historique Unifié

```typescript
// Sauvegarde depuis n'importe quel vertical
saveEstimation({
  id: string,
  vertical: 'immobilier' | 'automobile',
  name: string,
  date: string,
  finalPrice: number,
  metadata: {
    // Spécifique au vertical
    address?: string,
    surface?: number,
    brand?: string,
    model?: string,
  }
});

// Récupération filtrée
const immobilierHistory = getHistoryByVertical('immobilier');
const autoHistory = getHistoryByVertical('automobile');
```

### 3. Thème et Préférences

```typescript
// Store global (apps/web)
useAppStore: {
  darkMode: boolean,
  language: 'fr' | 'en',
  toggleDarkMode(),
  setLanguage()
}

// Persisté dans LocalStorage: 'monprixjuste-app-storage'
```

## 🎨 Design System

### Couleurs Primaires

```css
--color-primary: #f97316      /* Orange principal */
--color-primary-50: #fff7ed
--color-primary-100: #ffedd5
--color-primary-200: #fed7aa
--color-primary-300: #fdba74
--color-primary-400: #fb923c
--color-primary-500: #f97316
--color-primary-600: #ea580c
--color-primary-700: #c2410c
--color-primary-800: #9a3412
--color-primary-900: #7c2d12
```

### Composants UI - Variants

**Button** :
- `primary` : Gradient orange, texte blanc
- `secondary` : Gris, adaptatif dark mode
- `outline` : Bordure orange, fond transparent
- `ghost` : Transparent, hover subtil

**Sizes** : `sm`, `md`, `lg`

### Responsive Breakpoints

```javascript
sm: '640px',
md: '768px',
lg: '1024px',
xl: '1280px',
'2xl': '1536px'
```

## 🚀 Build & Déploiement

### Scripts Turborepo

```json
{
  "dev": "turbo run dev",        // Tous les packages en dev
  "build": "turbo run build",    // Build production
  "lint": "turbo run lint",      // Lint tous les packages
  "clean": "turbo run clean"     // Nettoie node_modules et dist
}
```

### Pipeline Turborepo

```json
{
  "build": {
    "dependsOn": ["^build"],     // Build dépendances d'abord
    "outputs": ["dist/**"]
  },
  "dev": {
    "cache": false,              // Pas de cache en dev
    "persistent": true           // Processus long
  }
}
```

### Optimisations

1. **Cache Turborepo** : Évite les rebuilds inutiles
2. **Parallel Execution** : Build simultané des packages indépendants
3. **Incremental Builds** : Seuls les packages modifiés sont rebuildés
4. **Shared Dependencies** : pnpm workspace optimise le stockage

## 📝 Conventions de Code

### Imports

```typescript
// Packages internes (alias configurés)
import { Button, Card } from '@monprixjuste/ui';
import { formatEuro, saveEstimation } from '@monprixjuste/core';
import { ImmobilierApp } from '@monprixjuste/immobilier';

// Relatifs pour le même package
import { useImmobilierStore } from './stores/useImmobilierStore';
```

### Nommage

- **Composants** : PascalCase (`Button.tsx`, `EstimationForm.tsx`)
- **Hooks** : camelCase avec préfixe `use` (`useImmobilierStore.ts`)
- **Utils** : camelCase (`formatEuro`, `calculateConfidence`)
- **Types** : PascalCase (`UnifiedEstimation`, `Vertical`)
- **Constantes** : UPPER_SNAKE_CASE (`MAX_HISTORY_ITEMS`)

### Structure des Composants

```typescript
// 1. Imports
import { useState } from 'react';
import { Button } from '@monprixjuste/ui';

// 2. Types/Interfaces
interface MyComponentProps {
  title: string;
  onSubmit: () => void;
}

// 3. Composant
export default function MyComponent({ title, onSubmit }: MyComponentProps) {
  // 3.1 Hooks
  const [state, setState] = useState();
  
  // 3.2 Handlers
  const handleClick = () => {};
  
  // 3.3 Render
  return <div>...</div>;
}
```

## 🧪 Tests (À Implémenter)

### Structure Prévue

```
packages/*/
├── src/
└── __tests__/
    ├── unit/
    ├── integration/
    └── e2e/
```

### Stack de Test Recommandée

- **Vitest** : Tests unitaires et intégration
- **Testing Library** : Tests composants React
- **Playwright** : Tests E2E
- **MSW** : Mock API calls

## 🔐 Sécurité & Bonnes Pratiques

1. **Pas de secrets en dur** : Utiliser `.env` pour les clés API
2. **Validation stricte** : Zod pour toutes les entrées utilisateur
3. **Type safety** : TypeScript strict mode
4. **Sanitization** : Nettoyer les données avant affichage
5. **CORS** : Configurer correctement pour les APIs externes

## 📊 Performance

### Métriques Cibles

- **First Contentful Paint** : < 1.5s
- **Time to Interactive** : < 3s
- **Bundle Size** : < 500KB (gzipped)
- **Lighthouse Score** : > 90

### Optimisations Appliquées

- Code splitting par vertical (React.lazy)
- Tree shaking (Vite)
- CSS purging (Tailwind)
- Image optimization
- Lazy loading des composants lourds

## 🔮 Roadmap Technique

### Phase 1 : Foundation (Actuelle)
- ✅ Architecture monorepo
- ✅ Packages core et UI
- ✅ Landing page et routing
- ⏳ Migration vertical immobilier

### Phase 2 : Immobilier Complet
- ⏳ Migration complète du code existant
- ⏳ Tests unitaires
- ⏳ Documentation composants
- ⏳ Optimisations performance

### Phase 3 : Automobile
- 📋 Création package automobile
- 📋 Composants spécifiques
- 📋 Intégration APIs auto
- 📋 Tests et validation

### Phase 4 : Améliorations
- 📋 PWA (offline support)
- 📋 Export Excel
- 📋 Partage d'estimation
- 📋 Analytics
- 📋 Backend API (optionnel)

## 🤝 Contribution

### Ajouter un Nouveau Vertical

1. Créer `packages/[vertical]/`
2. Copier la structure de `packages/immobilier/`
3. Implémenter `[Vertical]App.tsx`
4. Ajouter la route dans `apps/web/src/App.tsx`
5. Ajouter la carte dans `LandingPage.tsx`
6. Mettre à jour le type `Vertical` dans `@monprixjuste/core`

### Ajouter un Composant UI

1. Créer `packages/ui/src/components/[Component].tsx`
2. Exporter dans `packages/ui/src/index.ts`
3. Documenter les props et variants
4. Ajouter des exemples d'utilisation

---

**Architecture conçue et développée par Artean Digital Studio**
**https://www.arteandigital.fr**
