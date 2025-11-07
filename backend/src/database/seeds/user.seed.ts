import { DataSource } from 'typeorm';
import { User } from '../../modules/users/user.entity';
import { Role, RoleType } from '../../modules/roles/role.entity';
import { Localisation } from '../../modules/localisations/localisation.entity';

export async function seedAdminUser(dataSource: DataSource): Promise<void> {
  console.log('🌱 Seeding admin user...');

  const userRepository = dataSource.getRepository(User);
  const roleRepository = dataSource.getRepository(Role);
  const localisationRepository = dataSource.getRepository(Localisation);

  // Find admin role
  const adminRole = await roleRepository.findOne({
    where: { type: RoleType.ADMIN },
  });

  if (!adminRole) {
    console.error('  ❌ Admin role not found. Please run role seeding first.');
    throw new Error('Admin role not found');
  }

  // Find a default localisation
  const defaultLocalisation = await localisationRepository.findOne({
    where: { code: 'AISNE' },
  });

  // Check if admin user already exists
  const adminEmail = 'admin@afpi-crm.fr';
  const existingAdmin = await userRepository.findOne({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const adminUser = userRepository.create({
      email: adminEmail,
      password: 'Admin123!', // This will be hashed by the entity's BeforeInsert hook
      firstName: 'Admin',
      lastName: 'AFPI',
      phone: '03 23 26 30 00',
      isActive: true,
      isLdapUser: false,
      role: adminRole,
      roleId: adminRole.id,
      localisation: defaultLocalisation,
      localisationId: defaultLocalisation?.id,
    });

    await userRepository.save(adminUser);
    console.log(`  ✓ Created admin user: ${adminEmail}`);
    console.log(`  ℹ️  Default password: Admin123! (Please change after first login)`);
  } else {
    console.log(`  ⊙ Admin user already exists: ${adminEmail}`);
  }

  console.log('✅ Admin user seeding completed');
}
