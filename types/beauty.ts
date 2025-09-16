// types/beauty.ts - TYPES BEAUTÉ CENTRALISÉS
// Ce fichier centralise tous les types spécifiques au secteur beauté

// ✅ TYPES DE BASE BEAUTÉ
export type BeautyCategory = 'skincare' | 'makeup' | 'fragrance' | 'haircare' | 'bodycare' | 'multi'

export type BeautyAgentType = 'skincare_expert' | 'makeup_expert' | 'fragrance_expert' | 'haircare_expert' | 'bodycare_expert' | 'beauty_expert'

export type ClassicAgentType = 'general' | 'product_specialist' | 'support' | 'upsell'

export type AgentType = BeautyAgentType | ClassicAgentType

export type PersonalityType = 'professional' | 'friendly' | 'expert' | 'casual'

export type ProductRange = 'premium' | 'accessible' | 'organic' | 'vegan' | 'anti_aging' | 'sensitive' | 'custom'

// ✅ TYPES WIDGET BEAUTÉ
export type BeautyTheme = 'beauty_modern' | 'beauty_elegant' | 'beauty_fresh' | 'brand_adaptive'
export type ClassicTheme = 'modern' | 'minimal'
export type WidgetTheme = BeautyTheme | ClassicTheme

export type WidgetPosition = 'above-cta' | 'below-cta' | 'beside-cta' | 'bottom-right' | 'bottom-left'
export type WidgetLanguage = 'fr' | 'en' | 'wo'

// ✅ CONFIGURATION AGENT BEAUTÉ COMPLETE
export interface BeautyAgentConfig {
  collectName?: boolean
  collectPhone?: boolean
  collectEmail?: boolean
  collectAddress?: boolean
  collectBeautyProfile?: boolean // ✅ SPÉCIFIQUE BEAUTÉ
  collectAge?: boolean
  collectBudget?: boolean
  collectPreferences?: boolean
  collectPayment?: boolean
  upsellEnabled?: boolean
  urgencyEnabled?: boolean
  specificInstructions?: string[]
  linkedKnowledgeBase?: string[]
  aiProvider?: 'openai' | 'claude'
  temperature?: number
  maxTokens?: number
  systemPrompt?: string
  generatedSystemPrompt?: string
  tone?: string
}

// ✅ INTERFACE AGENT COMPLÈTE
export interface Agent {
  id: string
  name: string
  title?: string
  type: AgentType
  personality: PersonalityType
  productType?: 'auto' | 'skincare' | 'makeup' | 'fragrance' | 'haircare' | 'bodycare' | 'wellness' | 'accessories' | 'tools' | 'custom'
  customProductType?: string
  productRange?: ProductRange
  customProductRange?: string
  shopName?: string
  description: string | null
  welcomeMessage: string | null
  fallbackMessage: string | null
  avatar: string | null
  isActive: boolean
  config: BeautyAgentConfig
  stats: {
    conversations: number
    conversions: number
  }
  knowledgeBase?: Array<{
    id: string
    title: string
    contentType: string
    isActive: boolean
    tags: string[]
  }>
  createdAt: string
  updatedAt: string
}

// ✅ CONFIGURATION WIDGET BEAUTÉ COMPLÈTE
export interface WidgetConfig {
  buttonText: string
  primaryColor: string
  position: WidgetPosition
  floatingPosition: 'bottom-right' | 'bottom-left'
  widgetSize: 'small' | 'medium' | 'large'
  theme: WidgetTheme
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full'
  animation: 'fade' | 'slide' | 'bounce' | 'none'
  autoOpen: boolean
  showAvatar: boolean
  soundEnabled: boolean
  mobileOptimized: boolean
  showTypingIndicator?: boolean
  offlineMessage?: string
  isActive: boolean
  language: WidgetLanguage
}

