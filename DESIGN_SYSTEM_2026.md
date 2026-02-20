# 🎨 MonPrixJuste Design System 2026

## Vue d'Ensemble

Le design system MonPrixJuste 2026 incarne une identité visuelle moderne, chaleureuse et digne de confiance pour une startup proptech/auto française. L'approche est **humaine, énergique mais calme**, évitant le style corporate froid.

## 🎯 Philosophie de Design

- **Trustworthy** : Inspire confiance grâce à des couleurs équilibrées et une hiérarchie claire
- **Energetic** : Orange vif pour les CTA et accents, créant de l'engagement
- **Calm** : Neutrals doux (crème, gris chauds) pour ne pas fatiguer l'œil
- **Human-centered** : Typographie Inter lisible, espacements généreux, interactions fluides
- **Modern French Proptech** : Élégance sobre, pas de fioritures inutiles

## 🎨 Palette de Couleurs

### Couleurs Principales

#### Juste Orange (Primary)
**Usage** : CTA buttons, liens actifs, accents, éléments interactifs
```css
--juste-orange: #f97316
--juste-orange-dark: #ea580c (hover state)
```

#### Confiance Teal (Secondary)
**Usage** : Scores de confiance élevés, éléments positifs, badges de qualité
```css
--juste-teal: #0ea5e9
```

### Couleurs Sémantiques

#### Success (Vert Émeraude)
**Usage** : Jauges de succès, validations, indicateurs positifs
```css
--juste-emerald: #10b981
```

#### Warning (Jaune Ambre)
**Usage** : Alertes modérées, scores moyens
```css
--juste-amber: #f59e0b
```

#### Danger (Rouge Brique)
**Usage** : Erreurs, scores faibles, actions destructives
```css
--juste-brick: #ef4444
```

### Neutrals

#### Text Colors
```css
--juste-gray-dark: #374151   /* Texte principal */
--juste-gray-warm: #6b7280   /* Texte secondaire */
```

#### Backgrounds
```css
--juste-bg-cream: #fafaf9    /* Background light (off-white crème) */
--bg-cards: #ffffff          /* Cartes et surfaces */
--bg-dark: #1f2937          /* Dark mode background */
```

#### Borders
```css
--border-light: #d1d5db
--border-gray: #e5e7eb
```

## 🌈 Gradients

### CTA Gradient
**Usage** : Tous les boutons primaires, icônes de verticaux
```css
background: linear-gradient(135deg, #f97316, #ea580c);
```
**Classe Tailwind** : `bg-gradient-cta`

### Success Gradient
**Usage** : Jauges de score élevé, indicateurs de confiance
```css
background: linear-gradient(90deg, #10b981, #059669);
```
**Classe Tailwind** : `bg-gradient-success`

### Teal Gradient
**Usage** : Score boxes avec haute confiance
```css
background: linear-gradient(135deg, #0ea5e9, #0284c7);
```
**Classe Tailwind** : `bg-gradient-teal`

## 🔤 Typographie

### Police Principale : Inter

**Headings** : Inter 700-800 (Bold/Extrabold)
**Body** : Inter 400-500 (Regular/Medium)

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### Hiérarchie Typographique

```css
/* Hero Title */
h1: text-5xl md:text-6xl font-extrabold tracking-tight

/* Section Titles */
h2: text-2xl font-bold

/* Card Titles */
h3: text-xl font-bold

/* Body Text */
p: text-base font-medium (primary)
p: text-base font-normal (secondary)

/* Small Text */
small: text-sm font-medium
```

## 🧩 Composants UI

### Button

#### Variants

