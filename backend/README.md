# AFPI CRM Backend

API backend NestJS pour la gestion commerciale des formations AFPI.

## Structure du projet

```
backend/
├── src/
│   ├── modules/              # Modules fonctionnels
│   │   ├── entreprises/      # Gestion des entreprises
│   │   ├── opportunites/     # Workflow des opportunités
│   │   ├── objectifs/        # Suivi des objectifs/KPIs
│   │   ├── localisations/    # 14 centres AFPI
│   │   ├── formateurs/       # Gestion des formateurs
│   │   ├── ypareo/           # Configuration Ypareo
│   │   ├── plugins/          # Système de plugins
│   │   ├── notifications/    # Notifications utilisateurs
│   │   └── dashboard/        # Statistiques dashboard
│   ├── database/
│   │   └── entities/         # Entités TypeORM
│   ├── app.module.ts         # Module principal
│   └── main.ts               # Point d'entrée
├── package.json
├── tsconfig.json
└── .env.example
```

## Modules créés

### 1. Entreprises (`/api/entreprises`)
Gestion des entreprises avec informations SIRET, contacts, secteur d'activité.

**Endpoints:**
- `GET /api/entreprises` - Liste toutes les entreprises
- `GET /api/entreprises/:id` - Détails d'une entreprise
- `POST /api/entreprises` - Créer une entreprise
- `PATCH /api/entreprises/:id` - Modifier une entreprise
- `DELETE /api/entreprises/:id` - Supprimer une entreprise

### 2. Opportunités (`/api/opportunites`)
Workflow des opportunités en 6 sections.

**Endpoints:**
- `GET /api/opportunites` - Liste toutes les opportunités
- `GET /api/opportunites/:id` - Détails d'une opportunité
- `POST /api/opportunites` - Créer une opportunité
- `PATCH /api/opportunites/:id` - Modifier une opportunité
- `DELETE /api/opportunites/:id` - Supprimer une opportunité

### 3. Objectifs (`/api/objectifs`)
Suivi des objectifs et KPIs (CA, nb opportunités, taux conversion).

**Endpoints:**
- `GET /api/objectifs` - Liste tous les objectifs
- `GET /api/objectifs/:id` - Détails d'un objectif
- `POST /api/objectifs` - Créer un objectif
- `PATCH /api/objectifs/:id` - Modifier un objectif
- `DELETE /api/objectifs/:id` - Supprimer un objectif

### 4. Localisations (`/api/localisations`)
Gestion des 14 centres AFPI.

**Endpoints:**
- `GET /api/localisations` - Liste toutes les localisations
- `GET /api/localisations/:id` - Détails d'une localisation
- `POST /api/localisations` - Créer une localisation
- `PATCH /api/localisations/:id` - Modifier une localisation
- `DELETE /api/localisations/:id` - Supprimer une localisation

### 5. Formateurs (`/api/formateurs`)
Gestion des formateurs avec spécialités et disponibilités.

**Endpoints:**
- `GET /api/formateurs` - Liste tous les formateurs
- `GET /api/formateurs/:id` - Détails d'un formateur
- `POST /api/formateurs` - Créer un formateur
- `PATCH /api/formateurs/:id` - Modifier un formateur
- `DELETE /api/formateurs/:id` - Supprimer un formateur

### 6. Ypareo (`/api/ypareo`)
Configuration de la synchronisation avec Ypareo.

**Endpoints:**
- `GET /api/ypareo` - Liste des configurations
- `GET /api/ypareo/:id` - Détails d'une configuration
- `POST /api/ypareo` - Créer une configuration
- `PATCH /api/ypareo/:id` - Modifier une configuration
- `DELETE /api/ypareo/:id` - Supprimer une configuration

### 7. Plugins (`/api/plugins`)
Système de plugins extensible.

**Endpoints:**
- `GET /api/plugins` - Liste tous les plugins
- `GET /api/plugins/:id` - Détails d'un plugin
- `POST /api/plugins` - Créer un plugin
- `PATCH /api/plugins/:id` - Modifier un plugin
- `DELETE /api/plugins/:id` - Supprimer un plugin

