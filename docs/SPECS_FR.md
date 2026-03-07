# BookEase — Cahier des Charges

**Plateforme SaaS de réservation multi-tenant**

| | |
|---|---|
| **Version** | 1.0 |
| **Date** | Mars 2026 |
| **Stack** | Nuxt 3 / TailwindCSS / Pinia / MongoDB |
| **Statut** | Draft |

---

## PARTIE I — CAHIER DES CHARGES FONCTIONNEL

---

### 1. Présentation du projet

#### 1.1 Contexte

BookEase est une plateforme web SaaS permettant à tout type d'établissement (salon de coiffure, cinéma, salle d'événements, etc.) de proposer en ligne un système de réservation à ses clients. L'application repose sur une architecture multi-tenant : chaque gérant dispose de son propre espace isolé, configurable selon son métier.

#### 1.2 Objectifs

- Permettre à un gérant de créer et gérer son établissement en ligne
- Permettre à ses clients de consulter les disponibilités et réserver un créneau ou une place
- Proposer une expérience fluide, moderne et responsive
- Être extensible à de nouveaux types de ressources sans refonte architecturale

#### 1.3 Cas d'usage principaux retenus

- **Salon de coiffure** : réservation de rendez-vous sur des créneaux horaires définis par un prestataire
- **Cinéma / événement** : réservation de places dans une salle à capacité fixe, sur une séance à date/heure précise

---

### 2. Personas

| Persona | Description | Besoins clés |
|---|---|---|
| **Gérant (tenant)** | Propriétaire d'un établissement inscrit sur BookEase | Gérer ses ressources, ses créneaux, ses réservations |
| **Client final** | Utilisateur qui souhaite réserver un service | Trouver un créneau dispo, réserver simplement |
| **Super Admin** | Administrateur de la plateforme BookEase | Superviser les tenants, modérer, accéder aux stats globales |

---

### 3. Périmètre fonctionnel

#### 3.1 Module Authentification & Gestion des comptes

- Inscription / connexion via email + mot de passe
- Connexion via OAuth (Google) — optionnel en v2
- Rôles : `super_admin` / `manager` (gérant) / `client`
- Gestion du profil (nom, email, mot de passe)
- Réinitialisation du mot de passe par email

#### 3.2 Module Gestion de l'établissement (Manager)

- Création d'un établissement avec : nom, description, catégorie, logo, adresse
- Configuration du type de réservation : par créneau (coiffeur) ou par place/séance (cinéma)
- Gestion des ressources : prestataires (coiffeur), salles / séances (cinéma)
- Définition des plages horaires d'ouverture
- Activation / désactivation des réservations
- Paramétrage du paiement en ligne (optionnel par établissement)

#### 3.3 Module Réservation (Client)

