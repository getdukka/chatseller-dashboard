// types/plans.ts - VERSION CORRIGÉE avec fallback

export interface PlanQuotas {
  aiResponses: number
  knowledgeDocuments: number
  indexablePages: number
  agents: number // -1 = illimité
  additionalAgentCost: number // Coût par agent supplémentaire
}

export interface PlanFeatures {
  name: string
  code: string
  monthlyPrice: number
  yearlyPrice: number
  yearlyDiscount: number // %
  trialDays: number
  quotas: PlanQuotas
  features: string[]
  beautySpecific: string[] // Fonctionnalités spécifiques beauté
  isPopular?: boolean
  color: string // Couleur pour l'UI beauté
}

// ✅ NOUVEAUX PLANS BEAUTÉ OPTIMISÉS
export const BEAUTY_PLANS: Record<string, PlanFeatures> = {
  starter: {
    name: 'Starter',
    code: 'starter',
    monthlyPrice: 49,
    yearlyPrice: 504, // 49*12 - 15% = ~504€
    yearlyDiscount: 15,
    trialDays: 14,
    quotas: {
      aiResponses: 1000,
      knowledgeDocuments: 50,
      indexablePages: 500,
      agents: -1, // ✅ ILLIMITÉ
      additionalAgentCost: 10 // 10€ par agent supplémentaire
    },
    features: [
      'Agents IA beauté illimités',
      '1000 réponses IA mensuelles',
      '50 documents base de connaissances',
      '500 pages web indexables',
      'Widget adaptatif beauté',
      'Analytics de base',
      'Support email'
    ],
    beautySpecific: [
      'Templates esthéticienne/experte makeup',
      'Qualification automatique type de peau',
      'Recommandations produits beauté',
      'Collecte profil beauté client'
    ],
    isPopular: true,
    color: 'rose'
  },
  
  growth: {
    name: 'Growth',
    code: 'growth',
    monthlyPrice: 149,
    yearlyPrice: 1524, // 149*12 - 15% = ~1524€
    yearlyDiscount: 15,
    trialDays: 14,
    quotas: {
      aiResponses: 10000,
      knowledgeDocuments: 200,
      indexablePages: 2000,
      agents: -1, // ✅ ILLIMITÉ
      additionalAgentCost: 10
    },
    features: [
      'Tout Starter +',
      'Agents IA beauté illimités',
      '10 000 réponses IA mensuelles',
      '200 documents base de connaissances', 
      '2000 pages web indexables',
      'Analytics avancées & ROI',
      'A/B testing des agents',
      'Intégrations CRM',
      'Support prioritaire'
    ],
    beautySpecific: [
      'Agents multi-spécialités (skincare + makeup + parfums)',
      'IA feedback et apprentissage',
      'Routines beauté personnalisées',
      'Upsell automatique produits complémentaires',
      'Analyses sentiment client beauté'
    ],
    color: 'purple'
  },
  
  performance: {
    name: 'Performance',
    code: 'performance',
    monthlyPrice: 0, // Sur mesure
    yearlyPrice: 0, // Sur mesure
    yearlyDiscount: 0,
    trialDays: 14,
    quotas: {
      aiResponses: -1, // ✅ ILLIMITÉ
      knowledgeDocuments: -1, // ✅ ILLIMITÉ
      indexablePages: -1, // ✅ ILLIMITÉ
      agents: -1, // ✅ ILLIMITÉ
      additionalAgentCost: 0 // Inclus
    },
    features: [
      'Tout Growth +',
      'Réponses IA illimitées',
      'Documents illimités',
      'Pages indexables illimitées',
      'Agents IA inclus (pas de surcoût)',
      'White-label complet',
      'API avancée',
      'Support dédié 24/7',
      'Onboarding personnalisé'
    ],
    beautySpecific: [
      'IA custom entraînée sur vos données beauté',
      'Conseillères virtuelles avec votre identité',
      'Intégration ERP/CRM beauté avancée',
      'Analytics prédictives tendances beauté',
      'Support technique dédié secteur beauté'
    ],
    color: 'gradient'
  },

  // ✅ AJOUT : Support des anciens plans pour compatibilité
  free: {
    name: 'Free (Legacy)',
    code: 'free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    yearlyDiscount: 0,
    trialDays: 14,
    quotas: {
      aiResponses: 100,
      knowledgeDocuments: 5,
      indexablePages: 50,
      agents: 1,
      additionalAgentCost: 20
    },
    features: ['Plan legacy - Migrer vers Starter'],
    beautySpecific: [],
    color: 'gray'
  }
}

