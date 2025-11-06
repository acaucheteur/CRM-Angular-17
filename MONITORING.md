# Guide de Monitoring et Observabilité - AFPI CRM

Ce document décrit la stratégie de monitoring et d'observabilité pour l'application AFPI CRM en production.

## 📋 Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Logs structurés](#logs-structurés)
- [Métriques](#métriques)
- [Alertes](#alertes)
- [Tracing distribué](#tracing-distribué)
- [Dashboard et visualisation](#dashboard-et-visualisation)
- [Configuration](#configuration)

---

## 🎯 Vue d'ensemble

### Les trois piliers de l'observabilité

1. **Logs** : Événements discrets enregistrés
2. **Métriques** : Valeurs numériques agrégées dans le temps
3. **Traces** : Parcours des requêtes à travers le système

### Stack de monitoring

- **Logs** : Winston (Backend) + File rotation
- **Métriques** : Prometheus + Grafana
- **APM** : (à implémenter) - ex: Elastic APM, Datadog
- **Alerting** : Grafana Alerts + Notifications

---

## 📝 Logs structurés

### Backend (NestJS + Winston)

#### Configuration Winston

```typescript
// src/config/logger.config.ts
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

export const loggerConfig = WinstonModule.createLogger({
  transports: [
    // Console (development)
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, context, ...meta }) => {
          return `${timestamp} [${context}] ${level}: ${message} ${
            Object.keys(meta).length ? JSON.stringify(meta) : ''
          }`;
        }),
      ),
    }),

    // File - All logs
    new DailyRotateFile({
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    }),

    // File - Error logs only
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d',
      level: 'error',
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    }),
  ],
});
```

#### Utilisation dans les services

```typescript
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  async createUser(createUserDto: CreateUserDto) {
    this.logger.log('Creating user', {
      email: createUserDto.email,
      roleId: createUserDto.roleId,
    });

    try {
      const user = await this.userRepository.save(createUserDto);

      this.logger.log('User created successfully', {
        userId: user.id,
        email: user.email,
      });

      return user;
    } catch (error) {
      this.logger.error('Failed to create user', {
        error: error.message,
        stack: error.stack,
        dto: createUserDto,
      });

      throw new InternalServerErrorException('Failed to create user');
    }
  }
}
```

#### Intercepteur de logs HTTP

```typescript
// src/common/interceptors/logging.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip } = request;
    const userAgent = request.get('user-agent') || '';
    const startTime = Date.now();

    this.logger.log('Incoming request', {
      method,
      url,
      ip,
      userAgent,
    });

    return next.handle().pipe(
      tap({
        next: (data) => {
          const response = context.switchToHttp().getResponse();
          const { statusCode } = response;
          const duration = Date.now() - startTime;

          this.logger.log('Request completed', {
            method,
            url,
            statusCode,
            duration: `${duration}ms`,
          });
        },
        error: (error) => {
          const duration = Date.now() - startTime;

          this.logger.error('Request failed', {
            method,
            url,
            error: error.message,
            duration: `${duration}ms`,
          });
        },
      }),
    );
  }
}
```

### Frontend (Angular)

#### Service de logging

```typescript
// src/app/core/services/logger.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  constructor(private http: HttpClient) {}

  debug(message: string, data?: any) {
    this.log(LogLevel.DEBUG, message, data);
  }

  info(message: string, data?: any) {
    this.log(LogLevel.INFO, message, data);
  }

  warn(message: string, data?: any) {
    this.log(LogLevel.WARN, message, data);
  }

  error(message: string, error?: any) {
    this.log(LogLevel.ERROR, message, {
      error: error?.message,
      stack: error?.stack,
      ...error,
    });
  }

  private log(level: LogLevel, message: string, data?: any) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    // Console en développement
    if (!environment.production) {
      console[level](message, data);
    }

    // Envoyer au backend en production
    if (environment.production && level === LogLevel.ERROR) {
      this.sendToBackend(logEntry).subscribe();
    }
  }

  private sendToBackend(logEntry: any) {
    return this.http.post(`${environment.apiUrl}/logs/frontend`, logEntry);
  }
}
```

#### Error Handler global

```typescript
// src/app/core/handlers/global-error.handler.ts
import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LoggerService } from '../services/logger.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) {}

  handleError(error: Error | HttpErrorResponse) {
    const logger = this.injector.get(LoggerService);
    const toastr = this.injector.get(ToastrService);

    if (error instanceof HttpErrorResponse) {
      // Erreur HTTP
      logger.error('HTTP Error', {
        status: error.status,
        message: error.message,
        url: error.url,
      });

      // Message utilisateur
      if (error.status === 0) {
        toastr.error('Impossible de contacter le serveur', 'Erreur réseau');
      } else if (error.status === 401) {
        toastr.error('Session expirée, veuillez vous reconnecter', 'Non authentifié');
      } else if (error.status >= 500) {
        toastr.error('Une erreur serveur est survenue', 'Erreur serveur');
      }
    } else {
      // Erreur JavaScript
      logger.error('JavaScript Error', error);
      toastr.error('Une erreur inattendue est survenue', 'Erreur');
    }
  }
}
```

---

## 📊 Métriques

### Backend (NestJS + Prometheus)

#### Installation

```bash
npm install @willsoto/nestjs-prometheus prom-client
```

#### Configuration

```typescript
// src/app.module.ts
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    PrometheusModule.register({
      defaultMetrics: {
        enabled: true,
      },
      path: '/metrics',
    }),
    // ... autres modules
  ],
})
export class AppModule {}
```

#### Métriques personnalisées

```typescript
// src/modules/opportunites/opportunites.service.ts
import { Injectable } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram } from 'prom-client';

@Injectable()
export class OpportunitesService {
  constructor(
    @InjectMetric('opportunites_created_total')
    private opportunitesCreatedCounter: Counter<string>,

    @InjectMetric('opportunite_creation_duration_seconds')
    private opportuniteCreationHistogram: Histogram<string>,
  ) {}

  async create(dto: CreateOpportuniteDto) {
    const timer = this.opportuniteCreationHistogram.startTimer();

    try {
      const opportunite = await this.repository.save(dto);

      this.opportunitesCreatedCounter.inc({
        status: 'success',
        localisation: opportunite.localisationId.toString(),
      });

      timer();
      return opportunite;
    } catch (error) {
      this.opportunitesCreatedCounter.inc({ status: 'error' });
      timer();
      throw error;
    }
  }
}
```

#### Provider de métriques

```typescript
// src/common/providers/metrics.provider.ts
import { makeCounterProvider, makeHistogramProvider } from '@willsoto/nestjs-prometheus';

export const metricsProviders = [
  // Compteurs
  makeCounterProvider({
    name: 'opportunites_created_total',
    help: 'Total number of opportunities created',
    labelNames: ['status', 'localisation'],
  }),

  makeCounterProvider({
    name: 'users_login_total',
    help: 'Total number of user logins',
    labelNames: ['status', 'role'],
  }),

  // Histogrammes (durées)
  makeHistogramProvider({
    name: 'opportunite_creation_duration_seconds',
    help: 'Duration of opportunity creation',
    labelNames: ['status'],
    buckets: [0.1, 0.5, 1, 2, 5],
  }),

  makeHistogramProvider({
    name: 'http_request_duration_seconds',
    help: 'HTTP request duration',
    labelNames: ['method', 'route', 'status'],
    buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
  }),
];
```

### Métriques métier clés

```typescript
// KPIs à tracker
const businessMetrics = [
  'opportunites_total',                    // Nombre total d'opportunités
  'opportunites_by_status',                // Par statut (section_1, section_2, etc.)
  'opportunites_conversion_rate',          // Taux de conversion
  'revenue_total',                         // CA total
  'revenue_by_localisation',               // CA par localisation
  'active_users',                          // Utilisateurs actifs
  'ypareo_sync_duration_seconds',          // Durée des syncs Ypareo
  'ypareo_sync_errors_total',              // Erreurs de sync
];
```

---

## 🚨 Alertes

### Configuration Grafana

```yaml
# docker/grafana/provisioning/alerting/rules.yml
apiVersion: 1

groups:
  - name: afpi_crm_alerts
    interval: 1m
    rules:
      # Alerte : Taux d'erreur élevé
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Taux d'erreur HTTP élevé"
          description: "Plus de 5% des requêtes HTTP retournent une erreur 5xx"

      # Alerte : Temps de réponse lent
      - alert: SlowResponseTime
        expr: http_request_duration_seconds{quantile="0.95"} > 2
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Temps de réponse lent"
          description: "Le temps de réponse p95 dépasse 2 secondes"

      # Alerte : Base de données down
      - alert: DatabaseDown
        expr: up{job="mariadb"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Base de données inaccessible"
          description: "La base de données MariaDB ne répond pas"

      # Alerte : Redis down
      - alert: RedisDown
        expr: up{job="redis"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Redis inaccessible"
          description: "Le serveur Redis ne répond pas"

      # Alerte : Échec de sync Ypareo
      - alert: YpareoSyncFailure
        expr: increase(ypareo_sync_errors_total[10m]) > 5
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Échecs répétés de synchronisation Ypareo"
          description: "Plus de 5 échecs de sync Ypareo en 10 minutes"
```

### Notifications

```yaml
# docker/grafana/provisioning/alerting/contact-points.yml
apiVersion: 1

contactPoints:
  - name: email-admin
    type: email
    settings:
      addresses: admin@afpi.fr
      singleEmail: true

  - name: slack-alerts
    type: slack
    settings:
      url: ${SLACK_WEBHOOK_URL}
      text: |
        🚨 Alerte AFPI CRM
        {{ .CommonAnnotations.summary }}
        {{ .CommonAnnotations.description }}
```

---

## 🔍 Tracing distribué

### OpenTelemetry (à implémenter)

```typescript
// Exemple de configuration OpenTelemetry
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

const sdk = new NodeSDK({
  serviceName: 'afpi-crm-backend',
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
```

---

## 📈 Dashboard et visualisation

### Dashboard Grafana pour AFPI CRM

```json
{
  "dashboard": {
    "title": "AFPI CRM - Métriques Métier",
    "panels": [
      {
        "title": "Opportunités créées (24h)",
        "targets": [
          {
            "expr": "increase(opportunites_created_total[24h])"
          }
        ]
      },
      {
        "title": "Taux de conversion",
        "targets": [
          {
            "expr": "opportunites_conversion_rate"
          }
        ]
      },
      {
        "title": "CA par localisation",
        "targets": [
          {
            "expr": "sum by (localisation) (revenue_by_localisation)"
          }
        ]
      }
    ]
  }
}
```

---

## ⚙️ Configuration

### Variables d'environnement

```env
# Logs
LOG_LEVEL=info
LOG_DIR=./logs

# Prometheus
PROMETHEUS_ENABLED=true
PROMETHEUS_PORT=9090

# Grafana
GRAFANA_ADMIN_USER=admin
GRAFANA_ADMIN_PASSWORD=secure_password

# Alerting
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
ALERT_EMAIL=admin@afpi.fr
```

### Rotation des logs

```javascript
// package.json scripts
{
  "scripts": {
    "logs:clean": "find ./logs -name '*.log' -mtime +30 -delete",
    "logs:archive": "tar -czf logs-archive-$(date +%Y%m%d).tar.gz logs/"
  }
}
```

---

## 📚 Best Practices

1. **Log structuré** : Toujours utiliser des objets JSON pour les logs
2. **Niveaux appropriés** : DEBUG < INFO < WARN < ERROR
3. **Contexte** : Inclure des informations contextuelles (userId, requestId, etc.)
4. **Pas de données sensibles** : Ne jamais logger de mots de passe, tokens, etc.
5. **Métriques pertinentes** : Tracker ce qui a un impact business
6. **Alertes actionnables** : Chaque alerte doit conduire à une action
7. **Dashboards clairs** : Visualisations simples et compréhensibles

---

## 📞 Runbook

En cas d'alerte, suivre ce processus :

1. **Identifier** : Quelle alerte ? Quelle gravité ?
2. **Vérifier** : Consulter les logs et métriques
3. **Diagnostiquer** : Identifier la cause racine
4. **Mitiger** : Actions immédiates pour limiter l'impact
5. **Résoudre** : Corriger le problème
6. **Post-mortem** : Documenter et améliorer

---

Un système bien observé est un système qui tourne ! 🎯
