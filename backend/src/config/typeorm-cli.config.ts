import { DataSource } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';

// Load environment variables for TypeORM CLI
dotenvConfig();

// DataSource configuration for TypeORM CLI (migrations, etc.)
export default new DataSource({
  type: 'mariadb',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'afpi_crm',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false,
  logging: process.env.DB_LOGGING === 'true',
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  migrationsRun: false,
  charset: 'utf8mb4',
  timezone: 'Z',
  extra: {
    connectionLimit: 10,
  },
});
