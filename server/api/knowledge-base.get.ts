export default defineEventHandler(async (event) => {
  // Données de démonstration
  const knowledgeBase = [
    {
      id: '1',
      title: 'Catalogue Produits',
      type: 'csv',
      size: '2.3 MB',
      status: 'active',
      lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      entriesCount: 145
    },
    {
      id: '2',
      title: 'Politique de Retour',
      type: 'pdf',
      size: '856 KB',
      status: 'active',
      lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      entriesCount: 1
    },
    {
      id: '3',
      title: 'FAQ Clients',
      type: 'manual',
      size: '1.1 MB',
      status: 'active',
      lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      entriesCount: 67
    }
  ]
  
  return {
    success: true,
    data: knowledgeBase,
    total: knowledgeBase.length
  }
})