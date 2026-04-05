# Guide Complet - Fonctionnalites, Gameplay, Missions et Prise en Main

## 1) Vision du jeu

**AuditQuest (SkyOffice Audit)** est un simulateur multijoueur d'audit de securite inspire des controles ISO 27001/27002.

Le joueur incarne un auditeur dans un bureau virtuel. L'objectif est de:

- lancer et suivre des missions d'audit,
- collecter des preuves,
- evaluer la conformite,
- analyser les risques,
- produire un resultat d'audit exploitable.

Le scenario principal actuel tourne autour de l'entreprise **Northbridge Health Group**.

---

## 2) Fonctionnalites implementees

### A. Monde de jeu et multijoueur

- Environnement bureau virtuel en **Phaser 3**.
- Synchronisation temps reel via **Colyseus**.
- Presence de plusieurs joueurs dans la meme salle.
- Deplacements et interactions avec objets auditable (PC, whiteboard, NPC, etc.).

### B. Systeme de missions d'audit

- Initialisation automatique des missions cote serveur.
- Gestion des statuts de mission:
  - `pending`
  - `in-progress`
  - `completed`
- Deblocage progressif selon les prerequis (story logic).
- Journalisation des actions de mission (start, complete, unlock).

### C. Collecte de preuves

- Formulaire de collecte de preuves connecte au serveur.
- Preuves associees a une mission.
- Types de preuves supportes (documents, interviews, observations, etc. selon usage).
- Suivi du nombre de preuves collectees par mission.

### D. Conformite et findings

- Evaluation de conformite par mission:
  - `compliant`
  - `partial`
  - `non-compliant`
- Creation automatique d'un **finding** a la completion de mission.
- Lien entre findings et preuves collectees.
- Justification textuelle stockee dans le systeme d'audit.

### E. Evaluation des risques

- Ajout d'evaluations de risques associees aux findings.
- Gestion des niveaux de severite dans le store et les composants UI.
- Onglet dedie au suivi des risques.

### F. Tableau de bord audit (HUD)

- Interface audit avec onglets:
  - Overview
  - Missions
  - Evidence
  - Findings
  - Risks
  - Journal
- Dialogs metiers integres:
  - Evidence Collection
  - Compliance Evaluation
  - Risk Assessment
  - Mission/Briefing dialogs

### G. Collaboration et communication

- Chat en jeu.
- Video/WebRTC et partage d'ecran (selon contexte d'usage).
- Whiteboard collaboratif.
- Journal d'activite d'audit synchronise.

### H. Scoring et reporting

- Calcul de score d'audit (etat actuel principalement pilote pour affichage cote client, avec logique serveur en progression).
- Base de generation de rapport (HTML/CSV) disponible.

---

## 3) Gameplay: boucle complete

Le cycle de jeu suit les phases suivantes:

1. **Briefing de pre-audit**

- Comprendre le contexte, le perimetre, et les enjeux.

2. **Execution des missions**

- Aller sur les zones/objets cibles.
- Interagir avec PCs, NPCs, whiteboards, etc.

3. **Collecte de preuves**

- Documenter les preuves pertinentes.
- Les rattacher a la mission correspondante.

4. **Evaluation de conformite**

- Statuer mission par mission.
- Ajouter une justification claire.

5. **Analyse de risques**

- Qualifier les impacts/probabilites sur les ecarts identifies.

6. **Journal et synthese**

- Verifier le journal d'audit.
- Consolider les constats.

7. **Resultat final / rapport**

- Evaluer le score global et le niveau de maturite de conformite.

---

## 4) Liste des missions actuelles (scenario narratif)

### Chapitre 1 - Opening Review

1. **A.5.1 - Information Security Policies**

- Cible: `npc_director` (Director Office)
- But: verifier que les politiques de securite sont documentees et approuvees.

2. **A.6.1 - Internal Organization**

- Cible: `npc_manager` (Meeting Room)
- But: verifier roles et responsabilites securite.

### Chapitre 2 - Operational Investigation

3. **A.7.2.2 - Security Awareness**

- Cible: `npc_hr` (Break Room)
- But: interviewer sur les risques de social engineering.

4. **A.8.1 - User Registration**

- Cible: PC `0` (General Office)
- But: verifier les enregistrements/acces utilisateurs.

5. **A.9.4.3 - Password Management**

- Cible: PC `1` (General Office)
- But: verifier complexite/expiration des mots de passe.

6. **A.12.1.1 - Operating Procedures**

- Cible: PC `2` (General Office)
- But: verifier disponibilite des procedures IT.

7. **A.12.4.1 - Event Logging**

- Cible: PC `3` (General Office)
- But: verifier la journalisation des evenements.

### Chapitre 3 - Sensitive Areas

8. **A.11.2.9 - Clear Desk & Clear Screen**

- Cible: `meeting_whiteboard` (Meeting Room)
- But: detecter l'exposition d'informations sensibles.

9. **A.13.1.1 - Network Controls**

- Cible: PC `4` (General Office / zone technique)
- But: verifier segregation et controles reseau.

### Chapitre 4 - Audit Conclusion

10. **A.18.1.1 - Legal Identification**

- Cible: `director_safe` (Director Office)
- But: verifier l'identification des obligations legales/compliance.

---

## 5) Comment jouer (guide rapide)

### Prerequis

- Node.js (v14+ recommande)
- Yarn ou npm

### Lancer le serveur

A la racine du projet:

```bash
yarn
yarn start
```

Serveur disponible sur: `http://localhost:2567`

### Lancer le client

Dans un 2eme terminal:

```bash
cd client
yarn
yarn dev
```

Client disponible sur: `http://localhost:5173`

### Rejoindre une partie

- Ouvrir le client dans le navigateur.
- Se connecter/choisir la room.
- Entrer dans l'office et ouvrir le HUD audit.

### Controles de base

- `W A S D` ou fleches: se deplacer
- `E`: s'asseoir / se lever
- `R`: utiliser un ordinateur
- `Enter`: ouvrir le chat
- `ESC`: fermer les dialogs

### Strategie de jeu recommandee

1. Commencer par les missions sans prerequis.
2. Collecter des preuves qualite plutot que quantite.
3. Completer chaque mission avec une justification solide.
4. Evaluer les risques des non-conformites importantes.
5. Verifier les onglets Missions, Evidence, Findings, Risks, Journal avant cloture.

---

## 6) Ce qui est deja solide vs. ce qui reste a finir

### Solide aujourd'hui

- Flux principal mission -> evidence -> finding -> risk.
- Synchro multijoueur et journal d'audit.
- HUD metier et formulaires principaux connectes.

### En cours / a renforcer

- Alignement strict des types partages client/serveur sur certains modeles.
- Stabilisation finale du scoring cote serveur.
- UX de restitution finale (visualisation rapport directement en jeu).
- Extensions gameplay (mini-jeux securite, validations avancees, etc.).

---

## 7) Resume en une phrase

Le jeu est deja jouable de bout en bout pour simuler un audit ISO (missions, preuves, conformite, risques, journal), avec une base multijoueur solide, et il entre maintenant dans une phase de stabilisation/release sur la coherence des types, le scoring final et l'experience de reporting.
