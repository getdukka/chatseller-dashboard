#!/bin/bash

echo "🧹 ChatSeller - Nettoyage Complet"
echo "================================="

# 1. Supprimer les fichiers index.ts problématiques
echo "🗑️ Suppression des fichiers index.ts..."
rm -f composables/index.ts
rm -f types/index.ts

# 2. Nettoyer complètement
echo "🧼 Nettoyage des caches..."
rm -rf .nuxt
rm -rf .output
rm -rf node_modules/.cache

# 3. Corriger le CSS principal pour éviter les warnings
echo "🎨 Correction du CSS principal..."
cat << 'EOF' > assets/css/main.css
/* Import Tailwind CSS */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Styles de base */
body {
  font-family: 'Inter', system-ui, sans-serif;
  font-feature-settings: 'cv11', 'ss01';
}

/* Scrollbar styles */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Focus states */
*:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

/* Selection */
::selection {
  background: #dbeafe;
  color: #1e40af;
}

/* Utilitaires */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
EOF

# 4. Ajouter compatibilityDate si pas présent
echo "⚙️ Vérification de nuxt.config.ts..."
if ! grep -q "compatibilityDate" nuxt.config.ts; then
    echo "Ajout de compatibilityDate..."
    # Créer une sauvegarde
    cp nuxt.config.ts nuxt.config.ts.backup
    
    # Ajouter compatibilityDate au début
    sed '1a\
  compatibilityDate: '\''2025-07-24'\'',\
' nuxt.config.ts > nuxt.config.ts.tmp && mv nuxt.config.ts.tmp nuxt.config.ts
fi

# 5. Créer une page login simple si elle n'existe pas
if [ ! -f "pages/login.vue" ]; then
    echo "📄 Création d'une page login simple..."
    cat << 'EOF' > pages/login.vue
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <h2 class="text-3xl font-bold text-gray-900">ChatSeller</h2>
        <p class="mt-2 text-gray-600">Connexion à votre dashboard</p>
      </div>
      
      <div class="bg-white p-8 rounded-lg shadow">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input
              v-model="form.email"
              type="email"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="votre@email.com"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input
              v-model="form.password"
              type="password"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            >
          </div>
          
          <div v-if="error" class="text-red-600 text-sm">{{ error }}</div>
          
          <button
            type="submit"
            :disabled="loading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {{ loading ? 'Connexion...' : 'Se connecter' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: undefined, layout: false })

const { login } = useAuth()

const form = ref({ email: '', password: '' })
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const result = await login(form.value)
    if (!result.success) {
      error.value = result.error || 'Erreur de connexion'
    }
  } catch (err) {
    error.value = 'Erreur de connexion'
    console.error(err)
  } finally {
    loading.value = false
  }
}

useHead({ title: 'Connexion - ChatSeller' })
</script>
EOF
fi

# 6. Créer une page dashboard simple si elle n'existe pas
if [ ! -f "pages/index.vue" ]; then
    echo "📄 Création d'une page dashboard simple..."
    cat << 'EOF' > pages/index.vue
<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold">ChatSeller Dashboard</h1>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-700">{{ userName }}</span>
            <button
              @click="handleLogout"
              class="text-sm text-gray-500 hover:text-gray-700"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="border-4 border-dashed border-gray-200 rounded-lg p-8 text-center">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">🎉 Bienvenue sur ChatSeller !</h2>
          <p class="text-gray-600 mb-6">Votre dashboard est maintenant opérationnel.</p>
          
          <div class="space-x-4">
            <NuxtLink
              to="/settings"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Configurer mon agent
            </NuxtLink>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })

const { logout, userName } = useAuth()

const handleLogout = async () => {
  await logout()
}

useHead({ title: 'Dashboard - ChatSeller' })
</script>
EOF
fi

# 7. Régénérer les types
echo "🔄 Régénération des types..."
npm run postinstall

echo ""
echo "✅ Nettoyage terminé !"
echo ""
echo "🚀 Démarrez maintenant le serveur :"
echo "   npm run dev -- --port 3000"
echo ""
echo "📋 Ce qui a été fait :"
echo "   ✅ Suppression des fichiers index.ts conflictuels"
echo "   ✅ Nettoyage des caches"
echo "   ✅ Correction du CSS principal"
echo "   ✅ Ajout de compatibilityDate"
echo "   ✅ Création de pages de base"
echo "   ✅ Régénération des types"
echo ""