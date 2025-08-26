#!/usr/bin/env node

// scripts/diagnose.js - Diagnostic des imports dupliqués

const fs = require('fs');
const path = require('path');

console.log('🔍 Diagnostic des imports dupliqués...\n');

// Vérifier si composables/index.ts existe
const composablesIndex = path.join(process.cwd(), 'composables/index.ts');
if (fs.existsSync(composablesIndex)) {
  console.log('❌ composables/index.ts existe encore - À supprimer !');
  console.log('   Commande: rm composables/index.ts\n');
} else {
  console.log('✅ composables/index.ts supprimé\n');
}

// Vérifier les imports dans les fichiers
const searchImports = (dir, extensions = ['.ts', '.vue', '.js']) => {
  const files = [];
  
  const scanDir = (currentDir) => {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory() && 
          !entry.name.startsWith('.') && 
          !['node_modules', 'dist'].includes(entry.name)) {
        scanDir(fullPath);
      } else if (entry.isFile() && 
                 extensions.some(ext => entry.name.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  };
  
  scanDir(dir);
  return files;
};

// Chercher les imports problématiques
const files = searchImports(process.cwd());
const problematicFiles = [];

for (const file of files) {
  try {
    const content = fs.readFileSync(file, 'utf8');
    
    // Chercher les imports depuis composables/index
    if (content.includes("from '~/composables/index'") || 
        content.includes('from "~/composables/index"') ||
        content.includes("from '@/composables/index'") ||
        content.includes('from "@/composables/index"')) {
      
      const relativePath = path.relative(process.cwd(), file);
      problematicFiles.push(relativePath);
    }
  } catch (err) {
    // Ignorer les erreurs de lecture
  }
}

if (problematicFiles.length > 0) {
  console.log('❌ Fichiers avec imports problématiques:');
  problematicFiles.forEach(file => {
    console.log(`   - ${file}`);
  });
  console.log('\n💡 Ces fichiers doivent être nettoyés manuellement');
  console.log('   Supprimez les imports depuis ~/composables/index');
  console.log('   Nuxt auto-importe les composables automatiquement\n');
} else {
  console.log('✅ Aucun import problématique trouvé\n');
}

// Vérifier la structure des dossiers
const checkStructure = () => {
  const requiredDirs = ['composables', 'stores', 'types', 'utils'];
  console.log('📁 Structure des dossiers:');
  
  for (const dir of requiredDirs) {
    const dirPath = path.join(process.cwd(), dir);
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.ts') || f.endsWith('.js'));
      console.log(`   ✅ ${dir}/ (${files.length} fichiers)`);
      
      // Lister les fichiers
      files.forEach(file => {
        console.log(`      - ${file}`);
      });
    } else {
      console.log(`   ❌ ${dir}/ manquant`);
    }
  }
};

checkStructure();

console.log('\n🚀 Actions recommandées:');
console.log('1. Supprimer composables/index.ts si existant');
console.log('2. Nettoyer les imports dans les fichiers listés');
console.log('3. Lancer: npm run clean && npm install');
console.log('4. Tester: npm run build');