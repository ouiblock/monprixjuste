# Système d'Estimation Hybride Immobilière — Spécification Technique

**Projet** : MonPrixJuste  
**Version** : 2.0  
**Date** : Février 2026  
**Auteur** : Équipe MonPrixJuste

---

## 1. Vue d'ensemble

### 1.1 Concept

Le moteur d'estimation hybride calcule un **prix juste** pour un bien immobilier en croisant **3 familles de sources** pondérées par l'utilisateur, puis en appliquant des **ajustements qualitatifs** avec triple garde-fou anti-cumul.

### 1.2 Philosophie

- **Pas de boîte noire** : l'utilisateur voit chaque étape du calcul, chaque source, chaque ajustement et son impact en €.
- **Hybride** : on combine données transactionnelles réelles (DVF), annonces du marché (Leboncoin, SeLoger…) et estimations professionnelles (Meilleurs Agents, agences locales).
- **Pondérable** : l'utilisateur choisit le poids de chaque famille de sources selon sa confiance.
- **Plafonné** : les ajustements qualitatifs ne peuvent jamais dépasser ±30% du prix de base.

### 1.3 Stack technique actuelle

| Couche | Technologie |
|---|---|
| Types / Contrats | TypeScript (fichier isolé, 0 dépendance) |
| Moteur de calcul | TypeScript pur (1 fichier, 0 dépendance externe) |
| State management | Zustand + persist (localStorage) |
| UI | React 18 + Tailwind CSS |

> **Point clé pour l'intégration** : le moteur de calcul (`calculatePrice.ts`) est une **fonction pure** sans aucune dépendance framework. Il prend 4 objets en entrée et retourne 1 objet en sortie. Il peut être extrait tel quel dans n'importe quel environnement TypeScript/JavaScript, ou porté en Python/PHP/Go sans difficulté.

---

## 2. Architecture des données

### 2.1 Données du bien (`PropertyData`)

```typescript
interface PropertyData {
  estimationName: string;     // Nom libre pour retrouver l'estimation
  date: string;               // Date de l'estimation (ISO)
  typeBien: 'Appartement' | 'Maison' | 'Terrain' | 'Immeuble' | 'Local commercial' | 'Parking/Garage';
  adresse: string;
  ville: string;
  codePostal: string;
  surface: number;            // m² — OBLIGATOIRE pour le calcul au m²
  pieces: number;
  chambres: number;
  etage: number;
  ascenseur: boolean;
  anneeConstruction: number;
}
```

### 2.2 Sources de prix (`Sources`)

Le système accepte **3 familles de sources**, chacune avec sa propre structure :

#### a) Transactions DVF (Demandes de Valeurs Foncières)

```typescript
interface DVFTransaction {
  id: string;
  prix: number;         // Prix de vente réel
  surface: number;      // Surface du comparable (m²)
  date: string;         // Date de la transaction
  adresse: string;      // Adresse du comparable
  commentaire: string;
}
```

> **Rôle** : données les plus fiables car ce sont des ventes réelles enregistrées par l'État. Pondération recommandée : **50%**.

#### b) Annonces du marché

```typescript
interface AnnoncePAP {
  id: string;
  prix: number;         // Prix affiché
  surface: number;      // Surface annoncée (m²)
  pieces: number;
  lien: string;         // URL de l'annonce
  source: string;       // "PAP", "Leboncoin", "SeLoger"
  commentaire: string;
}
```

> **Rôle** : reflet du marché actuel (prix demandés, pas vendus). Pondération recommandée : **30%**.

#### c) Estimations professionnelles

```typescript
interface EstimationAgence {
  id: string;
  prixMin: number;      // Fourchette basse
  prixMax: number;      // Fourchette haute
  source: string;       // "Meilleurs Agents", "Yanport", "Agence locale"
  date: string;
  commentaire: string;
}
```

> **Rôle** : avis d'experts ou outils en ligne. Pondération recommandée : **20%**.

### 2.3 Pondérations (`Ponderations`)

```typescript
interface Ponderations {
  dvf: number;          // % (défaut: 50)
  annonces: number;     // % (défaut: 30)
  estimations: number;  // % (défaut: 20)
}
```

L'utilisateur ajuste librement ces curseurs. Le total est **normalisé automatiquement** (pas besoin d'être exactement 100).

### 2.4 Ajustements qualitatifs (`Ajustements`)

