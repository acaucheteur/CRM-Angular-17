# 🎓 AFPI CRM - Gestion Commerciale de Formations Professionnelles

Application complète de CRM pour la gestion commerciale des formations AFPI avec workflow de validation en 6 étapes.

## 📋 Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Architecture](#architecture)
- [Fonctionnalités](#fonctionnalités)
- [Installation](#installation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [Workflow des opportunités](#workflow-des-opportunités)
- [Hiérarchie des droits](#hiérarchie-des-droits)
- [API Documentation](#api-documentation)

---

## 🎯 Vue d'ensemble

AFPI CRM est une solution complète pour gérer le processus commercial des formations professionnelles, de la collecte d'informations initiale jusqu'à la facturation finale.

### Technologies utilisées

**Backend:**
- NestJS 10
- TypeORM
- MariaDB
- JWT Authentication
- Bull Queue (Redis)
- Swagger Documentation

**Frontend:**
- Angular 17
- AdminLTE 3
- Bootstrap 5
- Chart.js
- Ngx-Toastr

---

## 🏗️ Architecture

```
afpi-crm-complete/
├── backend/                  # API NestJS
│   ├── src/
│   │   ├── modules/         # Modules fonctionnels
│   │   │   ├── auth/        # Authentification JWT
│   │   │   ├── users/       # Gestion utilisateurs
│   │   │   ├── roles/       # Rôles et permissions
│   │   │   ├── entreprises/ # Gestion entreprises
│   │   │   ├── opportunites/# Workflow opportunités
│   │   │   ├── objectifs/   # Suivi KPIs
│   │   │   ├── localisations/ # 14 centres AFPI
│   │   │   ├── formateurs/  # Gestion formateurs
│   │   │   ├── ypareo/      # Sync Ypareo
│   │   │   └── plugins/     # Système plugins
│   │   ├── config/          # Configuration
│   │   ├── common/          # Guards, interceptors, pipes
│   │   └── database/        # Entities, migrations, seeds
│   └── .env.example         # Variables d'environnement
│
└── frontend/                # Application Angular
    ├── src/
    │   ├── app/
    │   │   ├── core/        # Services, guards, interceptors
    │   │   ├── shared/      # Composants réutilisables
    │   │   └── modules/     # Modules fonctionnels
    │   ├── assets/          # Images, fonts, etc.
    │   └── environments/    # Config environnements
    └── angular.json         # Configuration Angular
```

---

## ✨ Fonctionnalités

### 1. Gestion des opportunités avec workflow complet
- **Section 1 : Collecte d'informations** (Commercial)
- **Section 2 : Devis** (Responsable Commercial)
- **Section 3 : Montage administratif** (Assistante)
- **Section 4 : Planification** (Planificateur)
- **Section 5 : Documents administratifs** (Assistante)
- **Section 6 : Facturation** (Service Facturation)

### 2. Gestion des entreprises
- Fiche entreprise complète (SIRET, contacts, secteur)
- Historique des opportunités
- Synchronisation Ypareo

### 3. Suivi des objectifs
- Objectifs par utilisateur ou localisation
- KPIs : CA, nb opportunités, taux conversion
- Tableaux de bord personnalisés

### 4. Synchronisation Ypareo
- Configuration de la fréquence de sync
- Mode : lecture, écriture, ou bidirectionnel
- Logs détaillés des synchronisations
- Gestion des erreurs

### 5. Système de plugins
- Chargement dynamique de plugins
- Hooks pour étendre les fonctionnalités
- Champs personnalisés

### 6. Gestion des droits granulaires
- 7 rôles prédéfinis
- Permissions par ressource et action
- Hiérarchie de validation

---

## 🚀 Installation

### Prérequis

- Node.js 18+ et npm 9+
- MariaDB 10.6+
- Redis 6+ (pour Bull Queue)
- Git

### Étape 1 : Installation du Backend

```bash
cd backend

# Copier le fichier d'environnement
cp .env.example .env

# Éditer .env avec vos paramètres
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

# Exécuter les migrations
npm run migration:run

# Peupler la base avec les données initiales
npm run seed

# Démarrer le serveur en mode développement
npm run start:dev
```

Le backend sera accessible sur `http://localhost:3000`
La documentation Swagger sur `http://localhost:3000/api/docs`

### Étape 2 : Installation du Frontend

```bash
cd frontend

# Installer les dépendances
npm install

# Démarrer l'application en mode développement
npm start
```

L'application sera accessible sur `http://localhost:4200`

---

## ⚙️ Configuration

### Variables d'environnement du Backend (.env)

```env
# Base de données MariaDB
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=afpi_crm_user
DB_PASSWORD=VotreMotDePasseSecurise123!
DB_DATABASE=afpi_crm

# JWT
JWT_SECRET=VotreSecretJWTTresSecurise_ChangezCeci_2024!
JWT_EXPIRES_IN=24h

# API Ypareo
YPAREO_API_URL=https://votre-instance.ypareo.fr/api/v3
YPAREO_API_KEY=votre_cle_api_ypareo
YPAREO_SYNC_FREQUENCY=3600
YPAREO_SYNC_MODE=read_write

# Email (notifications)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=votre-email@afpi.fr
MAIL_PASSWORD=votre_mot_de_passe_email

# Redis (Bull Queue)
REDIS_HOST=localhost
REDIS_PORT=6379
```

### Les 14 localisations AFPI

Les centres suivants sont pré-configurés dans le seed :

1. AFPI de l'Aisne
2. AFPI de l'Oise
3. AFPI de la Somme
4. AFPI du Nord
5. AFPI du Pas-de-Calais
6. AFPI de Seine-et-Marne
7. AFPI des Yvelines
8. AFPI de l'Essonne
9. AFPI des Hauts-de-Seine
10. AFPI de Seine-Saint-Denis
11. AFPI du Val-de-Marne
12. AFPI du Val-d'Oise
13. AFPI de Paris
14. AFPI de Bretagne

---

## 📖 Utilisation

### Connexion

Utilisateurs par défaut après le seed :

| Rôle | Email | Mot de passe | Accès |
|------|-------|--------------|-------|
| Administrateur | admin@afpi.fr | Admin123! | Accès complet |
| Responsable Commercial | resp@afpi.fr | Resp123! | Toutes localisations |
| Manager | manager@afpi.fr | Manager123! | Sa localisation |
| Commercial | commercial@afpi.fr | Commercial123! | Ses opportunités |

### Workflow des opportunités

#### Section 1 : Collecte d'informations (Commercial)
1. Le commercial crée une opportunité
2. Remplit les informations : entreprise, formation, participants, budget
3. Soumet pour validation au Responsable

#### Section 2 : Devis (Responsable Commercial)
1. Le responsable valide les informations
2. Crée et envoie le devis
3. Attend la réponse du client
4. Marque le devis comme accepté/refusé

#### Section 3 : Montage administratif (Assistante)
1. Dossier de financement (OPCO, Région, etc.)
2. Validation du financement
3. Numéro de prise en charge

#### Section 4 : Planification (Planificateur)
1. Dates de formation
2. Attribution des formateurs
3. Commande reprographie

#### Section 5 : Documents administratifs (Assistante)
1. Collecte des pièces justificatives
2. Convention, bulletin d'inscription
3. Feuilles de présence

#### Section 6 : Facturation
1. Création de la facture
2. Envoi au client
3. Suivi du paiement

---

## 🔐 Hiérarchie des droits

```
Administrateur (super admin)
    ↓
Responsable Commercial (tous les managers)
    ↓
Manager (par localisation)
    ↓
Commercial / Planificateur / Assistante / Facturation
```

### Permissions par rôle

| Action | Admin | Resp. Com. | Manager | Commercial | Planif. | Assist. | Factu. |
|--------|-------|------------|---------|------------|---------|---------|--------|
| Créer opportunité | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Valider Section 1 | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Gérer devis | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Montage admin | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| Planifier | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| Documents admin | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| Facturer | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Config Ypareo | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 📚 API Documentation

### Endpoints principaux

#### Authentification
```
POST /api/auth/login        # Connexion
POST /api/auth/logout       # Déconnexion
```

#### Utilisateurs
```
GET    /api/users           # Liste utilisateurs
GET    /api/users/:id       # Détail utilisateur
POST   /api/users           # Créer utilisateur
PUT    /api/users/:id       # Modifier utilisateur
DELETE /api/users/:id       # Supprimer utilisateur
```

#### Entreprises
```
GET    /api/entreprises
GET    /api/entreprises/:id
POST   /api/entreprises
PUT    /api/entreprises/:id
DELETE /api/entreprises/:id
```

#### Opportunités
```
GET    /api/opportunites
GET    /api/opportunites/:id
POST   /api/opportunites
PUT    /api/opportunites/:id
DELETE /api/opportunites/:id
PUT    /api/opportunites/:id/valider-section-1
PUT    /api/opportunites/:id/envoyer-devis
PUT    /api/opportunites/:id/accepter-devis
```

#### Synchronisation Ypareo
```
GET    /api/ypareo/config           # Configuration actuelle
PUT    /api/ypareo/config           # Modifier config
POST   /api/ypareo/sync             # Lancer sync manuelle
GET    /api/ypareo/logs             # Logs de sync
```

Documentation complète : `http://localhost:3000/api/docs`

---

## 🧪 Tests

```bash
# Tests unitaires backend
cd backend
npm run test

# Tests e2e backend
npm run test:e2e

# Tests frontend
cd frontend
npm run test
```

---

## 📦 Build Production

### Backend
```bash
cd backend
npm run build
npm run start:prod
```

### Frontend
```bash
cd frontend
npm run build
# Les fichiers seront dans dist/afpi-crm-frontend
```

---

## 🤝 Support

Pour toute question ou problème :
1. Consulter la documentation Swagger
2. Vérifier les logs backend : `logs/app.log`
3. Vérifier les logs Ypareo dans l'interface d'administration

---

## 📝 Licence

Ce projet est propriétaire - AFPI

---

## 🎉 Bon démarrage !

**Compte administrateur par défaut :**
- Email : `admin@afpi.fr`
- Mot de passe : `Admin123!`

⚠️ **Important : Changez ce mot de passe dès la première connexion !**