// ✅ CONFIGURATION COMPLÈTE AGENT+WIDGET
export interface AgentConfig {
  agent: Agent
  widget: WidgetConfig
  knowledgeBase: Array<{
    id: string
    title: string
    contentType: string
    isActive: boolean
    tags: string[]
  }>
}

// ✅ DÉTAILS TYPES D'AGENTS BEAUTÉ COMPLETS
export interface BeautyAgentTypeInfo {
  label: string
  icon: string
  color: 'rose' | 'purple' | 'violet' | 'amber' | 'teal' | 'pink'
  defaultName: string
  description: string
  welcomeTemplate: string
}

export const BEAUTY_AGENT_TYPES: Record<BeautyAgentType, BeautyAgentTypeInfo> = {
  skincare_expert: {
    label: 'Esthéticienne IA',
    icon: '✨',
    color: 'rose',
    defaultName: 'Camille',
    description: 'Experte soins visage et conseils peau personnalisés',
    welcomeTemplate: 'Bonjour ! Je suis {agentName}, esthéticienne IA chez {shopName}. Quel est votre type de peau ? Je vais vous conseiller la routine idéale.'
  },
  makeup_expert: {
    label: 'Experte Makeup IA',
    icon: '💄',
    color: 'purple',
    defaultName: 'Léa',
    description: 'Conseils maquillage, techniques et looks occasions',
    welcomeTemplate: 'Salut ! Moi c\'est {agentName}, experte makeup chez {shopName}. Quel look souhaitez-vous créer aujourd\'hui ?'
  },
  fragrance_expert: {
    label: 'Conseillère Parfums IA',
    icon: '🌸',
    color: 'violet',
    defaultName: 'Chloé',
    description: 'Experte fragrances et familles olfactives',
    welcomeTemplate: 'Bonjour ! Je suis {agentName}, conseillère parfums chez {shopName}. Quelle fragrance vous ferait rêver ?'
  },
  haircare_expert: {
    label: 'Experte Capillaire IA',
    icon: '💇‍♀️',
    color: 'amber',
    defaultName: 'Amélie',
    description: 'Soins cheveux et diagnostics capillaires',
    welcomeTemplate: 'Hello ! Je suis {agentName}, experte capillaire chez {shopName}. Parlez-moi de vos cheveux, je vais vous chouchouter !'
  },
  bodycare_expert: {
    label: 'Experte Soins Corps IA',
    icon: '🧴',
    color: 'teal',
    defaultName: 'Sarah',
    description: 'Rituels bien-être et soins corporels',
    welcomeTemplate: 'Bonjour ! Je suis {agentName}, experte bien-être chez {shopName}. Créons ensemble votre rituel beauté idéal.'
  },
  beauty_expert: {
    label: 'Conseillère Beauté IA',
    icon: '🎀',
    color: 'pink',
    defaultName: 'Rose',
    description: 'Multi-spécialités beauté et expertise transversale',
    welcomeTemplate: 'Bonjour ! Je suis {agentName}, conseillère beauté chez {shopName}. Dans quel domaine beauté puis-je vous accompagner ?'
  }
}

// ✅ OPTIONS GAMME PRODUITS BEAUTÉ
export const PRODUCT_RANGE_OPTIONS = [
  { value: 'premium', label: '💎 Premium/Luxe', description: 'Produits haut de gamme' },
  { value: 'accessible', label: '🛍️ Grand public/Accessible', description: 'Prix abordables' },
  { value: 'organic', label: '🌿 Bio/Naturel', description: 'Ingrédients naturels' },
  { value: 'vegan', label: '🐰 Vegan/Cruelty-free', description: 'Sans cruauté animale' },
  { value: 'anti_aging', label: '⏰ Anti-âge/Mature', description: 'Soins anti-vieillissement' },
  { value: 'sensitive', label: '🤲 Peaux sensibles/Réactives', description: 'Formules douces' },
  { value: 'custom', label: '🎯 Gamme spécifique', description: 'Personnalisé' }
]

