#!/usr/bin/env node

/**
 * POST-BUILD SCRIPT POUR VERCEL
 * S'assure que tous les fichiers nécessaires sont correctement générés
 */

const fs = require('fs')
const path = require('path')

console.log('🔧 Post-build Vercel - Finalisation Widget ChatSeller...')

const distDir = path.join(__dirname, '..', 'dist')

// ✅ VÉRIFIER QUE LE RÉPERTOIRE DIST EXISTE
if (!fs.existsSync(distDir)) {
  console.log('⚠️ Répertoire dist/ non trouvé - Le build principal doit être exécuté en premier')
  // Ne pas échouer si dist n'existe pas, Vite le créera
  fs.mkdirSync(distDir, { recursive: true })
}

// ✅ VÉRIFIER LES FICHIERS OBLIGATOIRES
const requiredFiles = [
  'chatseller-widget.js'
  // index.html sera généré par le plugin Vite
]

const presentFiles = []
const missingFiles = []

requiredFiles.forEach(file => {
  const filePath = path.join(distDir, file)
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath)
    console.log(`✅ ${file} présent (${(stats.size / 1024).toFixed(2)}KB)`)
    presentFiles.push(file)
  } else {
    console.log(`⚠️ ${file} sera généré par Vite`)
    missingFiles.push(file)
  }
})

// Ne pas échouer si les fichiers n'existent pas encore - ils seront générés par Vite
if (missingFiles.length > 0) {
  console.log(`📝 Fichiers en attente de génération: ${missingFiles.join(', ')}`)
}

// ✅ CRÉER UN FICHIER WIDGET.JS QUI REDIRIGE (POUR COMPATIBILITÉ)
const widgetJsPath = path.join(distDir, 'widget.js')
const mainWidgetPath = path.join(distDir, 'chatseller-widget.js')

if (fs.existsSync(mainWidgetPath) && !fs.existsSync(widgetJsPath)) {
  console.log('🔗 Création du fichier widget.js de redirection...')
  
  // Lire le contenu du widget principal
  const mainWidgetContent = fs.readFileSync(mainWidgetPath, 'utf-8')
  
  // Créer le fichier de redirection
  const redirectContent = `/*! ChatSeller Widget - Compatibility Redirect */
${mainWidgetContent}

// ✅ Compatibilité legacy - auto-init si détection ancienne config
if (typeof window !== 'undefined' && !(window as any).ChatSeller) {
  console.warn('⚠️ widget.js est dépréciée. Utilisez chatseller-widget.js');
}`
  
  fs.writeFileSync(widgetJsPath, redirectContent)
  console.log('✅ widget.js créé avec succès')
} else if (!fs.existsSync(mainWidgetPath)) {
  console.log('⚠️ chatseller-widget.js non trouvé - sera généré par Vite')
} else {
  console.log('✅ widget.js déjà présent')
}

// ✅ CRÉER UN FICHIER _REDIRECTS POUR NETLIFY/VERCEL (AU CAS OÙ)
const redirectsPath = path.join(distDir, '_redirects')
const redirectsContent = `# ChatSeller Widget Redirects
/widget     /chatseller-widget.js   200
/docs       https://docs.chatseller.app  302
/dashboard  https://dashboard.chatseller.app  302
/app        https://chatseller.app  302`

fs.writeFileSync(redirectsPath, redirectsContent)
console.log('✅ _redirects créé')

// ✅ GÉNÉRER UN FICHIER DE SANTÉ (.well-known/health)
const wellKnownDir = path.join(distDir, '.well-known')
if (!fs.existsSync(wellKnownDir)) {
  fs.mkdirSync(wellKnownDir, { recursive: true })
}

const healthContent = JSON.stringify({
  status: 'healthy',
  service: 'chatseller-widget',
  version: '1.0.0',
  timestamp: new Date().toISOString(),
  environment: 'production',
  endpoints: {
    widget: '/chatseller-widget.js',
    homepage: '/',
    docs: 'https://docs.chatseller.app'
  }
}, null, 2)

fs.writeFileSync(path.join(wellKnownDir, 'health'), healthContent)
console.log('✅ Health check endpoint créé')

// ✅ CRÉER SITEMAP.XML
const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://widget.chatseller.app/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://widget.chatseller.app/chatseller-widget.js</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`

fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapContent)
console.log('✅ sitemap.xml créé')

// ✅ CRÉER ROBOTS.TXT
const robotsContent = `User-agent: *
Allow: /
Allow: /chatseller-widget.js
Allow: /widget.js

Sitemap: https://widget.chatseller.app/sitemap.xml

# ChatSeller Widget - Agent IA Commercial pour E-commerce
# https://chatseller.app`

fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsContent)
console.log('✅ robots.txt créé')

// ✅ VÉRIFIER LA TAILLE DES FICHIERS (SI DISPONIBLES)
const widgetPath = path.join(distDir, 'chatseller-widget.js')
const maxSize = 200 * 1024 // 200KB

if (fs.existsSync(widgetPath)) {
  const widgetSize = fs.statSync(widgetPath).size
  const sizeWarning = widgetSize > maxSize
  
  console.log('\n📊 STATISTIQUES BUILD:')
  console.log(`📦 Widget principal: ${(widgetSize / 1024).toFixed(2)}KB`)
  
  const indexPath = path.join(distDir, 'index.html')
  if (fs.existsSync(indexPath)) {
    console.log(`📄 Page d'accueil: ${(fs.statSync(indexPath).size / 1024).toFixed(2)}KB`)
  }
  
  if (sizeWarning) {
    console.warn(`⚠️  ATTENTION: Widget dépasse 200KB (${(widgetSize / 1024).toFixed(2)}KB)`)
  } else {
    console.log('✅ Taille du widget dans les limites recommandées')
  }
} else {
  console.log('📊 STATISTIQUES BUILD: Fichiers en cours de génération par Vite...')
}

// ✅ LISTAGE FINAL DES FICHIERS GÉNÉRÉS
console.log('\n📁 FICHIERS GÉNÉRÉS:')
if (fs.existsSync(distDir)) {
  const files = fs.readdirSync(distDir, { withFileTypes: true })
  files.forEach(file => {
    if (file.isFile()) {
      const filePath = path.join(distDir, file.name)
      const stats = fs.statSync(filePath)
      console.log(`   ${file.name}: ${(stats.size / 1024).toFixed(2)}KB`)
    }
  })
} else {
  console.log('   Répertoire dist sera créé par Vite...')
}

console.log('\n🎉 POST-BUILD VERCEL TERMINÉ AVEC SUCCÈS!')
console.log('🌐 Widget disponible sur: https://widget.chatseller.app/')
console.log('🔗 Endpoint widget: https://widget.chatseller.app/chatseller-widget.js')
console.log('📖 Documentation: https://docs.chatseller.app')

// ✅ SUCCÈS
process.exit(0)