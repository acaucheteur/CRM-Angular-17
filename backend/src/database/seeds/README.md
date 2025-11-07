# Database Seeding Guide

Ce guide explique comment initialiser la base de données avec des données de base nécessaires pour le fonctionnement du CRM AFPI.

## Prérequis

Avant d'exécuter les seeds, assurez-vous que :

1. La base de données MariaDB/MySQL est créée et accessible
2. Les variables d'environnement sont configurées dans le fichier `.env`
3. Les migrations ont été exécutées (si applicable)

## Configuration

Créez un fichier `.env` à partir de `.env.example` et configurez vos paramètres de connexion :

```bash
cp .env.example .env
```

Modifiez les paramètres de base de données :
```
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=afpi_crm_user
DB_PASSWORD=VotreMotDePasseSecurise123!
DB_DATABASE=afpi_crm

# Optional: Set a custom default password for the admin user
ADMIN_DEFAULT_PASSWORD=YourSecurePasswordHere
```

## Exécution des Seeds

Pour initialiser la base de données avec les données de base :

```bash
npm run seed
```

## Données créées

Le script de seeding crée les données suivantes :

### 1. Permissions (permission.seed.ts)
Génère toutes les combinaisons de permissions pour les actions et ressources définies :
- **Actions** : create, read, update, delete, validate, export, manage
- **Ressources** : users, roles, entreprises, opportunites, objectifs, dashboard, localisations, formateurs, ypareo, plugins, settings

### 2. Rôles (role.seed.ts)
Crée les rôles suivants avec leurs permissions associées :

- **Administrateur** (niveau 0)
  - Accès complet à toutes les fonctionnalités

- **Responsable Commercial** (niveau 1)
  - Gestion des équipes commerciales et validation des opportunités
  - Toutes les permissions sauf settings

- **Manager** (niveau 2)
  - Gestion d'une localisation et de son équipe
  - Permissions sur : opportunites, entreprises, objectifs, dashboard, formateurs, users

- **Commercial** (niveau 3)
  - Gestion des opportunités commerciales
  - Permissions complètes sur opportunites
  - Permissions limitées sur entreprises et dashboard

- **Planificateur** (niveau 3)
  - Planification des formations et gestion des formateurs
  - Permissions read/update sur formateurs, opportunites, dashboard

- **Assistante** (niveau 3)
  - Support administratif et saisie des données
  - Permissions create/read/update sur entreprises, opportunites, dashboard

- **Facturation** (niveau 3)
  - Gestion de la facturation
  - Permissions read sur toutes les ressources concernées
  - Permission update limitée aux opportunites

### 3. Localisations (localisation.seed.ts)
Crée les localisations AFPI suivantes :
- AFPI de l'Aisne (Laon)
- AFPI de l'Oise (Beauvais)
- AFPI de la Somme (Amiens)
- AFPI du Nord (Lille)
- AFPI du Pas-de-Calais (Arras)

### 4. Utilisateur Administrateur (user.seed.ts)
Crée un compte administrateur par défaut :
- **Email** : admin@afpi-crm.fr
- **Mot de passe** : Configurable via `ADMIN_DEFAULT_PASSWORD` (défaut: Admin123!)
- **Rôle** : Administrateur

⚠️ **Important** : 
- Définissez `ADMIN_DEFAULT_PASSWORD` dans votre fichier `.env` pour un mot de passe sécurisé
- Changez le mot de passe après la première connexion !

## Réexécution des Seeds

Les seeds sont conçus pour être idempotents :
- Si les données existent déjà, elles ne seront pas dupliquées
- Vous pouvez réexécuter `npm run seed` en toute sécurité
- Les rôles existants seront mis à jour avec les permissions correctes

## Ordre d'exécution

Les seeds sont exécutés dans cet ordre pour respecter les dépendances :

1. Permissions (pas de dépendance)
2. Rôles (dépend des permissions)
3. Localisations (pas de dépendance)
4. Utilisateur Admin (dépend des rôles et localisations)

## Dépannage

### Erreur de connexion à la base de données
- Vérifiez que MariaDB/MySQL est démarré
- Vérifiez les paramètres dans le fichier `.env`
- Assurez-vous que la base de données existe

### Tables non trouvées
- Exécutez d'abord les migrations : `npm run migration:run`
- Ou activez `synchronize: true` temporairement dans `typeorm.config.ts` (non recommandé en production)

### Permission denied
- Vérifiez que l'utilisateur de base de données a les droits nécessaires
- Accordez les permissions appropriées : `GRANT ALL PRIVILEGES ON afpi_crm.* TO 'afpi_crm_user'@'localhost';`

## Personnalisation

Pour personnaliser les données initiales :

1. Modifiez les fichiers de seed dans `src/database/seeds/`
2. Ajustez les données selon vos besoins
3. Réexécutez `npm run seed`

## Fichiers de Seed

- `seed.ts` : Point d'entrée principal, gère la connexion et l'ordre d'exécution
- `permission.seed.ts` : Création des permissions
- `role.seed.ts` : Création des rôles et association des permissions
- `localisation.seed.ts` : Création des localisations
- `user.seed.ts` : Création de l'utilisateur administrateur

## Sécurité

⚠️ **Attention** : 
- Ne commitez jamais votre fichier `.env` dans le contrôle de version
- Changez immédiatement le mot de passe administrateur par défaut en production
- Utilisez des mots de passe forts pour tous les comptes
- Limitez l'accès à la base de données aux seuls services nécessaires
