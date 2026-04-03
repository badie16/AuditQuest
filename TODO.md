# ISO 2700x Audit Simulator - TODO Priorise

Ce backlog est aligne sur l'etat reel du code au 02 Avril 2026.

Convention:

- [ ] A faire
- [~] En cours / partiel
- [x] Termine

---

# P0 - Stabilisation technique (bloquant)

- [x] Corriger toutes les erreurs TypeScript du workspace (client + serveur).
- [x] Aligner les modeles de donnees mission/finding/risk entre types partages, schema serveur et store client.
- [x] Corriger le mapping audit dans le reseau client (sync state Colyseus -> Redux).
- [x] Nettoyer les incoherences de champs dans AuditStore (mission et finding).
- [x] Fiabiliser les gardes de null/undefined sur l'etat Colyseus cote client.

---

# P1 - Integrite metier audit

- [x] Deplacer le calcul de score final cote serveur.
- [x] Synchroniser le score serveur vers HUD client sans recalcul local divergent.
- [x] Journal d'audit present et couvre les actions metier principales (mission, evidence, risk, role).
- [x] Ajouter verification collaborative des preuves (valider/rejeter evidence).
- [x] Ajouter gestion des roles (auditeur, audite, observateur).
- [x] Ajouter matrice d'autorisations complete par action (mission, evidence, finding, risk) cote serveur.
- [x] Ajouter ecran de gestion des roles (attribution/changement de role en session).

---

# P1 - Build, run, deploiement

- [ ] Documenter un flux de build production complet client + serveur.
- [ ] Clarifier la strategie d'hebergement du client (serveur statique ou deploiement separe).
- [ ] Verifier la coherence Procfile/build output pour publication cloud.
- [ ] Ajouter une checklist de smoke test post-deploiement.

---

# P2 - UX et fonctionnalites audit

- [ ] Ajouter les boutons export (HTML/CSV) dans l'onglet Overview.
- [ ] Ajouter un ecran final de rapport (lecture + telechargement).
- [ ] Ajouter un Room Indicator dans le HUD.
- [x] Ajouter un systeme de visibilite par salle avec ombres sur les zones non actives.
- [ ] Ajouter interviews NPC a choix multiples pour debloquer certaines preuves.
- [ ] Ajouter visualisation de pseudo-documents (preuve type document).

---

# P2 - Story mode et narration

- [ ] Definir une histoire de depart pour l'entreprise (nom, secteur, contexte, problemes, objectifs d'audit).
- [ ] Ajouter une ecran / dialogue d'introduction au lancement de la partie, avant les missions.
- [ ] Transformer le briefing de mission en briefing narratif lie a l'histoire de l'entreprise.
- [ ] Organiser les missions en chapitres de story, pas en liste aleatoire.
- [ ] Ajouter des dependances de missions basees sur la progression narrative.
- [ ] Ajouter des dialogues de mission avec contexte, objectif et consequence, pas un simple message unique.
- [ ] Permettre des interactions de dialogue plus riches avec les PNJ (questions / reponses / choix).
- [ ] Relier chaque mission a un lieu, un acteur, et un enjeu narratif precis.
- [ ] Ajouter des etats de story (debut, investigation, escalade, conclusion) pour piloter les dialogues.
- [ ] Faire evoluer les dialogues des PNJ selon les preuves deja collectees.
- [ ] Ajouter un texte de mission plus pro avec nom de l'entreprise, departement concerne et raison de l'audit.
- [ ] Ajouter une vraie progression de campagne avec mission d'ouverture, milieu de parcours et cloture.

---

# P2 - Collaboration avancee

- [~] Video et partage d'ecran disponibles (base presente).
- [ ] Ajouter workflow d'interview collaborative entre joueurs.
- [ ] Ajouter workflow d'analyse de logs en equipe.
- [ ] Ajouter workflow de discussion d'audit structuree (decision tracking).

---

# P3 - Qualite logicielle

- [ ] Reduire les logs debug en production.
- [ ] Corriger les anomalies UI mineures detectees (ex: styles invalides).
- [ ] Ajouter retour utilisateur explicite quand une action est refusee par les permissions serveur.
- [ ] Ajouter tests unitaires prioritaires:
  - scoring
  - mapping reseau
  - reducers AuditStore
- [ ] Ajouter au moins un test d'integration du flux mission complet.

---

# Meta suivi

- [ ] Reevaluer ce TODO apres correction P0.
- [ ] Mettre a jour pourcentage d'avancement sur base des taches verifiees, pas seulement des intentions.

---

Derniere mise a jour: 02 Avril 2026
