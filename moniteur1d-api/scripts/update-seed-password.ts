import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

// Mot de passe uniforme
const UNIFORM_PASSWORD = process.env.UNIFORM_PASSWORD;
if (!UNIFORM_PASSWORD) {
  throw new Error('UNIFORM_PASSWORD environment variable must be set');
}

async function updateSeedPassword() {
  console.log('🔄 Mise à jour du mot de passe pour tous les utilisateurs créés par le seed');
  console.log(`   Mot de passe: ${UNIFORM_PASSWORD}`);
  console.log('─'.repeat(80));
  console.log('');

  try {
    await prisma.$connect();
    console.log('✅ Connexion à la base de données réussie\n');

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(UNIFORM_PASSWORD, 10);

    // Mettre à jour tous les utilisateurs
    const result = await prisma.user.updateMany({
      data: {
        password: hashedPassword,
      },
    });

    console.log(`✅ ${result.count} utilisateur(s) mis à jour`);
    console.log('');
    console.log('📋 Tous les utilisateurs peuvent maintenant se connecter avec:');
    console.log(`   Mot de passe: ${UNIFORM_PASSWORD}`);
    console.log('');
    console.log('👤 Comptes disponibles:');
    const users = await prisma.user.findMany({
      select: {
        email: true,
        role: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
    users.forEach((user) => {
      console.log(`   - ${user.email} (${user.role})`);
    });

  } catch (error: any) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

updateSeedPassword()
  .catch(console.error);