// ✅ OPTIONS TYPE DE PRODUIT AVEC CUSTOM
export const PRODUCT_TYPE_OPTIONS = [
  { value: 'auto', label: '🎯 Détection automatique', description: 'Le système détecte le type de produit beauté' },
  { value: 'skincare', label: '✨ Soins visage', description: 'Crèmes, sérums, nettoyants visage' },
  { value: 'makeup', label: '💄 Maquillage', description: 'Fonds de teint, rouge à lèvres, fards' },
  { value: 'fragrance', label: '🌸 Parfums', description: 'Eau de parfum, eau de toilette, parfums' },
  { value: 'haircare', label: '💇‍♀️ Soins capillaires', description: 'Shampoings, masques, huiles cheveux' },
  { value: 'bodycare', label: '🧴 Soins corps', description: 'Crèmes corps, gommages, lotions' },
  { value: 'wellness', label: '🧘‍♀️ Bien-être', description: 'Produits détente, aromathérapie' },
  { value: 'accessories', label: '👜 Accessoires', description: 'Pinceaux, éponges, trousses' },
  { value: 'tools', label: '🔧 Outils beauté', description: 'Appareils, dispositifs de beauté' },
  { value: 'custom', label: '🎨 Personnalisé', description: 'Définir un type spécifique' }
]

// ✅ TEMPLATES D'INSTRUCTIONS BEAUTÉ PRÉDÉFINIS
export const BEAUTY_INSTRUCTION_TEMPLATES = [
  {
    id: 'qualify-skin-first',
    icon: '🔍',
    title: 'Qualification peau obligatoire',
    description: 'Toujours demander le type de peau avant recommandations',
    category: 'skincare',
    instructions: 'TOUJOURS demander le type de peau (normale, sèche, grasse, mixte, sensible) avant de recommander des produits.'
  },
  {
    id: 'samples-systematic',
    icon: '🎁',
    title: 'Proposition échantillons',
    description: 'Proposer systématiquement des échantillons gratuits',
    category: 'all',
    instructions: 'TOUJOURS proposer des échantillons gratuits pour les nouveaux produits recommandés.'
  },
  {
    id: 'ingredients-focus',
    icon: '🌿',
    title: 'Focus ingrédients actifs',
    description: 'Mettre en avant compositions et bienfaits',
    category: 'all',
    instructions: 'TOUJOURS mentionner les ingrédients clés (acide hyaluronique, vitamine C, rétinol, etc.) et leurs bénéfices.'
  },
  {
    id: 'routine-complete',
    icon: '📋',
    title: 'Vente routine complète',
    description: 'Proposer routines vs produits isolés',
    category: 'skincare',
    instructions: 'TOUJOURS proposer une routine complète (nettoyage, soin, protection) plutôt qu\'un seul produit.'
  },
  {
    id: 'seasonal-urgency',
    icon: '⏰',
    title: 'Urgence saisonnière',
    description: 'Créer urgence avec saisons et offres limitées',
    category: 'all',
    instructions: 'Mentionner la saisonnalité et les offres limitées pour créer de l\'urgence d\'achat.'
  }
]

// ✅ HELPER FUNCTIONS BEAUTÉ
export function getTypeLabel(type: AgentType): string {
  const beautyType = BEAUTY_AGENT_TYPES[type as BeautyAgentType]
  if (beautyType) {
    return beautyType.label
  }
  
  const classicLabels = {
    general: 'Vendeur généraliste',
    product_specialist: 'Spécialiste produit',
    support: 'Support & SAV',
    upsell: 'Upsell & Cross-sell'
  }
  
  return classicLabels[type as keyof typeof classicLabels] || type
}

export function getProductTypeLabel(type: string, customType?: string): string {
  // Si c'est un type personnalisé, utiliser la valeur personnalisée
  if (type === 'custom' && customType) {
    return customType
  }
  
  const option = PRODUCT_TYPE_OPTIONS.find(opt => opt.value === type)
  return option ? option.label : '🎯 Détection automatique'
}