- Recherche et consultation d'un établissement
- Visualisation des créneaux ou places disponibles en temps réel
- Sélection et confirmation d'une réservation
- Paiement en ligne si activé par le gérant (via Stripe)
- Réception d'une confirmation par email
- Annulation de réservation (selon politique de l'établissement)

#### 3.4 Module Dashboard Manager

- Vue d'ensemble : réservations du jour, semaine, mois
- Liste et gestion des réservations (statuts : confirmée, annulée, en attente)
- Statistiques simples : taux de remplissage, revenus, fréquentation
- Notifications en cas de nouvelle réservation ou annulation

#### 3.5 Module Administration (Super Admin)

- Liste de tous les tenants inscrits
- Activation / suspension d'un tenant
- Vue des statistiques globales de la plateforme

---

### 4. Cas d'usage détaillés

#### UC-01 : Un gérant crée son établissement

**Acteur :** Manager  
**Précondition :** Le manager est inscrit et connecté

**Scénario principal :**
1. Il accède à son espace et clique sur « Créer un établissement »
2. Il renseigne les informations générales (nom, catégorie, description, logo)
3. Il choisit le type de réservation (créneaux ou séances/places)
4. Il configure ses ressources (prestataires ou salles) et ses horaires
5. Il publie son établissement — il est maintenant accessible aux clients

#### UC-02 : Un client réserve un créneau (coiffeur)

**Acteur :** Client  
**Précondition :** L'établissement est publié et actif

**Scénario principal :**
1. Le client consulte la page de l'établissement
2. Il sélectionne un prestataire et une date
3. Il voit les créneaux disponibles et en choisit un
4. Il confirme sa réservation (paiement si activé)
5. Il reçoit un email de confirmation avec les détails

#### UC-03 : Un client réserve une place (cinéma)

**Acteur :** Client

**Scénario principal :**
1. Le client consulte les séances disponibles
2. Il sélectionne une séance et voit les places restantes
3. Il choisit sa ou ses places et confirme
4. Il reçoit sa confirmation par email

---

### 5. Règles métier

- Un créneau réservé ne peut pas être réservé par un autre client (verrou concurrentiel)
- Une réservation peut être annulée jusqu'à X heures avant (configurable par le gérant)
- Le paiement est déclenché uniquement si le gérant a activé cette option
- Chaque tenant a un espace de données strictement isolé
- Un utilisateur peut avoir un compte client ET manager (avec des établissements différents)

---

## PARTIE II — CAHIER DES CHARGES TECHNIQUE

---

### 6. Stack technique

| Couche | Technologie | Justification |
|---|---|---|
| Frontend | Nuxt 3 | SSR/SSG, routing fichiers, montée en compétence |
| UI | TailwindCSS | Maîtrisé, cohérent avec stack actuelle |
| State management | Pinia | Standard Vue 3, maîtrisé |
| Backend (API) | Nuxt 3 / Nitro (API routes) | Fullstack unifié, pas de serveur Express séparé |
| Base de données | MongoDB (Atlas) | Flexible pour schémas multi-tenant, gratuit en Cloud |
| ODM | Mongoose | Connu, facilite la modélisation |
| Authentification | nuxt-auth-utils + bcrypt | Léger, intégré Nuxt |
| Paiement | Stripe (optionnel) | Standard industrie, bonne doc |
| Emails | Resend + Vue Email | API simple, templates Vue natifs — cohérent avec la stack |
| Tests | Vitest + Vue Test Utils | Maîtrisé, cohérent |
| CI/CD | GitHub Actions | Intégration GitHub native |
| Hébergement | Vercel + MongoDB Atlas | Tier gratuit suffisant pour démo |

---

### 7. Architecture

#### 7.1 Vue d'ensemble

L'application suit une architecture monorepo avec Nuxt 3 pour le frontend et les API routes (via Nitro) pour le backend. Les données sont hébergées sur MongoDB Atlas. Le modèle multi-tenant est implémenté via un champ `tenantId` présent dans chaque document de la base.

#### 7.2 Structure du projet

```
/
├── pages/               # Routes de l'application (Nuxt file-based routing)
├── components/          # Composants Vue réutilisables
├── composables/         # Logique réutilisable (useAuth, useBooking, etc.)
├── stores/              # Stores Pinia (auth, tenant, booking)
├── server/
│   ├── api/             # API routes Nitro (REST)
│   ├── models/          # Modèles Mongoose
│   ├── middleware/       # Middleware auth et tenant
│   └── utils/           # Helpers (email, stripe, etc.)
└── tests/               # Tests unitaires et d'intégration
```

---

### 8. Modèle de données

#### 8.1 Collection `User`

| Champ | Type | Description |
|---|---|---|
| `_id` | ObjectId | Identifiant unique |
| `email` | String (unique) | Adresse email de connexion |
| `passwordHash` | String | Mot de passe hashé (bcrypt) |
| `role` | Enum (`super_admin`, `manager`, `client`) | Rôle global de l'utilisateur |
| `firstName` / `lastName` | String | Nom et prénom |
| `createdAt` | Date | Date de création du compte |

#### 8.2 Collection `Tenant` (Établissement)

| Champ | Type | Description |
|---|---|---|
| `_id` | ObjectId | Identifiant du tenant |
| `ownerId` | ObjectId (ref: User) | Gérant de l'établissement |
| `name` | String | Nom de l'établissement |
| `category` | Enum (`barbershop`, `cinema`, `event`, ...) | Type d'établissement |
| `bookingType` | Enum (`slot`, `seat`) | Mode de réservation |
| `isActive` | Boolean | Établissement publié ou non |
| `paymentEnabled` | Boolean | Paiement en ligne activé |
| `cancellationHours` | Number | Délai max d'annulation (heures) |
| `slug` | String (unique) | URL publique de l'établissement |

#### 8.3 Collection `Resource` (Prestataire / Salle)

| Champ | Type | Description |
|---|---|---|
| `_id` | ObjectId | Identifiant de la ressource |
| `tenantId` | ObjectId (ref: Tenant) | Tenant auquel appartient la ressource |
| `name` | String | Nom (ex : Jean, Salle A) |
| `type` | Enum (`provider`, `room`) | Prestataire ou salle |
| `capacity` | Number | Nombre de places (type `room`) |
| `isActive` | Boolean | Ressource active |

#### 8.4 Collection `Slot` (Créneau / Séance)

| Champ | Type | Description |
|---|---|---|
| `_id` | ObjectId | Identifiant du créneau |
| `tenantId` | ObjectId (ref: Tenant) | Tenant propriétaire |
| `resourceId` | ObjectId (ref: Resource) | Ressource associée |
| `startAt` | Date | Début du créneau ou de la séance |
| `endAt` | Date | Fin du créneau ou de la séance |
| `capacity` | Number | Places totales |
| `bookedCount` | Number | Places réservées |
| `isActive` | Boolean | Créneau ouvert aux réservations |

#### 8.5 Collection `Booking` (Réservation)

| Champ | Type | Description |
|---|---|---|
| `_id` | ObjectId | Identifiant de la réservation |
| `tenantId` | ObjectId (ref: Tenant) | Tenant concerné |
| `slotId` | ObjectId (ref: Slot) | Créneau réservé |
| `userId` | ObjectId (ref: User) | Client ayant réservé |
| `status` | Enum (`pending`, `confirmed`, `cancelled`) | Statut de la réservation |
| `quantity` | Number | Nombre de places réservées |
| `paymentStatus` | Enum (`none`, `pending`, `paid`) | Statut du paiement |
| `stripeSessionId` | String | ID session Stripe (si paiement) |
| `createdAt` | Date | Date de la réservation |

---

### 9. API Routes

#### 9.1 Authentification

| Méthode | Route | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Inscription d'un nouvel utilisateur |
| `POST` | `/api/auth/login` | Connexion et création de session |
| `POST` | `/api/auth/logout` | Déconnexion |
| `GET` | `/api/auth/me` | Profil de l'utilisateur connecté |
| `POST` | `/api/auth/reset-password` | Demande de reset mot de passe |

#### 9.2 Tenants (Établissements)

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/tenants` | Liste des tenants (`super_admin`) |
| `POST` | `/api/tenants` | Créer un établissement |
| `GET` | `/api/tenants/:slug` | Détail d'un établissement (public) |
| `PUT` | `/api/tenants/:id` | Modifier son établissement (`manager`) |
| `DELETE` | `/api/tenants/:id` | Supprimer un établissement (`manager`) |

#### 9.3 Slots (Créneaux)

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/tenants/:id/slots` | Liste des créneaux disponibles |
| `POST` | `/api/tenants/:id/slots` | Créer un créneau (`manager`) |
| `PUT` | `/api/slots/:id` | Modifier un créneau (`manager`) |
| `DELETE` | `/api/slots/:id` | Supprimer un créneau (`manager`) |

#### 9.4 Bookings (Réservations)

| Méthode | Route | Description |
|---|---|---|
| `POST` | `/api/bookings` | Créer une réservation |
| `GET` | `/api/bookings/me` | Mes réservations (client) |
| `GET` | `/api/tenants/:id/bookings` | Réservations d'un tenant (`manager`) |
| `PATCH` | `/api/bookings/:id/cancel` | Annuler une réservation |

---

### 10. Sécurité & Architecture multi-tenant

- Chaque requête API vérifie l'identité de l'utilisateur via un middleware d'authentification (session côté serveur)
- Le `tenantId` est systématiquement vérifié côté serveur — un manager ne peut pas accéder aux données d'un autre tenant
- Les routes sensibles (création, modification, suppression) sont protégées par vérification du rôle
- Le mot de passe est hashé avec bcrypt (coût minimum 12)
- Les variables sensibles (clés Stripe, URI MongoDB, etc.) sont stockées dans des variables d'environnement non commitées
- Protection CSRF intégrée via Nuxt

---

### 11. Concurrence & intégrité des données

La réservation d'un créneau est une opération critique qui peut être tentée par plusieurs clients simultanément. La stratégie retenue est :

- Utilisation de `findOneAndUpdate` avec condition de capacité (`bookedCount < capacity`) en une seule opération atomique MongoDB
- Retour d'une erreur `409 Conflict` si le créneau est plein au moment de la validation
- En cas de paiement Stripe, la réservation est d'abord créée en statut `pending`, puis confirmée via webhook Stripe après paiement réussi

---

### 12. Roadmap & priorisation

| Phase | Contenu | Priorité |
|---|---|---|
| **v1 — MVP** | Auth, création tenant, créneaux, réservation simple (sans paiement), email de confirmation | Haute |
| **v1.1** | Dashboard manager, statistiques de base, annulation de réservation | Haute |
| **v1.2** | Intégration Stripe (paiement optionnel) | Moyenne |
| **v2** | OAuth Google, notifications temps réel, application mobile (Nuxt/Capacitor) | Basse |
| **v2+** | Multi-langue, analytics avancés, API publique pour intégrations tierces | Future |

---

### 13. Tests & Qualité

- Tests unitaires des composants Vue avec Vitest + Vue Test Utils
- Tests des API routes avec Vitest (mocks Mongoose)
- Linting : ESLint + Prettier configurés
- CI/CD : GitHub Actions pour lint + tests à chaque push sur `main`
- Storybook pour documenter les composants UI réutilisables

---

### 14. Environnements

| Env | Usage | Infrastructure |
|---|---|---|
| `development` | Développement local | localhost:3000, MongoDB local ou Atlas free tier |
| `staging` | Tests et démonstrations | Vercel Preview, MongoDB Atlas |
| `production` | Version live | Vercel Production, MongoDB Atlas |

---

*— Fin du cahier des charges v1.0 —*
