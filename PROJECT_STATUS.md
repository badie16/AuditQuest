# État d'Avancement du Projet - SkyOffice Audit

Ce document résume les fonctionnalités implémentées, celles qui nécessitent des améliorations, et ce qu'il reste à faire pour finaliser le projet.

## ✅ Ce qui est fait (Correctement)

### Infrastructure de Base
- **Multi-joueur** : Système de synchronisation des mouvements et des animations via Colyseus.
- **Monde Virtuel** : Map Phaser avec différentes zones (Bureaux, Salle de réunion, Salle serveur, Cafétéria).
- **Communication** : Chat en temps réel et bulles de dialogue au-dessus des personnages.
- **Outils Collaboratifs** : Partage d'écran et tableaux blancs fonctionnels.

### Système d'Audit
- **Types de Données** : Structures complètes pour les missions, preuves, constats (findings) et risques (ISO 27001).
- **Initialisation** : Chargement automatique des missions d'audit à la création de la salle.
- **Synchronisation** : Toutes les actions d'audit sont synchronisées entre tous les joueurs en temps réel.
- **Dashboard (HUD)** : Interface React complète avec onglets (Aperçu, Missions, Preuves, Findings, Risques, Journal).
- **Logique de Scoring** : Calcul dynamique du score (0-100) et attribution d'une note (A-F) basée sur les performances.

### Améliorations Récentes (v2)
- **Scénario Non-Linéaire** : Implémentation d'un graphe de dépendances (`prerequisites`). Les missions se débloquent logiquement (Politique -> Organisation -> Technique).
- **Feedback Visuel** : Des marqueurs (⭐ pour cible, ✅ pour complété) apparaissent désormais au-dessus des objets audités dans le monde Phaser.
- **Collecte Facilitée** : Les points d'audit sont pré-remplis dans le dialogue de collecte grâce à une base de données centralisée (`AUDIT_POINTS_DATA`).
- **Notifications UI** : Ajout d'un système de "Toast" (Snackbar) pour informer les utilisateurs des succès et mises à jour en temps réel.

---

## ⚠️ Ce qui est fait (Mais à améliorer / "Mauvaise" manière)

### UI/UX
- **AuditHUD** : L'interface reste dense sur les petits écrans.

---

## ❌ Ce qui n'est pas complété

### Génération de Rapport
- **Export UI** : Le code pour générer des rapports HTML/JSON existe (`reportGenerator.ts`), mais il n'y a pas encore de bouton "Télécharger le rapport final" dans le Dashboard.

### Interactions PNJ (NPC)
- **Dialogues Statiques** : Les PNJ parlent, mais ne réagissent pas aux découvertes de l'auditeur. Il manque un système d'"Entretien" où le PNJ pourrait donner des preuves seulement si on pose la bonne question.

### Contenu d'Audit
- **Couverture ISO** : Seuls environ 10 contrôles sont implémentés. Il faudrait en ajouter d'autres pour couvrir plus de domaines (Sécurité réseau, RH, Cryptographie, etc.).

### Tests et Sécurité
- **Validation des Rôles** : N'importe qui peut valider une mission. Il faudrait un rôle "Auditeur" spécifique.
- **Tests Automatisés** : Pas de tests unitaires pour la logique de scoring ou les commandes serveur.

---

## 🚀 Comment compléter le projet (Roadmap)

1.  **Intégration du Rapport** : Ajouter un bouton "Générer Rapport" dans l'onglet Overview du Dashboard pour exporter les résultats en HTML.
2.  **Amélioration de l'Interaction** : Créer un composant `InterviewDialog` pour que les discussions avec les PNJ soient plus interactives.
3.  **Feedback visuel Phaser** : Ajouter des "Emitters" de particules ou des icônes au-dessus des objets déjà audités.
4.  **Extension de la Map** : Ajouter une "Server Room" dédiée avec des contrôles physiques (climatisation, accès badge).
5.  **Système de Rôles** : Implémenter une distinction claire entre "Auditeur" (celui qui remplit le rapport) et "Collaborateur" (ceux qui travaillent dans le bureau).
6.  **Polissage UI** : Refondre le style CSS du Dashboard pour un aspect plus "Entreprise/Moderne".

---
