# Guide de Développement - AFPI CRM

Bienvenue dans le guide de développement pour AFPI CRM. Ce document est destiné aux développeurs qui contribuent au projet.

## 📚 Table des matières

1. [Configuration de l'environnement de développement](#configuration-de-lenvironnement-de-développement)
2. [Architecture du projet](#architecture-du-projet)
3. [Standards de code](#standards-de-code)
4. [Flux de travail Git](#flux-de-travail-git)
5. [Tests](#tests)
6. [Debugging](#debugging)
7. [Performance](#performance)
8. [Sécurité](#sécurité)

---

## 🛠️ Configuration de l'environnement de développement

### Prérequis

- Node.js 18+ et npm 9+
- MariaDB 10.6+
- Redis 6+
- Git
- VS Code (recommandé) ou tout autre IDE

### Extensions VS Code recommandées

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "angular.ng-template",
    "ms-vscode.vscode-typescript-next",
    "firsttris.vscode-jest-runner",
    "christian-kohler.path-intellisense"
  ]
}
```

### Configuration initiale

```bash
# Cloner le dépôt
git clone https://github.com/acaucheteur/CRM-Angular-17.git
cd CRM-Angular-17

# Option 1 : Utiliser Docker (recommandé pour démarrage rapide)
docker-compose up -d

# Option 2 : Installation locale
# Backend
cd backend
cp .env.example .env
npm install
npm run migration:run
npm run seed

# Frontend
cd ../frontend
npm install
```

---

## 🏗️ Architecture du projet

### Structure générale

```
afpi-crm-complete/
├── backend/                  # API NestJS
│   ├── src/
│   │   ├── modules/         # Modules fonctionnels
│   │   ├── common/          # Code partagé (guards, interceptors, etc.)
│   │   ├── config/          # Configuration
│   │   └── database/        # Entities, migrations, seeds
│   ├── test/                # Tests E2E
│   └── package.json
│
├── frontend/                # Application Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/       # Services, guards, interceptors
│   │   │   ├── shared/     # Composants réutilisables
│   │   │   └── modules/    # Modules fonctionnels
│   │   ├── assets/         # Ressources statiques
│   │   └── environments/   # Configurations d'environnement
│   └── package.json
│
├── docker/                  # Configuration Docker
├── docs/                    # Documentation
└── docker-compose.yml
```

### Modules Backend (NestJS)

Chaque module suit la structure standard NestJS :

```
module/
├── dto/                     # Data Transfer Objects
│   ├── create-*.dto.ts
│   └── update-*.dto.ts
├── entities/               # Entités TypeORM
│   └── *.entity.ts
├── *.controller.ts        # Contrôleurs HTTP
├── *.service.ts           # Logique métier
├── *.module.ts            # Module NestJS
└── *.controller.spec.ts   # Tests unitaires
```

### Modules Frontend (Angular)

```
module/
├── components/             # Composants du module
├── services/              # Services du module
├── models/                # Interfaces/Models TypeScript
├── guards/                # Guards de route
├── *-routing.module.ts    # Configuration des routes
└── *.module.ts            # Module Angular
```

---

## 📝 Standards de code

### Formatage automatique

Le projet utilise **Prettier** et **ESLint** pour l'uniformité du code.

```bash
# Formater tout le code
npm run format

# Vérifier les erreurs de linting
npm run lint

# Corriger automatiquement les erreurs
npm run lint:fix
```

### Conventions de nommage

#### Backend (NestJS/TypeScript)

- **Classes** : PascalCase (`UserService`, `OpportuniteEntity`)
- **Interfaces** : PascalCase avec préfixe `I` optionnel (`IUser`, `CreateUserDto`)
- **Fonctions/Méthodes** : camelCase (`createUser()`, `findById()`)
- **Variables** : camelCase (`userName`, `totalAmount`)
- **Constantes** : UPPER_SNAKE_CASE (`MAX_ATTEMPTS`, `API_URL`)
- **Fichiers** : kebab-case (`user.service.ts`, `create-user.dto.ts`)

#### Frontend (Angular/TypeScript)

- **Composants** : PascalCase (`UserListComponent`)
- **Services** : PascalCase (`AuthService`)
- **Directives** : camelCase avec préfixe `app` (`appHighlight`)
- **Pipes** : camelCase (`formatDate`)
- **Fichiers** : kebab-case (`user-list.component.ts`)

### Structure des commits

Utilisez les **Conventional Commits** :

```
type(scope): description courte

[corps optionnel]

[pied optionnel]
```

Types valides :
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation
- `style`: Formatage (pas de changement de code)
- `refactor`: Refactorisation
- `test`: Ajout/modification de tests
- `chore`: Tâches de maintenance

Exemples :
```
feat(opportunites): ajouter la validation de la section 2
fix(auth): corriger la vérification du token JWT
docs(readme): mettre à jour les instructions d'installation
```

---

## 🔄 Flux de travail Git

### Branches

- `main` : Branche de production (protégée)
- `develop` : Branche de développement
- `feature/*` : Nouvelles fonctionnalités
- `bugfix/*` : Corrections de bugs
- `hotfix/*` : Corrections urgentes en production

### Workflow standard

```bash
# 1. Créer une nouvelle branche depuis develop
git checkout develop
git pull origin develop
git checkout -b feature/nom-de-la-fonctionnalite

# 2. Développer et commiter
git add .
git commit -m "feat(module): description"

# 3. Pousser la branche
git push origin feature/nom-de-la-fonctionnalite

# 4. Créer une Pull Request sur GitHub
# 5. Attendre la revue de code
# 6. Merger après approbation
```

### Pull Requests

Toute Pull Request doit :
- Avoir un titre clair et descriptif
- Inclure une description détaillée des changements
- Passer tous les tests CI/CD
- Être revue par au moins un développeur
- Respecter les standards de code

---

## 🧪 Tests

### Backend (NestJS)

```bash
# Tests unitaires
npm run test

# Tests avec couverture
npm run test:cov

# Tests E2E
npm run test:e2e

# Mode watch
npm run test:watch
```

#### Structure d'un test unitaire

```typescript
describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findById', () => {
    it('should return a user', async () => {
      const user = { id: 1, email: 'test@afpi.fr' };
      jest.spyOn(repository, 'findOne').mockResolvedValue(user as User);

      const result = await service.findById(1);
      expect(result).toEqual(user);
    });
  });
});
```

### Frontend (Angular)

```bash
# Tests unitaires
npm run test

# Tests avec couverture
npm run test:cov

# Tests E2E
npm run e2e
```

#### Structure d'un test de composant

```typescript
describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getUsers']);

    await TestBed.configureTestingModule({
      declarations: [UserListComponent],
      providers: [{ provide: UserService, useValue: userServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    const mockUsers = [{ id: 1, email: 'test@afpi.fr' }];
    userService.getUsers.and.returnValue(of(mockUsers));

    component.ngOnInit();

    expect(userService.getUsers).toHaveBeenCalled();
    expect(component.users).toEqual(mockUsers);
  });
});
```

---

## 🐛 Debugging

### Backend

#### VS Code Launch Configuration

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug NestJS",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "start:debug"],
      "console": "integratedTerminal",
      "restart": true,
      "protocol": "inspector",
      "sourceMaps": true
    }
  ]
}
```

#### Logs structurés

```typescript
import { Logger } from '@nestjs/common';

export class UserService {
  private readonly logger = new Logger(UserService.name);

  async createUser(dto: CreateUserDto) {
    this.logger.log(`Creating user: ${dto.email}`);
    try {
      // ...
      this.logger.log(`User created successfully: ${user.id}`);
      return user;
    } catch (error) {
      this.logger.error(`Failed to create user: ${error.message}`, error.stack);
      throw error;
    }
  }
}
```

### Frontend

#### Angular DevTools

Installez l'extension **Angular DevTools** pour Chrome/Edge pour inspecter :
- L'arbre des composants
- L'état des composants
- Le change detection
- Les performances

#### Console Logging

```typescript
import { environment } from '@environments/environment';

export class MyComponent {
  constructor() {
    if (!environment.production) {
      console.log('Debug info:', this.data);
    }
  }
}
```

---

## ⚡ Performance

### Backend

#### Optimisation des requêtes

```typescript
// ❌ Mauvais : N+1 queries
const users = await this.userRepository.find();
for (const user of users) {
  user.role = await this.roleRepository.findOne(user.roleId);
}

// ✅ Bon : Utiliser relations
const users = await this.userRepository.find({
  relations: ['role', 'localisation'],
});
```

#### Mise en cache

```typescript
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('users')
@UseInterceptors(CacheInterceptor)
export class UserController {
  @CacheTTL(300) // 5 minutes
  @Get()
  findAll() {
    return this.userService.findAll();
  }
}
```

### Frontend

#### Lazy Loading

```typescript
const routes: Routes = [
  {
    path: 'opportunites',
    loadChildren: () =>
      import('./modules/opportunites/opportunites.module').then((m) => m.OpportunitesModule),
  },
];
```

#### OnPush Change Detection

```typescript
@Component({
  selector: 'app-user-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-list.component.html',
})
export class UserListComponent {}
```

---

## 🔒 Sécurité

### Backend

#### Validation des entrées

```typescript
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
```

#### Guards d'authentification

```typescript
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}
```

### Frontend

#### Sanitisation XSS

Angular sanitise automatiquement les valeurs dans les templates. Pour du HTML dynamique :

```typescript
import { DomSanitizer } from '@angular/platform-browser';

constructor(private sanitizer: DomSanitizer) {}

getSafeHtml(html: string) {
  return this.sanitizer.sanitize(SecurityContext.HTML, html);
}
```

#### Protection CSRF

Configurée automatiquement avec HttpClient Angular.

---

## 📞 Support

Pour toute question :
- Consultez d'abord cette documentation
- Vérifiez les issues GitHub existantes
- Créez une nouvelle issue si nécessaire
- Contactez l'équipe sur le canal Slack dédié

---

## 📄 Licence

Ce projet est propriétaire - AFPI. Tous droits réservés.
