# ChatSeller Dashboard

Dashboard marchand pour ChatSeller - Configuration et analytics de votre Agent IA Commercial.

## 🚀 Fonctionnalités

- **Aperçu des performances** - Métriques en temps réel de vos conversions
- **Gestion des conversations** - Suivi et supervision des chats clients
- **Gestion des commandes** - Export et traitement des commandes collectées
- **Configuration de l'agent IA** - Personnalisation de votre assistant virtuel
- **Base de connaissance** - Upload et gestion du contenu pour l'IA
- **Analytics avancées** - Rapports détaillés et insights

## 🛠 Installation

### Prérequis
- Node.js 18+
- npm ou yarn
- Accès à l'API ChatSeller

### Setup

```bash
# Clone du repository
git clone https://github.com/getdukka/chatseller-dashboard.git
cd chatseller-dashboard

# Installation des dépendances
npm install

# Configuration de l'environnement
cp .env.example .env
# Éditer .env avec vos valeurs

# Démarrage en développement
npm run dev
```

### Variables d'environnement

```env
# Supabase
SUPABASE_URL="your-supabase-url"
SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_KEY="your-service-key"

# API
API_URL="http://localhost:3001"

# Widget
WIDGET_URL="https://widget.chatseller.app"

# App
APP_URL="http://localhost:3000"
```

## 📁 Structure du projet

```
├── pages/
│   ├── index.vue           # Dashboard principal
│   ├── conversations.vue   # Gestion conversations
│   ├── orders.vue         # Gestion commandes
│   ├── knowledge.vue      # Base de connaissance
│   └── settings.vue       # Configuration
├── layouts/
│   └── default.vue        # Layout principal
├── components/
│   ├── charts/           # Composants graphiques
│   ├── forms/            # Formulaires
│   └── ui/               # Composants UI
├── composables/
│   ├── useAuth.ts        # Authentification
│   ├── useAPI.ts         # Appels API
│   └── useAnalytics.ts   # Analytics
├── assets/
│   └── css/
│       └── main.css      # Styles principaux
└── public/
    └── favicon.ico
```

## 🎨 Technologies utilisées

- **Nuxt.js 3** - Framework Vue.js full-stack
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling utility-first
- **Heroicons** - Icônes
- **Chart.js** - Graphiques et analytics
- **Supabase** - Backend et base de données
- **Vercel** - Déploiement et hosting

## 📊 Pages principales

### Dashboard (/)
- Vue d'ensemble des métriques
- Graphiques de performance
- Conversations récentes
- Actions rapides
- Code d'intégration

### Conversations (/conversations)
- Liste des conversations actives
- Historique des chats
- Filtres et recherche
- Takeover manuel (à venir)

### Commandes (/orders)
- Liste des commandes collectées
- Export CSV/Excel
- Statuts et suivi
- Intégrations e-commerce

### Base de connaissance (/knowledge)
- Upload de documents (PDF, CSV)
- Gestion du contenu IA
- Recherche sémantique
- Optimisation des réponses

### Configuration (/settings)
- Paramètres de l'agent IA
- Customisation du widget
- Intégrations
- Paramètres du compte

## 🔧 Développement

### Scripts disponibles

```bash
# Développement avec hot reload
npm run dev

# Build pour production
npm run build

# Génération statique
npm run generate

# Preview du build
npm run preview

# Vérification TypeScript
npm run type-check

# Linting
npm run lint
npm run lint:fix
```

### Ajout de nouvelles fonctionnalités

1. **Nouvelle page**
   ```bash
   # Créer pages/nouvelle-page.vue
   # La route sera automatiquement générée
   ```

2. **Nouveau composant**
   ```bash
   # Créer components/MonComposant.vue
   # Auto-import disponible dans les pages
   ```

3. **Nouveau composable**
   ```bash
   # Créer composables/useMonComposable.ts
   # Auto-import disponible partout
   ```

## 🚀 Déploiement

### Vercel (Recommandé)

1. Connecter le repository à Vercel
2. Configurer les variables d'environnement
3. Déploiement automatique sur push

### Variables d'environnement pour production

```env
SUPABASE_URL=your-production-supabase-url
SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_KEY=your-production-service-key
API_URL=https://api.chatseller.app
WIDGET_URL=https://widget.chatseller.app
APP_URL=https://dashboard.chatseller.app
```

## 🎛 Configuration

### Thèmes et personnalisation

Le dashboard utilise Tailwind CSS avec une palette de couleurs personnalisée :

```css
/* Couleurs principales */
primary: #ec4899 (rose ChatSeller)
gray: Palette standard Tailwind
success: #10b981 (vert)
warning: #f59e0b (orange)
error: #ef4444 (rouge)
```

### Responsive design

- **Mobile-first** - Optimisé pour tous les écrans
- **Breakpoints** - sm:640px, md:768px, lg:1024px, xl:1280px
- **Navigation adaptative** - Menu hamburger sur mobile

## 📱 Support mobile

Le dashboard est entièrement responsive et optimisé pour :
- **Smartphones** - Interface tactile adaptée
- **Tablettes** - Layout en colonnes ajusté
- **Desktop** - Pleine expérience multi-colonnes

## 🔒 Sécurité

- **Authentification** - Via Supabase Auth (à implémenter)
- **Row Level Security** - Isolation des données par boutique
- **HTTPS only** - En production
- **CORS** - Configuration sécurisée

## 📈 Analytics et métriques

Le dashboard affiche :
- **Conversations totales** - Nombre de chats initiés
- **Taux de conversion** - % de conversations → commandes
- **Revenus générés** - Montant total des commandes
- **Tendances** - Évolution dans le temps

## 🐛 Debugging

```bash
# Logs détaillés
DEBUG=nuxt:* npm run dev

# Vérification build
npm run build && npm run preview

# Analyse du bundle
npx nuxi analyze
```

## 📄 Licence

MIT License - voir le fichier LICENSE pour les détails.

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/amazing-feature`)
3. Commit les changements (`git commit -m 'Add amazing feature'`)
4. Push la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📞 Support

- **Documentation** : [docs.chatseller.app](https://docs.chatseller.app)
- **Support** : [support@chatseller.app](mailto:support@chatseller.app)
- **Discord** : [discord.gg/chatseller](https://discord.gg/chatseller)

---

Développé avec ❤️ par l'équipe Dukka
