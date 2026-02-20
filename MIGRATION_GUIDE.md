# 📦 Guide de Migration - MonPrixJuste Monorepo

Ce guide explique comment migrer le code immobilier existant vers la nouvelle architecture monorepo.

## 🏗️ Architecture Créée

```
monprixjuste/
├── apps/
│   └── web/                    # Application principale (✅ Créée)
│       ├── src/
│       │   ├── main.tsx
│       │   ├── App.tsx
│       │   ├── index.css
│       │   ├── store/
│       │   │   └── appStore.ts
│       │   ├── components/
│       │   │   └── Layout.tsx
│       │   └── pages/
│       │       ├── LandingPage.tsx
│       │       └── AutoPage.tsx
│       ├── index.html
│       ├── vite.config.ts
│       ├── tailwind.config.js
│       ├── postcss.config.js
│       └── package.json
│
├── packages/
│   ├── ui/                     # Composants partagés (✅ Créé)
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   └── Input.tsx
│   │   │   └── index.ts
│   │   ├── tailwind.config.js
│   │   └── package.json
│   │
│   ├── core/                   # Logique métier partagée (✅ Créé)
│   │   ├── src/
│   │   │   ├── types/
│   │   │   │   └── index.ts
│   │   │   ├── utils/
│   │   │   │   ├── formatters.ts
│   │   │   │   ├── confidence.ts
│   │   │   │   └── history.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   └── immobilier/             # À CRÉER - Migration du code existant
│       ├── src/
│       │   ├── components/     # Migrer depuis estimation-jpi-app/src/components
│       │   ├── hooks/
│       │   ├── stores/         # Migrer depuis estimation-jpi-app/src/store
│       │   ├── calculation/    # Migrer depuis estimation-jpi-app/src/utils/calculations.ts
│       │   ├── types/          # Migrer depuis estimation-jpi-app/src/types
│       │   └── index.ts
│       └── package.json
│
├── turbo.json                  # ✅ Créé
├── pnpm-workspace.yaml         # ✅ Créé
├── package.json                # ✅ Créé
└── tsconfig.json               # ✅ Créé
```

## 📋 Étapes de Migration

### 1. Installation des Dépendances

```bash
cd monprixjuste
pnpm install
```

### 2. Créer le Package Immobilier

```bash
mkdir -p packages/immobilier/src/{components,hooks,stores,calculation,types,services}
```

### 3. Créer package.json pour Immobilier

Créer `packages/immobilier/package.json`:

```json
{
  "name": "@monprixjuste/immobilier",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "dependencies": {
    "@monprixjuste/core": "workspace:*",
    "@monprixjuste/ui": "workspace:*",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-hook-form": "^7.71.1",
    "zod": "^4.3.6",
    "@hookform/resolvers": "^5.2.2",
    "zustand": "^5.0.10",
    "chart.js": "^4.5.1",
    "react-chartjs-2": "^5.3.1",
    "date-fns": "^4.1.0",
    "lucide-react": "^0.563.0"
  },
  "devDependencies": {
    "@types/react": "^19.2.5",
    "@types/react-dom": "^19.2.3",
    "typescript": "^5.9.3"
  }
}
```

### 4. Migrer les Fichiers

#### A. Types
Copier `estimation-jpi-app/src/types/index.ts` → `packages/immobilier/src/types/index.ts`

Ajuster les imports pour utiliser `@monprixjuste/core`:
```typescript
import { formatEuro, calculateConfidenceScore } from '@monprixjuste/core';
```

#### B. Composants
Copier tous les composants depuis `estimation-jpi-app/src/components/` → `packages/immobilier/src/components/`

Mettre à jour les imports:
```typescript
// Avant
import { Button, Card } from '../components/shared';

// Après
import { Button, Card } from '@monprixjuste/ui';
import { formatEuro } from '@monprixjuste/core';
```

#### C. Store Zustand
Copier `estimation-jpi-app/src/store/useStore.ts` → `packages/immobilier/src/stores/useImmobilierStore.ts`

Utiliser l'historique unifié:
```typescript
import { saveEstimation, getHistoryByVertical } from '@monprixjuste/core';
```

#### D. Logique de Calcul
Copier `estimation-jpi-app/src/utils/calculations.ts` → `packages/immobilier/src/calculation/index.ts`

#### E. Services
Copier `estimation-jpi-app/src/services/` → `packages/immobilier/src/services/`

