import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

interface AuditResult {
  category: string;
  check: string;
  status: 'ok' | 'warning' | 'error' | 'info';
  message: string;
  solution?: string;
  details?: any;
}

const results: AuditResult[] = [];

// URLs de production
const PROD_API_URL = process.env.PROD_API_URL || 'https://api.moniteur1d.com';
const PROD_FRONTEND_URL = process.env.PROD_FRONTEND_URL || 'https://moniteur1d.com';
const PROD_FRONTEND_ALT = process.env.PROD_FRONTEND_ALT || 'https://www.moniteur1d.com';

function addResult(category: string, check: string, status: 'ok' | 'warning' | 'error', message: string, solution?: string, details?: any) {
  results.push({ category, check, status, message, solution, details });
}

// 1. Vérification des URLs de production
async function auditProductionUrls() {
  console.log('\n🌐 1. Vérification des URLs de Production\n');
  
  console.log(`   API: ${PROD_API_URL}`);
  console.log(`   Frontend: ${PROD_FRONTEND_URL}`);
  console.log(`   Frontend Alt: ${PROD_FRONTEND_ALT}\n`);

  addResult('URLs', 'API URL', 'ok', `API URL: ${PROD_API_URL}`);
  addResult('URLs', 'Frontend URL', 'ok', `Frontend URL: ${PROD_FRONTEND_URL}`);
  
  // Vérifier le format HTTPS
  if (!PROD_API_URL.startsWith('https://')) {
    addResult('URLs', 'API HTTPS', 'error', 'API URL doit utiliser HTTPS en production', 'Configurer HTTPS pour l\'API');
  } else {
    addResult('URLs', 'API HTTPS', 'ok', 'API utilise HTTPS');
  }

  if (!PROD_FRONTEND_URL.startsWith('https://')) {
    addResult('URLs', 'Frontend HTTPS', 'error', 'Frontend URL doit utiliser HTTPS en production', 'Configurer HTTPS pour le frontend');
  } else {
    addResult('URLs', 'Frontend HTTPS', 'ok', 'Frontend utilise HTTPS');
  }
}

