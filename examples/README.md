# Exemples d'Implémentation - AFPI CRM

Ce dossier contient des exemples d'implémentation pour les principales fonctionnalités du projet.

## 📁 Structure

```
examples/
├── backend/
│   └── common/
│       ├── filters/
│       │   └── http-exception.filter.ts    # Filtre de gestion des erreurs HTTP
│       └── interceptors/
│           └── logging.interceptor.ts       # Intercepteur de logging
│
└── frontend/
    ├── interceptors/
    │   └── error.interceptor.ts             # Intercepteur de gestion d'erreurs
    └── components/
        ├── kpi-dashboard.component.ts       # Dashboard KPIs TypeScript
        └── kpi-dashboard.component.html     # Dashboard KPIs Template
```

## 🔧 Backend (NestJS)

### HTTP Exception Filter

**Fichier:** `backend/common/filters/http-exception.filter.ts`

Filtre global pour intercepter et formater toutes les exceptions HTTP.

**Caractéristiques:**
- Génération automatique de `correlationId` pour tracer les erreurs
- Messages utilisateur adaptés selon le code HTTP
- Logging structuré avec contexte complet
- Support des erreurs de validation avec détails

**Utilisation:**

```typescript
// main.ts
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}
```

### Logging Interceptor

**Fichier:** `backend/common/interceptors/logging.interceptor.ts`

Intercepteur pour logger automatiquement toutes les requêtes HTTP.

**Caractéristiques:**
- Log de toutes les requêtes entrantes
- Mesure de la durée de traitement
- Identification de l'utilisateur (si authentifié)
- Logs séparés pour succès et erreurs

**Utilisation:**

```typescript
// main.ts ou dans un module spécifique
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new LoggingInterceptor());
  await app.listen(3000);
}
```

## 🎨 Frontend (Angular)

### Error Interceptor

**Fichier:** `frontend/interceptors/error.interceptor.ts`

Intercepteur HTTP pour gérer les erreurs de manière centralisée.

**Caractéristiques:**
- Retry automatique pour les requêtes GET en cas d'erreur réseau
- Messages utilisateur adaptés selon le code d'erreur
- Gestion des erreurs de validation avec détails
- Redirection automatique vers login en cas de session expirée
- Traduction des noms de champs pour les erreurs

**Utilisation:**

```typescript
// app.module.ts
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';

@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
  ],
})
export class AppModule {}
```

### KPI Dashboard Component

**Fichiers:**
- `frontend/components/kpi-dashboard.component.ts`
- `frontend/components/kpi-dashboard.component.html`

Composant de dashboard pour afficher les KPIs métier.

**Caractéristiques:**
- Affichage des KPIs principaux : CA, Opportunités, Taux de Conversion
- Graphiques interactifs avec Chart.js
- Comparaison objectifs vs réalisations
- Visualisation par localisation
- Responsive et accessible (WCAG 2.1 AA)

**KPIs affichés:**

1. **Chiffre d'Affaires**
   - Valeur actuelle
   - Objectif
   - Barre de progression
   - Pourcentage d'atteinte

2. **Nombre d'Opportunités**
   - Total créé
   - Objectif
   - Progression

3. **Taux de Conversion**
   - Pourcentage actuel
   - Objectif cible
   - Indicateur coloré (vert/orange/rouge)

**Graphiques:**

1. **CA par Localisation** (Graphique à barres)
   - Comparaison visuelle entre les 14 centres AFPI
   - Valeurs en euros
   - Responsive

2. **Taux de Conversion par Localisation** (Graphique en ligne)
   - Évolution du taux de conversion
   - Comparaison entre localisations
   - Échelle 0-100%

3. **Tableau de Performance**
   - Vue détaillée par localisation
   - Tri possible
   - Badges colorés selon performance

**Utilisation:**

```typescript
// dashboard.module.ts
import { KpiDashboardComponent } from './components/kpi-dashboard/kpi-dashboard.component';

@NgModule({
  declarations: [KpiDashboardComponent],
  imports: [CommonModule, DashboardRoutingModule],
})
export class DashboardModule {}
```

```typescript
// dashboard.service.ts (à créer)
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getKPIData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/objectifs/kpi`);
  }

  getLocalisationPerformance(): Observable<any> {
    return this.http.get(`${this.apiUrl}/objectifs/performance`);
  }
}
```

## 📊 API Backend pour KPIs

Exemple de contrôleur et service pour les endpoints KPI :

```typescript
// objectifs.controller.ts
@Controller('objectifs')
@UseGuards(JwtAuthGuard)
export class ObjectifsController {
  constructor(private objectifsService: ObjectifsService) {}

