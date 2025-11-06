-- Mock data for AFPI CRM
-- This file is executed when the database is first initialized

USE afpi_crm;

-- Create tables if they don't exist (basic structure)
CREATE TABLE IF NOT EXISTS `roles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `description` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `localisations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `code` VARCHAR(20) NOT NULL UNIQUE,
  `address` TEXT,
  `city` VARCHAR(100),
  `postal_code` VARCHAR(10),
  `phone` VARCHAR(20),
  `email` VARCHAR(100),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `first_name` VARCHAR(50) NOT NULL,
  `last_name` VARCHAR(50) NOT NULL,
  `role_id` INT NOT NULL,
  `localisation_id` INT,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`),
  FOREIGN KEY (`localisation_id`) REFERENCES `localisations`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `entreprises` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(200) NOT NULL,
  `siret` VARCHAR(14) UNIQUE,
  `address` TEXT,
  `city` VARCHAR(100),
  `postal_code` VARCHAR(10),
  `phone` VARCHAR(20),
  `email` VARCHAR(100),
  `secteur` VARCHAR(100),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `opportunites` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `reference` VARCHAR(50) UNIQUE NOT NULL,
  `entreprise_id` INT NOT NULL,
  `commercial_id` INT NOT NULL,
  `localisation_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `status` ENUM('section_1', 'section_2', 'section_3', 'section_4', 'section_5', 'section_6', 'completed', 'cancelled') DEFAULT 'section_1',
  `budget` DECIMAL(10,2),
  `nb_participants` INT,
  `date_debut` DATE,
  `date_fin` DATE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`entreprise_id`) REFERENCES `entreprises`(`id`),
  FOREIGN KEY (`commercial_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`localisation_id`) REFERENCES `localisations`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert mock roles
INSERT INTO `roles` (`name`, `description`) VALUES
('administrateur', 'Accès complet au système'),
('responsable_commercial', 'Gestion de toutes les localisations'),
('manager', 'Gestion d\'une localisation'),
('commercial', 'Création et suivi des opportunités'),
('planificateur', 'Planification des formations'),
('assistante', 'Gestion administrative'),
('facturation', 'Gestion de la facturation');

-- Insert mock localisations (14 AFPI centers)
INSERT INTO `localisations` (`name`, `code`, `address`, `city`, `postal_code`, `phone`, `email`) VALUES
('AFPI de l\'Aisne', 'AFPI-02', '12 Rue de la Formation', 'Saint-Quentin', '02100', '03 23 00 00 00', 'aisne@afpi.fr'),
('AFPI de l\'Oise', 'AFPI-60', '45 Avenue des Métiers', 'Beauvais', '60000', '03 44 00 00 00', 'oise@afpi.fr'),
('AFPI de la Somme', 'AFPI-80', '78 Boulevard Industriel', 'Amiens', '80000', '03 22 00 00 00', 'somme@afpi.fr'),
('AFPI du Nord', 'AFPI-59', '23 Rue du Commerce', 'Lille', '59000', '03 20 00 00 00', 'nord@afpi.fr'),
('AFPI du Pas-de-Calais', 'AFPI-62', '56 Avenue de la Gare', 'Arras', '62000', '03 21 00 00 00', 'pasdecalais@afpi.fr'),
('AFPI de Seine-et-Marne', 'AFPI-77', '89 Rue de Paris', 'Meaux', '77100', '01 60 00 00 00', 'seine-et-marne@afpi.fr'),
('AFPI des Yvelines', 'AFPI-78', '34 Boulevard Voltaire', 'Versailles', '78000', '01 39 00 00 00', 'yvelines@afpi.fr'),
('AFPI de l\'Essonne', 'AFPI-91', '67 Avenue de la République', 'Évry', '91000', '01 69 00 00 00', 'essonne@afpi.fr'),
('AFPI des Hauts-de-Seine', 'AFPI-92', '12 Rue Jean Jaurès', 'Nanterre', '92000', '01 47 00 00 00', 'hauts-de-seine@afpi.fr'),
('AFPI de Seine-Saint-Denis', 'AFPI-93', '45 Avenue Lénine', 'Saint-Denis', '93200', '01 48 00 00 00', 'seine-saint-denis@afpi.fr'),
('AFPI du Val-de-Marne', 'AFPI-94', '78 Rue Victor Hugo', 'Créteil', '94000', '01 49 00 00 00', 'val-de-marne@afpi.fr'),
('AFPI du Val-d\'Oise', 'AFPI-95', '23 Boulevard de la Liberté', 'Cergy', '95000', '01 34 00 00 00', 'val-d-oise@afpi.fr'),
('AFPI de Paris', 'AFPI-75', '56 Rue de Rivoli', 'Paris', '75001', '01 42 00 00 00', 'paris@afpi.fr'),
('AFPI de Bretagne', 'AFPI-35', '89 Avenue de Bretagne', 'Rennes', '35000', '02 99 00 00 00', 'bretagne@afpi.fr');

-- Insert mock users (password is hashed version of the password mentioned in docs)
-- Note: In a real scenario, these would be properly hashed with bcrypt
INSERT INTO `users` (`email`, `password`, `first_name`, `last_name`, `role_id`, `localisation_id`) VALUES
('admin@afpi.fr', '$2b$10$YourHashedPasswordHere', 'Admin', 'Système', 1, NULL),
('resp@afpi.fr', '$2b$10$YourHashedPasswordHere', 'Responsable', 'Commercial', 2, NULL),
('manager@afpi.fr', '$2b$10$YourHashedPasswordHere', 'Manager', 'Nord', 3, 4),
('commercial@afpi.fr', '$2b$10$YourHashedPasswordHere', 'Commercial', 'Lille', 4, 4),
('planif@afpi.fr', '$2b$10$YourHashedPasswordHere', 'Planificateur', 'Nord', 5, 4),
('assist@afpi.fr', '$2b$10$YourHashedPasswordHere', 'Assistante', 'Nord', 6, 4),
('factu@afpi.fr', '$2b$10$YourHashedPasswordHere', 'Facturation', 'Nord', 7, 4);

-- Insert mock entreprises
INSERT INTO `entreprises` (`name`, `siret`, `address`, `city`, `postal_code`, `phone`, `email`, `secteur`) VALUES
('Entreprise Tech Solutions', '12345678901234', '10 Rue de l\'Innovation', 'Lille', '59000', '03 20 11 11 11', 'contact@techsolutions.fr', 'IT'),
('Industries Mécaniques SA', '23456789012345', '25 Avenue de la Mécanique', 'Arras', '62000', '03 21 22 22 22', 'info@industries-meca.fr', 'Industrie'),
('Commerce Formation SARL', '34567890123456', '50 Boulevard du Commerce', 'Amiens', '80000', '03 22 33 33 33', 'contact@commerce-formation.fr', 'Commerce'),
('Logistique Express', '45678901234567', '75 Route de la Logistique', 'Saint-Quentin', '02100', '03 23 44 44 44', 'info@logistique-express.fr', 'Transport'),
('Automobile Services', '56789012345678', '100 Avenue de l\'Auto', 'Beauvais', '60000', '03 44 55 55 55', 'contact@auto-services.fr', 'Automobile');

-- Insert mock opportunités
INSERT INTO `opportunites` (`reference`, `entreprise_id`, `commercial_id`, `localisation_id`, `title`, `description`, `status`, `budget`, `nb_participants`, `date_debut`, `date_fin`) VALUES
('OPP-2024-001', 1, 4, 4, 'Formation DevOps', 'Formation complète sur les pratiques DevOps et CI/CD', 'section_2', 15000.00, 8, '2024-03-01', '2024-03-15'),
('OPP-2024-002', 2, 4, 4, 'Usinage CNC Avancé', 'Formation sur les machines CNC de dernière génération', 'section_3', 25000.00, 12, '2024-04-01', '2024-04-30'),
('OPP-2024-003', 3, 4, 4, 'Management Commercial', 'Techniques de management pour équipes commerciales', 'section_1', 8000.00, 6, '2024-05-01', '2024-05-10'),
('OPP-2024-004', 4, 4, 4, 'Gestion de Stock', 'Optimisation de la gestion des stocks en entrepôt', 'section_4', 12000.00, 10, '2024-03-15', '2024-03-25'),
('OPP-2024-005', 5, 4, 4, 'Maintenance Automobile', 'Maintenance préventive des véhicules électriques', 'completed', 18000.00, 15, '2024-02-01', '2024-02-28');

-- Create metrics/KPI tracking table
CREATE TABLE IF NOT EXISTS `objectifs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT,
  `localisation_id` INT,
  `year` INT NOT NULL,
  `quarter` INT,
  `target_ca` DECIMAL(12,2),
  `target_nb_opportunites` INT,
  `target_conversion_rate` DECIMAL(5,2),
  `actual_ca` DECIMAL(12,2) DEFAULT 0,
  `actual_nb_opportunites` INT DEFAULT 0,
  `actual_conversion_rate` DECIMAL(5,2) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`localisation_id`) REFERENCES `localisations`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample objectives
INSERT INTO `objectifs` (`user_id`, `localisation_id`, `year`, `quarter`, `target_ca`, `target_nb_opportunites`, `target_conversion_rate`, `actual_ca`, `actual_nb_opportunites`, `actual_conversion_rate`) VALUES
(4, 4, 2024, 1, 100000.00, 20, 65.00, 78000.00, 18, 61.11),
(4, 4, 2024, 2, 120000.00, 25, 70.00, 0, 0, 0);

COMMIT;
