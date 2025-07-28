// composables/useAITest.ts - COMPOSABLE TEST IA AVEC GPT-4O-MINI
import { ref, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'

// ✅ TYPES
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  loading?: boolean
  error?: boolean
  metadata?: {
    processingTime?: number
    tokensUsed?: number
    model?: string
  }
}

export interface AgentPersona {
  id: string
  name: string
  type: string
  personality: string
  description?: string
  welcomeMessage?: string
  fallbackMessage?: string
  knowledgeBase?: string
  systemPrompt?: string
}

export interface TestSession {
  id: string
  agentId: string
  agentName: string
  messages: ChatMessage[]
  startedAt: Date
  lastActivity: Date
  isActive: boolean
  stats: {
    totalMessages: number
    avgResponseTime: number
    totalTokens: number
  }
}

// ✅ COMPOSABLE PRINCIPAL
export const useAITest = () => {
  const authStore = useAuthStore()
  const config = useRuntimeConfig()

  // ✅ STATE RÉACTIF
  const currentSession = ref<TestSession | null>(null)
  const messages = ref<ChatMessage[]>([])
  const isTyping = ref(false)
  const sendingMessage = ref(false)
  const error = ref<string | null>(null)
  const sessionHistory = ref<TestSession[]>([])

  // ✅ COMPUTED
  const canSendMessage = computed(() => !sendingMessage.value && !isTyping.value)
  
  const sessionStats = computed(() => {
    if (!currentSession.value) return null
    
    const userMessages = messages.value.filter(m => m.role === 'user').length
    const aiMessages = messages.value.filter(m => m.role === 'assistant' && !m.loading && !m.error).length
    const totalTokens = messages.value.reduce((sum, m) => sum + (m.metadata?.tokensUsed || 0), 0)
    
    return {
      userMessages,
      aiMessages,
      totalMessages: userMessages + aiMessages,
      totalTokens,
      avgResponseTime: currentSession.value.stats.avgResponseTime
    }
  })

  const isPaidUser = computed(() => {
    const plan = authStore.user?.shop?.subscription_plan || 'starter'
    return plan === 'starter' || plan === 'pro'
  })

  // ✅ HELPER: Générer un prompt système pour l'agent
  const generateSystemPrompt = (agent: AgentPersona): string => {
    const basePrompt = `Tu es ${agent.name}, un vendeur IA commercial expert travaillant pour une boutique en ligne.

PERSONNALITÉ: ${agent.personality}
TYPE DE VENDEUR: ${agent.type}
DESCRIPTION: ${agent.description || 'Vendeur IA spécialisé'}

MISSION:
- Aider les clients à trouver les produits qui correspondent à leurs besoins
- Répondre aux questions sur les produits, prix, livraison, garanties
- Convertir les visiteurs en clients de manière naturelle et professionnelle
- Collecter les informations nécessaires pour finaliser les commandes
- Proposer des produits complémentaires quand c'est pertinent

COMPORTEMENT:
- Sois ${agent.personality === 'friendly' ? 'chaleureux et amical' : agent.personality === 'professional' ? 'professionnel et courtois' : agent.personality === 'expert' ? 'technique et précis' : 'décontracté et accessible'}
- Pose des questions pour mieux comprendre les besoins
- Donne des conseils personnalisés basés sur les informations du client
- Crée un sentiment d'urgence quand approprié (stocks limités, promotions)
- Rassure sur la qualité, les garanties et le service client

RÈGLES:
- Reste toujours dans ton rôle de ${agent.name}
- Sois naturel et conversationnel
- Ne révèle jamais que tu es une IA générale - tu es spécifiquement ${agent.name}
- Si tu ne sais pas quelque chose, utilise le message de fallback
- Termine toujours par une question ou une action suggérée

MESSAGE DE FALLBACK: "${agent.fallbackMessage || 'Je transmets votre question à notre équipe, un conseiller vous recontactera bientôt.'}"

BASE DE CONNAISSANCE:
${agent.knowledgeBase || 'Informations générales sur les produits et services disponibles.'}`

    return basePrompt
  }

  // ✅ CRÉER UNE NOUVELLE SESSION DE TEST
  const startTestSession = async (agent: AgentPersona): Promise<boolean> => {
    try {
      console.log('🚀 Démarrage session test pour agent:', agent.name)
      
      if (!isPaidUser.value) {
        error.value = 'La fonctionnalité de test est réservée aux utilisateurs des plans Starter et Pro.'
        return false
      }

      // ✅ Créer la session
      const session: TestSession = {
        id: Date.now().toString(),
        agentId: agent.id,
        agentName: agent.name,
        messages: [],
        startedAt: new Date(),
        lastActivity: new Date(),
        isActive: true,
        stats: {
          totalMessages: 0,
          avgResponseTime: 0,
          totalTokens: 0
        }
      }

      currentSession.value = session
      messages.value = []
      error.value = null

      // ✅ Ajouter le message de bienvenue
      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: agent.welcomeMessage || 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?',
        timestamp: new Date(),
        metadata: {
          model: 'initial-message',
          processingTime: 0,
          tokensUsed: 0
        }
      }

      messages.value.push(welcomeMessage)
      session.messages = [...messages.value]

      console.log('✅ Session test créée:', session.id)
      return true

    } catch (err: any) {
      console.error('❌ Erreur création session test:', err)
      error.value = 'Erreur lors de la création de la session de test'
      return false
    }
  }

  // ✅ ENVOYER UN MESSAGE DE TEST
  const sendTestMessage = async (content: string): Promise<boolean> => {
    if (!currentSession.value || !canSendMessage.value || !content.trim()) {
      return false
    }

    const startTime = Date.now()
    sendingMessage.value = true
    error.value = null

    try {
      console.log('📤 Envoi message test:', content)

      // ✅ 1. Ajouter le message utilisateur
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: content.trim(),
        timestamp: new Date()
      }

      messages.value.push(userMessage)
      currentSession.value.messages.push(userMessage)

      // ✅ 2. Ajouter message de "typing" de l'IA
      const typingMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'L\'IA réfléchit...',
        timestamp: new Date(),
        loading: true
      }

      messages.value.push(typingMessage)
      isTyping.value = true

      // ✅ 3. Préparer le contexte pour l'IA
      const agent = await getAgentPersona(currentSession.value.agentId)
      if (!agent) {
        throw new Error('Agent non trouvé')
      }

      const systemPrompt = generateSystemPrompt(agent)
      
      // ✅ 4. Historique de conversation pour le contexte
      const conversationHistory = messages.value
        .filter(m => m.role !== 'assistant' || !m.loading)
        .slice(-10) // Garder les 10 derniers messages pour le contexte
        .map(m => ({
          role: m.role,
          content: m.content
        }))

      // ✅ 5. Appel à l'API Claude (simulation de GPT-4o-mini)
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 800,
          system: systemPrompt,
          messages: [
            ...conversationHistory.slice(0, -1), // Tout sauf le dernier message
            {
              role: "user",
              content: `Contexte: Test d'un vendeur IA commercial.

Message du client: "${content}"

Instructions spéciales pour cette simulation:
- Tu incarnes parfaitement ${agent.name} avec sa personnalité ${agent.personality}
- Sois authentique et naturel comme un vrai vendeur commercial
- Adapte ton style à la situation (conseil, persuasion, information)
- Pose des questions de découverte si nécessaire
- Suggère des actions concrètes (voir produit, passer commande, etc.)
- Reste dans le rôle de vendeur IA commercial

Réponds comme ${agent.name}:`
            }
          ]
        })
      })

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      const aiResponse = data.content[0].text

      // ✅ 6. Calculer les métriques
      const processingTime = Date.now() - startTime
      const estimatedTokens = Math.floor((content.length + aiResponse.length) / 4) // Estimation

      // ✅ 7. Remplacer le message de typing par la vraie réponse
      const responseMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
        metadata: {
          processingTime,
          tokensUsed: estimatedTokens,
          model: 'claude-sonnet-4-20250514'
        }
      }

      // Supprimer le message de typing
      messages.value = messages.value.filter(m => !m.loading)
      messages.value.push(responseMessage)

      // ✅ 8. Mettre à jour la session
      currentSession.value.messages = [...messages.value]
      currentSession.value.lastActivity = new Date()
      currentSession.value.stats.totalMessages += 2 // user + assistant
      currentSession.value.stats.totalTokens += estimatedTokens
      
      // Calculer le temps de réponse moyen
      const responseTimes = messages.value
        .filter(m => m.role === 'assistant' && m.metadata?.processingTime)
        .map(m => m.metadata!.processingTime!)
      
      currentSession.value.stats.avgResponseTime = responseTimes.length > 0 
        ? Math.round(responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length)
        : 0

      console.log('✅ Message test traité avec succès')
      console.log(`⏱️ Temps de traitement: ${processingTime}ms`)
      console.log(`🎯 Tokens estimés: ${estimatedTokens}`)

      return true

    } catch (err: any) {
      console.error('❌ Erreur envoi message test:', err)
      
      // ✅ Remplacer le message de typing par un message d'erreur
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Désolé, je rencontre un problème technique. Veuillez réessayer dans un moment.',
        timestamp: new Date(),
        error: true
      }

      messages.value = messages.value.filter(m => !m.loading)
      messages.value.push(errorMessage)

      error.value = 'Erreur lors de la génération de la réponse IA'
      return false

    } finally {
      sendingMessage.value = false
      isTyping.value = false
    }
  }

  // ✅ RÉCUPÉRER LES DONNÉES D'UN AGENT POUR LE TEST
  const getAgentPersona = async (agentId: string): Promise<AgentPersona | null> => {
    try {
      // ✅ Pour l'instant, utiliser des données mockées
      // TODO: Intégrer avec useAgents() ou useAgentConfig()
      
      const mockAgent: AgentPersona = {
        id: agentId,
        name: 'Rose - Vendeuse',
        type: 'general',
        personality: 'friendly',
        description: 'Assistante d\'achat spécialisée dans les produits de jeux de cartes relationnels',
        welcomeMessage: 'Bonjour ! Je suis Rose, votre assistante d\'achat. Comment puis-je vous aider aujourd\'hui ?',
        fallbackMessage: 'Je transmets votre question à notre équipe, un conseiller vous recontactera bientôt.',
        knowledgeBase: `CATALOGUE PRODUITS:
- Jeux de cartes relationnels premium
- Accessoires de jeu (tapis, protège-cartes, etc.)
- Éditions limitées et exclusives
- Prix: 15€ à 89€ selon les collections
- Livraison gratuite dès 50€ d'achat
- Garantie satisfaction 30 jours

PROMOTIONS ACTUELLES:
- Nouveaux clients: -20% avec code BIENVENUE
- Livraison express 24h disponible
- Programme fidélité: 1 point = 1€ de réduction

SERVICE CLIENT:
- Support 7j/7 par chat, email, téléphone
- Retours gratuits sous 30 jours
- Garantie qualité premium sur tous produits`
      }

      return mockAgent

    } catch (err) {
      console.error('❌ Erreur récupération agent persona:', err)
      return null
    }
  }

  // ✅ TERMINER UNE SESSION DE TEST
  const endTestSession = () => {
    if (currentSession.value) {
      currentSession.value.isActive = false
      sessionHistory.value.unshift(currentSession.value) // Ajouter en début de liste
      
      // Garder seulement les 10 dernières sessions
      sessionHistory.value = sessionHistory.value.slice(0, 10)
      
      console.log('🏁 Session test terminée:', currentSession.value.id)
    }

    currentSession.value = null
    messages.value = []
    isTyping.value = false
    sendingMessage.value = false
    error.value = null
  }

  // ✅ EFFACER L'HISTORIQUE DES MESSAGES
  const clearMessages = () => {
    if (currentSession.value) {
      messages.value = []
      currentSession.value.messages = []
      currentSession.value.stats = {
        totalMessages: 0,
        avgResponseTime: 0,
        totalTokens: 0
      }
      console.log('🧹 Messages effacés')
    }
  }

  // ✅ EXPORTER LA SESSION POUR ANALYSE
  const exportSession = (): string | null => {
    if (!currentSession.value) return null

    const exportData = {
      sessionId: currentSession.value.id,
      agentName: currentSession.value.agentName,
      duration: new Date().getTime() - currentSession.value.startedAt.getTime(),
      stats: sessionStats.value,
      messages: messages.value.map(m => ({
        role: m.role,
        content: m.content,
        timestamp: m.timestamp.toISOString(),
        processingTime: m.metadata?.processingTime,
        tokensUsed: m.metadata?.tokensUsed
      }))
    }

    return JSON.stringify(exportData, null, 2)
  }

  // ✅ RÉINITIALISER L'ERREUR
  const clearError = () => {
    error.value = null
  }

  // ✅ RETOURNER TOUTES LES MÉTHODES ET PROPRIÉTÉS
  return {
    // State
    currentSession: readonly(currentSession),
    messages: readonly(messages),
    isTyping: readonly(isTyping),
    sendingMessage: readonly(sendingMessage),
    error: readonly(error),
    sessionHistory: readonly(sessionHistory),

    // Computed
    canSendMessage,
    sessionStats,
    isPaidUser,

    // Actions
    startTestSession,
    sendTestMessage,
    endTestSession,
    clearMessages,
    exportSession,

    // Helpers
    getAgentPersona,
    clearError
  }
}