  @Get('kpi')
  async getKPIData(@Request() req) {
    const userId = req.user.id;
    const roleId = req.user.roleId;
    return this.objectifsService.getKPIData(userId, roleId);
  }

  @Get('performance')
  async getLocalisationPerformance(@Request() req) {
    const userId = req.user.id;
    const roleId = req.user.roleId;
    return this.objectifsService.getLocalisationPerformance(userId, roleId);
  }
}
```

```typescript
// objectifs.service.ts
@Injectable()
export class ObjectifsService {
  constructor(
    @InjectRepository(Objectif)
    private objectifRepository: Repository<Objectif>,
    @InjectRepository(Opportunite)
    private opportuniteRepository: Repository<Opportunite>,
  ) {}

  async getKPIData(userId: number, roleId: number) {
    // Logique pour calculer les KPIs selon le rôle
    const filter = this.getFilterByRole(userId, roleId);

    const [objectifs, opportunites] = await Promise.all([
      this.objectifRepository.find({ where: filter }),
      this.opportuniteRepository.find({ where: filter }),
    ]);

    const totalCA = opportunites
      .filter((o) => o.status === 'completed')
      .reduce((sum, o) => sum + o.budget, 0);

    const totalOpportunites = opportunites.length;

    const completedOpportunites = opportunites.filter((o) => o.status === 'completed').length;

    const conversionRate = totalOpportunites > 0 
      ? (completedOpportunites / totalOpportunites) * 100 
      : 0;

    const targetCA = objectifs.reduce((sum, o) => sum + o.target_ca, 0);
    const targetOpportunites = objectifs.reduce((sum, o) => sum + o.target_nb_opportunites, 0);
    const targetConversionRate = objectifs.length > 0
      ? objectifs.reduce((sum, o) => sum + o.target_conversion_rate, 0) / objectifs.length
      : 0;

    return {
      totalCA,
      totalOpportunites,
      conversionRate,
      targetCA,
      targetOpportunites,
      targetConversionRate,
    };
  }

  async getLocalisationPerformance(userId: number, roleId: number) {
    // Retourner la performance par localisation
    // Implémentation selon les besoins
  }

  private getFilterByRole(userId: number, roleId: number) {
    // Filtrer selon le rôle (admin voit tout, manager sa localisation, etc.)
    // Implémentation selon la hiérarchie des rôles
  }
}
```

## 🚀 Intégration dans votre projet

### 1. Copier les fichiers

Copiez les fichiers d'exemple dans les emplacements appropriés de votre projet :

```bash
# Backend
cp examples/backend/common/filters/http-exception.filter.ts backend/src/common/filters/
cp examples/backend/common/interceptors/logging.interceptor.ts backend/src/common/interceptors/

# Frontend
cp examples/frontend/interceptors/error.interceptor.ts frontend/src/app/core/interceptors/
cp examples/frontend/components/kpi-dashboard.component.* frontend/src/app/modules/dashboard/components/kpi-dashboard/
```

### 2. Installer les dépendances

```bash
# Backend
cd backend
npm install uuid @types/uuid

# Frontend
cd frontend
npm install chart.js ngx-toastr
```

### 3. Configurer les modules

Suivez les exemples d'utilisation ci-dessus pour intégrer les composants dans vos modules.

### 4. Tester

```bash
# Backend
npm run test

# Frontend
npm run test
```

## 📚 Documentation associée

- [ERROR_HANDLING.md](../ERROR_HANDLING.md) - Guide complet de gestion des erreurs
- [MONITORING.md](../MONITORING.md) - Stratégie de monitoring et logging
- [DEVELOPER.md](../DEVELOPER.md) - Guide développeur
- [ARCHITECTURE.md](../ARCHITECTURE.md) - Architecture du système

## 💡 Personnalisation

Ces exemples sont des points de départ. N'hésitez pas à les adapter selon vos besoins :

- Ajouter des KPIs supplémentaires
- Modifier les messages d'erreur
- Personnaliser les graphiques
- Ajouter des filtres par période
- Implémenter l'export en PDF/Excel
- Ajouter des notifications en temps réel

## 🤝 Contribution

Pour proposer de nouveaux exemples ou améliorer les existants, consultez [CONTRIBUTING.md](../CONTRIBUTING.md).

---

Ces exemples sont fournis pour faciliter l'implémentation des fonctionnalités principales. Adaptez-les selon vos besoins spécifiques ! 🚀
