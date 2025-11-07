import { DataSource } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';
import { seedRoles } from './role.seed';
import { seedPermissions } from './permission.seed';
import { seedLocalisations } from './localisation.seed';
import { seedAdminUser } from './user.seed';

// Load environment variables
dotenvConfig();

async function runSeeds() {
  // Create database connection
  const dataSource = new DataSource({
    type: 'mariadb',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'afpi_crm',
    entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
    synchronize: false,
    logging: true,
    charset: 'utf8mb4',
    timezone: 'Z',
  });

  try {
    console.log('🌱 Starting database seeding...');

    await dataSource.initialize();
    console.log('✅ Database connection established');

    // Run seeds in order (respecting dependencies)
    await seedPermissions(dataSource);
    await seedRoles(dataSource);
    await seedLocalisations(dataSource);
    await seedAdminUser(dataSource);

    console.log('✅ All seeds completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('✅ Database connection closed');
    }
  }
}

// Run the seeder
runSeeds()
  .then(() => {
    console.log('✅ Seeding process finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding process failed:', error);
    process.exit(1);
  });
