# Guide de Style de Code - AFPI CRM

Ce document définit les standards de code pour le projet AFPI CRM.

## Table des matières

1. [Principes généraux](#principes-généraux)
2. [TypeScript](#typescript)
3. [NestJS (Backend)](#nestjs-backend)
4. [Angular (Frontend)](#angular-frontend)
5. [Base de données](#base-de-données)
6. [API REST](#api-rest)
7. [Git](#git)

---

## Principes généraux

### Code propre

- **DRY (Don't Repeat Yourself)** : Évitez la duplication de code
- **KISS (Keep It Simple, Stupid)** : Privilégiez la simplicité
- **YAGNI (You Aren't Gonna Need It)** : N'ajoutez pas de fonctionnalités non nécessaires
- **SOLID** : Suivez les principes SOLID pour la conception orientée objet

### Commentaires

- Le code doit être auto-documenté autant que possible
- Commentez le "pourquoi", pas le "quoi"
- Utilisez JSDoc pour les fonctions publiques

```typescript
// ❌ Mauvais
// Incrémente le compteur
counter++;

// ✅ Bon
// Compteur de tentatives de connexion pour limiter les attaques par force brute
loginAttempts++;

/**
 * Calcule le taux de conversion des opportunités
 * @param completed - Nombre d'opportunités complétées
 * @param total - Nombre total d'opportunités
 * @returns Taux de conversion en pourcentage (0-100)
 */
function calculateConversionRate(completed: number, total: number): number {
  if (total === 0) return 0;
  return (completed / total) * 100;
}
```

---

## TypeScript

### Configuration

Utilisez `strict: true` dans `tsconfig.json`.

### Types

```typescript
// ❌ Évitez any
function processData(data: any) {
  return data.value;
}

// ✅ Utilisez des types spécifiques
interface UserData {
  id: number;
  email: string;
  role: string;
}

function processData(data: UserData) {
  return data.email;
}

// ✅ Ou génériques si nécessaire
function processData<T>(data: T): T {
  return data;
}
```

### Interfaces vs Types

- Utilisez `interface` pour les objets qui peuvent être étendus
- Utilisez `type` pour les unions, intersections, et types primitifs

```typescript
// Interface (préféré pour les objets)
interface User {
  id: number;
  email: string;
}

interface AdminUser extends User {
  permissions: string[];
}

// Type (pour unions et intersections)
type Status = 'active' | 'inactive' | 'pending';
type UserWithRole = User & { role: string };
```

### Enums

Utilisez des enums pour les valeurs constantes liées :

```typescript
// ✅ Bon
enum OpportuniteStatus {
  SECTION_1 = 'section_1',
  SECTION_2 = 'section_2',
  SECTION_3 = 'section_3',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

// ❌ Évitez les string literals multiples
const status1 = 'section_1';
const status2 = 'section_2';
```

### Optional Chaining et Nullish Coalescing

```typescript
// ✅ Utilisez optional chaining
const email = user?.profile?.email;

// ✅ Utilisez nullish coalescing
const displayName = user.name ?? 'Anonymous';

// ❌ Évitez les vérifications longues
const email = user && user.profile && user.profile.email;
const displayName = user.name !== null && user.name !== undefined ? user.name : 'Anonymous';
```

---

## NestJS (Backend)

### Structure des modules

```typescript
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
```

### Contrôleurs

- Gardez les contrôleurs légers
- Déléguez la logique métier aux services
- Utilisez des DTOs pour la validation

```typescript
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findById(id);
  }
}
```

### Services

- Un service = une responsabilité
- Utilisez l'injection de dépendances
- Gérez les erreurs de manière appropriée

```typescript
@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role', 'localisation'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const user = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });

      const savedUser = await this.userRepository.save(user);
      this.logger.log(`User created: ${savedUser.id}`);

      return savedUser;
    } catch (error) {
      this.logger.error(`Failed to create user: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to create user');
    }
  }
}
```

### DTOs (Data Transfer Objects)

```typescript
import { IsEmail, IsString, MinLength, IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'user@afpi.fr', description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecurePass123!', description: 'User password (min 8 characters)' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'John', description: 'User first name' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'User last name' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 1, description: 'Role ID' })
  @IsInt()
  roleId: number;

  @ApiProperty({ example: 1, description: 'Localisation ID', required: false })
  @IsInt()
  @IsOptional()
  localisationId?: number;
}
```

### Entités TypeORM

```typescript
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ select: false }) // Ne pas inclure dans les requêtes par défaut
  password: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
```

### Gestion des erreurs

Utilisez les exceptions NestJS appropriées :

```typescript
import {
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

// Ressource non trouvée
throw new NotFoundException('User not found');

// Données invalides
throw new BadRequestException('Invalid email format');

// Non authentifié
throw new UnauthorizedException('Invalid credentials');

// Accès interdit
throw new ForbiddenException('Insufficient permissions');

// Conflit (ex: email déjà existant)
throw new ConflictException('Email already exists');

// Erreur serveur
throw new InternalServerErrorException('Database connection failed');
```

---

## Angular (Frontend)

### Structure des composants

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  loading = false;
  private destroy$ = new Subject<void>();

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadUsers(): void {
    this.loading = true;
    this.userService
      .getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (users) => {
          this.users = users;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading users:', error);
          this.loading = false;
        },
      });
  }
}
```

### Services

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(catchError(this.handleError));
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  createUser(user: CreateUserDto): Observable<User> {
    return this.http.post<User>(this.apiUrl, user).pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something went wrong. Please try again later.'));
  }
}
```

### Templates

```html
<!-- ✅ Utilisez async pipe pour les observables -->
<div *ngIf="users$ | async as users">
  <div *ngFor="let user of users">{{ user.name }}</div>
</div>

<!-- ✅ Utilisez trackBy pour les *ngFor -->
<div *ngFor="let user of users; trackBy: trackByUserId">{{ user.name }}</div>

<!-- ❌ Évitez les appels de méthodes dans les templates -->
<div>{{ calculateTotal() }}</div>

<!-- ✅ Utilisez des propriétés -->
<div>{{ total }}</div>
```

### Formulaires réactifs

```typescript
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export class UserFormComponent implements OnInit {
  userForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      roleId: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const user = this.userForm.value;
      // Process form
    }
  }
}
```

---

## Base de données

### Nommage

- Tables : snake_case au pluriel (`users`, `opportunites`)
- Colonnes : snake_case (`first_name`, `created_at`)
- Clés primaires : `id`
- Clés étrangères : `table_id` (ex: `role_id`)

### Migrations

```typescript
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsersTable1234567890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'email',
            type: 'varchar',
            length: '100',
            isUnique: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
```

---

## API REST

### Conventions d'URL

```
GET    /api/users              # Liste tous les utilisateurs
GET    /api/users/:id          # Récupère un utilisateur
POST   /api/users              # Crée un utilisateur
PUT    /api/users/:id          # Met à jour un utilisateur (complet)
PATCH  /api/users/:id          # Met à jour partiellement un utilisateur
DELETE /api/users/:id          # Supprime un utilisateur

# Actions spéciales : utiliser des verbes
POST   /api/opportunites/:id/valider
POST   /api/ypareo/sync
```

### Codes de statut HTTP

- `200 OK` : Requête réussie (GET, PUT, PATCH)
- `201 Created` : Ressource créée (POST)
- `204 No Content` : Réussite sans contenu (DELETE)
- `400 Bad Request` : Données invalides
- `401 Unauthorized` : Non authentifié
- `403 Forbidden` : Non autorisé
- `404 Not Found` : Ressource non trouvée
- `409 Conflict` : Conflit (ex: email existant)
- `500 Internal Server Error` : Erreur serveur

### Format des réponses

```typescript
// Succès
{
  "id": 1,
  "email": "user@afpi.fr",
  "firstName": "John",
  "lastName": "Doe"
}

// Liste avec pagination
{
  "data": [...],
  "meta": {
    "page": 1,
    "perPage": 20,
    "total": 150,
    "totalPages": 8
  }
}

// Erreur
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email must be a valid email address"
    }
  ]
}
```

---

## Git

### Messages de commit

Format : `type(scope): description`

Types :
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation
- `style`: Formatage
- `refactor`: Refactorisation
- `test`: Tests
- `chore`: Maintenance

Exemples :
```
feat(auth): add JWT authentication
fix(opportunites): correct status validation
docs(readme): update installation instructions
style: format code with prettier
refactor(users): extract validation logic
test(services): add unit tests for UserService
chore(deps): update dependencies
```

### Branches

- `main` : Production
- `develop` : Développement
- `feature/description` : Nouvelles fonctionnalités
- `bugfix/description` : Corrections de bugs
- `hotfix/description` : Corrections urgentes

---

## Ressources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Angular Style Guide](https://angular.io/guide/styleguide)
- [Clean Code](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)

---

Ce guide est un document vivant. N'hésitez pas à proposer des améliorations !
