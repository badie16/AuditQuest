# Rapport d'Analyse Technique & Suivi - AuditQuest

Ce document suit l'évolution technique du projet, les corrections effectuées et les chantiers restants.

## 1. Progrès Réalisés (Corrections Effectuées) ✅

### Architecture & Synchronisation
- **Synchronisation Multijoueur (Colyseus) :** Implémentée. Le serveur (`AuditQuest.ts`) gère désormais les messages d'audit et synchronise l'état global.
- **Réception Réseau :** `Network.ts` met à jour automatiquement le store Redux local de tous les clients lors d'une action d'audit (Missions, Preuves, Journal).
- **Refactorisation Redux :** Suppression des `setTimeout` illégaux dans les reducers de `AuditStore.ts`. Utilisation de thunks ou de gestionnaires d'état propres.

### Interface Utilisateur (UI/UX)
- **Intégration du Dashboard :** Le `AuditHUD.tsx` utilise désormais les onglets Material UI (`EvidenceTab`, `FindingsTab`, `RiskTab`) pour afficher les données réelles.
- **Formulaires Connectés :** `EvidenceCollectionDialog.tsx` envoie maintenant les preuves au serveur au lieu de les stocker localement.

### Structure des Objets Game
- **Hiérarchie Auditable :** `Computer.ts` et `NPC.ts` héritent désormais de `AuditableObject`, permettant une gestion standardisée des points d'audit.

---

## 2. Choses Implémentées avec une Mauvaise Structure (À Refactoriser) ⚠️

- **Ciblage des Missions (Hard-coded) :** Les missions dans `AuditService.ts` pointent vers des IDs comme `director_desk` qui ne sont pas encore dynamiquement liés aux objets dans Phaser.
- **Système de Dialogue NPC :** Bien que les NPC soient "auditables", le dialogue est une simple chaîne de texte. Il manque un système de branchement pour que certaines réponses soient automatiquement collectées comme preuves.
- **Initialisation des Missions :** Actuellement, le serveur et le client initialisent des missions. Cela devrait être centralisé sur le serveur uniquement pour éviter les doublons ou les incohérences.
- **Mapping des Portraits NPC :** Le mapping des portraits est codé en dur dans `NPC.ts`. Il devrait être configuré via un fichier de données.

---

## 3. Choses Incomplètes ou en Cours ⏳

- **Dialogues de Conformité & Risques :** `ComplianceEvaluationDialog.tsx` et `RiskAssessmentDialog.tsx` ne sont pas encore connectés au serveur (envoient encore des données locales).
- **Validation des Preuves :** Le système permet de collecter des preuves mais pas encore de les "valider" ou de les "rejeter" par un auditeur senior (pourtant prévu dans le schéma).
- **Rapport Final :** Le générateur de rapport existe mais il n'y a pas d'interface pour le visualiser sans quitter le jeu.

---

## 4. Choses Pas Encore Débutées 🛑

- **Mini-jeux de Sécurité :**
    - Analyse de force de mot de passe.
    - Détection d'anomalies dans les logs.
    - Vérification "Clear Desk" (objets cachés sur la carte).
- **Notifications Visuelles :** Pas de système de "Toast" pour avertir les joueurs d'une nouvelle preuve collectée par un collègue.
- **Indicateur de Pièce :** Affichage dynamique du nom de la zone actuelle sur le HUD.
- **Pondération des Scores :** Le calcul du score final ne prend pas encore en compte la gravité des risques identifiés.

---

## 5. Prochaines Étapes Prioritaires

1.  **Connecter les dialogues restants :** Finir la migration des formulaires de conformité et de risques vers le système `Network`.
2.  **Lier les IDs d'objets :** S'assurer que chaque bureau et objet dans Tiled possède un ID correspondant aux missions.
3.  **Implémenter les notifications :** Ajouter un feedback visuel immédiat pour les actions d'audit en multijoueur.