// ✅ HELPER FONCTIONS CORRIGÉES avec fallback
export function getPlanDetails(planCode: string): PlanFeatures | null {
  // ✅ CORRECTION : Normaliser le planCode avant recherche
  const normalizedPlanCode = planCode?.toLowerCase?.() || 'starter'
  
  // Essayer directement
  if (BEAUTY_PLANS[normalizedPlanCode]) {
    return BEAUTY_PLANS[normalizedPlanCode]
  }
  
  // Mapping des anciens plans vers nouveaux
  const legacyMapping: Record<string, string> = {
    'free': 'starter', // Migrer free vers starter
    'basic': 'starter',
    'pro': 'growth',
    'premium': 'performance',
    'enterprise': 'performance'
  }
  
  const mappedPlan = legacyMapping[normalizedPlanCode]
  if (mappedPlan && BEAUTY_PLANS[mappedPlan]) {
    console.log(`🔄 Migration plan ${planCode} → ${mappedPlan}`)
    return BEAUTY_PLANS[mappedPlan]
  }
  
  // ✅ FALLBACK : Retourner starter par défaut
  console.warn(`⚠️ Plan '${planCode}' non trouvé, fallback vers 'starter'`)
  return BEAUTY_PLANS.starter
}

export function calculateAgentCost(planCode: string, agentCount: number): number {
  const plan = getPlanDetails(planCode)
  if (!plan) return 0
  
  // Si agents illimités avec coût supplémentaire
  if (plan.quotas.agents === -1 && plan.quotas.additionalAgentCost > 0) {
    // Premier agent inclus, les suivants payants
    return Math.max(0, agentCount - 1) * plan.quotas.additionalAgentCost
  }
  
  // Si plan avec limite d'agents
  if (plan.quotas.agents > 0 && agentCount > plan.quotas.agents) {
    const extraAgents = agentCount - plan.quotas.agents
    return extraAgents * plan.quotas.additionalAgentCost
  }
  
  return 0
}

export function canCreateAgent(planCode: string, currentAgentCount: number): boolean {
  const plan = getPlanDetails(planCode)
  if (!plan) return false
  
  // Agents illimités
  if (plan.quotas.agents === -1) return true
  
  // Limite d'agents
  return currentAgentCount < plan.quotas.agents
}

// ✅ FONCTION CORRIGÉE : checkQuotaUsage avec fallback robuste
export function checkQuotaUsage(planCode: string, usage: Partial<PlanQuotas>): {
  aiResponses: { used: number, limit: number, exceeded: boolean }
  knowledgeDocuments: { used: number, limit: number, exceeded: boolean }
  indexablePages: { used: number, limit: number, exceeded: boolean }
  agents: { used: number, limit: number, exceeded: boolean, additionalCost: number }
} {
  // ✅ CORRECTION CRITIQUE : Ne jamais throw, toujours fallback
  const plan = getPlanDetails(planCode)
  
  // ✅ Si aucun plan trouvé même avec fallback, utiliser starter en dur
  const safePlan = plan || BEAUTY_PLANS.starter
  
  if (!safePlan) {
    console.error('❌ Aucun plan trouvé, même starter! Utilisation de valeurs par défaut.')
    // Valeurs par défaut d'urgence
    return {
      aiResponses: { used: 0, limit: 1000, exceeded: false },
      knowledgeDocuments: { used: 0, limit: 50, exceeded: false },
      indexablePages: { used: 0, limit: 500, exceeded: false },
      agents: { used: 0, limit: -1, exceeded: false, additionalCost: 0 }
    }
  }
  
  return {
    aiResponses: {
      used: usage.aiResponses || 0,
      limit: safePlan.quotas.aiResponses,
      exceeded: safePlan.quotas.aiResponses !== -1 && (usage.aiResponses || 0) > safePlan.quotas.aiResponses
    },
    knowledgeDocuments: {
      used: usage.knowledgeDocuments || 0,
      limit: safePlan.quotas.knowledgeDocuments,
      exceeded: safePlan.quotas.knowledgeDocuments !== -1 && (usage.knowledgeDocuments || 0) > safePlan.quotas.knowledgeDocuments
    },
    indexablePages: {
      used: usage.indexablePages || 0,
      limit: safePlan.quotas.indexablePages,
      exceeded: safePlan.quotas.indexablePages !== -1 && (usage.indexablePages || 0) > safePlan.quotas.indexablePages
    },
    agents: {
      used: usage.agents || 0,
      limit: safePlan.quotas.agents,
      exceeded: safePlan.quotas.agents !== -1 && (usage.agents || 0) > safePlan.quotas.agents,
      additionalCost: calculateAgentCost(planCode, usage.agents || 0)
    }
  }
}

// ✅ RE-EXPORT des types beauté via re-exports directs (sans imports inutiles)
export { 
  BEAUTY_AGENT_TYPES,
  BEAUTY_INSTRUCTION_TEMPLATES 
} from '~/types/beauty'

export type { 
  BeautyCategory,
  BeautyAgentType 
} from '~/types/beauty'