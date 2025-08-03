// server/api/test.get.ts
export default defineEventHandler(async (event) => {
  console.log('🚀 Test endpoint appelé')
  
  return {
    success: true,
    message: 'ChatSeller API endpoints fonctionnent !',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  }
})