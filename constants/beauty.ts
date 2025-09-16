// constants/beauty.ts

export const BEAUTY_PLAN_LIMITS = {
  starter: { 
    documents: 50, 
    fileSize: 10 * 1024 * 1024, // 10MB
    indexablePages: 500,
    trialDays: 14
  },
  growth: { 
    documents: 200, 
    fileSize: 25 * 1024 * 1024, // 25MB
    indexablePages: 2000,
    trialDays: 14
  },
  performance: { 
    documents: -1, // Illimité
    fileSize: 100 * 1024 * 1024, // 100MB
    indexablePages: -1, // Illimité
    trialDays: 14
  }
};

export const ALLOWED_BEAUTY_FILE_TYPES = {
  'application/pdf': '.pdf',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  'application/vnd.ms-excel': '.xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
  'text/csv': '.csv',
  'text/plain': '.txt',
  'image/jpeg': '.jpg', 
  'image/png': '.png'   
};

export const BEAUTY_CATEGORIES = {
  skincare: {
    label: 'Soins visage',
    keywords: ['skincare', 'soin', 'visage', 'crème', 'sérum', 'masque', 'nettoyant'],
    color: 'rose'
  },
  makeup: {
    label: 'Maquillage',
    keywords: ['maquillage', 'makeup', 'fond de teint', 'rouge', 'mascara', 'ombre'],
    color: 'purple'
  },
  fragrance: {
    label: 'Parfums',
    keywords: ['parfum', 'fragrance', 'eau de toilette', 'eau de parfum'],
    color: 'violet'
  },
  haircare: {
    label: 'Soins capillaires',
    keywords: ['cheveux', 'hair', 'shampoing', 'masque capillaire'],
    color: 'amber'
  },
  bodycare: {
    label: 'Soins corps',
    keywords: ['corps', 'body', 'lotion', 'gommage', 'huile corps'],
    color: 'teal'
  },
  multi: {
    label: 'Multi-catégories',
    keywords: [],
    color: 'pink'
  }
};

// Fonction utilitaire pour valider les fichiers beauté
export function validateBeautyFile(file: File, plan: string): { 
  valid: boolean; 
  error?: string; 
  category?: string 
} {
  const planLimits = BEAUTY_PLAN_LIMITS[plan as keyof typeof BEAUTY_PLAN_LIMITS] || BEAUTY_PLAN_LIMITS.starter;
  
  // Vérifier le type
  if (!ALLOWED_BEAUTY_FILE_TYPES[file.type as keyof typeof ALLOWED_BEAUTY_FILE_TYPES]) {
    return {
      valid: false,
      error: `Type de fichier non supporté. Types acceptés : ${Object.keys(ALLOWED_BEAUTY_FILE_TYPES).join(', ')}`
    };
  }
  
  // Vérifier la taille
  if (file.size > planLimits.fileSize) {
    return {
      valid: false,
      error: `Fichier trop volumineux. Taille max pour votre plan ${plan} : ${Math.round(planLimits.fileSize / 1024 / 1024)}MB`
    };
  }
  
  // Détecter la catégorie beauté
  const fileName = file.name.toLowerCase();
  let detectedCategory = 'multi';
  
  for (const [category, config] of Object.entries(BEAUTY_CATEGORIES)) {
    if (config.keywords.some(keyword => fileName.includes(keyword))) {
      detectedCategory = category;
      break;
    }
  }
  
  return {
    valid: true,
    category: detectedCategory
  };
}