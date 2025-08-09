// test-api.js - SCRIPT POUR TESTER L'API
// Exécuter avec: node test-api.js

async function testAPI() {
  const API_BASE = 'https://chatseller-api-production.up.railway.app';
  
  console.log('🧪 === TEST CONNECTIVITÉ API ===\n');
  
  // ✅ TEST 1: Health Check
  try {
    console.log('1. Test Health Check...');
    const healthResponse = await fetch(`${API_BASE}/health`);
    const healthData = await healthResponse.json();
    
    console.log('   Status:', healthResponse.status);
    console.log('   Data:', JSON.stringify(healthData, null, 2));
    
    if (healthResponse.ok) {
      console.log('   ✅ Health Check: OK\n');
    } else {
      console.log('   ❌ Health Check: FAILED\n');
    }
  } catch (error) {
    console.log('   ❌ Health Check Error:', error.message, '\n');
  }
  
  // ✅ TEST 2: Root Endpoint
  try {
    console.log('2. Test Root Endpoint...');
    const rootResponse = await fetch(`${API_BASE}/`);
    const rootData = await rootResponse.json();
    
    console.log('   Status:', rootResponse.status);
    console.log('   Available Endpoints:', rootData.endpoints);
    
    if (rootResponse.ok) {
      console.log('   ✅ Root Endpoint: OK\n');
    } else {
      console.log('   ❌ Root Endpoint: FAILED\n');
    }
  } catch (error) {
    console.log('   ❌ Root Error:', error.message, '\n');
  }
  
  // ✅ TEST 3: Billing Diagnostic
  try {
    console.log('3. Test Billing Diagnostic...');
    const billingResponse = await fetch(`${API_BASE}/api/v1/billing/diagnostic`);
    const billingData = await billingResponse.json();
    
    console.log('   Status:', billingResponse.status);
    console.log('   Prisma Test:', billingData.diagnostic?.prisma?.success ? '✅ OK' : '❌ FAILED');
    console.log('   Supabase Test:', billingData.diagnostic?.supabase?.success ? '✅ OK' : '❌ FAILED');
    
    if (billingResponse.ok) {
      console.log('   ✅ Billing Diagnostic: OK\n');
    } else {
      console.log('   ❌ Billing Diagnostic: FAILED\n');
    }
  } catch (error) {
    console.log('   ❌ Billing Diagnostic Error:', error.message, '\n');
  }
  
  // ✅ TEST 4: Test route protégée (sans auth - doit échouer)
  try {
    console.log('4. Test Route Protégée (sans auth)...');
    const agentsResponse = await fetch(`${API_BASE}/api/v1/agents`);
    
    console.log('   Status:', agentsResponse.status);
    
    if (agentsResponse.status === 401) {
      console.log('   ✅ Auth Protection: OK (401 attendu)\n');
    } else {
      console.log('   ⚠️ Auth Protection: Unexpected status\n');
    }
  } catch (error) {
    console.log('   ❌ Protected Route Error:', error.message, '\n');
  }
  
  console.log('🏁 Test terminé !');
}

// Exécuter le test
testAPI().catch(console.error);