export function getProductRangeLabel(range: ProductRange, customRange?: string): string {
  if (range === 'custom' && customRange) {
    return customRange
  }
  
  const option = PRODUCT_RANGE_OPTIONS.find(opt => opt.value === range)
  return option ? option.label : '💎 Premium/Luxe'
}

export function getAgentIcon(type: AgentType): string {
  const beautyType = BEAUTY_AGENT_TYPES[type as BeautyAgentType]
  if (beautyType) {
    return beautyType.icon
  }
  
  return '👤'
}

export function getAvatarClass(type: AgentType): string {
  const beautyType = BEAUTY_AGENT_TYPES[type as BeautyAgentType]
  if (beautyType) {
    const colorMap = {
      rose: 'bg-gradient-to-br from-pink-500 to-rose-600',
      purple: 'bg-gradient-to-br from-purple-500 to-pink-600',
      violet: 'bg-gradient-to-br from-violet-500 to-purple-600',
      amber: 'bg-gradient-to-br from-amber-500 to-orange-600',
      teal: 'bg-gradient-to-br from-teal-500 to-cyan-600',
      pink: 'bg-gradient-to-br from-rose-500 to-pink-600'
    }
    return colorMap[beautyType.color] || colorMap.pink
  }
  
  return 'bg-blue-500'
}

// ✅ TEMPLATE MESSAGE D'ACCUEIL PAR DÉFAUT
export function getDefaultWelcomeTemplate(): string {
  return `\${greeting} 👋 Je suis \${agentName}, \${agentTitle} chez \${shopName}.

Je vois que vous vous intéressez à notre \${productType} "\${productName}". Excellent choix ! ✨

Comment puis-je vous aider avec ce \${productType} ? 😊`
}

// ✅ TYPES POUR LE SYSTÈME DE FEEDBACK IA BEAUTÉ
export interface AIFeedback {
  id: string
  messageId: string
  shopId: string
  agentId: string
  conversationId: string
  originalResponse: string
  correctedResponse?: string
  feedbackType: 'correction' | 'improvement' | 'validation' | 'negative'
  feedbackRating?: number // 1-5
  feedbackComment?: string
  feedbackTags?: string[] // ['response_quality', 'product_knowledge', 'tone', etc.]
  userCorrection?: string
  isPublic: boolean // Partager avec autres utilisateurs du même secteur
  beautyCategory?: BeautyCategory
  createdAt: string
  updatedAt?: string
}

// ✅ TAGS FEEDBACK PRÉDÉFINIS POUR BEAUTÉ
export const BEAUTY_FEEDBACK_TAGS = [
  { id: 'product_knowledge', label: 'Connaissance produits', category: 'expertise' },
  { id: 'skin_diagnosis', label: 'Diagnostic peau', category: 'skincare' },
  { id: 'makeup_technique', label: 'Techniques maquillage', category: 'makeup' },
  { id: 'fragrance_matching', label: 'Correspondances parfums', category: 'fragrance' },
  { id: 'hair_analysis', label: 'Analyse capillaire', category: 'haircare' },
  { id: 'ingredient_explanation', label: 'Explication ingrédients', category: 'expertise' },
  { id: 'routine_building', label: 'Construction routine', category: 'skincare' },
  { id: 'color_matching', label: 'Correspondance couleurs', category: 'makeup' },
  { id: 'seasonal_advice', label: 'Conseils saisonniers', category: 'general' },
  { id: 'price_justification', label: 'Justification prix', category: 'sales' },
  { id: 'upsell_relevance', label: 'Pertinence upsell', category: 'sales' },
  { id: 'tone_appropriateness', label: 'Ton adapté', category: 'communication' },
  { id: 'response_length', label: 'Longueur réponse', category: 'communication' },
  { id: 'personalization', label: 'Personnalisation', category: 'communication' },
  { id: 'urgency_creation', label: 'Création urgence', category: 'sales' }
]