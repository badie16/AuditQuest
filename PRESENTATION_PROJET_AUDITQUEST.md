# Presentation Projet - AuditQuest
## 1) Objectif de la presentation

Montrer de facon claire et professionnelle:

- Le probleme reel que nous adressons
- La solution que nous avons construite (jeu serieux d'audit ISO 27001/27002)
- Ce qui est deja fonctionnel et demontrable
- Ce qui reste a finaliser avant release
- La vision future du produit
- Comment jouer rapidement (prise en main)

---

## 2) Plan de presentation (15 minutes)

1. Contexte et probleme (2 min)
2. Notre solution: AuditQuest (2 min)
3. Demo du gameplay et du flux audit (5 min)
4. Architecture technique et choix techno (2 min)
5. Etat du projet: acquis, limites, non implemente (2 min)
6. Roadmap et futur (1.5 min)
7. Conclusion + Q/R (0.5 min)

Conseil timing: garder 30 a 45 secondes de marge pour les questions.

---

## 3) Deck de slides pret a presenter

## Slide 1 - Titre

Titre: **AuditQuest - Simulateur multijoueur d'audit ISO 27001**  
Sous-titre: **Apprendre l'audit securite par le jeu, la collaboration et la preuve**

Message cle:

- Nous transformons un processus d'audit complexe en experience interactive et mesurable.

---

## Slide 2 - Le probleme

Titre: **Pourquoi ce projet existe**

Points a afficher:

- Les audits ISO sont souvent percus comme theoriques et difficiles a pratiquer.
- Les apprenants manquent de mises en situation realistes.
- Les outils classiques ne favorisent pas assez la collaboration en temps reel.
- Il est difficile de relier preuves, conformite, risques et rapport final dans un meme flux.

Phrase de transition:

"Nous avons donc cree un environnement immersif qui reproduit le cycle complet d'un audit."

---

## Slide 3 - Notre solution

Titre: **AuditQuest: la reponse**

Points a afficher:

- Jeu serieux multijoueur dans un bureau virtuel.
- Missions basees sur des controles ISO 27002.
- Collecte de preuves, evaluation de conformite, analyse de risques.
- Journal d'audit synchronise et scoring automatique.
- Generation de rapport (base HTML/CSV).

Valeur ajoutee:

- Pedagogie active: apprendre en faisant.
- Collaboration: auditeurs peuvent travailler ensemble en temps reel.

---

## Slide 4 - Demo: boucle de jeu complete

Titre: **Du briefing au resultat d'audit**

Montrer le cycle:

1. Briefing pre-audit
2. Execution des missions
3. Collecte de preuves
4. Evaluation de conformite
5. Analyse de risques
6. Journal + synthese
7. Score et resultat final

Message cle:

- Le flux principal metier est deja jouable de bout en bout.

---

## Slide 5 - Comment jouer (guide rapide)

Titre: **Prise en main en 60 secondes**

Commandes:

- Deplacement: W A S D / Fleches
- Interaction: E (sit/stand), R (utiliser un PC)
- Communication: Enter (chat), ESC (fermer dialogs)

Parcours joueur conseille:

- Rejoindre une room
- Ouvrir le HUD audit
- Completer missions -> preuves -> findings -> risques
- Verifier l'onglet Journal avant cloture

---

## Slide 6 - Fonctionnalites majeures

Titre: **Ce que la plateforme offre deja**

- Monde Phaser 3 + synchronisation Colyseus
- Missions d'audit a prerequis (story logic)
- Preuves liees aux missions
- Findings conformite (compliant / partial / non-compliant)
- Evaluation des risques
- HUD metier (Overview, Missions, Evidence, Findings, Risks, Journal)
- Collaboration (chat, video, partage ecran, whiteboard - base disponible)

---

## Slide 7 - Architecture technique

Titre: **Architecture client/serveur**

Pile technologique:

- Client: React + Redux + Phaser 3 + TypeScript
- Serveur: Colyseus + TypeScript
- Collaboration media: PeerJS/WebRTC
- UI: Material UI
- Types partages: dossier `types/`

Message cle:

- Separation claire des responsabilites: gameplay, etat audit, synchro temps reel.

---

## Slide 8 - Problemes rencontres et solutions apportees

Titre: **Probleme -> Solution**

Probleme 1: derive des modeles de donnees entre client, serveur et types partages  
Solution: harmonisation des modeles mission/finding/risk + correction du mapping reseau.

Probleme 2: flux audit parfois local et non synchronise  
Solution: envoi des formulaires metier vers le serveur et synchro Redux automatique.

Probleme 3: initialisation et logique mission fragiles  
Solution: initialisation centralisee cote serveur + prerequis explicites.

Probleme 4: manque de feedback metier global  
Solution: journal d'audit, HUD structure et score synchronise.

---

## Slide 9 - Etat actuel du projet

Titre: **Ou nous en sommes (05/04/2026)**

Acquis solides:

- Flux metier complet mission -> evidence -> finding -> risk
- Multijoueur stable et journal d'audit
- Gestion des roles et matrice d'autorisations cote serveur

Points encore a finaliser avant release:

- Flux de build/deploiement production complet client + serveur
- Ecran final de rapport en jeu + export dans Overview
- Workflows collaboratifs avances (interview structuree, analyse logs en equipe)
- Renforcement qualite (tests unitaires/integration, cleanup logs debug)

---

## Slide 10 - Ce qui n'est pas encore implemente

Titre: **Gap actuel (transparent et maitrise)**

Non implemente / partiel:

- Mini-jeux securite (mot de passe, detection anomalies logs, clear desk avance)
- Memoire NPC et dialogues adaptatifs plus profonds
- Workflow complet de decision collaborative tracee
- Suite de tests automatisee encore insuffisante

Message cle:

- Ce sont des extensions de valeur, pas des blocages du coeur fonctionnel.

---

## Slide 11 - Vision future et roadmap

Titre: **Prochaines etapes**

Court terme (release readiness):

- Pipeline de deploiement unifie
- Rapport final consultable et telechargeable in-game
- Tests prioritaires (scoring, mapping reseau, reducers)

Moyen terme (experience):

- Dialogues NPC a choix multiples complets
- Collaboration d'audit structuree (interviews, decisions)
- Story mode plus dynamique par chapitres

Long terme (impact formation):

- Scenarios sectoriels additionnels
- Analytics pedagogiques (progression apprenant, erreurs recurrentes)

---

## Slide 12 - Conclusion

Titre: **Conclusion**

- AuditQuest rend l'audit ISO praticable, collaboratif et mesurable.
- Le socle produit est fonctionnel et demontrable.
- La feuille de route est claire pour passer de "jouable" a "release robuste".

Call to action:

- "Nous sommes prets a finaliser la phase release et a lancer un pilote utilisateur."

---


