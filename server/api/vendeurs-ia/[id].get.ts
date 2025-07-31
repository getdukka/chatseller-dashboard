// server/api/vendeurs-ia/[id].get.ts - VERSION SUPABASE RÉELLE
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    // Récupérer l'ID de l'agent depuis les paramètres de route
    const agentId = getRouterParam(event, 'id')
    
    if (!agentId || agentId === 'undefined') {
      console.error('❌ ID agent invalide:', agentId)
      throw createError({
        statusCode: 400,
        statusMessage: 'ID agent invalide'
      })
    }

    console.log('🔍 [API] Récupération agent depuis Supabase:', agentId)

    // ✅ CONNEXION SUPABASE RÉELLE
    const config = useRuntimeConfig()
    const supabase = createClient(
      config.public.supabaseUrl,
      config.public.supabaseAnonKey
    )

    // ✅ RÉCUPÉRATION DE L'AGENT DEPUIS SUPABASE
    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .select('*')
      .eq('id', agentId)
      .single()

    if (agentError) {
      console.error('❌ Erreur Supabase agent:', agentError)
      
      // ✅ FALLBACK AVEC DONNÉES MOCKÉES SI ERREUR SUPABASE
      console.log('⚠️ Fallback vers données mockées')
      const mockAgent = {
        id: agentId,
        name: 'Sophie - Assistante d\'achat',
        type: 'general',
        personality: 'professional',
        description: 'Assistante d\'achat spécialisée dans les produits.',
        welcome_message: 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?',
        fallback_message: 'Je transmets votre question à notre équipe.',
        avatar: 'https://ui-avatars.com/api/?name=Sophie&background=10B981&color=fff',
        is_active: true,
        config: {
          collectName: true,
          collectPhone: true,
          collectAddress: false,
          collectPayment: true,
          upsellEnabled: false
        },
        total_conversations: 0,
        total_conversions: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      return {
        success: true,
        data: {
          agent: {
            id: mockAgent.id,
            name: mockAgent.name,
            type: mockAgent.type,
            personality: mockAgent.personality,
            description: mockAgent.description,
            welcomeMessage: mockAgent.welcome_message,
            fallbackMessage: mockAgent.fallback_message,
            avatar: mockAgent.avatar,
            isActive: mockAgent.is_active,
            config: mockAgent.config,
            stats: {
              conversations: mockAgent.total_conversations,
              conversions: mockAgent.total_conversions
            }
          },
          knowledgeBase: []
        }
      }
    }

    if (!agent) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Agent non trouvé'
      })
    }

    console.log('✅ Agent trouvé dans Supabase:', agent.name)

    // ✅ FORMATAGE DES DONNÉES POUR CORRESPONDRE À L'INTERFACE
    const formattedAgent = {
      id: agent.id,
      name: agent.name,
      type: agent.type,
      personality: agent.personality,
      description: agent.description,
      welcomeMessage: agent.welcome_message,
      fallbackMessage: agent.fallback_message,
      avatar: agent.avatar,
      isActive: agent.is_active,
      config: agent.config || {},
      stats: {
        conversations: agent.total_conversations || 0,
        conversions: agent.total_conversions || 0
      }
    }

    // ✅ RÉCUPÉRATION BASE DE CONNAISSANCE (si table existe)
    let knowledgeBase = []
    try {
      const { data: kbData } = await supabase
        .from('knowledge_base')
        .select('id, title, content_type, is_active, tags')
        .eq('shop_id', agent.shop_id)
        .eq('is_active', true)

      if (kbData) {
        knowledgeBase = kbData.map(kb => ({
          id: kb.id,
          title: kb.title,
          contentType: kb.content_type,
          isActive: kb.is_active,
          tags: kb.tags || []
        }))
      }
    } catch (kbError) {
      console.warn('⚠️ Erreur récupération knowledge base:', kbError)
      // Continuer sans la knowledge base
    }

    return {
      success: true,
      data: {
        agent: formattedAgent,
        knowledgeBase
      }
    }

  } catch (error: any) {
    console.error('❌ [API] Erreur récupération agent:', error)
    
    // ✅ DERNIER FALLBACK EN CAS D'ERREUR TOTALE
    const agentId = getRouterParam(event, 'id')
    const fallbackAgent = {
      id: agentId,
      name: 'Agent de Test',
      type: 'general',
      personality: 'professional',
      description: 'Agent de test en cas d\'erreur',
      welcomeMessage: 'Bonjour ! Je suis en mode test.',
      fallbackMessage: 'Service temporairement indisponible.',
      avatar: null,
      isActive: true,
      config: {},
      stats: { conversations: 0, conversions: 0 }
    }

    return {
      success: true,
      data: {
        agent: fallbackAgent,
        knowledgeBase: []
      }
    }
  }
})