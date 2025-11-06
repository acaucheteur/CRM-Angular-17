# Guide d'Accessibilité - AFPI CRM

Ce document présente les standards d'accessibilité (WCAG 2.1 niveau AA) à respecter pour l'application AFPI CRM.

## 📋 Table des matières

- [Principes WCAG](#principes-wcag)
- [Checklist d'accessibilité](#checklist-daccessibilité)
- [Couleurs et contrastes](#couleurs-et-contrastes)
- [Navigation au clavier](#navigation-au-clavier)
- [Lecteurs d'écran](#lecteurs-décran)
- [Formulaires](#formulaires)
- [Contenu multimédia](#contenu-multimédia)
- [Outils de test](#outils-de-test)

---

## 🎯 Principes WCAG

Les quatre principes fondamentaux de l'accessibilité web (POUR) :

### 1. Perceptible
L'information et les composants de l'interface utilisateur doivent être présentés de manière perceptible.

### 2. Utilisable
Les composants de l'interface utilisateur et la navigation doivent être utilisables.

### 3. Compréhensible
L'information et l'utilisation de l'interface utilisateur doivent être compréhensibles.

### 4. Robuste
Le contenu doit être suffisamment robuste pour être interprété de manière fiable par une large variété d'agents utilisateurs, y compris les technologies d'assistance.

---

## ✅ Checklist d'accessibilité

### Structure HTML

- [ ] Utiliser les balises HTML sémantiques (`<header>`, `<nav>`, `<main>`, `<footer>`, etc.)
- [ ] Hiérarchie de titres logique (H1 → H2 → H3, sans sauter de niveaux)
- [ ] Un seul H1 par page
- [ ] Utiliser `<button>` pour les actions et `<a>` pour la navigation

```html
<!-- ✅ Bon -->
<main>
  <h1>Gestion des utilisateurs</h1>
  <section>
    <h2>Liste des utilisateurs</h2>
    <!-- contenu -->
  </section>
</main>

<!-- ❌ Mauvais -->
<div>
  <h1>Titre</h1>
  <h3>Sous-titre</h3> <!-- Saute le niveau H2 -->
  <div onclick="...">Cliquez ici</div> <!-- Utilise div au lieu de button -->
</div>
```

### Textes alternatifs

- [ ] Toutes les images ont un attribut `alt` descriptif
- [ ] Les images décoratives ont `alt=""`
- [ ] Les icônes fonctionnelles ont des labels accessibles

```html
<!-- ✅ Images informatives -->
<img src="user-profile.jpg" alt="Photo de profil de Jean Dupont" />

<!-- ✅ Images décoratives -->
<img src="decoration.svg" alt="" role="presentation" />

<!-- ✅ Icônes avec action -->
<button aria-label="Supprimer l'utilisateur">
  <i class="fa fa-trash" aria-hidden="true"></i>
</button>
```

### ARIA (Accessible Rich Internet Applications)

- [ ] Utiliser ARIA uniquement quand nécessaire
- [ ] Les landmarks ARIA sont correctement définis
- [ ] Les états dynamiques sont annoncés

```html
<!-- Landmarks -->
<nav role="navigation" aria-label="Menu principal">...</nav>
<main role="main">...</main>
<aside role="complementary">...</aside>

<!-- États dynamiques -->
<button aria-expanded="false" aria-controls="menu">Menu</button>
<div id="menu" aria-hidden="true">...</div>

<!-- Messages d'alerte -->
<div role="alert" aria-live="polite">Utilisateur créé avec succès</div>

<!-- Chargement -->
<div role="status" aria-live="polite" aria-busy="true">Chargement en cours...</div>
```

---

## 🎨 Couleurs et contrastes

### Ratios de contraste minimum (WCAG 2.1 AA)

- **Texte normal** : Ratio de contraste 4.5:1
- **Texte large** (18pt+ ou 14pt+ gras) : Ratio de contraste 3:1
- **Composants UI** : Ratio de contraste 3:1

### Vérification des contrastes

```css
/* ✅ Bon contraste (noir sur blanc = 21:1) */
.text {
  color: #000000;
  background-color: #ffffff;
}

/* ✅ Bon contraste (bleu foncé sur blanc = 8.59:1) */
.link {
  color: #0056b3;
  background-color: #ffffff;
}

/* ❌ Mauvais contraste (gris clair sur blanc = 2.32:1) */
.text-light {
  color: #c0c0c0;
  background-color: #ffffff;
}
```

### Ne pas utiliser uniquement la couleur

L'information ne doit pas être transmise uniquement par la couleur.

```html
<!-- ❌ Mauvais : Information uniquement par couleur -->
<span style="color: red">Erreur</span>
<span style="color: green">Succès</span>

<!-- ✅ Bon : Couleur + icône + texte -->
<span class="text-danger">
  <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
  Erreur : Le champ email est requis
</span>

<span class="text-success">
  <i class="fa fa-check-circle" aria-hidden="true"></i>
  Succès : Utilisateur créé
</span>
```

---

## ⌨️ Navigation au clavier

### Ordre de tabulation

- [ ] L'ordre de tabulation est logique et suit l'ordre visuel
- [ ] Tous les éléments interactifs sont accessibles au clavier
- [ ] Le focus est visible

```css
/* Focus visible */
a:focus,
button:focus,
input:focus {
  outline: 2px solid #0056b3;
  outline-offset: 2px;
}

/* Ne jamais faire : */
*:focus {
  outline: none; /* ❌ */
}
```

### Touches de raccourci

- `Tab` : Navigation avant
- `Shift + Tab` : Navigation arrière
- `Enter` : Activer un lien ou bouton
- `Space` : Activer un bouton ou checkbox
- `Escape` : Fermer un modal ou menu
- `Flèches` : Navigation dans les listes et menus

```typescript
// Exemple : Fermer un modal avec Escape
@HostListener('keydown.escape')
onEscape() {
  this.closeModal();
}

// Navigation dans une liste avec flèches
@HostListener('keydown.arrowdown', ['$event'])
onArrowDown(event: KeyboardEvent) {
  event.preventDefault();
  this.navigateToNextItem();
}
```

### Skip links

Ajouter un lien pour sauter au contenu principal :

```html
<a href="#main-content" class="skip-link">Aller au contenu principal</a>

<main id="main-content">
  <!-- Contenu principal -->
</main>
```

```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000;
  color: #fff;
  padding: 8px;
  text-decoration: none;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

---

## 🔊 Lecteurs d'écran

### Annonces dynamiques

Utilisez `aria-live` pour les changements dynamiques :

```html
<!-- Annonces polies (non urgentes) -->
<div role="status" aria-live="polite">3 nouveaux messages</div>

<!-- Annonces assertives (urgentes) -->
<div role="alert" aria-live="assertive">Erreur : Votre session a expiré</div>
```

### Contenu généré dynamiquement

```typescript
// Angular : Annoncer le chargement de contenu
export class UserListComponent {
  loadingMessage = '';

  loadUsers() {
    this.loadingMessage = 'Chargement des utilisateurs en cours...';

    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loadingMessage = `${users.length} utilisateurs chargés`;
      },
      error: () => {
        this.loadingMessage = 'Erreur lors du chargement des utilisateurs';
      },
    });
  }
}
```

```html
<div role="status" aria-live="polite" aria-atomic="true">{{ loadingMessage }}</div>
```

### Labels et descriptions

```html
<!-- Label explicite -->
<label for="email">Adresse email</label>
<input type="email" id="email" name="email" />

<!-- Description supplémentaire -->
<label for="password">Mot de passe</label>
<input
  type="password"
  id="password"
  aria-describedby="password-requirements"
/>
<span id="password-requirements">Minimum 8 caractères, incluant majuscules, minuscules et chiffres</span>

<!-- Groupes de champs -->
<fieldset>
  <legend>Informations personnelles</legend>
  <label for="firstName">Prénom</label>
  <input type="text" id="firstName" />

  <label for="lastName">Nom</label>
  <input type="text" id="lastName" />
</fieldset>
```

---

## 📝 Formulaires

### Validation accessible

```html
<!-- État d'erreur -->
<div class="form-group" [class.has-error]="emailControl.invalid && emailControl.touched">
  <label for="email">Email <span aria-label="requis">*</span></label>
  
  <input
    type="email"
    id="email"
    [formControl]="emailControl"
    [attr.aria-invalid]="emailControl.invalid && emailControl.touched"
    aria-describedby="email-error"
  />
  
  <span
    id="email-error"
    role="alert"
    *ngIf="emailControl.invalid && emailControl.touched"
  >
    <span *ngIf="emailControl.hasError('required')">L'email est requis</span>
    <span *ngIf="emailControl.hasError('email')">Format d'email invalide</span>
  </span>
</div>
```

### Instructions claires

```html
<!-- ✅ Instructions avant le formulaire -->
<p id="form-instructions">Les champs marqués d'un astérisque (*) sont obligatoires</p>

<form aria-describedby="form-instructions">
  <!-- Champs du formulaire -->
</form>
```

### Messages de succès/erreur

```html
<!-- Message de succès -->
<div
  *ngIf="successMessage"
  role="alert"
  aria-live="polite"
  class="alert alert-success"
>
  <i class="fa fa-check-circle" aria-hidden="true"></i>
  {{ successMessage }}
</div>

<!-- Message d'erreur -->
<div
  *ngIf="errorMessage"
  role="alert"
  aria-live="assertive"
  class="alert alert-danger"
>
  <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
  {{ errorMessage }}
</div>
```

---

## 🎬 Contenu multimédia

### Vidéos

- [ ] Fournir des sous-titres pour toutes les vidéos
- [ ] Fournir une transcription textuelle
- [ ] Fournir une audiodescription si nécessaire

```html
<video controls>
  <source src="video.mp4" type="video/mp4" />
  <track kind="captions" src="captions-fr.vtt" srclang="fr" label="Français" />
  <track kind="descriptions" src="descriptions-fr.vtt" srclang="fr" label="Français (AD)" />
  Votre navigateur ne supporte pas la balise vidéo.
</video>
```

### Audio

- [ ] Fournir une transcription textuelle pour tous les contenus audio

---

## 🧪 Outils de test

### Extensions navigateur

1. **axe DevTools** (Chrome, Firefox)
   - Scan automatique des problèmes d'accessibilité
   - https://www.deque.com/axe/devtools/

2. **WAVE** (Chrome, Firefox)
   - Évaluation visuelle de l'accessibilité
   - https://wave.webaim.org/extension/

3. **Lighthouse** (Chrome DevTools)
   - Audit d'accessibilité intégré
   - Ouvrir DevTools > Lighthouse > Accessibility

### Lecteurs d'écran

- **NVDA** (Windows) - Gratuit
- **JAWS** (Windows) - Payant
- **VoiceOver** (macOS, iOS) - Intégré
- **TalkBack** (Android) - Intégré

### Tests automatisés

```typescript
// Exemple avec jest-axe (Backend tests)
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('should not have accessibility violations', async () => {
  const html = render(<UserListComponent />);
  const results = await axe(html.container);
  expect(results).toHaveNoViolations();
});
```

### Checklist manuelle

- [ ] Navigation complète au clavier uniquement
- [ ] Test avec un lecteur d'écran
- [ ] Test avec zoom 200%
- [ ] Test en mode sombre / contraste élevé
- [ ] Désactiver les images et vérifier que le contenu reste compréhensible
- [ ] Vérifier les contrastes avec un outil dédié

---

## 📚 Ressources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM](https://webaim.org/)
- [The A11Y Project](https://www.a11yproject.com/)
- [Angular Accessibility Guide](https://angular.io/guide/accessibility)

---

## 🎯 Objectifs du projet

### Niveau actuel
- Objectif : WCAG 2.1 niveau AA

### Prochaines étapes
1. Audit complet de l'application existante
2. Correction des problèmes critiques
3. Formation de l'équipe sur l'accessibilité
4. Intégration des tests d'accessibilité dans le CI/CD
5. Documentation des patterns accessibles

---

L'accessibilité n'est pas une fonctionnalité, c'est une nécessité. Merci de contribuer à rendre AFPI CRM accessible à tous ! 🙏
