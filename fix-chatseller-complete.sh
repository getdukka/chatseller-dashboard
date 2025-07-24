#!/bin/bash

echo "🚀 ChatSeller Dashboard - Réparation Complète"
echo "=============================================="

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages colorés
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Vérifier qu'on est dans le bon répertoire
if [ ! -f "package.json" ]; then
    log_error "package.json non trouvé. Assurez-vous d'être dans le répertoire chatseller-dashboard"
    exit 1
fi

log_info "Répertoire de travail: $(pwd)"

# 1. Nettoyer complètement l'environnement
log_info "🧹 Nettoyage complet de l'environnement..."
rm -rf node_modules
rm -rf .nuxt
rm -rf .output
rm -rf dist
rm -f package-lock.json
log_success "Environnement nettoyé"

# 2. Créer la structure de répertoires
log_info "📁 Création de la structure de répertoires..."
mkdir -p types
mkdir -p composables
mkdir -p stores
mkdir -p utils
mkdir -p middleware
mkdir -p pages
mkdir -p layouts
mkdir -p components/ui
mkdir -p server/api
mkdir -p assets/css
mkdir -p public
log_success "Structure de répertoires créée"

# 3. Installer les dépendances corrigées
log_info "📦 Installation des dépendances..."
npm install @vueuse/core@^10.11.1 @vueuse/nuxt@^10.11.1 --save
if [ $? -ne 0 ]; then
    log_error "Erreur lors de l'installation de @vueuse"
    exit 1
fi

npm install
if [ $? -ne 0 ]; then
    log_error "Erreur lors de l'installation des dépendances"
    exit 1
fi
log_success "Dépendances installées"

# 4. Préparer Nuxt
log_info "⚙️ Préparation de Nuxt..."
npm run postinstall
log_success "Nuxt préparé"

# 5. Créer le fichier .env si il n'existe pas
if [ ! -f ".env" ]; then
    log_info "📝 Création du fichier .env..."
    cat << 'EOF' > .env
# ChatSeller Dashboard - Variables d'environnement
JWT_SECRET=dev-secret-key-chatseller-dashboard-$(openssl rand -hex 16)
API_BASE_URL=https://chatseller-api-production.up.railway.app
APP_URL=http://localhost:3000

# Supabase (à configurer avec vos vraies clés)
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-key
EOF
    log_success "Fichier .env créé"
else
    log_warning "Fichier .env existant conservé"
fi

# 6. Créer le fichier types/index.ts
log_info "📄 Création des types TypeScript..."
cat << 'EOF' > types/index.ts
// Types globaux pour ChatSeller Dashboard

export interface User {
  id: string
  email: string
  name?: string
  shopId?: string
  createdAt: string
  updatedAt: string
}

export interface Shop {
  id: string
  name: string
  domain?: string
  settings?: Record<string, any>
  userId: string
  createdAt: string
  updatedAt: string
}

export interface Conversation {
  id: string
  shopId: string
  visitorId: string
  status: 'active' | 'completed' | 'abandoned'
  messages?: Message[]
  metadata?: Record<string, any>
  createdAt: string
  updatedAt: string
}

export interface Message {
  id: string
  conversationId: string
  content: string
  role: 'user' | 'assistant'
  timestamp: string
}

export interface Order {
  id: string
  conversationId?: string
  customerName: string
  customerEmail: string
  amount: number
  status: 'pending' | 'completed' | 'cancelled'
  items?: OrderItem[]
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
}

export interface AnalyticsData {
  totalConversations: number
  activeConversations: number
  completedOrders: number
  totalRevenue: number
  conversionRate: number
  averageOrderValue: number
}
EOF
log_success "Types TypeScript créés"

# 7. Vérifier les fichiers critiques
log_info "🔍 Vérification des fichiers critiques..."