// 2. Test de connectivité réseau
async function auditNetworkConnectivity() {
  console.log('\n📡 2. Test de Connectivité Réseau\n');
  
  // Test API
  try {
    console.log(`   Test de connexion à ${PROD_API_URL}...`);
    const startTime = Date.now();
    const response = await fetch(`${PROD_API_URL}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(10000) // 10 secondes timeout
    });
    const endTime = Date.now();
    const latency = endTime - startTime;

    if (response.ok) {
      addResult('Network', 'API Reachable', 'ok', `API accessible (latence: ${latency}ms)`);
      
      // Vérifier les headers de sécurité
      const headers = Object.fromEntries(response.headers.entries());
      if (headers['strict-transport-security']) {
        addResult('Network', 'HSTS Header', 'ok', 'HSTS activé');
      } else {
        addResult('Network', 'HSTS Header', 'warning', 'HSTS non détecté', 'Activer HSTS pour la sécurité');
      }
    } else {
      addResult('Network', 'API Reachable', 'error', `API retourne ${response.status}`, 'Vérifier que le serveur API est démarré');
    }
  } catch (error: any) {
    if (error.name === 'TimeoutError' || error.message.includes('timeout')) {
      addResult('Network', 'API Reachable', 'error', 'Timeout lors de la connexion à l\'API', 'Vérifier le firewall, le DNS, ou que le serveur est démarré');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      addResult('Network', 'API DNS', 'error', 'DNS non résolu pour l\'API', 'Vérifier la configuration DNS de api.moniteur1d.com');
    } else if (error.message.includes('certificate') || error.message.includes('SSL')) {
      addResult('Network', 'API SSL', 'error', 'Erreur de certificat SSL', 'Vérifier le certificat SSL de l\'API');
    } else {
      addResult('Network', 'API Reachable', 'error', `Erreur: ${error.message}`, 'Vérifier la connectivité réseau');
    }
  }

  // Test Frontend
  try {
    console.log(`   Test de connexion à ${PROD_FRONTEND_URL}...`);
    const response = await fetch(PROD_FRONTEND_URL, {
      method: 'GET',
      signal: AbortSignal.timeout(10000)
    });
    
    if (response.ok || response.status === 200) {
      addResult('Network', 'Frontend Reachable', 'ok', 'Frontend accessible');
    } else {
      addResult('Network', 'Frontend Reachable', 'warning', `Frontend retourne ${response.status}`);
    }
  } catch (error: any) {
    addResult('Network', 'Frontend Reachable', 'warning', `Frontend non accessible: ${error.message}`);
  }
}

// 3. Vérification CORS pour la production
async function auditProductionCORS() {
  console.log('\n🔒 3. Vérification CORS Production\n');
  
  try {
    // Test CORS depuis le frontend vers l'API
    console.log(`   Test CORS depuis ${PROD_FRONTEND_URL} vers ${PROD_API_URL}...`);
    
    const response = await fetch(`${PROD_API_URL}/health`, {
      method: 'GET',
      headers: {
        'Origin': PROD_FRONTEND_URL
      },
      signal: AbortSignal.timeout(10000)
    });

    const corsOrigin = response.headers.get('access-control-allow-origin');
    const corsCredentials = response.headers.get('access-control-allow-credentials');
    const corsMethods = response.headers.get('access-control-allow-methods');

    if (corsOrigin) {
      if (corsOrigin === PROD_FRONTEND_URL || corsOrigin === '*') {
        addResult('CORS', 'Origin Header', 'ok', `CORS Origin: ${corsOrigin}`);
      } else {
        addResult('CORS', 'Origin Header', 'error', `CORS Origin incorrect: ${corsOrigin}`, `Configurer CORS pour autoriser ${PROD_FRONTEND_URL}`);
      }
    } else {
      addResult('CORS', 'Origin Header', 'error', 'Header CORS Origin manquant', 'Vérifier la configuration CORS du serveur');
    }

    if (corsCredentials === 'true') {
      addResult('CORS', 'Credentials', 'ok', 'CORS credentials activé');
    } else {
      addResult('CORS', 'Credentials', 'error', 'CORS credentials non activé', 'Activer credentials: true dans la config CORS');
    }

    if (corsMethods && corsMethods.includes('POST') && corsMethods.includes('GET')) {
      addResult('CORS', 'Methods', 'ok', `Méthodes autorisées: ${corsMethods}`);
    } else {
      addResult('CORS', 'Methods', 'warning', `Méthodes: ${corsMethods || 'non détectées'}`);
    }

    // Test OPTIONS (preflight)
    try {
      const optionsResponse = await fetch(`${PROD_API_URL}/auth/login`, {
        method: 'OPTIONS',
        headers: {
          'Origin': PROD_FRONTEND_URL,
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type'
        },
        signal: AbortSignal.timeout(10000)
      });

      if (optionsResponse.ok || optionsResponse.status === 204) {
        addResult('CORS', 'Preflight', 'ok', 'Requête OPTIONS (preflight) fonctionne');
      } else {
        addResult('CORS', 'Preflight', 'error', `Preflight retourne ${optionsResponse.status}`, 'Vérifier la gestion des requêtes OPTIONS');
      }
    } catch (error: any) {
      addResult('CORS', 'Preflight', 'warning', `Erreur preflight: ${error.message}`);
    }

  } catch (error: any) {
    addResult('CORS', 'CORS Test', 'error', `Erreur lors du test CORS: ${error.message}`, 'Vérifier que l\'API est accessible');
  }
}

// 4. Vérification de la configuration serveur
async function auditServerConfiguration() {
  console.log('\n⚙️  4. Configuration Serveur\n');
  
  try {
    const indexPath = path.join(__dirname, '../src/index.ts');
    const indexContent = fs.readFileSync(indexPath, 'utf-8');
    
    // Vérifier les origines CORS autorisées
    const allowedOriginsMatch = indexContent.match(/const allowedCorsOrigins[^=]+=\s*\[([^\]]+)\]/s);
    if (allowedOriginsMatch) {
      const origins = allowedOriginsMatch[1];
      if (origins.includes('moniteur1d.com')) {
        addResult('Server Config', 'CORS Origins', 'ok', 'Origines moniteur1d.com configurées');
      } else {
        addResult('Server Config', 'CORS Origins', 'error', 'Origines moniteur1d.com non trouvées', 'Ajouter moniteur1d.com aux origines CORS');
      }
    }

    // Vérifier FRONTEND_URL
    if (indexContent.includes('FRONTEND_URL')) {
      addResult('Server Config', 'FRONTEND_URL Usage', 'ok', 'FRONTEND_URL utilisé dans le code');
    }

    // Vérifier trust proxy
    if (indexContent.includes("app.set('trust proxy'")) {
      addResult('Server Config', 'Trust Proxy', 'ok', 'Trust proxy activé (nécessaire pour reverse proxy)');
    } else {
      addResult('Server Config', 'Trust Proxy', 'warning', 'Trust proxy non activé', 'Activer trust proxy si derrière un reverse proxy');
    }

    // Vérifier NODE_ENV
    if (indexContent.includes('process.env.NODE_ENV === "production"')) {
      addResult('Server Config', 'Production Mode', 'ok', 'Code vérifie NODE_ENV production');
    }

  } catch (error: any) {
    addResult('Server Config', 'File Read', 'error', `Erreur: ${error.message}`);
  }
}

// 5. Test d'authentification en production
async function auditProductionAuth() {
  console.log('\n🔐 5. Test d\'Authentification Production\n');
  
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@moniteur1d.com';
  const adminPassword = process.env.ADMIN_PASSWORD || process.env.UNIFORM_PASSWORD;

  if (!adminPassword) {
    addResult('Auth', 'Credentials', 'warning', 'ADMIN_PASSWORD non défini', 'Définir ADMIN_PASSWORD pour tester');
    return;
  }

  try {
    console.log(`   Test de login avec ${adminEmail}...`);
    const loginResponse = await fetch(`${PROD_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': PROD_FRONTEND_URL
      },
      body: JSON.stringify({ email: adminEmail, password: adminPassword }),
      signal: AbortSignal.timeout(15000)
    });

    const responseText = await loginResponse.text();
    let data: any;
    try {
      data = JSON.parse(responseText);
    } catch {
      addResult('Auth', 'Login Response', 'error', `Réponse non JSON: ${responseText.substring(0, 100)}`, 'Vérifier les logs du serveur');
      return;
    }

    if (loginResponse.ok && data.user) {
      addResult('Auth', 'Login Success', 'ok', 'Connexion réussie en production');
      
      // Vérifier les cookies
      const cookies = loginResponse.headers.get('set-cookie');
      if (cookies) {
        const hasAccessToken = cookies.includes('accessToken');
        const hasRefreshToken = cookies.includes('refreshToken');
        
        if (hasAccessToken && hasRefreshToken) {
          addResult('Auth', 'Cookies Set', 'ok', 'Cookies accessToken et refreshToken définis');
        } else {
          addResult('Auth', 'Cookies Set', 'error', 'Cookies manquants', 'Vérifier la configuration des cookies');
        }

        // Vérifier Secure flag
        if (cookies.includes('Secure')) {
          addResult('Auth', 'Cookie Secure', 'ok', 'Flag Secure présent sur les cookies');
        } else {
          addResult('Auth', 'Cookie Secure', 'error', 'Flag Secure manquant', 'Activer secure: true pour les cookies en production');
        }

        // Vérifier SameSite
        if (cookies.includes('SameSite=Strict') || cookies.includes('SameSite=Lax')) {
          addResult('Auth', 'Cookie SameSite', 'ok', 'SameSite configuré');
        } else {
          addResult('Auth', 'Cookie SameSite', 'warning', 'SameSite non détecté', 'Configurer SameSite pour les cookies');
        }
      } else {
        addResult('Auth', 'Cookies Set', 'error', 'Aucun cookie reçu', 'Vérifier la configuration des cookies');
      }
    } else {
      addResult('Auth', 'Login Success', 'error', `Échec de connexion: ${data.message || loginResponse.status}`, 'Vérifier les credentials et la base de données');
    }
  } catch (error: any) {
    if (error.name === 'TimeoutError') {
      addResult('Auth', 'Login Timeout', 'error', 'Timeout lors de la connexion', 'Vérifier la latence réseau ou les problèmes de serveur');
    } else {
      addResult('Auth', 'Login Error', 'error', `Erreur: ${error.message}`, 'Vérifier la connectivité');
    }
  }
}