```typescript
interface Ajustements {
  // État & caractéristiques (valeurs à choix)
  etatGeneral: 'Neuf / récent' | 'Bon' | 'À rafraîchir' | 'À rénover';
  dpe: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'Non renseigné';
  exposition: 'Nord' | 'Sud' | 'Est' | 'Ouest' | 'Double' | 'Triple';

  // Équipements (booléens)
  balcon: boolean;
  terrasse: boolean;
  jardin: boolean;
  parking: boolean;
  cave: boolean;

  // Vue & environnement (booléens)
  vueDegagee: boolean;
  calme: boolean;
  proximiteTransports: boolean;
  proximiteCommerce: boolean;

  // Autres (booléens)
  travauxRecents: boolean;
  coproprieteEntretenue: boolean;
}
```

---

## 3. Algorithme de calcul — Étape par étape

### Étape 1 : Calcul des moyennes par catégorie

Chaque famille de sources produit une **moyenne normalisée au m²** :

```
DVF_avg      = moyenne(prix/surface pour chaque DVF) × surface_du_bien
Annonces_avg = moyenne(prix/surface pour chaque annonce) × surface_du_bien
Estim_avg    = moyenne((prixMin + prixMax) / 2 pour chaque estimation)
```

> Les DVF et annonces sont ramenées au m² puis re-multipliées par la surface du bien pour comparer des pommes avec des pommes.

### Étape 2 : Prix de base pondéré

```
total_pond = dvf% + annonces% + estimations%

normDVF      = dvf% / total_pond
normAnnonces = annonces% / total_pond
normEstim    = estimations% / total_pond

contrib_DVF      = DVF_avg × normDVF        (si DVF non vide, sinon 0)
contrib_Annonces = Annonces_avg × normAnnonces  (si annonces non vides, sinon 0)
contrib_Estim    = Estim_avg × normEstim    (si estimations non vides, sinon 0)

// Pondération effective (exclut les catégories vides)
effectivePond = Σ(normX si catégorie X non vide)

PRIX_BASE = (contrib_DVF + contrib_Annonces + contrib_Estim) / effectivePond
```

> **Gestion des catégories vides** : si l'utilisateur n'a pas de DVF mais a des annonces et estimations, le poids DVF est redistribué proportionnellement aux autres catégories.

### Étape 3 : Ajustements qualitatifs (méthode ADDITIVE)

Chaque ajustement est calculé en **% du prix de base** et les pourcentages sont **sommés** (pas multipliés) :

#### Barème des ajustements

| Catégorie | Ajustement | Impact |
|---|---|---|
| **État général** | Neuf / récent | +10% |
| | Bon | 0% |
| | À rafraîchir | -8% |
| | À rénover | -20% |
| **DPE** | A | +12% |
| | B | +8% |
| | C | +4% |
| | D | 0% |
| | E | -5% |
| | F | -12% |
| | G | -20% |
| **Exposition** | Triple | +10% |
| | Sud | +8% |
| | Double | +6% |
| | Est | +3% |
| | Ouest | +2% |
| | Nord | -3% |
| **Équipements** | Jardin | +8% |
| | Terrasse | +6% |
| | Parking | +5% |
| | Balcon | +4% |
| | Cave | +2% |
| **Environnement** | Vue dégagée | +5% |
| | Proximité transports | +4% |
| | Calme | +3% |
| | Proximité commerces | +3% |
| **Autres** | Travaux récents | +7% |
| | Copropriété entretenue | +3% |

```
total_ajustement_% = Σ(tous les ajustements actifs en %)
```

### Étape 4 : Triple garde-fou anti-cumul

#### Garde-fou 1 — Coefficient de pondération dégressif

Quand l'utilisateur active beaucoup d'ajustements, un coefficient réduit l'impact global :

| Nombre d'ajustements | Coefficient appliqué |
|---|---|
| ≤ 3 | 100% |
| 4 | 95% |
| 5 | 90% |
| 6 | 85% |
| 7 | 75% |
| 8 | 70% |
| 9 | 65% |
| 10 | 60% |
| 11+ | 45% |

```
ajustement_pondere_% = total_ajustement_% × coefficient
```

#### Garde-fou 2 — Plafond dur ±30%

```
ajustement_final_% = clamp(ajustement_pondere_%, -30%, +30%)
```

> Même si l'utilisateur coche tout et obtient +82% brut, après pondération (45%) = +36.9%, puis plafond = **+30% max**.

#### Garde-fou 3 — Transparence

Chaque garde-fou déclenché est **affiché à l'utilisateur** comme une ligne d'ajustement supplémentaire (ex: "⚖️ Pondération appliquée" ou "🔒 Plafond ±30%").

### Étape 5 : Prix final

```
PRIX_FINAL = PRIX_BASE × (1 + ajustement_final_% / 100)
PRIX_M2    = PRIX_FINAL / surface
```

### Étape 6 : Fourchette de prix

La largeur de la fourchette dépend de la **qualité des données** :

| Condition | Fourchette |
|---|---|
| ≥ 5 sources ET coefficient de variation < 15% | ±8% |
| 3-4 sources | ±12% |
| < 3 sources | ±15% |
| Coefficient de variation > 15% | ±12% |

