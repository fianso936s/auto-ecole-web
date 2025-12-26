import dotenv from 'dotenv';

dotenv.config();

const PROD_API_URL = process.env.PROD_API_URL || 'https://api.moniteur1d.com';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@moniteur1d.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || process.env.UNIFORM_PASSWORD || '';

async function testProduction() {
  console.log('🔍 TEST API DE PRODUCTION');
  console.log('='.repeat(60));
  console.log(`API URL: ${PROD_API_URL}`);
  console.log(`Email: ${ADMIN_EMAIL}`);
  console.log(`Mot de passe: ${ADMIN_PASSWORD ? '***' + ADMIN_PASSWORD.slice(-3) : 'NON DÉFINI'}`);
  console.log('');

  // Health check
  try {
    const healthResponse = await fetch(`${PROD_API_URL}/health`);
    if (healthResponse.ok) {
      const data = await healthResponse.json();
      console.log('✅ Health check OK:', data);
    } else {
      console.log('❌ Health check échoué:', healthResponse.status);
    }
  } catch (error: any) {
    console.log('❌ Erreur health check:', error.message);
  }

  // Test login
  if (ADMIN_PASSWORD) {
    try {
      const loginResponse = await fetch(`${PROD_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
      });

      if (loginResponse.ok) {
        const data = await loginResponse.json();
        console.log('✅ Login réussi:', data.user?.email);
      } else {
        const error = await loginResponse.json().catch(() => ({}));
        console.log('❌ Login échoué:', error.message || loginResponse.status);
        console.log('');
        console.log('💡 Vérifiez que:');
        console.log('   1. ADMIN_EMAIL et ADMIN_PASSWORD sont corrects dans .env de production');
        console.log('   2. L'utilisateur existe en base de données de production');
        console.log('   3. L'API de production est démarrée');
      }
    } catch (error: any) {
      console.log('❌ Erreur login:', error.message);
    }
  } else {
    console.log('⚠️  ADMIN_PASSWORD non défini, impossible de tester le login');
  }
}

testProduction().catch(console.error);
