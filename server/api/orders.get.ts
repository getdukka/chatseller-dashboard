export default defineEventHandler(async (event) => {
  // Données de démonstration
  const mockOrders = [
    {
      id: '1',
      customerName: 'Pierre Martin',
      customerEmail: 'pierre.martin@email.com',
      customerPhone: '+33 6 12 34 56 78',
      productName: 'MacBook Air M3',
      quantity: 1,
      totalAmount: 1299.00,
      paymentMethod: 'carte_bancaire',
      status: 'confirmed',
      address: '123 Rue de la Paix, 75001 Paris',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      conversationId: '2'
    },
    {
      id: '2',
      customerName: 'Sophie Bernard',
      customerEmail: 'sophie.bernard@email.com',
      customerPhone: '+33 6 98 76 54 32',
      productName: 'iPhone 15',
      quantity: 1,
      totalAmount: 899.00,
      paymentMethod: 'paypal',
      status: 'pending',
      address: '456 Avenue des Champs, 75008 Paris',
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      conversationId: '4'
    }
  ]
  
  return {
    success: true,
    data: mockOrders,
    total: mockOrders.length,
    revenue: mockOrders.reduce((sum, order) => sum + order.totalAmount, 0)
  }
})