# 🎓 AFPI CRM - Gestion Commerciale de Formations Professionnelles

Application complète de CRM pour la gestion commerciale des formations AFPI avec workflow de validation en 6 étapes.

## 📋 Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Architecture](#architecture)
- [Fonctionnalités](#fonctionnalités)
- [Démarrage rapide avec Docker](#démarrage-rapide-avec-docker)
- [Installation](#installation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [Workflow des opportunités](#workflow-des-opportunités)
- [Hiérarchie des droits](#hiérarchie-des-droits)
- [API Documentation](#api-documentation)
- [Dashboard KPIs](#dashboard-kpis)
- [Standards et Qualité](#standards-et-qualité)
- [Documentation](#documentation)

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

**Qualité & Monitoring:**
- ESLint & Prettier (Linting et formatage)
- Prometheus & Grafana (Monitoring)
- Winston (Logs structurés)
- Docker Compose (Conteneurisation)
- WCAG 2.1 AA (Accessibilité)

---

## 🏗️ Architecture

### Diagramme d'architecture complet

Pour une vue détaillée de l'architecture système, consultez [ARCHITECTURE.md](./ARCHITECTURE.md).

**Vue simplifiée :**

```
┌─────────────┐
│ UTILISATEURS│
└──────┬──────┘
       │
┌──────▼──────────┐
│  Frontend       │
│  Angular 17     │ ──> Accessible (WCAG 2.1 AA)
│  (Port 4200)    │ ──> Gestion d'erreurs utilisateur
└──────┬──────────┘
       │ HTTP/REST
┌──────▼──────────┐
│  Backend NestJS │
│  (Port 3000)    │ ──> Intercepteurs d'erreurs
│                 │ ──> Logs structurés (Winston)
└─┬───┬────┬──────┘
  │   │    │
  │   │    └──────> Ypareo API (Sync)
  │   │
  │   └──────> Redis (Bull Queue)
  │            (Port 6379)
  │
  └──────> MariaDB (Base de données)
           (Port 3306)
           + Mock data pour tests

┌─────────────────────────────┐
│  Monitoring Stack           │
│  - Prometheus (Port 9090)   │ ──> Métriques
│  - Grafana (Port 3001)      │ ──> Dashboards & Alertes
└─────────────────────────────┘
```

### Structure des fichiers

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

### 3. Suivi des objectifs et Dashboard KPIs
- Objectifs par utilisateur ou localisation
- **KPIs en temps réel** : CA, nb opportunités, taux conversion
- **Dashboard métrique** avec graphiques (Chart.js)
- Tableaux de bord personnalisés par rôle
- Suivi de performance par période

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

## 🐳 Démarrage rapide avec Docker

La façon la plus rapide de tester l'application avec des données mockées !

### Pré-requis
- Docker 20+ et Docker Compose 2+

### Lancement

```bash
# Cloner le dépôt
git clone https://github.com/acaucheteur/CRM-Angular-17.git
cd CRM-Angular-17

# Lancer tous les services
docker-compose up -d

# Vérifier que tous les services sont démarrés
docker-compose ps
```

### Services disponibles

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:4200 | Application Angular |
| Backend | http://localhost:3000 | API NestJS |
| API Docs | http://localhost:3000/api/docs | Documentation Swagger |
| Grafana | http://localhost:3001 | Dashboards (admin/admin) |
| Prometheus | http://localhost:9090 | Métriques |

### Données mockées

Le conteneur MariaDB est automatiquement initialisé avec :
- ✅ 7 rôles utilisateurs
- ✅ 14 localisations AFPI
- ✅ 7 utilisateurs de test (voir [Utilisation](#utilisation))
- ✅ 5 entreprises exemples
- ✅ 5 opportunités dans différents états
- ✅ Objectifs KPIs pour Q1 et Q2 2024

### Arrêter les services

```bash
# Arrêter tous les services
docker-compose down

# Arrêter et supprimer les volumes (données)
docker-compose down -v
```

---

## 🚀 Installation locale

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

## 📊 Dashboard KPIs

### Métriques métier en temps réel

Le dashboard principal affiche les indicateurs clés de performance :

#### KPIs globaux
- **Chiffre d'affaires (CA)** : Total et par localisation
- **Nombre d'opportunités** : Créées, en cours, converties
- **Taux de conversion** : Pourcentage d'opportunités converties en formations
- **Pipeline commercial** : Valeur totale des opportunités en cours

#### Visualisations disponibles
- **Graphique de conversion** : Évolution du taux de conversion par trimestre
- **CA par localisation** : Comparaison des performances entre les 14 centres AFPI
- **Statut des opportunités** : Répartition par section (1-6)
- **Objectifs vs Réalisations** : Suivi des performances individuelles et d'équipe

#### Accès selon les rôles
- **Administrateur** : Vue complète de toutes les localisations
- **Responsable Commercial** : Vue de toutes les localisations avec drill-down
- **Manager** : Vue de sa localisation uniquement
- **Commercial** : Vue de ses opportunités personnelles

### Monitoring et alertes

Grafana dashboard accessible sur `http://localhost:3001` (admin/admin) inclut :
- Métriques système (CPU, RAM, DB connections)
- Métriques applicatives (HTTP requests, response times, error rates)
- Métriques métier (opportunités, CA, conversions)
- Alertes configurables pour anomalies et incidents

---

## 🎨 Standards et Qualité

### Linting et formatage

Le projet utilise **ESLint** et **Prettier** pour garantir la qualité et l'uniformité du code.

```bash
# Formater tout le code
npm run format

# Vérifier le linting
npm run lint

# Corriger automatiquement
npm run lint:fix
```

Configuration :
- `.eslintrc.json` : Règles ESLint pour TypeScript
- `.prettierrc` : Configuration Prettier
- `.prettierignore` : Fichiers exclus du formatage

### Accessibilité (WCAG 2.1 AA)

L'application respecte les standards d'accessibilité WCAG 2.1 niveau AA :
- Navigation complète au clavier
- Labels ARIA pour les lecteurs d'écran
- Contrastes de couleurs conformes
- Messages d'erreur descriptifs
- Support des technologies d'assistance

Voir [ACCESSIBILITY.md](./ACCESSIBILITY.md) pour les détails complets.

### Gestion des erreurs

#### Backend (NestJS)
- **Exception filters** : Gestion centralisée des erreurs
- **Validation pipes** : Validation automatique des DTOs
- **TypeORM interceptors** : Transformation des erreurs SQL en messages utilisateur

#### Frontend (Angular)
- **HTTP interceptors** : Interception et traitement des erreurs API
- **Global error handler** : Gestion des erreurs JavaScript
- **Toastr notifications** : Messages utilisateur clairs et contextuels

Voir [ERROR_HANDLING.md](./ERROR_HANDLING.md) pour l'implémentation complète.

---

## 📚 Documentation

### Pour les développeurs

- **[DEVELOPER.md](./DEVELOPER.md)** : Guide complet de développement
  - Configuration de l'environnement
  - Architecture détaillée
  - Tests et debugging
  - Performance et sécurité

- **[STYLE_GUIDE.md](./STYLE_GUIDE.md)** : Standards de code
  - Conventions de nommage
  - Bonnes pratiques TypeScript
  - Structure des composants
  - Patterns recommandés

- **[CONTRIBUTING.md](./CONTRIBUTING.md)** : Guide de contribution
  - Processus de développement
  - Format des commits
  - Pull requests
  - Code de conduite

### Architecture et Ops

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** : Diagrammes et flux
  - Vue d'ensemble du système
  - Flux de données
  - Modèle de données
  - Infrastructure de déploiement

- **[MONITORING.md](./MONITORING.md)** : Observabilité
  - Logs structurés (Winston)
  - Métriques (Prometheus)
  - Dashboards (Grafana)
  - Alertes et runbook

### Standards et qualité

- **[ACCESSIBILITY.md](./ACCESSIBILITY.md)** : Accessibilité WCAG
  - Principes et checklist
  - Navigation au clavier
  - Lecteurs d'écran
  - Outils de test

- **[ERROR_HANDLING.md](./ERROR_HANDLING.md)** : Gestion d'erreurs
  - Stratégie backend (NestJS)
  - Stratégie frontend (Angular)
  - Codes d'erreur
  - Messages utilisateur

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
1. Consulter la [documentation](#documentation) appropriée
2. Vérifier les logs backend : `logs/app.log`
3. Consulter Grafana pour les métriques : `http://localhost:3001`
4. Vérifier les logs Ypareo dans l'interface d'administration
5. Ouvrir une issue sur GitHub

---

## 📝 Licence

Ce projet est propriétaire - AFPI. Tous droits réservés.

---

## 🎉 Bon démarrage !

**Compte administrateur par défaut :**
- Email : `admin@afpi.fr`
- Mot de passe : `Admin123!`

⚠️ **Important : Changez ce mot de passe dès la première connexion !**

### Checklist de mise en production

Avant de déployer en production, assurez-vous de :
- [ ] Changer tous les mots de passe par défaut
- [ ] Configurer les variables d'environnement de production
- [ ] Activer HTTPS avec des certificats valides
- [ ] Configurer les sauvegardes automatiques de la base de données
- [ ] Mettre en place les alertes de monitoring
- [ ] Vérifier la conformité WCAG avec les outils de test
- [ ] Effectuer un audit de sécurité
- [ ] Documenter les procédures de déploiement
- [ ] Tester les procédures de récupération après incident
- [ ] Former les utilisateurs finaux

---

**Développé avec ❤️ pour AFPI**
