# 🏠 MonPrixJuste - Plateforme Multi-Verticale

**Le prix juste, vraiment.**

Une plateforme d'estimation hybride transparente pour différents marchés. Contrairement aux estimateurs automatiques "boîte noire", vous gardez le contrôle total en sélectionnant manuellement les comparables pertinents.

**Développé avec ❤️ par [Artean Digital Studio](https://www.arteandigital.fr)**

## 🎯 Verticaux Disponibles

- **🏠 Immobilier** - Estimation de biens immobiliers (disponible)
- **🚗 Automobile** - Estimation de véhicules (bientôt disponible)

## 🏗️ Architecture Monorepo

Ce projet utilise une architecture monorepo avec Turborepo et pnpm workspaces pour une scalabilité maximale.

```
monprixjuste/
├── apps/
│   └── web/              # Application principale (Vite + React)
├── packages/
│   ├── ui/               # Composants UI partagés
│   ├── core/             # Logique métier partagée
│   └── immobilier/       # Vertical immobilier
└── turbo.json            # Configuration Turborepo
```

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 18+
- pnpm 9+

### Installation

```bash
# Installer pnpm si nécessaire
npm install -g pnpm

# Installer les dépendances
pnpm install

# Lancer en développement
pnpm dev
```

L'application sera accessible sur `http://localhost:5173`

## 📦 Packages

### `@monprixjuste/ui`
Composants UI réutilisables (Button, Card, Input, etc.) avec Tailwind CSS.

### `@monprixjuste/core`
Logique métier partagée, utilitaires, types communs.

### `@monprixjuste/immobilier`
Vertical d'estimation immobilière avec logique spécifique.

## 🛠️ Scripts Disponibles

```bash
pnpm dev        # Lancer tous les packages en mode développement
pnpm build      # Build de production
pnpm lint       # Linter tous les packages
pnpm clean      # Nettoyer tous les node_modules et builds
```

## 🎨 Stack Technique

- **Monorepo**: Turborepo + pnpm workspaces
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS (configuration partagée)
- **State**: Zustand
- **Forms**: React Hook Form + Zod
- **Charts**: Chart.js + react-chartjs-2
- **PDF**: jsPDF + html2canvas
- **Icons**: Lucide React
- **Dates**: date-fns

## 📱 Fonctionnalités

### Partagées
- ✅ Landing page avec sélection de vertical
- ✅ Mode sombre
- ✅ Historique unifié multi-vertical
- ✅ Export PDF professionnel
- ✅ Interface multilingue (FR/EN)

### Vertical Immobilier
- ✅ Sélection manuelle de comparables (4 sources)
- ✅ Pondération configurable
- ✅ 17 caractéristiques qualitatives
- ✅ Score de confiance détaillé
- ✅ Autocomplétion d'adresse (API Géoplateforme)

## 🔜 Roadmap

- [ ] Vertical Automobile
- [ ] Export Excel
- [ ] Partage d'estimation
- [ ] Mode hors-ligne (PWA)
- [ ] API backend (optionnel)

## 📄 Licence

© 2026 MonPrixJuste - Tous droits réservés

## 🤝 Support

Pour toute question ou suggestion, contactez [Artean Digital Studio](https://www.arteandigital.fr).

---

**Développé avec ❤️ pour des estimations justes et transparentes**
