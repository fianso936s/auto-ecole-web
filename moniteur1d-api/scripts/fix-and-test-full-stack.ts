import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

dotenv.config();

const prisma = new PrismaClient();

interface Step {
  number: number;
  title: string;
  description: string;
  action: () => Promise<boolean>;
  manual?: string;
}

const steps: Step[] = [];
let currentStep = 0;

function addStep(title: string, description: string, action: () => Promise<boolean>, manual?: string) {
  steps.push({
    number: steps.length + 1,
    title,
    description,
    action,
    manual
  });
}

// Étape 1: Vérifier les identifiants de production
addStep(
  'Vérifier les identifiants de production',
  'Vérification des identifiants admin pour l\'API de production',
  async () => {
    console.log('\n📋 ÉTAPE 1: Vérification des identifiants de production\n');
    
    const envPath = join(process.cwd(), '.env');
    const envProdPath = join(process.cwd(), '.env.production');
    
    let envContent = '';
    if (existsSync(envPath)) {
      envContent = readFileSync(envPath, 'utf-8');
    } else if (existsSync(envProdPath)) {
      envContent = readFileSync(envProdPath, 'utf-8');
    } else {
      console.log('⚠️  Aucun fichier .env trouvé');
      return false;
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@moniteur1d.com';
    const adminPassword = process.env.ADMIN_PASSWORD || process.env.UNIFORM_PASSWORD || '';
    
    console.log(`📧 Email admin configuré: ${adminEmail}`);
    console.log(`🔐 Mot de passe: ${adminPassword ? '***' + adminPassword.slice(-3) : 'NON DÉFINI'}`);
    
    // Vérifier en base de données locale
    try {
      const user = await prisma.user.findUnique({
        where: { email: adminEmail.toLowerCase().trim() }
      });
      
      if (user) {
        console.log(`✅ Utilisateur trouvé en base de données locale`);
        console.log(`   ID: ${user.id}`);
        console.log(`   Rôle: ${user.role}`);
        console.log(`   Mot de passe présent: ${user.password ? 'Oui' : 'Non'}`);
      } else {
        console.log(`⚠️  Utilisateur ${adminEmail} non trouvé en base de données locale`);
        console.log(`💡 Vous devrez peut-être créer cet utilisateur sur l'API de production`);
      }
    } catch (error: any) {
      console.log(`❌ Erreur lors de la vérification: ${error.message}`);
    }
    
    console.log('\n📝 INSTRUCTIONS POUR L\'API DE PRODUCTION:');
    console.log('1. Connectez-vous à votre serveur Hostinger (SSH ou hPanel)');
    console.log('2. Allez dans le dossier de l\'API: cd moniteur1d-api');
    console.log('3. Vérifiez/modifiez le fichier .env avec les identifiants:');
    console.log(`   ADMIN_EMAIL="${adminEmail}"`);
    console.log(`   ADMIN_PASSWORD="votre_mot_de_passe_production"`);
    console.log('4. Assurez-vous que l\'utilisateur admin existe en base de données');
    console.log('5. Redémarrez l\'application Node.js sur Hostinger');
    
    return true;
  },
  'Configurez les identifiants ADMIN_EMAIL et ADMIN_PASSWORD dans le fichier .env de production sur Hostinger'
);

// Étape 2: Vérifier si le frontend local est démarré
addStep(
  'Vérifier le frontend local',
  'Vérification si le serveur frontend local est accessible',
  async () => {
    console.log('\n📋 ÉTAPE 2: Vérification du frontend local\n');
    
    const frontendUrl = process.env.LOCAL_FRONTEND_URL || 'http://localhost:5173';
    
    try {
      const response = await fetch(frontendUrl, {
        method: 'GET',
        signal: AbortSignal.timeout(2000)
      });
      
      if (response.ok) {
        console.log(`✅ Frontend local accessible sur ${frontendUrl}`);
        return true;
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log(`❌ Frontend local non accessible (timeout)`);
      } else {
        console.log(`❌ Frontend local non accessible: ${error.message}`);
      }
    }
    
    console.log('\n📝 INSTRUCTIONS POUR DÉMARRER LE FRONTEND LOCAL:');
    console.log('1. Ouvrez un NOUVEAU terminal (gardez celui-ci ouvert)');
    console.log('2. Naviguez vers le dossier racine du projet:');
    console.log('   cd C:\\Users\\asus\\Desktop\\moniteur1d-web');
    console.log('3. Installez les dépendances si nécessaire:');
    console.log('   npm install');
    console.log('4. Démarrez le serveur de développement:');
    console.log('   npm run dev');
    console.log('5. Attendez que le serveur démarre (vous verrez "Local: http://localhost:5173")');
    console.log('6. Revenez dans ce terminal et relancez le test');
    
    return false;
  },
  'Démarrez le frontend local avec: npm run dev dans un autre terminal'
);

// Étape 3: Créer un script PowerShell pour démarrer le frontend
addStep(
  'Créer un script de démarrage automatique',
  'Création d\'un script PowerShell pour démarrer le frontend automatiquement',
  async () => {
    console.log('\n📋 ÉTAPE 3: Création d\'un script de démarrage\n');
    
    const scriptPath = join(process.cwd(), '..', 'start-frontend.ps1');
    const scriptContent = `# Script pour démarrer le frontend local
# Usage: .\\start-frontend.ps1

Write-Host "🚀 Démarrage du frontend local..." -ForegroundColor Cyan

# Aller dans le dossier racine
$rootPath = Split-Path -Parent $PSScriptRoot
Set-Location $rootPath

# Vérifier si node_modules existe
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installation des dépendances..." -ForegroundColor Yellow
    npm install
}

# Démarrer le serveur de développement
Write-Host "🌐 Démarrage du serveur Vite..." -ForegroundColor Green
npm run dev
`;

    try {
      writeFileSync(scriptPath, scriptContent, 'utf-8');
      console.log(`✅ Script créé: ${scriptPath}`);
      console.log('\n💡 Pour démarrer le frontend, exécutez dans un nouveau terminal:');
      console.log(`   .\\start-frontend.ps1`);
      console.log('   ou');
      console.log(`   powershell -ExecutionPolicy Bypass -File start-frontend.ps1`);
      return true;
    } catch (error: any) {
      console.log(`❌ Erreur lors de la création du script: ${error.message}`);
      return false;
    }
  }
);

// Étape 4: Créer un script pour tester la production
addStep(
  'Créer un script de test production',
  'Création d\'un script pour tester uniquement l\'API de production',
  async () => {
    console.log('\n📋 ÉTAPE 4: Création d\'un script de test production\n');
    
    const scriptPath = join(process.cwd(), 'scripts', 'test-production-only.ts');
    const scriptContent = `import dotenv from 'dotenv';

dotenv.config();

const PROD_API_URL = process.env.PROD_API_URL || 'https://api.moniteur1d.com';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@moniteur1d.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || process.env.UNIFORM_PASSWORD || '';

async function testProduction() {
  console.log('🔍 TEST API DE PRODUCTION');
  console.log('='.repeat(60));
  console.log(\`API URL: \${PROD_API_URL}\`);
  console.log(\`Email: \${ADMIN_EMAIL}\`);
  console.log(\`Mot de passe: \${ADMIN_PASSWORD ? '***' + ADMIN_PASSWORD.slice(-3) : 'NON DÉFINI'}\`);
  console.log('');

  // Health check
  try {
    const healthResponse = await fetch(\`\${PROD_API_URL}/health\`);
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
      const loginResponse = await fetch(\`\${PROD_API_URL}/auth/login\`, {
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
        console.log('   2. L\'utilisateur existe en base de données de production');
        console.log('   3. L\'API de production est démarrée');
      }
    } catch (error: any) {
      console.log('❌ Erreur login:', error.message);
    }
  } else {
    console.log('⚠️  ADMIN_PASSWORD non défini, impossible de tester le login');
  }
}

testProduction().catch(console.error);
`;

    try {
      writeFileSync(scriptPath, scriptContent, 'utf-8');
      console.log(`✅ Script créé: ${scriptPath}`);
      console.log('\n💡 Pour tester uniquement la production:');
      console.log('   npm run test:prod');
      return true;
    } catch (error: any) {
      console.log(`❌ Erreur lors de la création du script: ${error.message}`);
      return false;
    }
  }
);

async function runSteps() {
  console.log('🔧 GUIDE DE RÉSOLUTION DES PROBLÈMES');
  console.log('='.repeat(80));
  console.log('');
  
  for (const step of steps) {
    currentStep = step.number;
    console.log(`\n${'='.repeat(80)}`);
    console.log(`ÉTAPE ${step.number}: ${step.title}`);
    console.log('='.repeat(80));
    console.log(step.description);
    console.log('');
    
    const success = await step.action();
    
    if (!success && step.manual) {
      console.log('\n📌 ACTION MANUELLE REQUISE:');
      console.log(step.manual);
    }
    
    if (step.number < steps.length) {
      console.log('\n⏸️  Appuyez sur Entrée pour continuer à l\'étape suivante...');
      // En mode automatique, on continue directement
    }
  }
  
  console.log('\n\n' + '='.repeat(80));
  console.log('✅ GUIDE TERMINÉ');
  console.log('='.repeat(80));
  console.log('\n📋 RÉSUMÉ DES ACTIONS À EFFECTUER:');
  console.log('\n1. POUR L\'API DE PRODUCTION:');
  console.log('   - Configurez ADMIN_EMAIL et ADMIN_PASSWORD dans .env de production');
  console.log('   - Assurez-vous que l\'utilisateur existe en base de données');
  console.log('   - Redémarrez l\'application Node.js sur Hostinger');
  console.log('\n2. POUR LE FRONTEND LOCAL:');
  console.log('   - Ouvrez un nouveau terminal');
  console.log('   - Exécutez: .\\start-frontend.ps1');
  console.log('   - Ou manuellement: cd moniteur1d-web && npm run dev');
  console.log('\n3. POUR RELANCER LES TESTS:');
  console.log('   - npm run test:full-stack');
  console.log('   - Ou pour tester uniquement la production: npm run test:prod');
}

runSteps()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error('❌ Erreur:', error);
    await prisma.$disconnect();
    process.exit(1);
  });

