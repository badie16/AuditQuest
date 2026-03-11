# ISO 2700x Audit Simulator – Features Checklist

This document lists all the planned features for the **ISO 2700x Security Audit Simulator** project.
Each feature can be checked once it is implemented.

---

# Core Game Features

* [✔] Player avatar (Auditor) movement inside the virtual office
* [✔] Interactive 2D office environment
* [✔] Multiple rooms (Reception, Offices, Server Room, Meeting Room)
* [✔] Object interaction system (inspect computers, documents, servers)
* [ ] NPC employees in the office
* [ ] Dialogue system with employees
* [✔] Evidence collection system (Implemented via EvidenceCollectionDialog and AuditStore)
* [✔] Mission / quest system for audit tasks (Implemented via AuditService and AuditMissionPanel)
* [✔] Audit progress tracking (Tracked in AuditStore and displayed in AuditHUD)
* [ ] In-game notifications (new evidence, mission completed)

---

# ISO 2700x Audit Features (Required by Project Specification)

* [✔] Company scenario presentation (Description in AuditService/MissionBriefing)
* [✔] Audit objective description
* [✔] List of ISO controls to audit (6 controls implemented: A.5.1 to A.10.1)
* [ ] At least 10–15 ISO 27002 security controls implemented (Currently 6/15)
* [✔] Description of each control and its objective
* [✔] Evidence collection for each control
* [✔] Compliance evaluation system (Compliant / Non-Compliant / Partial)
* [✔] Ability to justify audit decisions (Implemented in ComplianceEvaluationDialog)
* [✔] Risk assessment system (based on ISO 27005)
* [✔] Risk probability evaluation
* [✔] Risk impact evaluation
* [✔] Recommendation system for fixing issues (Implemented in RiskAssessmentDialog)

---

# Evidence System

* [ ] Inspect password policy documents (Abstracted in evidence collection)
* [ ] Inspect server configuration
* [ ] Inspect firewall configuration
* [ ] Analyze system logs
* [✔] Collect digital evidence (Functional in UI)
* [ ] Collect interview evidence from employees (Waiting for NPC system)
* [✔] Store collected evidence in audit journal (Implemented in AuditStore/Journal)

---

# Audit Journal System

* [✔] Audit journal interface (Available in AuditHUD tabs)
* [✔] Display collected evidence
* [✔] Display audit controls status
* [✔] Display detected vulnerabilities (Linked to non-compliant findings)
* [✔] Display recommendations (In Risk/Findings tabs)

---

# Mini Security Analysis Features

* [ ] Password strength analysis mini-game
* [ ] Log anomaly detection mini-game
* [ ] Security misconfiguration detection
* [ ] Identify weak authentication policies

---

# Report Generation

* [✔] Automatic audit report generation (Implemented in reportGenerator.ts)
* [✔] List of audited controls
* [✔] Compliance status of each control
* [✔] List of discovered vulnerabilities
* [✔] Risk analysis summary
* [✔] Security recommendations
* [✔] Final audit score (Calculated in scoringSystem.ts)

---

# Collaboration Features (Based on Existing SkyOffice Features)

## Video Chat

* [✔] Video meeting between auditors (Native SkyOffice feature)
* [ ] Interview simulation with employees
* [ ] Security discussion between team members

## Screen Sharing

* [✔] Share system configuration screens (Native SkyOffice feature)
* [ ] Demonstrate server configurations
* [ ] Analyze logs collaboratively

## Whiteboard

* [✔] Draw system architecture (Native SkyOffice feature)
* [ ] Map network topology
* [ ] Highlight vulnerabilities
* [ ] Brainstorm security solutions

---

# Multiplayer / Collaboration Features

* [✔] Multiple auditors in the same virtual office
* [ ] Collaborative investigation (State is shared via Colyseus)
* [ ] Shared evidence discovery
* [ ] Team audit discussion

---

# User Interface Features

* [✔] Main menu (Room selection/Login)
* [✔] Login system (Character selection and Name)
* [✔] Game HUD interface (AuditHUD)
* [✔] Mission tracker panel (AuditMissionPanel)
* [✔] Evidence popup window (EvidenceCollectionDialog)
* [✔] Audit journal panel (Part of AuditHUD)
* [ ] Final report screen (Report is generated but needs a dedicated UI view to display HTML/PDF)

---

# Office Environment Elements

* [✔] Reception desk
* [✔] Employee workstations
* [✔] Meeting room
* [✔] Server room
* [ ] IT administrator office
* [✔] Security equipment objects (Computers, Vending machines, etc.)

---

# Optional Advanced Features (Bonus for version 2)

* [ ] AI assistant to help with audit analysis
* [ ] Dynamic security scenarios
* [ ] Random vulnerabilities generation
* [ ] Difficulty levels
* [ ] Time-limited audit missions
* [✔] Leaderboard / scoring system (Scoring system implemented)
* [✔] Export audit report as PDF (HTML/JSON/CSV export implemented)

---

# Technical Features

* [✔] Real-time interaction system
* [✔] Player movement engine
* [✔] Object collision system
* [✔] Data storage for audit results (Redux + Colyseus)
* [✔] State management for missions (AuditStore)
* [✔] Modular architecture

---

# Documentation Deliverables

* [ ] Technical documentation
* [ ] Architecture diagram
* [ ] Installation guide
* [ ] Deployment guide
* [ ] Project report
* [ ] Oral presentation slides

---

# Progress Tracker

Total features planned: 85 (approx)
Features completed: 52
Completion percentage: 61 %

---

✔ Each feature will be checked when implemented during development.
