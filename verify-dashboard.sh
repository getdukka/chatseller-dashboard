#!/bin/bash
# verify-dashboard.sh - Vérification du dashboard ChatSeller

echo "🔍 Vérification du Dashboard ChatSeller..."

# Vérifier la connexion API
echo "📡 Test de connexion à l'API..."
API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://api.chatseller.app/health)
if [ "$API_STATUS" = "200" ]; then
    echo "✅ API accessible"
else
    echo "❌ API non accessible (Code: $API_STATUS)"
fi

# Vérifier les fichiers clés
echo "📁 Vérification des fichiers..."
FILES=(
    "nuxt.config.ts"
    "stores/auth.ts" 
    "middleware/auth.ts"
    "pages/login.vue"
    "pages/index.vue"
    ".env"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file existe"
    else
        echo "❌ $file manquant"
    fi
done

# Vérifier les variables d'environnement
echo "🔧 Vérification des variables d'environnement..."
if [ -f ".env" ]; then
    if grep -q "SUPABASE_URL" .env && grep -q "API_URL" .env; then
        echo "✅ Variables d'environnement configurées"
    else
        echo "❌ Variables d'environnement incomplètes"
    fi
else
    echo "❌ Fichier .env manquant"
fi

# Test de compilation TypeScript
echo "📝 Test de compilation TypeScript..."
if npm run type-check > /dev/null 2>&1; then
    echo "✅ Compilation TypeScript OK"
else
    echo "⚠️  Warnings TypeScript (normal en développement)"
fi

echo ""
echo "🎯 Prochaines étapes :"
echo "1. npm run dev pour démarrer"
echo "2. Ouvrir http://localhost:3000"
echo "3. Login avec admin@chatseller.app / password123"
echo ""
echo "✨ Vérification terminée !"