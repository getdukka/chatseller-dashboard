#!/bin/bash

# 🔧 SCRIPT DE CORRECTION COMPLÈTE - CHATSELLER DASHBOARD
echo "🔧 CORRECTION COMPLÈTE DES ERREURS TYPESCRIPT"
echo "=============================================="

# Vérification qu'on est dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ ERREUR: Exécutez ce script depuis la racine du projet"
    exit 1
fi

echo "📁 Répertoire: $(pwd)"
echo ""

# 1. Installation des dépendances manquantes
echo "📦 ÉTAPE 1: Installation des dépendances"
echo "========================================"

npm install date-fns
npm install --save-dev @types/node

echo "✅ Dépendances installées"
echo ""

# 2. Création du dossier types s'il n'existe pas
echo "📁 ÉTAPE 2: Création de la structure"
echo "===================================="

mkdir -p types

echo "✅ Structure créée"
echo ""

# 3. Sauvegarde des fichiers existants
echo "💾 ÉTAPE 3: Sauvegarde des fichiers"
echo "==================================="

mkdir -p backup/fix-$(date +%Y%m%d_%H%M%S)
cp nuxt.config.ts backup/fix-$(date +%Y%m%d_%H%M%S)/ 2>/dev/null || true
cp middleware/auth.ts backup/fix-$(date +%Y%m%d_%H%M%S)/ 2>/dev/null || true

echo "✅ Sauvegarde effectuée"
echo ""

# 4. Message pour les corrections manuelles
echo "📝 ÉTAPE 4: Corrections à appliquer manuellement"
echo "==============================================="
echo ""
echo "✅ REMPLACEZ les fichiers suivants avec le contenu des artifacts :"
echo ""
echo "1. 📄 pages/settings.vue"
echo "   → Utilisez l'artifact 'settings-vue-clean' (version mise à jour)"
echo ""
echo "2. 📄 nuxt.config.ts"
echo "   → Utilisez l'artifact 'nuxt-config-autoimports-fixed'"
echo ""
echo "3. 📄 middleware/auth.ts"
echo "   → Utilisez l'artifact 'middleware-auth-fixed'"
echo ""
echo "4. 📄 types/global.d.ts (NOUVEAU FICHIER)"
echo "   → Créez ce fichier avec l'artifact 'global-types'"
echo ""

# 5. Nettoyage après corrections
echo "🧹 ÉTAPE 5: Après avoir fait les corrections ci-dessus"
echo "====================================================="
echo ""
echo "Exécutez ces commandes :"
echo ""
echo "# Nettoyage complet"
echo "rm -rf .nuxt"
echo "rm -rf node_modules/.cache"
echo ""
echo "# Régénération des types"
echo "npm run postinstall"
echo ""
echo "# Redémarrage VS Code"
echo "# Cmd+Shift+P → 'Developer: Reload Window'"
echo ""
echo "# Test de démarrage"
echo "npm run dev"
echo ""

# 6. Test de la configuration actuelle
echo "🔍 ÉTAPE 6: Test de l'état actuel"
echo "================================="

echo "Vérification des modules Node.js..."
if node -e "console.log('Node.js fonctionne')" 2>/dev/null; then
    echo "✅ Node.js opérationnel"
else
    echo "❌ Problème avec Node.js"
fi

echo ""
echo "Vérification des dépendances critiques..."
DEPS=("@nuxt/image" "@nuxtjs/tailwindcss" "@pinia/nuxt" "date-fns")
for dep in "${DEPS[@]}"; do
    if npm list "$dep" > /dev/null 2>&1; then
        echo "✅ $dep installé"
    else
        echo "❌ $dep manquant"
    fi
done

echo ""
echo "🎯 RÉSUMÉ DES CORRECTIONS NÉCESSAIRES"
echo "===================================="
echo ""
echo "📋 PROBLÈMES IDENTIFIÉS :"
echo "• Template literal avec balises <script> → Corrigé avec concaténation"
echo "• Auto-imports Nuxt non fonctionnels → Configuration nuxt.config.ts"
echo "• Middleware sans imports → Imports explicites ajoutés"
echo "• Types globaux manquants → Fichier global.d.ts"
echo "• Dépendances manquantes → date-fns installé"
echo ""
echo "✅ APRÈS AVOIR APPLIQUÉ LES CORRECTIONS :"
echo "• Plus d'erreurs 'Cannot find name' dans VS Code"
echo "• Auto-imports Vue et Nuxt fonctionnels"
echo "• Template literal corrigé"
echo "• Types globaux déclarés"
echo "• Dashboard 100% opérationnel"
echo ""
echo "🚀 RÉSULTAT ATTENDU :"
echo "Un dashboard sans erreurs TypeScript qui démarre proprement"
echo ""
echo "📞 EN CAS DE PROBLÈME :"
echo "1. Vérifiez que tous les fichiers ont été remplacés"
echo "2. Redémarrez VS Code"
echo "3. Relancez 'npm run postinstall'"
echo "4. Testez avec 'npm run dev'"