// 6. Vérification SSL/TLS
async function auditSSL() {
  console.log('\n🔒 6. Vérification SSL/TLS\n');
  
  try {
    const apiUrl = new URL(PROD_API_URL);
    const hostname = apiUrl.hostname;
    
    // Note: La vérification SSL complète nécessiterait des outils comme openssl
    // On vérifie juste que HTTPS est utilisé
    if (apiUrl.protocol === 'https:') {
      addResult('SSL', 'HTTPS Protocol', 'ok', 'API utilise HTTPS');
    } else {
      addResult('SSL', 'HTTPS Protocol', 'error', 'API n\'utilise pas HTTPS', 'Configurer HTTPS pour l\'API');
    }

    if (PROD_FRONTEND_URL.startsWith('https://')) {
      addResult('SSL', 'Frontend HTTPS', 'ok', 'Frontend utilise HTTPS');
    } else {
      addResult('SSL', 'Frontend HTTPS', 'error', 'Frontend n\'utilise pas HTTPS', 'Configurer HTTPS pour le frontend');
    }
  } catch (error: any) {
    addResult('SSL', 'URL Parse', 'error', `Erreur: ${error.message}`);
  }
}

// 7. Vérification des variables d'environnement de production
async function auditProductionEnv() {
  console.log('\n📋 7. Variables d\'Environnement Production\n');
  
  const requiredVars = [
    'DATABASE_URL',
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
    'FRONTEND_URL',
    'NODE_ENV'
  ];

  for (const varName of requiredVars) {
    const value = process.env[varName];
    if (!value) {
      addResult('Env', varName, 'error', `${varName} non défini`, `Définir ${varName} dans .env de production`);
    } else {
      if (varName === 'NODE_ENV' && value !== 'production') {
        addResult('Env', varName, 'warning', `NODE_ENV=${value} (devrait être 'production')`, 'Définir NODE_ENV=production');
      } else if (varName.includes('SECRET') && (value.includes('change_me') || value.length < 20)) {
        addResult('Env', varName, 'warning', `${varName} semble faible`, 'Utiliser un secret fort et unique');
      } else {
        addResult('Env', varName, 'ok', `${varName} défini`);
      }
    }
  }

  // Vérifier FRONTEND_URL correspond
  const frontendUrl = process.env.FRONTEND_URL;
  if (frontendUrl && frontendUrl !== PROD_FRONTEND_URL && !frontendUrl.includes(PROD_FRONTEND_URL)) {
    addResult('Env', 'FRONTEND_URL Match', 'warning', `FRONTEND_URL=${frontendUrl} ne correspond pas à ${PROD_FRONTEND_URL}`, 'Vérifier que FRONTEND_URL correspond au domaine réel');
  }
}

