import dotenv from 'dotenv';

dotenv.config();

const API_URL = process.env.API_URL || process.env.VITE_API_URL || 'https://api.moniteur1d.com';
const API_PREFIX = process.env.API_PREFIX || ''; // Les routes sont directement sur /auth, pas /api/auth
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@moniteur1d.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

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

async function testApiLogin(email: string, password: string) {
  console.log('🌐 Test de connexion via l\'API');
  console.log(`   URL: ${API_URL}/auth/login`);
  console.log(`   Email: ${email}`);
  console.log(`   Mot de passe: ${'*'.repeat(password.length)}`);
  console.log('─'.repeat(80));

  try {
    // Test 1: Vérifier que le serveur répond
    console.log('\n📡 Étape 1: Vérification que le serveur est accessible...');
    try {
      const healthCheck = await fetch(`${API_URL}/health`, {
        method: 'GET',
        credentials: 'include',
      });
      console.log(`   Status: ${healthCheck.status} (${healthCheck.status === 401 ? 'Normal - non authentifié' : healthCheck.status})`);
      console.log('   ✅ Serveur accessible');
    } catch (error: any) {
      console.log(`   ❌ Serveur non accessible: ${error.message}`);
      console.log('\n💡 Assurez-vous que le serveur est démarré avec: npm run dev');
      return;
    }

    // Test 2: Tentative de connexion
    console.log('\n🔐 Étape 2: Tentative de connexion...');
    const loginResponse = await fetch(`${API_URL}/auth/login`, {
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

      // Test 3: Vérifier l'endpoint /me avec les cookies
      console.log('\n👤 Étape 3: Test de l\'endpoint /me...');
      
      // Note: Dans Node.js, on ne peut pas facilement gérer les cookies entre requêtes
      // Il faudrait utiliser un client HTTP qui gère les cookies (comme axios avec cookie jar)
      console.log('   ⚠️  Pour tester /me, vous devez utiliser un navigateur ou curl avec les cookies');
      console.log('\n   Exemple curl:');
      console.log(`   curl -X GET "${API_URL}/auth/me" \\`);
      if (cookies) {
        const cookieString = cookies.split(',').map((c: string) => c.split(';')[0]).join('; ');
        console.log(`     -H "Cookie: ${cookieString}"`);
      }

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
        console.log('   - Vérifiez que l\'email et le mot de passe sont corrects');
        console.log('   - Testez avec: npm run test:login -- email password');
      } else if (loginResponse.status === 400) {
        console.log('\n🔍 Analyse:');
        console.log('   - Status 400 = Requête invalide');
        console.log('   - Vérifiez le format de la requête');
      } else if (loginResponse.status === 500) {
        console.log('\n🔍 Analyse:');
        console.log('   - Status 500 = Erreur serveur');
        console.log('   - Vérifiez les logs du serveur backend');
      }

      return { success: false, error: data.message || 'Erreur inconnue' };
    }
  } catch (error: any) {
    console.log(`\n❌ Erreur lors du test: ${error.message}`);
    console.log('\n🔍 Causes possibles:');
    console.log('   - Le serveur backend n\'est pas démarré');
    console.log('   - L\'URL de l\'API est incorrecte');
    console.log('   - Problème de réseau/CORS');
    console.log('\n💡 Vérifiez que le serveur est démarré avec: npm run dev');
    return { success: false, error: error.message };
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  let email = ADMIN_EMAIL;
  let password = ADMIN_PASSWORD;

  if (args.length >= 1) {
    email = args[0];
  }
  
  if (args.length >= 2) {
    password = args[1];
  }

  if (!password) {
    console.log('❌ Mot de passe requis');
    console.log('Usage: npm run test:api-login -- [email] [password]');
    console.log(`Exemple: npm run test:api-login -- ${ADMIN_EMAIL} VotreMotDePasse`);
    process.exit(1);
  }

  await testApiLogin(email, password);
}

main().catch(console.error);