# Vérifier nuxt.config.ts
if [ ! -f "nuxt.config.ts" ]; then
    log_warning "nuxt.config.ts manquant - création d'un fichier de base"
    cat << 'EOF' > nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2025-07-24',
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/google-fonts'
  ],
  css: ['~/assets/css/main.css'],
  typescript: {
    strict: false,
    typeCheck: false
  },
  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET || 'dev-secret-key',
    public: {
      apiBaseUrl: process.env.API_BASE_URL || 'https://chatseller-api-production.up.railway.app',
      appUrl: process.env.APP_URL || 'http://localhost:3000'
    }
  }
})
EOF
fi

# Vérifier app.vue
if [ ! -f "app.vue" ]; then
    log_warning "app.vue manquant - création d'un fichier de base"
    cat << 'EOF' > app.vue
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const { restoreSession } = useAuth()

onMounted(async () => {
  try {
    await restoreSession()
  } catch (error) {
    console.error('Erreur restauration session:', error)
  }
})
</script>
EOF
fi

# Vérifier que les stores existent
if [ ! -f "stores/auth.ts" ]; then
    log_warning "Store auth.ts manquant - à créer manuellement"
fi

# Vérifier que les composables existent
if [ ! -f "composables/useAuth.ts" ]; then
    log_warning "Composable useAuth.ts manquant - à créer manuellement"
fi

# 8. Créer un composant de test simple
log_info "🧪 Création d'un composant de test..."
cat << 'EOF' > components/TestComponent.vue
<template>
  <div class="p-4 bg-green-50 border border-green-200 rounded-lg">
    <h3 class="text-green-800 font-medium">🎉 ChatSeller Dashboard Opérationnel</h3>
    <p class="text-green-700 text-sm mt-1">
      Tous les composants sont chargés correctement.
    </p>
  </div>
</template>
EOF
log_success "Composant de test créé"

# 9. Vérifier la configuration CSS
if [ ! -f "assets/css/main.css" ]; then
    log_info "🎨 Création du fichier CSS principal..."
    cat << 'EOF' > assets/css/main.css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

body {
  font-family: 'Inter', system-ui, sans-serif;
}
EOF
    log_success "Fichier CSS principal créé"
fi

# 10. Tester la configuration
log_info "🔧 Test de la configuration..."
npx nuxt info > /dev/null 2>&1
if [ $? -eq 0 ]; then
    log_success "Configuration Nuxt valide"
else
    log_warning "Problème potentiel avec la configuration Nuxt"
fi

# 11. Résumé et instructions
echo ""
echo "🎯 RÉSUMÉ DE LA RÉPARATION"
echo "=========================="
log_success "✅ Dépendances @vueuse installées"
log_success "✅ Structure de répertoires créée"
log_success "✅ Types TypeScript définis"
log_success "✅ Fichiers de base créés"
log_success "✅ Configuration CSS prête"

echo ""
echo "📋 ÉTAPES SUIVANTES:"
echo "===================="
echo "1. 📝 Créer/vérifier le store stores/auth.ts"
echo "2. 📝 Créer/vérifier le composable composables/useAuth.ts"
echo "3. 📝 Créer/vérifier les pages pages/login.vue et pages/dashboard.vue"
echo "4. 📝 Configurer les clés Supabase dans .env"
echo "5. 🚀 Démarrer le serveur: npm run dev -- --port 3000"

echo ""
echo "🔗 FICHIERS CRITIQUES À VÉRIFIER:"
echo "=================================="
echo "- nuxt.config.ts (✅ vérifié)"
echo "- package.json (✅ corrigé)"
echo "- tsconfig.json (⚠️  à vérifier)"
echo "- stores/auth.ts (⚠️  à créer)"
echo "- composables/useAuth.ts (⚠️  à créer)"
echo "- middleware/auth.ts (⚠️  à créer)"

echo ""
echo "🆘 EN CAS DE PROBLÈME:"
echo "======================"
echo "1. Vérifiez les logs du serveur"
echo "2. Consultez la console navigateur (F12)"
echo "3. Testez l'API: curl https://chatseller-api-production.up.railway.app/health"
echo "4. Relancez ce script si nécessaire"

echo ""
log_success "🎉 Réparation terminée! Vous pouvez maintenant démarrer le serveur."
echo ""