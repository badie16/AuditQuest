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
- [x] Ajouter un Room Indicator dans le HUD.
- [x] Ajouter un systeme de visibilite par salle avec ombres sur les zones non actives.
- [~] Ajouter interviews NPC a choix multiples pour debloquer certaines preuves.
- [ ] Ajouter visualisation de pseudo-documents (preuve type document).

---

# P2 - Story mode et narration

- [x] Ecrire un "story bible" du jeu: nom de l'entreprise, secteur, contexte, objectifs d'audit, risques majeurs et ton narratif.
- [x] Definir une structure de campagne en chapitres: ouverture, investigation, escalation, conclusion.
- [x] Ajouter un onboarding narratif au lancement de partie: briefing entreprise + objectif principal + premier enjeu.
- [x] Remplacer le briefing de mission generique par un briefing narratif avec contexte, acteur, lieu et consequence.
- [x] Faire depend chaque mission d'un chapitre ou d'un etat de story, pas d'une liste statique aleatoire.
- [~] Ajouter des templates de mission pro: titre metier, objectif, departement, localisation, preuve attendue, impact si echoue.
- [~] Ajouter un systeme de dialogues PNJ a choix multiples (question, reponse, suivi, escalade).
- [~] Faire evoluer les dialogues selon l'etat de la story et les preuves deja collectees.
- [ ] Ajouter un systeme de memoire PNJ simple: ce que le PNJ a deja dit, ce qu'il cache, ce qu'il peut reveler ensuite.
- [x] Lier chaque mission a un PNJ ou une zone precise avec justification narrative.
- [x] Ajouter des transitions entre chapitres avec message, objectif suivant et resume des preuves trouvees.
- [x] Ajouter une fin de campagne avec resultat audit, conclusion narrative et score final.

## Story mode - ordre de livraison recommande

1. Story bible et contexte entreprise.
2. Onboarding narratif au lancement.
3. Briefing de mission enrichi.
4. Dialogues PNJ a choix multiples.
5. Chapitres de story et progression.
6. Fin de campagne et conclusion.

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

- [x] Reevaluer ce TODO apres correction P0.
- [ ] Mettre a jour pourcentage d'avancement sur base des taches verifiees, pas seulement des intentions.

---

Derniere mise a jour: 05 Avril 2026
