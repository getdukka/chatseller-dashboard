// composables/useCache.ts
// Système de cache offline pour améliorer la résilience de l'application

export interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number // Time To Live en millisecondes
}

export const useCache = () => {
  const CACHE_PREFIX = 'chatseller_cache_'

  /**
   * Sauvegarder des données dans le cache
   * @param key - Clé unique pour identifier les données
   * @param data - Données à mettre en cache
   * @param ttl - Durée de validité du cache en ms (par défaut 5 minutes)
   */
  const set = <T>(key: string, data: T, ttl: number = 300000): void => {
    if (!process.client) return

    try {
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        ttl
      }

      localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(entry))
      console.log(`💾 [Cache] Sauvegardé: ${key} (TTL: ${ttl}ms)`)
    } catch (error) {
      console.warn('⚠️ [Cache] Erreur sauvegarde:', error)
      // LocalStorage plein ou désactivé - continuer sans bloquer
    }
  }

  /**
   * Récupérer des données du cache
   * @param key - Clé unique
   * @returns Les données ou null si expirées/inexistantes
   */
  const get = <T>(key: string): T | null => {
    if (!process.client) return null

    try {
      const cached = localStorage.getItem(`${CACHE_PREFIX}${key}`)
      if (!cached) return null

      const entry: CacheEntry<T> = JSON.parse(cached)
      const age = Date.now() - entry.timestamp

      // Vérifier si le cache est encore valide
      if (age > entry.ttl) {
        console.log(`🗑️ [Cache] Expiré: ${key} (age: ${age}ms, TTL: ${entry.ttl}ms)`)
        remove(key)
        return null
      }

      console.log(`✅ [Cache] Récupéré: ${key} (age: ${age}ms)`)
      return entry.data
    } catch (error) {
      console.warn('⚠️ [Cache] Erreur lecture:', error)
      return null
    }
  }

  /**
   * Supprimer une entrée du cache
   * @param key - Clé unique
   */
  const remove = (key: string): void => {
    if (!process.client) return

    try {
      localStorage.removeItem(`${CACHE_PREFIX}${key}`)
      console.log(`🗑️ [Cache] Supprimé: ${key}`)
    } catch (error) {
      console.warn('⚠️ [Cache] Erreur suppression:', error)
    }
  }

  /**
   * Nettoyer toutes les entrées expirées du cache
   */
  const cleanup = (): number => {
    if (!process.client) return 0

    let removed = 0

    try {
      const keys = Object.keys(localStorage)
      const cacheKeys = keys.filter(k => k.startsWith(CACHE_PREFIX))

      for (const fullKey of cacheKeys) {
        const key = fullKey.replace(CACHE_PREFIX, '')
        const data = get(key) // Ceci supprimera automatiquement si expiré
        if (!data) removed++
      }

      console.log(`🧹 [Cache] Nettoyage: ${removed} entrées expirées supprimées`)
    } catch (error) {
      console.warn('⚠️ [Cache] Erreur nettoyage:', error)
    }

    return removed
  }

  /**
   * Vider complètement le cache
   */
  const clear = (): void => {
    if (!process.client) return

    try {
      const keys = Object.keys(localStorage)
      const cacheKeys = keys.filter(k => k.startsWith(CACHE_PREFIX))

      for (const key of cacheKeys) {
        localStorage.removeItem(key)
      }

      console.log(`🗑️ [Cache] Vidé: ${cacheKeys.length} entrées supprimées`)
    } catch (error) {
      console.warn('⚠️ [Cache] Erreur vidage:', error)
    }
  }

  /**
   * Obtenir la taille totale du cache en octets
   */
  const size = (): number => {
    if (!process.client) return 0

    try {
      const keys = Object.keys(localStorage)
      const cacheKeys = keys.filter(k => k.startsWith(CACHE_PREFIX))

      let totalSize = 0
      for (const key of cacheKeys) {
        const value = localStorage.getItem(key)
        if (value) {
          totalSize += key.length + value.length
        }
      }

      return totalSize
    } catch (error) {
      console.warn('⚠️ [Cache] Erreur calcul taille:', error)
      return 0
    }
  }

  /**
   * Helper : Wrapper pour fetch avec cache automatique
   * @param key - Clé de cache
   * @param fetchFn - Fonction qui fait l'appel API
   * @param ttl - Durée de vie du cache
   * @param forceRefresh - Forcer le rechargement même si cache valide
   */
  const fetchWithCache = async <T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl: number = 300000,
    forceRefresh: boolean = false
  ): Promise<{ data: T; fromCache: boolean }> => {
    // Essayer le cache d'abord (sauf si forceRefresh)
    if (!forceRefresh) {
      const cached = get<T>(key)
      if (cached) {
        console.log(`🚀 [Cache] Utilisation cache pour: ${key}`)
        return { data: cached, fromCache: true }
      }
    }

    // Sinon faire l'appel API
    try {
      console.log(`📡 [Cache] Fetch fresh data pour: ${key}`)
      const data = await fetchFn()

      // Sauvegarder dans le cache
      set(key, data, ttl)

      return { data, fromCache: false }
    } catch (error) {
      // En cas d'erreur, essayer de retourner le cache même expiré
      const staleCache = get<T>(key)
      if (staleCache) {
        console.warn(`⚠️ [Cache] Erreur fetch, utilisation cache expiré pour: ${key}`)
        return { data: staleCache, fromCache: true }
      }

      // Si pas de cache du tout, propager l'erreur
      throw error
    }
  }

  return {
    set,
    get,
    remove,
    cleanup,
    clear,
    size,
    fetchWithCache
  }
}