#### F. Traductions
Copier `estimation-jpi-app/src/i18n/` → `packages/immobilier/src/i18n/`

### 5. Créer le Point d'Entrée Immobilier

Créer `packages/immobilier/src/index.ts`:

```typescript
export { default as ImmobilierApp } from './ImmobilierApp';
export * from './types';
export * from './stores/useImmobilierStore';
```

### 6. Créer le Composant Principal Immobilier

Créer `packages/immobilier/src/ImmobilierApp.tsx`:

```typescript
import { Routes, Route } from 'react-router-dom';
import NewEstimation from './components/NewEstimation';
import History from './components/History';
import About from './components/About';

export default function ImmobilierApp() {
  return (
    <Routes>
      <Route path="/" element={<NewEstimation />} />
      <Route path="/history" element={<History />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
}
```

### 7. Intégrer dans l'App Principale

Mettre à jour `apps/web/src/App.tsx`:

```typescript
import { ImmobilierApp } from '@monprixjuste/immobilier';

// Dans les routes:
<Route path="/immobilier/*" element={<ImmobilierApp />} />
```

### 8. Configurer Tailwind pour Immobilier

Créer `packages/immobilier/tailwind.config.js`:

```javascript
import baseConfig from '../ui/tailwind.config.js';

export default {
  ...baseConfig,
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
};
```

### 9. Mettre à Jour l'Historique

Dans les composants immobilier, utiliser l'historique unifié:

```typescript
import { saveEstimation, getHistoryByVertical } from '@monprixjuste/core';

// Lors de la sauvegarde
saveEstimation({
  id: Date.now().toString(),
  vertical: 'immobilier',
  name: formData.name,
  date: formData.date,
  finalPrice: result.finalPrice,
  metadata: {
    address: formData.address,
    surface: formData.surface,
  },
});

// Pour récupérer l'historique
const immobilierHistory = getHistoryByVertical('immobilier');
```

## 🚀 Lancer l'Application

```bash
# Depuis la racine du monorepo
pnpm dev

# Ou pour lancer uniquement l'app web
cd apps/web
pnpm dev
```

L'application sera accessible sur `http://localhost:5173`

## 📝 Checklist de Migration

- [ ] Installer les dépendances (`pnpm install`)
- [ ] Créer le package immobilier
- [ ] Migrer les types
- [ ] Migrer les composants
- [ ] Migrer les stores
- [ ] Migrer la logique de calcul
- [ ] Migrer les services (API adresse)
- [ ] Migrer les traductions
- [ ] Créer ImmobilierApp.tsx
- [ ] Intégrer dans apps/web
- [ ] Tester la navigation
- [ ] Tester l'historique unifié
- [ ] Tester le mode sombre
- [ ] Tester l'export PDF

## 🎯 Prochaines Étapes

1. **Compléter la migration immobilier** (priorité haute)
2. **Créer le package automobile** (structure similaire)
3. **Améliorer les composants UI partagés**
4. **Ajouter des tests unitaires**
5. **Configurer CI/CD avec Turborepo**
6. **Optimiser le build de production**

## 💡 Conseils

- Utilisez les alias TypeScript configurés (`@monprixjuste/*`)
- Partagez au maximum les composants UI
- Gardez la logique métier spécifique dans chaque vertical
- Utilisez l'historique unifié pour la cohérence
- Testez régulièrement avec `pnpm dev`

## 🐛 Dépannage

### Erreurs TypeScript
Si vous rencontrez des erreurs TypeScript, vérifiez:
1. Les imports utilisent bien les alias `@monprixjuste/*`
2. Les dépendances sont installées (`pnpm install`)
3. Le tsconfig.json est correct

### Erreurs Tailwind
Si les styles ne s'appliquent pas:
1. Vérifiez que le contenu est bien configuré dans tailwind.config.js
2. Redémarrez le serveur de développement
3. Vérifiez que `@import "tailwindcss"` est présent dans index.css

### Erreurs de Build
Si le build échoue:
1. Nettoyez les caches: `pnpm clean`
2. Réinstallez: `pnpm install`
3. Vérifiez turbo.json

## 📚 Ressources

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [React Router](https://reactrouter.com/)
- [Zustand](https://zustand-demo.pmnd.rs/)

---

**Développé avec ❤️ par Artean Digital Studio**
