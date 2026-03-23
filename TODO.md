# ISO 2700x Audit Simulator – Features Checklist

This document lists all the planned features for the **ISO 2700x Security Audit Simulator** project.
Each feature can be checked once it is implemented.

---

# Core Game Features

* [x] Player avatar (Auditor) movement inside the virtual office
* [x] Interactive 2D office environment
* [x] Multiple rooms (Reception, Offices, Server Room, Meeting Room)
* [x] Object interaction system (inspect computers, documents, servers)
* [x] NPC employees in the office (Sarah, Bob, Alice, Director Smith)
* [x] Dialogue system with employees (Pixel Art RPG Style)
* [x] Intelligent NPC placement (PNJs sit on chairs and occupy them)
* [x] Evidence collection system (Implemented via EvidenceCollectionDialog and AuditStore)
* [x] Mission / quest system for audit tasks (Implemented via AuditService and AuditMissionPanel)
* [x] Audit progress tracking (Tracked in AuditStore and displayed in AuditHUD)
* [ ] In-game notifications (new evidence, mission completed)

---

# ISO 2700x Audit Features (Required by Project Specification)

* [x] Company scenario presentation (Description in AuditService/MissionBriefing)
* [x] Audit objective description
* [x] List of ISO controls to audit (10 controls implemented: A.5 to A.18)
* [x] At least 10–15 ISO 27002 security controls implemented (10/15 completed)
* [x] Description of each control and its objective
* [x] Evidence collection for each control
* [x] Compliance evaluation system (Compliant / Non-Compliant / Partial)
* [x] Ability to justify audit decisions (Implemented in ComplianceEvaluationDialog)
* [x] Risk assessment system (based on ISO 27005)
* [x] Risk probability evaluation
* [x] Risk impact evaluation
* [x] Recommendation system for fixing issues (Implemented in RiskAssessmentDialog)

---

# Evidence System

* [ ] Inspect password policy documents (Abstracted in evidence collection)
* [ ] Inspect server configuration
* [ ] Inspect firewall configuration
* [ ] Analyze system logs
* [x] Collect digital evidence (Functional in UI)
* [x] Collect interview evidence from employees (Dialogue system + Evidence link)
* [x] Store collected evidence in audit journal (Implemented in AuditStore/Journal)

---

# Audit Journal System

* [x] Audit journal interface (Available in AuditHUD tabs)
* [x] Display collected evidence
* [x] Display audit controls status
* [x] Display detected vulnerabilities (Linked to non-compliant findings)
* [x] Display recommendations (In Risk/Findings tabs)

---

# Mini Security Analysis Features (The "Real Auditor" experience)

* [ ] **Password Strength Mini-game**: Test real passwords found on NPC computers.
* [ ] **Log Anomaly Detection**: Analyze a list of login attempts to find brute-force attacks.
* [ ] **Clear Desk Check**: Search for "Post-it" notes with passwords near NPC desks.
* [ ] **Network Segregation Map**: Reconstruct the network topology from server data.

---

# Report Generation

* [x] Automatic audit report generation (Implemented in reportGenerator.ts)
* [x] List of audited controls
* [x] Compliance status of each control
* [x] List of discovered vulnerabilities
* [x] Risk analysis summary
* [x] Security recommendations
* [x] Final audit score (Calculated in scoringSystem.ts)

---

# Collaboration Features (Based on Existing SkyOffice Features)

## Video Chat
* [x] Video meeting between auditors (Native SkyOffice feature)
* [ ] Interview simulation with employees
* [ ] Security discussion between team members

## Screen Sharing
* [x] Share system configuration screens (Native SkyOffice feature)
* [ ] Demonstrate server configurations
* [ ] Analyze logs collaboratively

## Whiteboard
* [x] Draw system architecture (Native SkyOffice feature)
* [ ] Map network topology
* [ ] Highlight vulnerabilities
* [ ] Brainstorm security solutions

---

# Multiplayer / Collaboration Features

* [x] Multiple auditors in the same virtual office
* [ ] Collaborative investigation (State is shared via Colyseus)
* [ ] Shared evidence discovery
* [ ] Team audit discussion

---

# User Interface Features

* [x] Main menu (Room selection/Login)
* [x] Login system (Character selection and Name)
* [x] Game HUD interface (AuditHUD)
* [x] Mission tracker panel (AuditMissionPanel)
* [x] Evidence popup window (EvidenceCollectionDialog)
* [x] Audit journal panel (Part of AuditHUD)
* [ ] **Room Indicator**: Show "Meeting Room", "Director Office", etc., on HUD.
* [ ] Final report screen (Dedicated UI view to display HTML/PDF)

---

# Office Environment Elements

* [x] Reception desk
* [x] Employee workstations
* [x] Meeting room
* [x] Server room
* [x] Director's office (Added Smith NPC there)
* [x] Security equipment objects (Computers, Vending machines, etc.)

---

# Technical Features

* [x] Real-time interaction system
* [x] Player movement engine
* [x] Object collision system
* [x] Data storage for audit results (Redux + Colyseus)
* [x] State management for missions (AuditStore)
* [x] **Optimized Interaction**: Increased range (48px) for interaction over desks.
* [x] Modular architecture

---

# Progress Tracker

Total features planned: 90 (approx)
Features completed: 68
Completion percentage: 75 %

---

x Each feature will be checked when implemented during development.
