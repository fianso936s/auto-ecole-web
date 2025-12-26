import dotenv from 'dotenv';

dotenv.config();

const PROD_API_URL = 'https://api.moniteur1d.com';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@moniteur1d.com';

interface LoginResponse {
  user?: {
    id: string;
    email: string;
    role: string;
    profile?: any;
  };
  message?: string;
  errors?: any[];
}

async function testProductionApi(email: string, password: string) {
  console.log('🌐 Test de connexion sur l\'API de PRODUCTION');
  console.log(`   URL: ${PROD_API_URL}/auth/login`);
  console.log(`   Email: ${email}`);
  console.log(`   Mot de passe: ${'*'.repeat(password.length)}`);
  console.log('─'.repeat(80));

  try {
    // Test 1: Vérifier que le serveur répond
    console.log('\n📡 Étape 1: Vérification que le serveur est accessible...');
    try {
      const healthCheck = await fetch(`${PROD_API_URL}/health`, {
        method: 'GET',
      });
      console.log(`   Status: ${healthCheck.status}`);
      console.log('   ✅ Serveur accessible');
    } catch (error: any) {
      console.log(`   ❌ Serveur non accessible: ${error.message}`);
      return;
    }

    // Test 2: Tentative de connexion
    console.log('\n🔐 Étape 2: Tentative de connexion...');
    const loginResponse = await fetch(`${PROD_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    console.log(`   Status HTTP: ${loginResponse.status} ${loginResponse.statusText}`);

    // Récupérer les cookies
    const cookies = loginResponse.headers.get('set-cookie');
    console.log(`   Cookies reçus: ${cookies ? '✅ Oui' : '❌ Non'}`);

    if (cookies) {
      const hasAccessToken = cookies.includes('accessToken');
      const hasRefreshToken = cookies.includes('refreshToken');
      console.log(`   - accessToken: ${hasAccessToken ? '✅' : '❌'}`);
      console.log(`   - refreshToken: ${hasRefreshToken ? '✅' : '❌'}`);
    }

    // Lire la réponse
    const data: LoginResponse = await loginResponse.json();

    if (loginResponse.ok && data.user) {
      console.log('\n✅ Connexion réussie !');
      console.log('\n📋 Données utilisateur retournées:');
      console.log(`   ID: ${data.user.id}`);
      console.log(`   Email: ${data.user.email}`);
      console.log(`   Rôle: ${data.user.role}`);
      if (data.user.profile) {
        console.log(`   Nom: ${data.user.profile.firstName} ${data.user.profile.lastName}`);
      }

      console.log('\n✅ L\'API de production fonctionne correctement !');
      return { success: true, user: data.user, cookies };
    } else {
      console.log('\n❌ Échec de la connexion');
      console.log(`   Message: ${data.message || 'Erreur inconnue'}`);
      if (data.errors) {
        console.log(`   Erreurs:`, data.errors);
      }

      // Analyser le problème
      if (loginResponse.status === 401) {
        console.log('\n🔍 Analyse:');
        console.log('   - Status 401 = Identifiants invalides');
        console.log('   - Le mot de passe ne correspond pas à celui en production');
        console.log('   - OU l\'utilisateur n\'existe pas sur le serveur de production');
        console.log('\n💡 Solutions possibles:');
        console.log('   1. Vérifiez que le mot de passe est correct pour la production');
        console.log('   2. Vérifiez que l\'utilisateur existe sur api.moniteur1d.com');
        console.log('   3. Le mot de passe en local peut être différent de celui en production');
      }

      return { success: false, error: data.message || 'Erreur inconnue' };
    }
  } catch (error: any) {
    console.log(`\n❌ Erreur lors du test: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  let email = ADMIN_EMAIL;
  let password = '';

  if (args.length >= 1) {
    email = args[0];
  }
  
  if (args.length >= 2) {
    password = args[1];
  } else {
    password = process.env.ADMIN_PASSWORD || '';
  }

  if (!password) {
    console.log('❌ Mot de passe requis');
    console.log('Usage: npm run test:prod-api -- [email] [password]');
    console.log(`Exemple: npm run test:prod-api -- ${ADMIN_EMAIL} VotreMotDePasse`);
    console.log('\nOu définissez ADMIN_PASSWORD dans .env');
    process.exit(1);
  }

  await testProductionApi(email, password);
}

main().catch(console.error);

