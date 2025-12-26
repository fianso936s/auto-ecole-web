import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@moniteur1d.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'lounes92';
const ADMIN_FIRST_NAME = process.env.ADMIN_FIRST_NAME || 'Admin';
const ADMIN_LAST_NAME = process.env.ADMIN_LAST_NAME || 'System';

async function createAdmin() {
  console.log('🔐 Création/Mise à jour du compte administrateur');
  console.log('='.repeat(60));
  console.log(`📧 Email: ${ADMIN_EMAIL}`);
  console.log(`👤 Nom: ${ADMIN_FIRST_NAME} ${ADMIN_LAST_NAME}`);
  console.log(`🔒 Mot de passe: ***${ADMIN_PASSWORD.slice(-3)} (${ADMIN_PASSWORD.length} caractères)`);
  console.log('');

  try {
    // Normaliser l'email
    const normalizedEmail = ADMIN_EMAIL.toLowerCase().trim();

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: { profile: true }
    });

    // Hasher le mot de passe avec bcrypt (10 rounds)
    console.log('🔐 Hashage du mot de passe avec bcrypt...');
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
    
    // Afficher uniquement les premiers et derniers caractères du hash pour vérification
    const hashPreview = `${hashedPassword.substring(0, 20)}...${hashedPassword.substring(hashedPassword.length - 10)}`;
    console.log(`✅ Mot de passe hashé: ${hashPreview}`);
    console.log(`   Longueur du hash: ${hashedPassword.length} caractères`);
    console.log('');

    if (existingUser) {
      console.log('⚠️  Utilisateur existant trouvé, mise à jour...');
      console.log(`   ID: ${existingUser.id}`);
      console.log(`   Rôle actuel: ${existingUser.role}`);
      console.log('');

      // Mettre à jour l'utilisateur
      const updatedUser = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          email: normalizedEmail,
          password: hashedPassword,
          role: 'ADMIN',
          profile: existingUser.profile ? undefined : {
            create: {
              firstName: ADMIN_FIRST_NAME,
              lastName: ADMIN_LAST_NAME,
              phone: '0102030405',
            }
          }
        },
        include: { profile: true }
      });

      // Mettre à jour le profil si nécessaire
      if (existingUser.profile) {
        await prisma.profile.update({
          where: { userId: updatedUser.id },
          data: {
            firstName: ADMIN_FIRST_NAME,
            lastName: ADMIN_LAST_NAME,
          }
        });
      }

      console.log('✅ Compte administrateur mis à jour avec succès!');
      console.log('');
      console.log('📋 Informations du compte:');
      console.log(`   ID: ${updatedUser.id}`);
      console.log(`   Email: ${updatedUser.email}`);
      console.log(`   Rôle: ${updatedUser.role}`);
      console.log(`   Nom: ${updatedUser.profile?.firstName} ${updatedUser.profile?.lastName}`);
      console.log(`   Mot de passe: ✅ Hashé et sécurisé`);
      console.log('');
      console.log('🔒 Sécurité:');
      console.log('   - Le mot de passe est hashé avec bcrypt (10 rounds)');
      console.log('   - Le hash ne peut pas être inversé');
      console.log('   - Seul le hash est stocké en base de données');
    } else {
      console.log('➕ Création d\'un nouvel utilisateur administrateur...');
      console.log('');

      // Créer un nouvel utilisateur admin
      const newUser = await prisma.user.create({
        data: {
          email: normalizedEmail,
          password: hashedPassword,
          role: 'ADMIN',
          profile: {
            create: {
              firstName: ADMIN_FIRST_NAME,
              lastName: ADMIN_LAST_NAME,
              phone: '0102030405',
            }
          }
        },
        include: { profile: true }
      });

      console.log('✅ Compte administrateur créé avec succès!');
      console.log('');
      console.log('📋 Informations du compte:');
      console.log(`   ID: ${newUser.id}`);
      console.log(`   Email: ${newUser.email}`);
      console.log(`   Rôle: ${newUser.role}`);
      console.log(`   Nom: ${newUser.profile?.firstName} ${newUser.profile?.lastName}`);
      console.log(`   Mot de passe: ✅ Hashé et sécurisé`);
      console.log('');
      console.log('🔒 Sécurité:');
      console.log('   - Le mot de passe est hashé avec bcrypt (10 rounds)');
      console.log('   - Le hash ne peut pas être inversé');
      console.log('   - Seul le hash est stocké en base de données');
    }

    // Vérification du hash (test de validation)
    console.log('');
    console.log('🧪 Vérification du hash...');
    const isValid = await bcrypt.compare(ADMIN_PASSWORD, hashedPassword);
    if (isValid) {
      console.log('✅ Vérification réussie: le hash est valide');
    } else {
      console.log('❌ ERREUR: Le hash ne correspond pas au mot de passe!');
      process.exit(1);
    }

    console.log('');
    console.log('='.repeat(60));
    console.log('✅ Opération terminée avec succès!');
    console.log('='.repeat(60));
    console.log('');
    console.log('💡 Vous pouvez maintenant vous connecter avec:');
    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log(`   Mot de passe: [le mot de passe que vous avez configuré]`);
    console.log('');
    console.log('⚠️  IMPORTANT: Le mot de passe en clair n\'est jamais stocké ni affiché.');
    console.log('   Seul le hash sécurisé est enregistré en base de données.');

  } catch (error: any) {
    console.error('');
    console.error('❌ Erreur lors de la création/mise à jour:', error.message);
    console.error('');
    console.error('Détails:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le script
createAdmin().catch((error) => {
  console.error('Erreur fatale:', error);
  process.exit(1);
});

