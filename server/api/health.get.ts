export default defineEventHandler(async (event) => {
  return {
    status: 'healthy',
    service: 'chatseller-dashboard',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      local: 'http://localhost:3000/api',
      external: 'https://chatseller-api-production.up.railway.app'
    }
  }
})