```
fourchette_basse = PRIX_FINAL × (1 - fourchette%)
fourchette_haute = PRIX_FINAL × (1 + fourchette%)
```

### Étape 7 : Score de confiance (0-100)

```
score = 40 (base)
      + min(nb_sources × 6, 30)          // max +30 pour les sources
      + bonus_variation                    // +15 si CV<5%, +10 si CV<10%, +5 si CV<15%
      + min(nb_ajustements × 2, 10)       // max +10 pour les ajustements
```

| Score | Interprétation |
|---|---|
| 80-100 | Estimation très fiable |
| 60-79 | Estimation fiable |
| 40-59 | Estimation indicative |
| < 40 | Estimation peu fiable |

### Étape 8 : Positionnement marché

Compare le prix final au prix de base pour qualifier l'estimation :

| Ratio prix_final / prix_base | Position |
|---|---|
| < 0.90 | Très compétitif |
| 0.90 - 0.97 | Compétitif |
| 0.97 - 1.03 | Dans la moyenne |
| 1.03 - 1.10 | Au-dessus |
| > 1.10 | Élevé |

---

## 4. Objet de sortie (`CalculationResult`)

```typescript
interface CalculationResult {
  prixBase: number;           // Prix pondéré avant ajustements (€)
  prixFinal: number;          // Prix final après ajustements (€)
  prixM2: number;             // Prix au m²

  fourchetteBasse: number;    // Borne basse (€)
  fourchetteHaute: number;    // Borne haute (€)

  scoreConfiance: number;     // 0-100

  detailsSources: {
    dvf:         { moyenne: number; poids: number; contribution: number };
    annonces:    { moyenne: number; poids: number; contribution: number };
    estimations: { moyenne: number; poids: number; contribution: number };
  };

  ajustementsAppliques: {
    nom: string;              // Ex: "Balcon", "DPE: A", "⚖️ Pondération..."
    valeur: number;           // % d'impact
    impact: number;           // Montant en €
  }[];

  positionMarche: 'Très compétitif' | 'Compétitif' | 'Dans la moyenne' | 'Au-dessus' | 'Élevé';
}
```

---

## 5. Signature de la fonction principale

```typescript
function calculateImmoPrice(
  propertyData: PropertyData,
  sources: Sources,
  ponderations: Ponderations,
  ajustements: Ajustements
): CalculationResult
```

**C'est une fonction pure** : pas d'effet de bord, pas de state, pas de dépendance externe. Elle peut être appelée côté serveur (Node.js, Deno, Bun) ou côté client.

---

## 6. Exemple concret

### Entrée

```json
{
  "propertyData": {
    "surface": 65,
    "typeBien": "Appartement",
    "ville": "Lyon",
    "codePostal": "69003"
  },
  "sources": {
    "dvf": [
      { "prix": 260000, "surface": 62 },
      { "prix": 275000, "surface": 68 }
    ],
    "annonces": [
      { "prix": 285000, "surface": 64 },
      { "prix": 270000, "surface": 66 }
    ],
    "estimations": [
      { "prixMin": 255000, "prixMax": 290000 }
    ]
  },
  "ponderations": { "dvf": 50, "annonces": 30, "estimations": 20 },
  "ajustements": {
    "etatGeneral": "Bon",
    "dpe": "C",
    "exposition": "Sud",
    "balcon": true,
    "parking": true,
    "vueDegagee": true,
    "calme": false,
    "terrasse": false,
    "jardin": false,
    "cave": false,
    "proximiteTransports": false,
    "proximiteCommerce": false,
    "travauxRecents": false,
    "coproprieteEntretenue": false
  }
}
```

### Calcul pas à pas

```
1. Moyennes au m² :
   DVF: (260000/62 + 275000/68) / 2 = 4 118 €/m² → × 65 = 267 670 €
   Annonces: (285000/64 + 270000/66) / 2 = 4 274 €/m² → × 65 = 277 810 €
   Estimations: (255000 + 290000) / 2 = 272 500 €

2. Prix de base pondéré :
   DVF (50%) : 267 670 × 0.50 = 133 835
   Annonces (30%) : 277 810 × 0.30 = 83 343
   Estimations (20%) : 272 500 × 0.20 = 54 500
   Prix base = 133 835 + 83 343 + 54 500 = 271 678 €

3. Ajustements (additifs sur prix base) :
   DPE C     : +4%  → +10 867 €
   Expo Sud  : +8%  → +21 734 €
   Balcon    : +4%  → +10 867 €
   Parking   : +5%  → +13 584 €
   Vue       : +5%  → +13 584 €
   Total brut : +26%

4. Garde-fous :
   5 ajustements → coefficient 90%
   26% × 0.90 = 23.4% → sous le plafond de 30% ✓

5. Prix final :
   271 678 × 1.234 = 335 231 €
   Prix/m² = 5 157 €/m²
   Fourchette (±8%) : 308 413 € — 362 049 €
```

