#!/bin/bash

echo "🔧 ChatSeller Dashboard - Script de Réparation Automatique"
echo "=================================================="

# Vérifier qu'on est dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: package.json non trouvé. Assurez-vous d'être dans le répertoire chatseller-dashboard"
    exit 1
fi

echo "📂 Répertoire de travail: $(pwd)"

# 1. Nettoyer les caches et modules
echo "🧹 Nettoyage des caches..."
rm -rf node_modules
rm -rf .nuxt
rm -rf .output
rm -rf dist
rm -f package-lock.json

# 2. Installer les dépendances manquantes
echo "📦 Installation des dépendances manquantes..."
npm install @vueuse/core@^10.11.1 @vueuse/nuxt@^10.11.1 --save

# 3. Réinstaller toutes les dépendances
echo "🔄 Réinstallation de toutes les dépendances..."
npm install

# 4. Préparer Nuxt
echo "⚙️ Préparation de Nuxt..."
npm run postinstall

# 5. Créer le fichier .env si il n'existe pas
if [ ! -f ".env" ]; then
    echo "📝 Création du fichier .env..."
    cat << EOF > .env
# ChatSeller Dashboard - Variables d'environnement
JWT_SECRET=dev-secret-key-chatseller-dashboard-$(openssl rand -hex 16)
API_BASE_URL=https://chatseller-api-production.up.railway.app
APP_URL=http://localhost:3000

# Supabase (à configurer)
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-key
EOF
    echo "✅ Fichier .env créé. N'oubliez pas de configurer vos clés Supabase!"
fi

# 6. Créer des répertoires manquants si nécessaire
echo "📁 Vérification de la structure des répertoires..."
mkdir -p types
mkdir -p composables
mkdir -p stores
mkdir -p utils
mkdir -p server/api
mkdir -p assets/css

# 7. Créer un fichier types de base si manquant
if [ ! -f "types/index.ts" ]; then
    echo "📄 Création du fichier types de base..."
    cat << EOF > types/index.ts
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
fi

echo ""
echo "✅ Réparation terminée!"
echo ""
echo "🚀 Pour démarrer le serveur, utilisez:"
echo "   npm run dev -- --port 3000"
echo ""
echo "📋 Vérifications à faire:"
echo "   1. Configurez vos clés Supabase dans le fichier .env"
echo "   2. Vérifiez que l'API est accessible: https://chatseller-api-production.up.railway.app"
echo "   3. Testez la connexion sur http://localhost:3000"
echo ""
echo "🐛 En cas de problème:"
echo "   - Vérifiez les logs dans la console"
echo "   - Consultez la documentation: https://docs.chatseller.app"
echo "   - Contactez le support si nécessaire"
echo ""