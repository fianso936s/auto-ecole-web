import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const API_URL = process.env.API_URL || 'http://localhost:3001';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

interface TestResult {
  step: string;
  success: boolean;
  message: string;
  data?: any;
}

async function testFullAuthFlow(email: string, password: string) {
  const results: TestResult[] = [];

  console.log('🧪 Test complet du flux d\'authentification');
  console.log(`   Email: ${email}`);
  console.log(`   API: ${API_URL}`);
  console.log(`   Frontend: ${FRONTEND_URL}\n`);
  console.log('─'.repeat(80));

  // Étape 1: Vérifier l'utilisateur en base de données
  console.log('\n📊 Étape 1: Vérification en base de données...');
  try {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: { profile: true }
    });

    if (!user) {
      results.push({
        step: 'Database Check',
        success: false,
        message: `Utilisateur non trouvé avec l'email: ${normalizedEmail}`
      });
      console.log('❌ Utilisateur non trouvé');
      return results;
    }

    console.log(`✅ Utilisateur trouvé:`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Rôle: ${user.role}`);
    console.log(`   Mot de passe: ${user.password ? '✅ Présent' : '❌ Absent'}`);

    if (!user.password) {
      results.push({
        step: 'Database Check',
        success: false,
        message: 'L\'utilisateur n\'a pas de mot de passe'
      });
      return results;
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    console.log(`   Mot de passe valide: ${passwordValid ? '✅ Oui' : '❌ Non'}`);

    results.push({
      step: 'Database Check',
      success: passwordValid,
      message: passwordValid ? 'Utilisateur et mot de passe valides' : 'Mot de passe invalide',
      data: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });

    if (!passwordValid) {
      console.log('\n❌ Le mot de passe ne correspond pas. Arrêt du test.');
      return results;
    }

  } catch (error: any) {
    results.push({
      step: 'Database Check',
      success: false,
      message: `Erreur: ${error.message}`
    });
    console.log(`❌ Erreur: ${error.message}`);
    return results;
  }

  // Étape 2: Test de connexion API
  console.log('\n🌐 Étape 2: Test de connexion API...');
  try {
    const loginResponse = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const loginData = await loginResponse.json();

    if (loginResponse.ok && loginData.user) {
      console.log('✅ Connexion API réussie');
      console.log(`   Utilisateur retourné: ${loginData.user.email}`);
      console.log(`   Rôle: ${loginData.user.role}`);

      results.push({
        step: 'API Login',
        success: true,
        message: 'Connexion API réussie',
        data: loginData.user
      });

      // Vérifier les cookies
      const cookies = loginResponse.headers.get('set-cookie');
      if (cookies) {
        const hasAccessToken = cookies.includes('accessToken');
        const hasRefreshToken = cookies.includes('refreshToken');
        console.log(`   Cookies:`);
        console.log(`   - accessToken: ${hasAccessToken ? '✅' : '❌'}`);
        console.log(`   - refreshToken: ${hasRefreshToken ? '✅' : '❌'}`);

        results.push({
          step: 'API Cookies',
          success: hasAccessToken && hasRefreshToken,
          message: hasAccessToken && hasRefreshToken 
            ? 'Cookies correctement définis' 
            : 'Cookies manquants ou incorrects'
        });
      }

    } else {
      console.log('❌ Échec de la connexion API');
      console.log(`   Status: ${loginResponse.status}`);
      console.log(`   Message: ${loginData.message || 'Erreur inconnue'}`);

      results.push({
        step: 'API Login',
        success: false,
        message: loginData.message || `Erreur ${loginResponse.status}`
      });
    }

  } catch (error: any) {
    console.log(`❌ Erreur lors de la connexion API: ${error.message}`);
    results.push({
      step: 'API Login',
      success: false,
      message: `Erreur réseau: ${error.message}`
    });
  }

  // Étape 3: Test de l'endpoint /me
  console.log('\n👤 Étape 3: Test de l\'endpoint /me...');
  try {
    // Simuler une requête avec cookies (nécessite un vrai navigateur ou curl)
    console.log('⚠️  Pour tester /me, vous devez utiliser un navigateur ou curl avec les cookies');
    console.log('   Exemple curl:');
    console.log(`   curl -X GET "${API_URL}/api/auth/me" \\`);
    console.log(`     -H "Cookie: accessToken=<token>"`);

    results.push({
      step: 'API /me',
      success: false,
      message: 'Test manuel requis (nécessite cookies)'
    });

  } catch (error: any) {
    results.push({
      step: 'API /me',
      success: false,
      message: `Erreur: ${error.message}`
    });
  }

  // Résumé
  console.log('\n\n📋 Résumé des tests:');
  console.log('─'.repeat(80));
  results.forEach((result, index) => {
    const icon = result.success ? '✅' : '❌';
    console.log(`${index + 1}. ${icon} ${result.step}: ${result.message}`);
  });

  const successCount = results.filter(r => r.success).length;
  const totalCount = results.length;
  console.log(`\n📊 Résultat: ${successCount}/${totalCount} tests réussis`);

  return results;
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('Usage: npm run test:auth-flow -- <email> <password>');
    console.log('Exemple: npm run test:auth-flow -- admin@moniteur1d.com MonMotDePasse123');
    process.exit(1);
  }

  const email = args[0];
  const password = args[1];

  await prisma.$connect();
  await testFullAuthFlow(email, password);
  await prisma.$disconnect();
}

main().catch(console.error);