---

## 7. Guide d'intégration pour Mon Prix Juste

### Option A — Intégration directe TypeScript

Copier les 2 fichiers :
- `types/index.ts` (contrats de données)
- `calculation/calculatePrice.ts` (moteur de calcul)

Aucune dépendance npm requise. Appeler `calculateImmoPrice()` avec les 4 paramètres.

### Option B — Exposition en API REST

```
POST /api/estimation/immobilier
Content-Type: application/json

Body: {
  propertyData: PropertyData,
  sources: Sources,
  ponderations: Ponderations,
  ajustements: Ajustements
}

Response: CalculationResult
```

### Option C — Portage dans un autre langage

Le moteur est une suite d'opérations arithmétiques simples (moyennes, sommes, clamp). Aucune dépendance à des bibliothèques ML ou statistiques avancées. Le portage en Python, PHP, Go ou Java est trivial.

### Points d'attention pour l'intégration

1. **Validation des entrées** : vérifier qu'au moins 1 source est fournie, que les surfaces sont > 0, que les prix sont positifs.
2. **Persistance** : le store Zustand actuel utilise `localStorage`. Pour une plateforme multi-utilisateurs, remplacer par une base de données (PostgreSQL recommandé).
3. **Historique** : l'interface `ImmoEstimationExport` est prévue pour sérialiser une estimation complète avec ses métadonnées.
4. **Extensibilité** : pour ajouter un nouveau type d'ajustement, il suffit d'ajouter une entrée dans le tableau `equipements`, `environnement` ou `autres` dans `calculatePrice.ts` et le champ correspondant dans `Ajustements`.

---

## 8. Arborescence des fichiers à extraire

```
packages/immobilier/src/
├── types/
│   └── index.ts              ← Contrats de données (170 lignes)
├── calculation/
│   └── calculatePrice.ts     ← Moteur de calcul pur (329 lignes)
├── stores/
│   └── immoStore.ts          ← State management Zustand (207 lignes)
└── components/
    └── ImmoEstimationApp.tsx  ← UI React (optionnel pour l'intégration)
```

**Minimum requis pour l'intégration** : `types/index.ts` + `calculation/calculatePrice.ts` (499 lignes au total, 0 dépendance externe).

---

## 9. Diagramme de flux

```
┌─────────────────────────────────────────────────────────────────┐
│                        ENTRÉES UTILISATEUR                       │
├──────────────┬──────────────┬──────────────┬────────────────────┤
│ PropertyData │   Sources    │ Pondérations │    Ajustements     │
│  (le bien)   │ (DVF+Ann+Est)│  (% curseurs)│  (état, DPE, etc.) │
└──────┬───────┴──────┬───────┴──────┬───────┴────────┬───────────┘
       │              │              │                │
       │              ▼              │                │
       │   ┌──────────────────┐     │                │
       │   │ Moyenne par      │     │                │
       │   │ catégorie (€/m²) │     │                │
       │   └────────┬─────────┘     │                │
       │            │               │                │
       │            ▼               ▼                │
       │   ┌────────────────────────────┐            │
       │   │   Prix de base pondéré     │            │
       │   │   (normalisation auto)     │            │
       │   └────────────┬───────────────┘            │
       │                │                            │
       │                ▼                            ▼
       │   ┌─────────────────────────────────────────────┐
       │   │   Ajustements ADDITIFS (% du prix base)     │
       │   │   → Σ des % individuels                     │
       │   └────────────────────┬────────────────────────┘
       │                        │
       │                        ▼
       │   ┌─────────────────────────────────────────────┐
       │   │   Garde-fou 1 : Coeff. dégressif            │
       │   │   (≤3 → 100%, 4-6 → 95-85%, 7+ → 75-45%)  │
       │   └────────────────────┬────────────────────────┘
       │                        │
       │                        ▼
       │   ┌─────────────────────────────────────────────┐
       │   │   Garde-fou 2 : Plafond dur ±30%            │
       │   └────────────────────┬────────────────────────┘
       │                        │
       │                        ▼
       │   ┌─────────────────────────────────────────────┐
       ├──▶│   PRIX FINAL = base × (1 + ajust_final%)   │
       │   └────────────────────┬────────────────────────┘
       │                        │
       ▼                        ▼
┌──────────────┐  ┌──────────────────────────────────────┐
│ Fourchette   │  │         CalculationResult             │
│ (±8% à ±15%) │  │  prix, fourchette, score, détails... │
└──────────────┘  └──────────────────────────────────────┘
```