### 8. Notifications (`/api/notifications`)
Notifications pour les utilisateurs.

**Endpoints:**
- `GET /api/notifications` - Liste toutes les notifications
- `GET /api/notifications/:id` - Détails d'une notification
- `POST /api/notifications` - Créer une notification
- `PATCH /api/notifications/:id` - Modifier une notification
- `DELETE /api/notifications/:id` - Supprimer une notification

### 9. Dashboard (`/api/dashboard`)
Statistiques pour les tableaux de bord.

**Endpoints:**
- `GET /api/dashboard` - Liste toutes les statistiques
- `GET /api/dashboard/:id` - Détails d'une statistique
- `POST /api/dashboard` - Créer une statistique
- `PATCH /api/dashboard/:id` - Modifier une statistique
- `DELETE /api/dashboard/:id` - Supprimer une statistique

## Installation

```bash
# Copier le fichier d'environnement
cp .env.example .env

# Éditer .env avec vos paramètres de base de données
nano .env

# Installer les dépendances
npm install

# Créer la base de données MariaDB
mysql -u root -p
CREATE DATABASE afpi_crm CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'afpi_crm_user'@'localhost' IDENTIFIED BY 'VotreMotDePasseSecurise123!';
GRANT ALL PRIVILEGES ON afpi_crm.* TO 'afpi_crm_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## Démarrage

```bash
# Mode développement
npm run start:dev

# Mode production
npm run build
npm run start:prod
```

Le serveur démarre sur `http://localhost:3000`
La documentation Swagger est accessible sur `http://localhost:3000/api/docs`

## Build

```bash
# Compiler le projet
npm run build

# Les fichiers compilés seront dans le dossier dist/
```

## Tests

```bash
# Tests unitaires
npm run test

# Tests e2e
npm run test:e2e

# Couverture de code
npm run test:cov
```

## Architecture

Chaque module suit la même structure:

```
module/
├── dto/
│   ├── create-{entity}.dto.ts    # DTO de création
│   └── update-{entity}.dto.ts    # DTO de mise à jour
├── {module}.controller.ts        # Contrôleur REST
├── {module}.service.ts           # Logique métier
└── {module}.module.ts            # Module NestJS
```

### Services
Chaque service implémente les opérations CRUD de base:
- `findAll()` - Récupère toutes les entités
- `findOne(id)` - Récupère une entité par ID
- `create(dto)` - Crée une nouvelle entité
- `update(id, dto)` - Met à jour une entité
- `remove(id)` - Supprime une entité

### Controllers
Chaque contrôleur expose les endpoints REST standard:
- `GET /` - Liste toutes les entités
- `GET /:id` - Détails d'une entité
- `POST /` - Créer une entité
- `PATCH /:id` - Modifier une entité
- `DELETE /:id` - Supprimer une entité

### DTOs
Les DTOs utilisent `class-validator` pour la validation:
- Validation des types
- Validation des formats (email, dates, etc.)
- Validation des contraintes (longueur, enum, etc.)

## Technologies

- **NestJS 10** - Framework backend
- **TypeORM** - ORM pour MariaDB
- **MySQL2** - Driver MariaDB/MySQL
- **Swagger** - Documentation API
- **class-validator** - Validation des DTOs
- **class-transformer** - Transformation des données

## Documentation API

La documentation complète de l'API est disponible via Swagger:
`http://localhost:3000/api/docs`

## Variables d'environnement

Voir `.env.example` pour la liste complète des variables d'environnement requises.

Principales variables:
- `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE` - Configuration base de données
- `PORT` - Port du serveur (défaut: 3000)
- `NODE_ENV` - Environnement (development, production)

## Prochaines étapes

- [ ] Ajouter l'authentification JWT
- [ ] Ajouter les guards et permissions
- [ ] Compléter les DTOs avec plus de validations
- [ ] Ajouter les migrations TypeORM
- [ ] Ajouter les seeds de données
- [ ] Ajouter les tests unitaires et e2e
- [ ] Ajouter la logique métier spécifique (workflow opportunités, etc.)
- [ ] Configurer la synchronisation Ypareo
