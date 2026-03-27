# SousCover — Tableau de bord souscripteur

Interface souscripteur pour la gestion des dossiers de couverture d'assurance facultative. Construit avec **Next.js 15**, **Chakra UI** et **TypeScript**.

---

## Aperçu

| Page         | Description                                                                     |
| ------------ | ------------------------------------------------------------------------------- |
| `/dashboard` | Tableau de bord principal avec liste, filtres, tri et recherche                 |
| `/new`       | Formulaire de soumission d'une nouvelle demande avec score estimé en temps réel |

---

## Stack technique

| Outil                 | Version | Rôle                         |
| --------------------- | ------- | ---------------------------- |
| Next.js               | 15      | Framework React (App Router) |
| React                 | 19      | UI                           |
| TypeScript            | 5.7     | Typage statique              |
| Chakra UI             | 2       | Composants & design system   |
| React Hook Form       | 7       | Gestion des formulaires      |
| Zod                   | 3       | Validation des schémas       |
| date-fns              | 4       | Formatage des dates          |
| Vitest                | 2       | Tests unitaires              |
| React Testing Library | 16      | Tests composants             |

---

## Installation

```bash
# Cloner le dépôt
git clone https://github.com/guilfred/test-sunu.git
cd test-sunu

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000).

---

## Scripts disponibles

```bash
npm run dev        # Serveur de développement (Next.js)
npm run build      # Build de production
npm run start      # Serveur de production
npm run lint       # Lint ESLint\
```

---

## Structure du projet

```
souscription-dashboard/
├── app/
│   ├── api/
│   │   └── dossiers/
│   │       └── route.ts          # Route API mock (GET + POST /api/dossiers)
│   ├── dashboard/
│   │   └── page.tsx              # Page tableau de bord
│   ├── new/
│   │   └── page.tsx              # Page nouvelle demande
│   ├── layout.tsx                # Layout racine avec polices & providers
│   └── page.tsx                  # Redirect → /dossiers
│
├── components/
│   ├── layout/
│   │   └── SideBar.tsx          # Sidebar + navigation principale
│   ├── ui/
│   │   ├── StatusBadge.tsx       # Badge de statut coloré
│   │   └── ScoreBadge.tsx        # Badge de score avec code couleur
│   ├── providers.tsx             # ChakraProvider + color mode manager
│   ├── DossierList.tsx           # Liste des dossiers avec filtres, tri, recherche
│   ├── DossierDetail.tsx         # Panneau latéral de détail (Drawer)
│   └── CoverageForm.tsx          # Formulaire de demande avec prévisualisation score
│
├── lib/
│   ├── labels.ts                 # Labels & color schemes pour les enums
│   ├── mockData.ts               # Données mock + fonctions d'accès simulées
│   ├── scoreCalculator.ts        # Calcul du score de risque (côté client)
│   └── theme.ts                  # Thème Chakra UI personnalisé
│
├── types/
│   └── index.ts                  # Types TypeScript du domaine
│
└── __tests__/
    ├── DossierList.test.tsx       # Tests composant (Vitest + RTL)
    └── scoreCalculator.test.ts   # Tests unitaires calcul du score
```

---

## Fonctionnalités implémentées

### Exercice F1 — Tableau de bord des dossiers

- **Liste des dossiers** avec référence, type, date de dépôt, statut et score
- **Code couleur du score** : vert ≥ 60, orange 40–59, rouge < 40
- **Filtre par statut** : EN_ATTENTE, EN_COURS, ACCEPTE, REFUSE
- **Panneau de détail** : drawer latéral au clic sur une ligne
- **État de chargement** : squelettes animés pendant le fetch
- **Gestion des erreurs** : message d'erreur affiché en cas d'échec

Bonus implémentés :

- **Tri** par date de dépôt ou par score (asc/desc)
- **Recherche** par référence (filtre en temps réel)
- **Tests unitaires** sur `DossierList` (Vitest + RTL)

### Exercice F2 — Formulaire de demande

- **Formulaire complet** : type, montant, durée, antécédent, description
- **Validation Zod** : messages d'erreur explicites sous chaque champ
- **Score estimé en temps réel** : recalculé à chaque frappe, avant soumission
- **Tableau de règles** affiché en sidebar du formulaire
- **Appel POST simulé** vers `/api/dossiers` avec message de confirmation
- **État de succès** : affichage de la référence générée après soumission

---

## Données mock

Les données sont définies dans `lib/mockData.ts`. Les fonctions `fetchDossiers`, `fetchDossierById` et `postDossier` simulent une latence réseau pour rendre le développement proche des conditions réelles.

```typescript
const mockDossiers: Dossier[] = [
  {
    id: "d001",
    reference: "DOS-2025-001",
    type: "COUVERTURE_FACULTATIVE",
    dateDePot: "2025-05-10",
    statut: "EN_COURS",
    score: 72,
  },
  {
    id: "d002",
    reference: "DOS-2025-002",
    type: "PLACEMENT_REAS",
    dateDePot: "2025-05-12",
    statut: "ACCEPTE",
    score: 85,
  },
  {
    id: "d003",
    reference: "DOS-2025-003",
    type: "COTATION",
    dateDePot: "2025-05-14",
    statut: "REFUSE",
    score: 28,
  },
];
```

---

## Tests

```bash
npm run test
```

Couverture :

- `DossierList.test.tsx` — rendu initial, filtres, recherche, état vide, état d'erreur, compteur
- `scoreCalculator.test.ts` — toutes les règles de calcul, bornes min/max

---

## Choix de conception

**Architecture** : Next.js App Router avec composants serveur pour les pages et composants client (`"use client"`) uniquement pour les parties interactives (liste, formulaire, drawer). Cela permet de garder les métadonnées et l'hydratation côté serveur par défaut.

**Validation** : Zod + React Hook Form avec `@hookform/resolvers` pour une validation déclarative et des messages d'erreur accessibles (`aria-describedby` géré par Chakra FormControl).

**API mock** : Les données sont en dur dans `lib/mockData.ts` avec une latence simulée. La route Next.js `/api/dossiers` est également disponible pour simuler un vrai appel réseau depuis le formulaire.

**Accessibilité** : Les composants Chakra UI gèrent, la navigation clavier et les états de focus. Les messages d'erreur de formulaire sont associés à leurs champs via `FormControl/FormErrorMessage`.
