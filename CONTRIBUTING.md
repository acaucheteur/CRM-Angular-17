# Guide de Contribution - AFPI CRM

Merci de votre intérêt pour contribuer au projet AFPI CRM ! Ce document vous guidera à travers le processus de contribution.

## 📋 Table des matières

- [Code de conduite](#code-de-conduite)
- [Comment puis-je contribuer ?](#comment-puis-je-contribuer)
- [Processus de développement](#processus-de-développement)
- [Standards de code](#standards-de-code)
- [Pull Requests](#pull-requests)
- [Signaler des bugs](#signaler-des-bugs)
- [Proposer des améliorations](#proposer-des-améliorations)

---

## 📜 Code de conduite

En participant à ce projet, vous acceptez de respecter notre code de conduite :

- Soyez respectueux et professionnel
- Acceptez les critiques constructives
- Concentrez-vous sur ce qui est meilleur pour la communauté
- Faites preuve d'empathie envers les autres membres

---

## 🤝 Comment puis-je contribuer ?

### Types de contributions

Nous acceptons différents types de contributions :

1. **Rapporter des bugs** : Signalez les problèmes que vous rencontrez
2. **Proposer des fonctionnalités** : Suggérez de nouvelles idées
3. **Améliorer la documentation** : Corrigez ou complétez la documentation
4. **Corriger des bugs** : Soumettez des corrections de code
5. **Implémenter de nouvelles fonctionnalités** : Développez de nouvelles fonctionnalités
6. **Réviser du code** : Participez aux revues de code

### Premiers pas

1. **Fork** le dépôt
2. **Clone** votre fork localement
3. **Créez une branche** pour votre contribution
4. **Faites vos changements**
5. **Testez** vos modifications
6. **Commit** avec un message clair
7. **Push** vers votre fork
8. **Ouvrez une Pull Request**

---

## 🔄 Processus de développement

### 1. Configuration de l'environnement

```bash
# Cloner votre fork
git clone https://github.com/VOTRE-USERNAME/CRM-Angular-17.git
cd CRM-Angular-17

# Ajouter le dépôt upstream
git remote add upstream https://github.com/acaucheteur/CRM-Angular-17.git

# Installer les dépendances
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Créer une branche

```bash
# Mettre à jour develop
git checkout develop
git pull upstream develop

# Créer une nouvelle branche
git checkout -b feature/ma-nouvelle-fonctionnalite
```

Nommage des branches :
- `feature/description` pour les nouvelles fonctionnalités
- `bugfix/description` pour les corrections de bugs
- `docs/description` pour la documentation
- `refactor/description` pour la refactorisation

### 3. Faire des changements

- Suivez le [STYLE_GUIDE.md](./STYLE_GUIDE.md)
- Écrivez des tests pour votre code
- Assurez-vous que tous les tests passent
- Mettez à jour la documentation si nécessaire

### 4. Commiter

Utilisez des commits atomiques et suivez le format **Conventional Commits** :

```bash
git add .
git commit -m "feat(module): description courte de la fonctionnalité"
```

Format des messages de commit :
```
type(scope): description courte

[corps détaillé optionnel]

[pied optionnel]
```

Types de commits :
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation uniquement
- `style`: Changements de formatage (pas de code)
- `refactor`: Refactorisation du code
- `perf`: Amélioration des performances
- `test`: Ajout ou modification de tests
- `chore`: Tâches de maintenance

Exemples :
```bash
feat(auth): add password reset functionality
fix(opportunites): correct validation in section 2
docs(readme): update installation steps
test(users): add unit tests for UserService
```

### 5. Tester

```bash
# Backend
cd backend
npm run test          # Tests unitaires
npm run test:e2e      # Tests E2E
npm run lint          # Vérifier le linting

# Frontend
cd frontend
npm run test          # Tests unitaires
npm run lint          # Vérifier le linting
```

### 6. Push et Pull Request

```bash
# Push vers votre fork
git push origin feature/ma-nouvelle-fonctionnalite
```

Ensuite, ouvrez une Pull Request sur GitHub.

---

## 📝 Standards de code

### Linting et formatage

Le projet utilise ESLint et Prettier pour maintenir la qualité du code.

```bash
# Formater le code
npm run format

# Vérifier le linting
npm run lint

# Corriger automatiquement les erreurs de linting
npm run lint:fix
```

### Tests

- **Tous les nouveaux codes doivent être testés**
- Visez une couverture de tests d'au moins 80%
- Écrivez des tests unitaires pour la logique métier
- Écrivez des tests d'intégration pour les flux critiques

### Documentation

- Documentez les fonctions publiques avec JSDoc
- Mettez à jour le README si vous ajoutez des fonctionnalités
- Ajoutez des commentaires pour les parties complexes du code

---

## 🔍 Pull Requests

### Checklist avant de soumettre

- [ ] Les tests passent localement (`npm run test`)
- [ ] Le code est formaté (`npm run format`)
- [ ] Le linting passe (`npm run lint`)
- [ ] La documentation est à jour
- [ ] Les commits suivent le format Conventional Commits
- [ ] La branche est à jour avec `develop`

### Template de Pull Request

Utilisez ce template pour vos Pull Requests :

```markdown
## Description

[Description claire et concise des changements]

## Type de changement

- [ ] Bug fix (non-breaking change qui corrige un problème)
- [ ] New feature (non-breaking change qui ajoute une fonctionnalité)
- [ ] Breaking change (correction ou fonctionnalité qui casserait la compatibilité)
- [ ] Documentation update

## Comment tester ?

[Instructions pour tester vos changements]

## Checklist

- [ ] Mon code suit le style guide du projet
- [ ] J'ai effectué une auto-revue de mon code
- [ ] J'ai commenté les parties complexes de mon code
- [ ] J'ai mis à jour la documentation
- [ ] Mes changements ne génèrent pas de nouveaux warnings
- [ ] J'ai ajouté des tests qui prouvent que ma correction fonctionne
- [ ] Les tests unitaires et d'intégration passent localement
- [ ] Tous les changements dépendants ont été mergés

## Screenshots (si applicable)

[Ajoutez des screenshots pour les changements UI]

## Issues liées

Closes #[numéro de l'issue]
```

### Processus de revue

1. Un membre de l'équipe sera assigné pour réviser votre PR
2. Des commentaires et suggestions pourront être faits
3. Apportez les modifications demandées
4. Une fois approuvée, votre PR sera mergée

### Critères d'acceptation

- Le code respecte les standards du projet
- Les tests passent
- La couverture de tests est maintenue ou améliorée
- La documentation est à jour
- Au moins une approbation d'un mainteneur

---

## 🐛 Signaler des bugs

### Avant de signaler

- Vérifiez que le bug n'a pas déjà été signalé
- Assurez-vous d'utiliser la dernière version
- Collectez les informations nécessaires

### Template de bug report

```markdown
## Description du bug

[Description claire et concise du bug]

## Comment reproduire

1. Aller à '...'
2. Cliquer sur '...'
3. Scroll jusqu'à '...'
4. Voir l'erreur

## Comportement attendu

[Ce qui devrait se passer]

## Comportement actuel

[Ce qui se passe actuellement]

## Screenshots

[Si applicable, ajoutez des screenshots]

## Environnement

- OS: [ex: Windows 10, macOS 12, Ubuntu 22.04]
- Navigateur: [ex: Chrome 120, Firefox 121]
- Version Node.js: [ex: 18.17.0]
- Version du projet: [ex: 1.2.3]

## Logs

```
[Collez les logs pertinents ici]
```

## Informations supplémentaires

[Tout autre contexte utile]
```

---

## 💡 Proposer des améliorations

### Template de feature request

```markdown
## Problème à résoudre

[Quel problème cette fonctionnalité résout-elle ?]

## Solution proposée

[Description de la solution envisagée]

## Alternatives considérées

[Autres solutions envisagées]

## Impacts

- [ ] Breaking change
- [ ] Nécessite une migration de base de données
- [ ] Nécessite une mise à jour de la documentation
- [ ] Nécessite des changements frontend
- [ ] Nécessite des changements backend

## Informations supplémentaires

[Contexte additionnel, screenshots, exemples, etc.]
```

---

## 🎯 Domaines prioritaires

Nous recherchons particulièrement de l'aide dans ces domaines :

1. **Tests** : Améliorer la couverture de tests
2. **Documentation** : Compléter et améliorer la documentation
3. **Accessibilité** : Améliorer l'accessibilité de l'interface
4. **Performance** : Optimiser les performances
5. **Sécurité** : Identifier et corriger les vulnérabilités

---

## 📚 Ressources utiles

- [Documentation développeur](./DEVELOPER.md)
- [Guide de style](./STYLE_GUIDE.md)
- [README principal](./README.md)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Guide Angular](https://angular.io/docs)
- [Documentation NestJS](https://docs.nestjs.com/)

---

## 🙏 Remerciements

Merci de prendre le temps de contribuer à AFPI CRM ! Chaque contribution, petite ou grande, est valorisée et appréciée.

---

## 📞 Questions ?

Si vous avez des questions sur le processus de contribution :

1. Consultez d'abord la documentation
2. Cherchez dans les issues existantes
3. Ouvrez une nouvelle issue avec le tag `question`
4. Contactez l'équipe sur le canal de communication dédié

---

## 📄 Licence

En contribuant à ce projet, vous acceptez que vos contributions soient sous la même licence que le projet principal.