// 8. Diagnostic des problèmes courants VPS + Hostinger
async function auditCommonIssues() {
  console.log('\n🔍 8. Diagnostic Problèmes Courants\n');
  
  // Problème 1: CORS entre domaines différents
  const apiDomain = new URL(PROD_API_URL).hostname;
  const frontendDomain = new URL(PROD_FRONTEND_URL).hostname;
  
  if (apiDomain !== frontendDomain) {
    addResult('Common Issues', 'Cross-Domain', 'info', `API (${apiDomain}) et Frontend (${frontendDomain}) sur domaines différents`, 'Normal pour VPS + Hostinger, vérifier CORS');
  }

  // Problème 2: Reverse proxy
  addResult('Common Issues', 'Reverse Proxy', 'info', 'Vérifier la configuration du reverse proxy (Nginx/Apache)', 'S\'assurer que trust proxy est activé');

  // Problème 3: Firewall
  addResult('Common Issues', 'Firewall', 'info', 'Vérifier que le port de l\'API est ouvert', 'Ouvrir le port dans le firewall du VPS');

  // Problème 4: Cookies cross-domain
  addResult('Common Issues', 'Cross-Domain Cookies', 'warning', 'Cookies cross-domain peuvent être bloqués', 'Vérifier SameSite=None et Secure=true si nécessaire');
}

