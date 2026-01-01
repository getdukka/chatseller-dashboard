# Configuration Supabase Email - ChatSeller Dashboard

## Problème résolu

Lors de la confirmation d'email, les utilisateurs étaient redirigés directement vers le dashboard au lieu de passer par la page d'onboarding.

## Solution mise en place

### 1. Middleware Auth renforcé (`middleware/auth.ts`)

Le middleware auth vérifie maintenant si l'onboarding a été complété :

```typescript
// Vérification onboarding_completed dans la table shops
if (shopData && !shopData.onboarding_completed) {
  return navigateTo('/onboarding')
}
```

**Avantages** :
- ✅ Force le passage par l'onboarding même si Supabase redirige mal
- ✅ Fonctionne pour tous les points d'entrée (callback, login direct, refresh)
- ✅ Non-bloquant : si la vérification échoue, l'utilisateur peut continuer

### 2. Configuration Supabase recommandée

#### A. Dans le Dashboard Supabase

**Authentication > URL Configuration**

```
Site URL: https://dashboard.chatseller.app
Redirect URLs:
  - https://dashboard.chatseller.app/auth/callback
  - https://dashboard.chatseller.app/onboarding
  - http://localhost:3000/auth/callback (développement)
  - http://localhost:3000/onboarding (développement)
```

#### B. Template Email "Confirm Signup"

Le template HTML que vous utilisez est CORRECT et doit rester tel quel.

**Important** : Le `{{ .ConfirmationURL }}` est généré automatiquement par Supabase et inclut déjà la bonne redirection vers `/auth/callback`.

Le flux est :
1. 📧 Email avec `{{ .ConfirmationURL }}`
2. 🔗 Lien pointe vers → `https://dashboard.chatseller.app/auth/callback#access_token=...`
3. ✅ `callback.vue` confirme l'email
4. ➡️ `callback.vue` redirige vers `/onboarding` (ligne 358)
5. 🛡️ **NOUVEAU** : Si l'utilisateur essaie d'aller ailleurs, `middleware/auth.ts` force `/onboarding`

## Flux complet après correction

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Utilisateur s'inscrit sur /register                      │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Email de confirmation envoyé par Supabase                │
│    Template: "Confirm signup" avec bouton d'activation      │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Clic sur bouton → /auth/callback (page de confirmation)  │
│    - Vérifie token                                           │
│    - Crée session Supabase                                   │
│    - Crée/vérifie le shop                                    │
│    - ✅ Redirige vers /onboarding                           │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Page /onboarding                                          │
│    - Middleware auth vérifie session ✅                      │
│    - Middleware auth vérifie onboarding_completed ❌         │
│    - ✅ Accès autorisé                                       │
│    - Formulaire 4 étapes + création agent IA                 │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Soumission formulaire onboarding                         │
│    - Mise à jour shop avec onboarding_completed = true       │
│    - Création automatique de l'agent IA                      │
│    - Redirection vers /?onboarding=completed                 │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. Dashboard principal /                                     │
│    - Middleware auth vérifie session ✅                      │
│    - Middleware auth vérifie onboarding_completed ✅         │
│    - ✅ Accès autorisé au dashboard                          │
└─────────────────────────────────────────────────────────────┘
```

## Protection multi-niveaux

### Niveau 1 : callback.vue (ligne 358)
```typescript
const redirectToOnboarding = async () => {
  await navigateTo('/onboarding?from=email-confirmation&beauty=true&welcome=true')
}
```

### Niveau 2 : middleware/auth.ts (lignes 106-122)
```typescript
// Vérification onboarding_completed
const { data: shopData } = await supabase
  .from('shops')
  .select('onboarding_completed')
  .eq('id', user.id)
  .single()

if (shopData && !shopData.onboarding_completed) {
  return navigateTo('/onboarding')
}
```

### Niveau 3 : onboarding.vue (ligne 1119)
```typescript
// Marquage onboarding_completed = true après soumission
onboarding_completed: true,
onboarding_completed_at: new Date().toISOString()
```

## Tests à effectuer

### Test 1 : Inscription normale
1. ✅ S'inscrire sur `/register`
2. ✅ Recevoir email de confirmation
3. ✅ Cliquer sur le bouton dans l'email
4. ✅ Arriver sur `/onboarding` (PAS le dashboard)
5. ✅ Compléter l'onboarding
6. ✅ Arriver sur le dashboard avec agent IA créé

### Test 2 : Tentative de bypass
1. ✅ S'inscrire et confirmer l'email
2. ✅ Pendant l'onboarding, taper manuellement `/` dans la barre d'adresse
3. ✅ Être automatiquement redirigé vers `/onboarding` par le middleware

### Test 3 : Refresh pendant onboarding
1. ✅ Être sur `/onboarding`
2. ✅ Rafraîchir la page (F5)
3. ✅ Rester sur `/onboarding` (pas de redirection vers dashboard)

## Variables d'environnement requises

Aucune variable d'environnement supplémentaire n'est nécessaire. La configuration utilise directement la session Supabase.

## Notes importantes

- **Ne pas modifier** le template HTML de l'email "Confirm signup" - il est correct
- **Le middleware auth** gère maintenant la protection onboarding automatiquement
- **callback.vue** reste la page de traitement de confirmation d'email
- **onboarding.vue** crée automatiquement l'agent IA à l'étape 4

## Dépannage

### Problème : L'utilisateur va quand même directement au dashboard

**Cause possible** : Le champ `onboarding_completed` est déjà à `true` dans la base de données

**Solution** :
```sql
-- Vérifier dans Supabase SQL Editor
SELECT id, email, onboarding_completed FROM shops WHERE email = 'email@utilisateur.com';

-- Si onboarding_completed = true alors que l'utilisateur n'a pas fait l'onboarding, réinitialiser :
UPDATE shops SET onboarding_completed = false WHERE email = 'email@utilisateur.com';
```

### Problème : Erreur 500 sur `/onboarding`

**Cause possible** : Le shop n'existe pas dans la table `shops`

**Solution** : Le shop est créé automatiquement dans `callback.vue` (lignes 219-260). Vérifier les logs de la console.

---

**Date de modification** : 2025-12-29
**Auteur** : Claude Code
**Version** : 1.0