**Primary** (CTA)
```tsx
<Button variant="primary">
  Commencer l'estimation
</Button>
```
- Gradient orange (#f97316 → #ea580c)
- Texte blanc
- Shadow-md
- Hover: scale-[1.02] + shadow-lg
- Active: scale-[0.98]

**Secondary** (Trust)
```tsx
<Button variant="secondary">
  En savoir plus
</Button>
```
- Background teal (#0ea5e9)
- Texte blanc
- Shadow-md

**Outline**
```tsx
<Button variant="outline">
  Annuler
</Button>
```
- Border orange 2px
- Texte orange
- Hover: bg-primary-50

**Ghost**
```tsx
<Button variant="ghost">
  Retour
</Button>
```
- Transparent
- Texte gray-dark
- Hover: bg-gray-100

**Success**
```tsx
<Button variant="success">
  Valider
</Button>
```
- Gradient vert (#10b981 → #059669)
- Texte blanc

**Danger**
```tsx
<Button variant="danger">
  Supprimer
</Button>
```
- Background rouge (#ef4444)
- Texte blanc

#### Sizes
- `sm`: px-3 py-1.5 text-sm
- `md`: px-5 py-2.5 text-base (default)
- `lg`: px-7 py-3.5 text-lg

### Card

**Base Card**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Titre</CardTitle>
  </CardHeader>
  <CardContent>
    Contenu
  </CardContent>
</Card>
```

**Styles** :
- Background blanc (#ffffff)
- Border subtile (#e5e7eb)
- Shadow-sm
- Rounded-xl
- Padding 1.5rem

**Hover Card**
```tsx
<Card hover>
  Contenu interactif
</Card>
```
- Hover: shadow-md
- Hover: border-juste-orange/20
- Transition 300ms

### Input

```tsx
<Input
  label="Adresse"
  placeholder="123 rue..."
  error="Champ requis"
  helperText="Aide contextuelle"
/>
```

**Styles** :
- Border gray-300
- Focus: ring-2 ring-juste-orange
- Error: border-red-500
- Rounded-lg
- Padding px-4 py-2

## 🎭 Applications Spécifiques

### Vertical Selector Cards (Landing Page)

```tsx
<Card hover>
  <div className="w-20 h-20 bg-gradient-cta rounded-2xl shadow-lg">
    <Icon />
  </div>
  <h2 className="text-juste-gray-dark">Titre</h2>
  <p className="text-juste-gray-warm">Description</p>
  <span className="text-juste-orange font-semibold">CTA</span>
</Card>
```

**Comportement** :
- Hover: border-juste-orange/20
- Hover: shadow-md
- Icon scale-110 on hover
- CTA gap augmente on hover

### Results Cards

**Score Box (High Confidence)**
```tsx
<div className="bg-gradient-teal rounded-xl p-6 text-white">
  <h3>Score de confiance</h3>
  <p className="text-4xl font-bold">92/100</p>
</div>
```

**Price Card**
```tsx
<Card>
  <div className="bg-primary-50 rounded-lg p-4">
    <h3 className="text-juste-orange">Prix final</h3>
    <p className="text-3xl font-bold text-juste-gray-dark">
      {formatEuro(price)}
    </p>
  </div>
</Card>
```

### Jauges (Gauges)

**Success Gauge** (Score > 80)
```tsx
<div className="h-4 bg-gray-200 rounded-full overflow-hidden">
  <div 
    className="h-full bg-gradient-success"
    style={{ width: `${score}%` }}
  />
</div>
```

**Warning Gauge** (Score 50-80)
```tsx
<div className="h-4 bg-gray-200 rounded-full overflow-hidden">
  <div 
    className="h-full bg-gradient-to-r from-juste-amber to-juste-orange"
    style={{ width: `${score}%` }}
  />
</div>
```

**Danger Gauge** (Score < 50)
```tsx
<div className="h-4 bg-gray-200 rounded-full overflow-hidden">
  <div 
    className="h-full bg-juste-brick"
    style={{ width: `${score}%` }}
  />
</div>
```

## 🌓 Dark Mode

### Stratégie
- Utilisation de la classe `dark:` de Tailwind
- Inversion des neutrals
- Conservation des couleurs d'accent (orange, teal, etc.) pour la vivacité

### Mappings

```css
/* Light Mode → Dark Mode */
bg-juste-bg-cream → dark:bg-gray-900
bg-white → dark:bg-gray-800
text-juste-gray-dark → dark:text-white
text-juste-gray-warm → dark:text-gray-400
border-gray-200 → dark:border-gray-700

/* Accents restent identiques */
text-juste-orange → text-juste-orange (pas de dark:)
bg-gradient-cta → bg-gradient-cta (pas de dark:)
```

## 📐 Espacements & Layouts

### Container
```css
max-width: 1280px (max-w-7xl)
padding: 1rem (px-4)
```

### Sections
```css
padding-y: 4rem (py-16)
margin-bottom: 4rem (mb-16)
```

### Cards
```css
padding: 1.5rem (p-6)
gap: 2rem (gap-8)
```

### Buttons
```css
gap: 0.5rem (gap-2) /* icon + text */
```

## 🎬 Animations & Transitions

### Durées Standard
```css
transition-all duration-200  /* Buttons, hovers rapides */
transition-all duration-300  /* Cards, modals */
transition-transform         /* Scales, rotations */
```

### Effets Communs

**Button Hover**
```css
hover:scale-[1.02]
active:scale-[0.98]
hover:shadow-lg
```

**Card Hover**
```css
hover:shadow-md
hover:border-juste-orange/20
```

**Icon Hover**
```css
group-hover:scale-110
transition-transform
```

## 🎯 Cas d'Usage Spécifiques

### Landing Page Hero
```tsx
<h1 className="text-5xl md:text-6xl font-extrabold text-juste-gray-dark tracking-tight">
  MonPrixJuste
</h1>
<p className="text-2xl md:text-3xl text-juste-orange font-bold tracking-tight">
  Le prix juste, vraiment
</p>
<p className="text-lg text-juste-gray-warm font-medium">
  Estimations hybrides transparentes
</p>
```

### Header Logo
```tsx
<div className="w-10 h-10 bg-gradient-cta rounded-lg shadow-md">
  <span className="text-white font-bold text-sm">MPJ</span>
</div>
```

### Footer
```tsx
<footer className="border-t border-gray-200 py-8">
  <p className="text-sm text-juste-gray-warm">
    © 2026 MonPrixJuste
  </p>
  <a href="..." className="text-juste-orange hover:underline">
    Artean Digital Studio
  </a>
</footer>
```

## 📱 Responsive Design

### Breakpoints
```css
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

### Patterns Communs
```tsx
/* Typography */
text-5xl md:text-6xl

/* Grid */
grid md:grid-cols-2 lg:grid-cols-3

/* Spacing */
px-4 md:px-8 lg:px-12
```

## ✅ Checklist d'Implémentation

### Composants à Mettre à Jour
- [x] Button (6 variants)
- [x] Card (base + hover)
- [x] Input
- [ ] Select
- [ ] Checkbox
- [ ] Radio
- [ ] Modal
- [ ] Toast
- [ ] Badge
- [ ] Progress Bar / Gauge

### Pages à Mettre à Jour
- [x] Landing Page
- [x] Layout (Header + Footer)
- [ ] Page Immobilier (formulaire)
- [ ] Page Immobilier (résultats)
- [ ] Page Automobile (placeholder)
- [ ] Page Historique

### Éléments Spécifiques
- [ ] Score de confiance (gradient teal si > 80)
- [ ] Jauges de position marché (gradient success/warning/danger)
- [ ] Graphiques Chart.js (couleurs alignées)
- [ ] Export PDF (styles cohérents)

## 🔧 Configuration Tailwind

### Fichier : `packages/ui/tailwind.config.js`

```javascript
colors: {
  juste: {
    orange: '#f97316',
    'orange-dark': '#ea580c',
    teal: '#0ea5e9',
    emerald: '#10b981',
    amber: '#f59e0b',
    brick: '#ef4444',
    'gray-warm': '#6b7280',
    'gray-dark': '#374151',
    'bg-cream': '#fafaf9',
  },
  primary: { /* ... */ },
  secondary: { /* ... */ },
  success: { /* ... */ },
  warning: { /* ... */ },
  danger: { /* ... */ },
},
backgroundImage: {
  'gradient-cta': 'linear-gradient(135deg, #f97316, #ea580c)',
  'gradient-success': 'linear-gradient(90deg, #10b981, #059669)',
  'gradient-teal': 'linear-gradient(135deg, #0ea5e9, #0284c7)',
},
fontFamily: {
  sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
}
```

## 📚 Ressources

- **Police Inter** : Google Fonts (400, 500, 600, 700, 800)
- **Icônes** : Lucide React
- **Inspiration** : Airbnb, Stripe, Linear (modern SaaS)

---

**Design System créé pour MonPrixJuste**
**Par Artean Digital Studio - 2026**
**https://www.arteandigital.fr**
