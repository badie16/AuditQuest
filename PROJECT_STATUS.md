# État d'Avancement du Projet - SkyOffice Audit (v2.1)

Ce document résume les fonctionnalités implémentées, les améliorations en cours et la feuille de route pour la finalisation du système d'audit ISO 27001.

## ✅ Ce qui est fait (Correctement)

### Infrastructure de Base & Multi-joueur
- **Synchronisation Temps Réel** : Mouvements, animations, chat et tableaux blancs synchronisés via Colyseus.
- **Monde Virtuel** : Map Phaser complète avec zones dédiées (Bureaux, Direction, Salle Serveur, Cafétéria).
- **Communication** : Bulles de dialogue dynamiques et système de chat persistant.

### Système d'Audit (Missions & Preuves)
- **Logique de Mission** : Système de dépendances (`prerequisites`) fonctionnel. Les missions se débloquent séquentiellement (ex: A.5.1 -> A.6.1).
- **Collecte de Preuves** : Interface interactive `EvidenceCollectionDialog` stylisée en "Mission Intel" (HUD de jeu) permettant de collecter des preuves sur les objets du décor (PC, Serveurs, Tableaux).
- **Audit Points** : Base de données centralisée (`AUDIT_POINTS_DATA`) associant des preuves spécifiques à chaque objet auditable.
- **Marqueurs Phaser** : Retour visuel direct dans le monde de jeu (icônes d'état au-dessus des objets).

### Interface Utilisateur (Design Pixel Art)
- **Refonte Graphique Complète** : Tout le Dashboard d'audit (`AuditHUD`) ainsi que les dialogues de mission et de collecte ont été migrés vers un style **Pixel Art / Retro Gaming** cohérent.
- **Onglets Fonctionnels** : 
  - **Overview** : Score dynamique (0-100) et statistiques globales.
  - **Missions** : Liste interactive des tâches avec barres de progression pixelisées.
  - **Evidence** : Répertoire tabulaire des preuves collectées.
  - **Findings** : Évaluations de conformité détaillées.
  - **Risks** : Matrice de risques et suivi des remédiations.
  - **Journal** : Piste d'audit (logs) de toutes les actions effectuées.

---

## ⚠️ Ce qui est fait (À améliorer / En cours)

### Système de Notation (Scoring)
- **Synchronisation du Score** : Le calcul du score est actuellement géré côté client pour l'affichage. Il devrait être recalculé côté serveur à chaque ajout de constat pour garantir l'intégrité des données en multi-joueur.

### Génération de Rapport
- **Export UI** : La logique technique (`reportGenerator.ts`) supporte l'export HTML/JSON/CSV, mais il manque encore les boutons physiques dans l'interface "Overview" pour déclencher le téléchargement par l'utilisateur.

### Accessibilité
- **Scrollbars** : Les barres de défilement personnalisées dans le style pixel art peuvent être difficiles à manipuler sur certains navigateurs.

---

## ❌ Ce qui n'est pas complété (À ajouter)

### Interviews et PNJs (NPCs)
- **Système d'Entretien** : Les PNJs ont des dialogues statiques. Il manque un `InterviewDialog` permettant de poser des questions spécifiques pour "débloquer" certaines preuves (ex: demander la politique au Directeur).

### Gestion des Rôles
- **Auditeur vs Audité** : Actuellement, tous les utilisateurs ont les mêmes droits. Il faut implémenter un système de rôles (ex: seul l'Auditeur peut valider une mission).

### Preuves Avancées
- **Visualisation de Documents** : Ajouter la possibilité de "voir" un faux document (PDF simulé ou image) lors de la collecte d'une preuve de type "Document".
- **Vérification** : Interface pour "Vérifier/Approuver" une preuve collectée par un autre membre de l'équipe (travail collaboratif).

---

## 🚀 Roadmap Prioritaire

1.  **Boutons d'Export (Immédiat)** : Ajouter les options de téléchargement (HTML/CSV) dans l'onglet Overview du Dashboard.
2.  **Interaction PNJ (Prochaine étape)** : Créer un système de dialogue à choix multiples pour les entretiens d'audit.
3.  **Commandes Serveur de Score** : Déplacer la logique de `calculateAuditScore` dans une commande Colyseus (`UpdateAuditScoreCommand`).
4.  **Simulateur de Documents** : Créer un composant simple pour afficher le contenu textuel ou visuel des preuves collectées.
5.  **Audit Timer** : Option pour ajouter un compte à rebours global pour la session d'audit afin d'augmenter le challenge.

---
*Dernière mise à jour : 27 Mars 2026*