// Générer le rapport
function generateReport(): string {
  const ok = results.filter(r => r.status === 'ok').length;
  const warnings = results.filter(r => r.status === 'warning').length;
  const errors = results.filter(r => r.status === 'error').length;
  const info = results.filter(r => r.status === 'info').length;
  const total = results.length - info;
  
  const score = total > 0 ? Math.round(((ok * 1 + warnings * 0.5) / total) * 100) : 0;

  let report = `# Audit Production Serveur - Communication API\n\n`;
  report += `**Date:** ${new Date().toLocaleString('fr-FR')}\n`;
  report += `**API:** ${PROD_API_URL}\n`;
  report += `**Frontend:** ${PROD_FRONTEND_URL}\n`;
  report += `**Score:** ${score}/100\n\n`;
  report += `---\n\n`;
  
  report += `## Résumé\n\n`;
  report += `- ✅ **OK:** ${ok}\n`;
  report += `- ⚠️  **Avertissements:** ${warnings}\n`;
  report += `- ❌ **Erreurs:** ${errors}\n\n`;

  const categories = [...new Set(results.map(r => r.category))];
  
  for (const category of categories) {
    report += `## ${category}\n\n`;
    const categoryResults = results.filter(r => r.category === category);
    
    for (const result of categoryResults) {
      const icon = result.status === 'ok' ? '✅' : result.status === 'warning' ? '⚠️' : result.status === 'error' ? '❌' : 'ℹ️';
      report += `### ${icon} ${result.check}\n\n`;
      report += `**Statut:** ${result.status}\n\n`;
      report += `**Message:** ${result.message}\n\n`;
      if (result.solution) {
        report += `**Solution:** ${result.solution}\n\n`;
      }
      if (result.details) {
        report += `**Détails:** ${JSON.stringify(result.details, null, 2)}\n\n`;
      }
    }
  }

  // Recommandations prioritaires
  const errorsList = results.filter(r => r.status === 'error');
  if (errorsList.length > 0) {
    report += `## 🔴 Problèmes Critiques à Corriger\n\n`;
    errorsList.forEach((error, index) => {
      report += `${index + 1}. **${error.check}**: ${error.message}\n`;
      if (error.solution) {
        report += `   - Solution: ${error.solution}\n`;
      }
      report += `\n`;
    });
  }

  report += `---\n\n`;
  report += `**Rapport généré automatiquement par audit-production-server.ts**\n`;

  return report;
}

// Afficher le résumé
function displaySummary() {
  const ok = results.filter(r => r.status === 'ok').length;
  const warnings = results.filter(r => r.status === 'warning').length;
  const errors = results.filter(r => r.status === 'error').length;
  const total = results.filter(r => r.status !== 'info').length;
  
  const score = total > 0 ? Math.round(((ok * 1 + warnings * 0.5) / total) * 100) : 0;

  console.log('\n\n' + '='.repeat(80));
  console.log('📊 RÉSUMÉ DE L\'AUDIT PRODUCTION');
  console.log('='.repeat(80));
  console.log(`\nScore Global: ${score}/100\n`);
  
  const categories = [...new Set(results.map(r => r.category))];
  for (const category of categories) {
    const categoryResults = results.filter(r => r.category === category && r.status !== 'info');
    if (categoryResults.length === 0) continue;
    
    const categoryOk = categoryResults.filter(r => r.status === 'ok').length;
    const categoryWarnings = categoryResults.filter(r => r.status === 'warning').length;
    const categoryErrors = categoryResults.filter(r => r.status === 'error').length;
    
    let icon = '✅';
    if (categoryErrors > 0) icon = '❌';
    else if (categoryWarnings > 0) icon = '⚠️';
    
    console.log(`${icon} ${category}: ${categoryOk} OK, ${categoryWarnings} avertissements, ${categoryErrors} erreurs`);
  }
  
  console.log(`\nTotal: ${ok} OK, ${warnings} avertissements, ${errors} erreurs\n`);
  
  const errorsList = results.filter(r => r.status === 'error');
  if (errorsList.length > 0) {
    console.log('🔴 Problèmes critiques:');
    errorsList.forEach((error, index) => {
      console.log(`   ${index + 1}. ${error.check}: ${error.message}`);
      if (error.solution) {
        console.log(`      💡 ${error.solution}`);
      }
    });
    console.log('');
  }
}

// Fonction principale
async function main() {
  console.log('='.repeat(80));
  console.log('🔍 AUDIT PRODUCTION SERVEUR - VPS + HOSTINGER');
  console.log('='.repeat(80));
  console.log(`\nAPI: ${PROD_API_URL}`);
  console.log(`Frontend: ${PROD_FRONTEND_URL}\n`);

  await auditProductionUrls();
  await auditNetworkConnectivity();
  await auditProductionCORS();
  await auditServerConfiguration();
  await auditProductionAuth();
  await auditSSL();
  await auditProductionEnv();
  await auditCommonIssues();
  
  displaySummary();
  
  // Générer le rapport
  const report = generateReport();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const reportPath = path.join(__dirname, `../AUDIT-PRODUCTION-${timestamp}.md`);
  fs.writeFileSync(reportPath, report, 'utf-8');
  
  console.log(`📄 Rapport détaillé: ${reportPath}\n`);
  
  const errorsList = results.filter(r => r.status === 'error');
  process.exit(errorsList.length > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
});

