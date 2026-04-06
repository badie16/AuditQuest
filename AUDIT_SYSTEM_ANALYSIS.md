# SkyOffice Audit System - Comprehensive Analysis

**Last Updated:** April 6, 2026  
**Scope:** Complete audit workflow, mission structure, story narrative, scoring system, and identified issues

---

## Table of Contents

1. [Story & Narrative Context](#story--narrative-context)
2. [Complete Audit Flow](#complete-audit-flow)
3. [Missions System](#missions-system)
4. [Scoring & Compliance Evaluation](#scoring--compliance-evaluation)
5. [Key Issues & Gaps](#key-issues--gaps)
6. [Gameplay Flow Diagram](#gameplay-flow-diagram)

---

## Story & Narrative Context

### Organization Background

**Company:** Northbridge Health Group  
**Sector:** Healthcare services and digital records  
**Tone:** Serious, professional, and slightly tense with focus on internal accountability

### Story Setup

Northbridge Health Group is preparing for an external ISO 27001 certification audit. The organization underwent several minor security incidents (access and document-handling issues) and claims to be audit-ready internally. Your role as an auditor is to **verify the actual security posture versus what's claimed on paper**.

### Core Story Question

> "Are the controls actually in place, or is the office only prepared on paper?"

### Primary Risks Being Audited

- Unclear access governance across office teams
- Sensitive files left visible in shared workspaces
- Weak evidence trail for policy approval and incident response

---

## Complete Audit Flow

### Phase 1: Pre-Audit Briefing

1. Player enters game and sees **Pre-Audit Briefing Dialog**
   - Displays company info: Northbridge Health Group
   - Shows audit objective and primary risks
   - Explains first stake: Director wants clear answer on control effectiveness
   - Player clicks "Continue" to proceed

### Phase 2: Chapter-Driven Story Progression

The audit is divided into **4 narrative chapters** that unlock sequentially:

#### Chapter 1: Opening Review (Order 1)

- Focus: Meet leadership, understand audit scope, verify security policy foundation
- Initial Missions Unlocked: 2 high-priority missions
  - **A.5.1 - Information Security Policies** (with Director Bahida)
  - **A.6.1 - Internal Organization** (with Manager Sarah)
  - **A.7.2.2 - Security Awareness** (with HR Maria) - _requires A.5.1 completion_

#### Chapter 2: Operational Investigation (Order 2)

- Focus: Inspect office workstations, logs, and procedures to validate daily security practice
- Missions Unlock After Chapter 1 Complete
  - **A.8.1 - User Registration** (PC 0)
  - **A.9.4.3 - Password Management** (PC 1)
  - **A.12.1.1 - Operating Procedures** (PC 2)
  - **A.12.4.1 - Event Logging** (PC 3)

#### Chapter 3: Sensitive Areas (Order 3)

- Focus: Focus on director office, server area, and physical controls
- Missions Unlock After Chapter 2 Complete
  - **A.11.2.9 - Clear Desk & Clear Screen** (Meeting Room Whiteboard)
  - **A.13.1.1 - Network Controls** (PC 4)

#### Chapter 4: Audit Conclusion (Order 4)

- Focus: Compile findings, document residual risk, close engagement with final verdict
- Final Mission Unlocks After Chapter 3 Complete
  - **A.18.1.1 - Legal Identification** (Director Office Safe)

### Phase 3: Gameplay - Mission Execution

For each active mission:

1. **Mission Available in Panel**
   - Player sees mission card in **Audit Mission Panel**
   - Shows control ID, status, priority, evidence progress
   - Displays location, actor, and brief objective

2. **Open Mission Briefing**
   - Dialog shows full mission details (chapter, control, ISO number)
   - Displays story context explaining _why_ this control matters
   - Consequence section shows impact if control is weak
   - Evidence requirements checklist
   - Player clicks "ACCEPT MISSION" to start

3. **Collect Evidence**
   - Player explores office, interacts with NPCs and objects
   - Can collect evidence from:
     - **NPCs** through dialogue (5 NPCs with dialogue options)
     - **Computers** (10 workstations each representing different logs/configs)
     - **Whiteboards** (3 physical security verification points)
     - **Director Office Safe** (compliance/legal records)
   - Opens Evidence Collection Dialog
     - Selects evidence type: document, log, config, interview, observation
     - Enters description and location
     - Evidence auto-linked to mission

4. **Evaluate Compliance**
   - When ready, auditor opens **Compliance Evaluation Dialog**
   - Selects compliance status: Compliant / Non-Compliant / Partial
   - Provides justification text explaining findings
   - Associates collected evidence with evaluation
   - Submits to complete mission

5. **Server Creates Finding**
   - Backend automatically creates `ComplianceFinding` record
   - Links all collected evidence to finding
   - Triggers chapter unlock if conditions met

### Phase 4: Risk Assessment (Optional)

After mission completion:

- Auditor can create risk assessments from findings
- Sets probability (low/medium/high) and impact (low/medium/high)
- System calculates severity using risk matrix
- Risk assessment linked to finding and affects final score

### Phase 5: Mission Completion & Chapter Transition

- When all missions in a chapter are completed → unlock next chapter
- New missions in next chapter become available
- Story progresses through office areas

### Phase 6: Campaign Completion

- All 11 missions completed → audit campaign concludes
- Final report generated with:
  - Total compliance score (0-100)
  - Performance grade: Excellent/Good/High Risk/Critical Risk
  - Summary of findings, risks, evidence
  - Audit journal complete trail

---

## Missions System

### Complete Mission List (11 Total)

All missions follow ISO 27002 control structure with narrative context.

#### **Chapter 1: Opening Review**

| ID   | Control | Title                         | Priority | Category       | Prerequisites | Actor           | Location        | Evidence Required                                                | Story Context                                              | Consequence                                                      |
| ---- | ------- | ----------------------------- | -------- | -------------- | ------------- | --------------- | --------------- | ---------------------------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------- |
| a5-1 | A.5.1   | Information Security Policies | HIGH     | POLICIES       | None          | Director Bahida | Director Office | Policy Document, Approval Records, Distribution Evidence         | Audit starts at top: confirm leadership approved framework | If policy missing, every downstream control harder to defend     |
| a6-1 | A.6.1   | Internal Organization         | HIGH     | ORGANIZATION   | a5-1          | Manager Sarah   | Meeting Room    | Org Chart, Role Definitions, Responsibility Matrix               | Verify responsibility clearly assigned                     | Ambiguous responsibilities explain why controls fail in practice |
| a7-2 | A.7.2.2 | Security Awareness            | MEDIUM   | HUMAN RESOURCE | a5-1          | HR Maria        | Break Room      | User Security Agreement, Training Records, Acceptable Use Policy | Interview about social engineering risks                   | Weak awareness means audit must dig deeper into behavior         |

#### **Chapter 2: Operational Investigation**

| ID    | Control  | Title                | Priority | Category         | Prerequisites | Actor                | Location       | Evidence Required                                             | Story Context                                 | Consequence                                                 |
| ----- | -------- | -------------------- | -------- | ---------------- | ------------- | -------------------- | -------------- | ------------------------------------------------------------- | --------------------------------------------- | ----------------------------------------------------------- |
| a8-1  | A.8.1    | User Registration    | HIGH     | ASSET MANAGEMENT | a6-1          | Office Workstation 0 | General Office | User Access List, Access Request Forms, Review Reports        | Verify users registered in controlled process | Informal registration makes access chain unreliable         |
| a9-4  | A.9.4.3  | Password Management  | HIGH     | ACCESS CONTROL   | a8-1          | Office Workstation 1 | General Office | Encryption Policy, Key Mgmt Records, Implementation Evidence  | Verify complexity and expiration settings     | Weak password governance reveals broader lack of discipline |
| a12-1 | A.12.1.1 | Operating Procedures | HIGH     | OPERATIONS       | a5-1          | Office Workstation 2 | General Office | System Documentation, Procedure Manual, Configuration Records | Verify procedures available where people work | Missing procedures weaken demonstrable secure operations    |
| a12-4 | A.12.4.1 | Event Logging        | MEDIUM   | OPERATIONS       | a12-1         | Office Workstation 3 | General Office | Incident Response Plan, Incident Log, Lessons Learned         | Check if logs recorded and secured            | Poor logs make future incident response harder to defend    |

#### **Chapter 3: Sensitive Areas**

| ID    | Control  | Title                     | Priority | Category          | Prerequisites | Actor                   | Location       | Evidence Required                                     | Story Context                         | Consequence                                                       |
| ----- | -------- | ------------------------- | -------- | ----------------- | ------------- | ----------------------- | -------------- | ----------------------------------------------------- | ------------------------------------- | ----------------------------------------------------------------- |
| a11-2 | A.11.2.9 | Clear Desk & Clear Screen | MEDIUM   | PHYSICAL SECURITY | a6-1          | Meeting Room Whiteboard | Meeting Room   | Physical Controls, Entry/Exit Logs, Security Barriers | Ensure no sensitive data left visible | Room leaks info = treat physical controls as live risk            |
| a13-1 | A.13.1.1 | Network Controls          | HIGH     | COMMUNICATIONS    | a12-4         | Office Workstation 4    | General Office | Network Diagram, Firewall Config, VLAN Config         | Inspect network segregation           | Weak network story = most sensitive area superficially controlled |

#### **Chapter 4: Audit Conclusion**

| ID    | Control  | Title                | Priority | Category   | Prerequisites | Actor         | Location        | Evidence Required                                        | Story Context                     | Consequence                                                   |
| ----- | -------- | -------------------- | -------- | ---------- | ------------- | ------------- | --------------- | -------------------------------------------------------- | --------------------------------- | ------------------------------------------------------------- |
| a18-1 | A.18.1.1 | Legal Identification | LOW      | COMPLIANCE | a5-1          | Director Safe | Director Office | Legal Registry, Compliance Certificates, Contract Review | Verify legislation identification | Weak compliance evidence = high residual risk in final report |

### Mission Status Progression

- **pending** → Mission locked (prerequisites not met or in wrong chapter)
- **in-progress** → Mission available and can be started
- **completed** → Mission done with compliance determination

### Evidence Collection Model

Each mission has **3-4 evidence requirements** representing audit proof:

- **Document Evidence:** Policy docs, agreements, contracts
- **Log Evidence:** System logs, access records, incident logs
- **Configuration Evidence:** System configs, network diagrams, backup logs
- **Interview Evidence:** Conversations with NPCs/staff
- **Observation Evidence:** Physical controls, clear desk checks

**Evidence Lifecycle:**

1. Auditor collects evidence (adds to mission)
2. Evidence stored with collection timestamp, type, location
3. Evidence can be verified by auditor (mark as verified/rejected)
4. At mission completion, all collected evidence linked to finding
5. Evidence contributes to compliance determination

---

## NPCs & Dialogue System

### Key NPCs (4 Primary)

#### 1. Director Bahida

- **Role:** Managing Director
- **Location:** Director Office
- **Opening Line:** "Welcome to the audit. I assure you we follow all ISO 27001 guidelines strictly here."
- **Dialogue Options:**
  - "Who approved the latest security policy version?" → Unlocks Chapter 1
  - "How do you track legal and compliance obligations?" → Unlocks Chapter 4
- **Mission Link:** A.5.1 (Information Security Policies)

#### 2. Manager Sarah

- **Role:** IT Manager
- **Location:** Meeting Room
- **Opening Line:** "I have all the logs and organizational charts ready for your review in the meeting room."
- **Dialogue Options:**
  - "How are security responsibilities assigned across teams?" → Unlocks Chapter 1
  - "What happens after a security incident is reported?" → Unlocks Chapter 2
- **Mission Link:** A.6.1 (Internal Organization)

#### 3. Admin Joe

- **Role:** System Administrator
- **Location:** General Office
- **Opening Line:** "The servers are segregated and all backups are encrypted. You can verify the configs on PC 4."
- **Dialogue Options:**
  - "Can you explain the network segmentation model?" → Unlocks Chapter 3
  - "How do you validate backup integrity?" → Unlocks Chapter 3
- **Mission Link:** A.13.1.1 (Network Controls)

#### 4. HR Maria

- **Role:** HR Specialist
- **Location:** Break Room
- **Opening Line:** "All employees have signed their non-disclosure agreements and completed the awareness training."
- **Dialogue Options:**
  - "How do you ensure awareness training is completed on time?" → Unlocks Chapter 2
  - "What social engineering scenarios are covered in training?" → Unlocks Chapter 2
- **Mission Link:** A.7.2.2 (Security Awareness)

### Dialogue to Evidence Integration

- Each NPC dialogue can be collected as evidence
- Player clicks "Collect as Evidence" in dialogue
- Becomes "interview" type evidence
- Auto-linked to active mission

---

## Scoring & Compliance Evaluation

### Compliance Status Determination

Each mission must be evaluated with one of three statuses:

| Status            | Meaning                                                       | Base Rating | Score Impact               |
| ----------------- | ------------------------------------------------------------- | ----------- | -------------------------- |
| **Compliant**     | Organization has implemented and maintains effective controls | 10/10       | Full domain weight awarded |
| **Non-Compliant** | Organization hasn't implemented or fails to maintain controls | 0/10        | Zero contribution to score |
| **Partial**       | Some controls implemented but gaps exist                      | 5/10        | Half domain weight awarded |

### Scoring Architecture (6-Step Breakdown)

The system uses a **weighted domain-based scoring model**:

#### Step 1: Domain Identification

- Each mission belongs to a category (domain)
- Domains include: POLICIES, ORGANIZATION, HUMAN_RESOURCE, ASSET_MANAGEMENT, ACCESS_CONTROL, PHYSICAL_SECURITY, OPERATIONS, COMMUNICATIONS, COMPLIANCE
- Each domain has a weight (0.0-1.0) reflecting importance

#### Step 2: Domain Weighting

Example domain weights:

- ACCESS_CONTROL: 0.25 (25% of total score)
- OPERATIONS: 0.20 (20% of total score)
- POLICIES: 0.15 (15% of total score)
- PHYSICAL_SECURITY: 0.15 (15% of total score)
- etc.

#### Step 3: Mission Weight Calculation

```
Mission Weight = (Domain Weight / # Missions in Domain) × 100
```

If ACCESS_CONTROL domain has weight 0.25 and 2 missions:

- Each mission worth: (0.25 / 2) × 100 = **12.5 points** toward final 100

#### Step 4: Base Control Rating

- Completed + Compliant = 10/10 points
- Completed + Partial = 5/10 points
- Completed + Non-Compliant = 0/10 points
- In-Progress (not completed) = 6/10 points (partial credit)
- Pending (not started) = 3/10 points (starting credit)

#### Step 5: Risk Penalties

After mission completion, identified risks penalize the score:

```
- Critical Risk: -3 points
- High Risk: -2 points
- Medium Risk: -1 point
- Low Risk: -0.5 points
```

Net Rating = max(0, Base Rating - Risk Penalty)

#### Step 6: Final Score Calculation

```
Weighted Score = Σ(Mission Contribution per Domain)
Final Score = Weighted Score out of 100, rounded
```

### Performance Grading

| Score | Grade             | Description                                           | Risk Level |
| ----- | ----------------- | ----------------------------------------------------- | ---------- |
| ≥90   | **Excellent**     | Low Risk - Strong information security posture        | Green      |
| 70-89 | **Good**          | Moderate Risk - Adequate controls with some gaps      | Yellow     |
| 50-69 | **High Risk**     | High Risk - Multiple security gaps identified         | Orange     |
| <50   | **Critical Risk** | Critical Risk - Severe organizational vulnerabilities | Red        |

### Risk Matrix (Probability × Impact = Severity)

```
             LOW      MEDIUM    HIGH
LOW          low      low       medium
MEDIUM       low      medium    high
HIGH         medium   high      critical
```

### Campaign Result Determination

After all missions complete:

- **Pass:** Score ≥ 75 and no critical risks
- **Warning:** Score 50-74 or has critical risks but not all critical
- **Fail:** Score < 50 or majority of controls non-compliant

---

## Evidence Collection & Verification

### Evidence Types

1. **Document** - Policy docs, contracts, agreements
2. **Log** - System logs, access records, event logs
3. **Config** - System configurations, network diagrams
4. **Interview** - NPC dialogue, staff statements
5. **Observation** - Physical security observations, clear desk checks

### Evidence Workflow

1. **Collection Phase**
   - Auditor sees Evidence Collection Dialog
   - Selects target (NPC, Computer, Whiteboard, etc.)
   - Chooses evidence type
   - Enters description (what was verified)
   - Records location where evidence found
2. **Storage**
   - Evidence record created with:
     - Unique ID
     - Mission ID (which mission it supports)
     - Type, description, location
     - Collection timestamp
     - Auditor ID who collected it
     - Verified flag (initially false)

3. **Verification**
   - Auditor can verify evidence as credible (manual check)
   - Mark verified = true with verifier ID and timestamp
   - Unverified evidence still counts toward completion but may reduce confidence

4. **Linking to Findings**
   - At mission completion, all collected evidence auto-linked to finding
   - Evidence array becomes part of compliance finding record
   - Drives justification for compliance determination

### Evidence Requirements Per Mission

Each mission lists 3-4 evidence requirements that should be collected:

- **A.5.1 (Policies):** Policy Document, Policy Approval Records, Distribution Evidence
- **A.6.1 (Organization):** Org Chart, Role Definitions, Responsibility Matrix
- **A.8.1 (User Registration):** User Access List, Access Request Forms, Review Reports
- **A.12.4.1 (Event Logging):** Incident Response Plan, Incident Log, Lessons Learned
- etc.

Evidence requirement names are **narrative labels** helping auditors know what to look for, not exact matching.

---

## Audit Journal & Audit Trail

### Journal Entry Types

System automatically logs all audit activities:

- `mission_started` - Auditor begins mission
- `mission_completed` - Auditor completes mission with compliance determination
- `evidence_collected` - Evidence collected for mission
- `compliance_evaluated` - Compliance status determined
- `risk_assessed` - Risk assessment created
- `finding_added` - Finding record created
- `chapter_transition` - Story chapter advanced
- `campaign_completed` - All missions complete
- `note_added` - Auditor adds notes/verifications

### Journal Record Structure

```
{
  id: uuid,
  timestamp: Date.now(),
  auditorId: client.sessionId,
  action: string (what happened),
  details: string (context),
  missionId?: string (which mission)
  findingId?: string (which finding)
  type: JournalEntryType,
}
```

Provides complete audit trail for compliance documentation.

---

## Key Issues & Gaps

### Critical Issues (P0)

#### 1. **Type Drift Between Client/Server/Shared Types**

**Status:** ⚠️ ACTIVE ISSUE

**Problem:**

- Mission model differs between:
  - `types/AuditTypes.ts` (shared types)
  - `server/rooms/schema/AuditState.ts` (Colyseus schema)
  - `client/src/stores/AuditStore.ts` (Redux store)
- Example: Mission fields like `zone`, `isoControl`, `name` exist in server schema but not all in shared types
- Causes TypeScript compilation errors and type mismatches at runtime

**Impact:**

- Client receives missions from server but doesn't match all properties to UI display
- Type guards needed in multiple places instead of clean types
- Risk of regressions when updating mission properties

**Files Affected:**

- [types/AuditTypes.ts](types/AuditTypes.ts) - defines `AuditMission`
- [types/AuditData.ts](types/AuditData.ts) - defines `NarrativeMission` extending `AuditMission`
- [server/rooms/schema/AuditState.ts](server/rooms/schema/AuditState.ts) - `MissionSchema`
- [client/src/stores/AuditStore.ts](client/src/stores/AuditStore.ts) - Redux state
- [client/src/components/MissionBriefing.tsx](client/src/components/MissionBriefing.tsx) - uses `mission.isoControl || mission.controlId`

**Recommendation:**

- Unify all mission properties in `types/AuditTypes.ts`
- Update server schema to match
- Audit all component property references

#### 2. **Incomplete Evidence Verification UI**

**Status:** ⚠️ INCOMPLETE

**Problem:**

- Evidence can be marked verified in backend but no UI dialog for collaborative verification
- Only auditor who collected evidence can mark verified
- No "Evidence Review Panel" for senior auditors to approve/reject evidence

**Impact:**

- Breaks multi-user audit workflow (junior auditor collects, senior auditor verifies)
- Evidence marked verified but no UI confirmation visible to players

**Files Affected:**

- [server/rooms/commands/EvidenceCollectionCommand.ts](server/rooms/commands/EvidenceCollectionCommand.ts) - has `VerifyEvidenceCommand`
- Missing UI component for evidence review

**Recommendation:**

- Create `EvidenceReviewDialog.tsx` for senior auditors
- Show unverified evidence for manual review
- Block mission completion until evidence verified for high-priority missions

#### 3. **Missing Mini-Games for Hands-On Verification**

**Status:** 🛑 NOT STARTED

**Problem:**

- Some missions (Password Management, Event Logging) claim to inspect configs but have no interactive verification
- Players just click "accept" without actually evaluating the systems

**Impact:**

- Reduces engagement and realism
- Doesn't teach audit techniques
- Missions feel incomplete

**Recommended Mini-Games:**

- **Clear Desk Challenge:** Find hidden objects on whiteboard (compliance demonstration)
- **Password Policy Calculator:** Verify complexity rules are enforced
- **Log Analysis:** Identify anomalies in sample event logs
- **Network Diagram Quiz:** Verify network segmentation understanding

#### 4. **Risk Assessment Severity Not Impacting Final Score Properly**

**Status:** ⚠️ PARTIALLY IMPLEMENTED

**Problem:**

- Risk penalties apply but may not fully reflect actual risk impact
- Critical risks should have heavier weight in final score
- Campaign result (pass/warning/fail) doesn't clearly articulate risk acceptance

**Impact:**

- Organizations with high risks but compliant controls get inflated scores
- Doesn't properly reflect residual risk

**Files Affected:**

- [client/src/utils/scoringSystem.ts](client/src/utils/scoringSystem.ts) - risk penalty calculation
- [server/utils/scoringSystem.ts](server/utils/scoringSystem.ts) - server-side scoring

**Recommendation:**

- Increase critical risk penalty (currently -3, should be -5+)
- Add "Risk Acceptance" flow where high/critical risks must be explicitly accepted
- Generate risk score separately from compliance score

#### 5. **Final Report Generation Not User-Accessible**

**Status:** ⚠️ INCOMPLETE

**Problem:**

- Report generator exists in [client/src/utils/reportGenerator.ts](client/src/utils/reportGenerator.ts)
- No UI dialog to view generated report before session ends
- Players can't save/export audit report

**Impact:**

- Missed opportunity for documentation and training material
- Can't demonstrate findings to stakeholders

**Recommendation:**

- Create `FinalReportDialog.tsx` component
- Show summary, findings, risks, recommendations
- Add export to PDF/JSON functionality

### High Priority Issues (P1)

#### 6. **Mission Prerequisites Not Fully Enforced**

**Status:** ⚠️ INCOMPLETE

**Problem:**

- Prerequisites array exists on missions but unlock mechanism may not handle cross-chapter dependencies
- Example: A.9.4 requires A.8.1 but both in different chapters

**Impact:**

- Player could theoretically complete A.9.4 before A.8.1 if prerequisites not enforced
- Story progression might skip logical requirements

**Files Affected:**

- [server/rooms/commands/AuditMissionCommand.ts](server/rooms/commands/AuditMissionCommand.ts) - `unlockMissionsForCurrentChapter` function

**Recommendation:**

- Strengthen `areMissionPrerequisitesMet` check
- Add server-side validation before allowing mission start
- Gray out/disable missions in UI if prerequisites not met

#### 7. \***\*Compliance Status Determination Logic Unclear to Players**

**Status:** ⚠️ UI ISSUE

**Problem:**

- [client/src/components/ComplianceEvaluationDialog.tsx](client/src/components/ComplianceEvaluationDialog.tsx) shows 3 options but doesn't guide auditor on HOW to decide
- No "suggested" compliance based on evidence collected
- Auditors might mark "Compliant" regardless of actual evidence

**Impact:**

- Audit outcomes become arbitrary
- Doesn't teach compliance evaluation methodology

**Recommendation:**

- Add "Evidence-Based Recommendation" section
- Show: "You've collected 2/3 of required evidence - control is PARTIAL"
- Highlight gaps in evidence collection

#### 8. **Chapter Progression Logic Not Clear in Code**

**Status:** ⚠️ TECHNICAL DEBT

**Problem:**

- Functions `unlockMissionsForCurrentChapter` and `progressStoryIfChapterCompleted` split logic
- Hard to understand when chapters actually progress
- No clear display to player of chapter status

**Impact:**

- Difficult to debug story flow issues
- Players don't understand chapter requirements

**Files Affected:**

- [server/rooms/commands/AuditMissionCommand.ts](server/rooms/commands/AuditMissionCommand.ts) - lines 150-200+

**Recommendation:**

- Add "Chapter Progress" panel showing:
  - Current chapter name/order
  - Missions remaining
  - Unlock condition for next chapter
- Simplify progression logic into single handler

---

## Gameplay Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                     SKYOFFICE AUDIT GAMEPLAY FLOW                   │
└─────────────────────────────────────────────────────────────────────┘

[Game Start]
    │
    ├─→ Check Audit Session Setup
    │    └─→ Initialize Missions (Server: InitializeAuditMissionsCommand)
    │        ├─ Create 11 mission records from AUDIT_MISSIONS
    │        ├─ Set first chapter missions to "in-progress"
    │        └─ Create initial journal entry
    │
    └─→ Display Pre-Audit Briefing Dialog
         ├─ Show: Company (Northbridge Health Group)
         ├─ Show: Audit Objective & Primary Risks
         ├─ Show: Story Context
         └─ Button: "Continue" → Phase 2

[Phase 2: Enter Game World]
    │
    ├─→ Render 3D Office with NPCs, Computers, Whiteboards
    │
    └─→ Audit HUD Appears (Bottom Right)
         ├─ Tabs: Overview | Missions | Evidence | Findings | Risks | Journal
         ├─ Current Score Display (100 initially)
         ├─ Progress Bar (0% initially)
         └─ All systems ready

[Phase 3: Play Active Missions - Chapter 1]
    │
    ├─→ Player clicks "Missions" Tab
    │    └─→ AuditMissionPanel shows 3 active missions:
    │         • A.5.1 - Information Security Policies [IN-PROGRESS]
    │         • A.6.1 - Internal Organization [PENDING - wait for A.5.1]
    │         • A.7.2.2 - Security Awareness [PENDING - require A.5.1]
    │
    ├─→ Player clicks on A.5.1 Card → "OPEN BRIEFING"
    │    └─→ MissionBriefing Dialog Opens
    │         ├─ Shows: ISO A.5.1, Chapter 1: Opening Review
    │         ├─ Shows: "Information Security Policies"
    │         ├─ Shows: Story Context
    │         ├─ Shows: Actor (Director Bahida)
    │         ├─ Shows: Required Evidence (0/3)
    │         └─ Button: "ACCEPT MISSION" / "DECLINE"
    │
    ├─→ Player Clicks "ACCEPT MISSION"
    │    └─→ Mission status stays "in-progress"
    │        └─→ Mission briefing closes
    │
    ├─→ Player Explores World to Collect Evidence
    │    │
    │    ├─→ Walks to Director Office
    │    │    └─→ Interacts with Director Bahida NPC
    │    │         ├─ Shows Dialogue: "Welcome..."
    │    │         └─ Dialog Options:
    │    │              • "Who approved the latest security policy version?"
    │    │                 → Answer: "I approved v2.0 last quarter..."
    │    │                 → Button: "Collect as Evidence"
    │    │              • Other options
    │    │
    │    ├─→ Clicks "Collect as Evidence"
    │    │    └─→ Evidence Collection Dialog Opens
    │    │         ├─ Type: "interview" (pre-selected)
    │    │         ├─ Description: "[NPC Name] confirmed policy approval..."
    │    │         ├─ Location: "Director Office"
    │    │         └─ Button: "COLLECT"
    │    │
    │    ├─→ Evidence Added
    │    │    └─→ Server: CollectEvidenceCommand executes
    │    │         ├─ Creates Evidence record with ID
    │    │         ├─ Links to A.5.1 mission
    │    │         ├─ Updates mission.collectedEvidence array
    │    │         ├─ Adds journal entry: "evidence_collected"
    │    │         ├─ Sends notification: "Evidence Collected"
    │    │         └─ Updates metrics
    │    │
    │    ├─→ Progress Updates
    │    │    └─→ Evidence Counter: 1/3
    │    │        Mission Briefing shows progress bar updated
    │    │
    │    ├─→ Repeats for Evidence #2 and #3
    │    │    ├─ Visit Meeting Room → Get evidence from Manager Sarah
    │    │    ├─ Find Policy Document on Computer PC0
    │    │    └─ Collect Distribution Evidence from Whiteboard
    │    │
    │    └─→ All 3 Evidence Collected
    │         └─→ Evidence Counter: 3/3 ✓
    │
    ├─→ Player Ready to Evaluate Mission
    │    └─→ Clicks "EVALUATE COMPLIANCE" (or similar)
    │
    ├─→ Compliance Evaluation Dialog Opens
    │    ├─ Shows: Mission Title, Control ID, Description
    │    ├─ Shows: Collected Evidence Links
    │    ├─ Selection: Compliance Status
    │    │    ○ Compliant (organization has effective controls)
    │    │    ○ Non-Compliant (organization failed to implement)
    │    │    ○ Partial (some controls but gaps exist)
    │    ├─ Text Box: Justification (required)
    │    ├─ Text Box: Notes (optional)
    │    └─ Buttons: "CANCEL" / "SUBMIT EVALUATION"
    │
    ├─→ Player Enters Justification
    │    └─→ "Director confirmed formal approval of security policy v2.0.
    │         Distributed to all department leads. Controls are properly
    │         documented and communicated. No gaps identified."
    │
    ├─→ Player Clicks "SUBMIT EVALUATION"
    │    └─→ Server: CompleteMissionCommand executes
    │         ├─ Sets mission.status = "completed"
    │         ├─ Sets mission.compliance = "compliant"
    │         ├─ Creates ComplianceFinding record
    │         │   ├─ finding.status = "compliant"
    │         │   ├─ finding.evidence = [evidence_id1, evidence_id2, evidence_id3]
    │         │   └─ finding.justification = player input
    │         ├─ Calls updateAuditSessionMetrics()
    │         │   └─ Recalculates total score (may increase)
    │         ├─ Checks unlockMissionsForCurrentChapter()
    │         │   └─ If A.5.1 done & prerequisites met:
    │         │       Unlock A.6.1 → "in-progress"
    │         ├─ Checks progressStoryIfChapterCompleted()
    │         │   └─ If all Chapter 1 missions done:
    │         │       Move to Chapter 2, unlock Chapter 2 missions
    │         ├─ Adds Journal Entry: "mission_completed"
    │         └─ Broadcasts state update to all clients
    │
    ├─→ Client State Updates
    │    └─→ Redux AuditStore updated with:
    │         ├─ Mission moved from activeMissions → completedMissions
    │         ├─ Finding added to store
    │         ├─ Score updated (100 → 95+)
    │         ├─ Progress percentage increases
    │         └─ UI automatically re-renders
    │
    ├─→ Mission Card Status Changed
    │    └─→ Panel shows: A.5.1 [COMPLETED] ✓
    │         Icon changes, card grayed out
    │
    ├─→ A.6.1 Unlocks
    │    └─→ A.6.1 Card now shows [IN-PROGRESS]
    │         "OPEN BRIEFING" button enabled
    │         Can repeat process for A.6.1
    │
    └─→ When All Chapter 1 Missions Complete
         ├─ Chapter transitions to Chapter 2
         ├─ All Chapter 2 mission cards appear
         └─ Story progresses...

[Phase 4: Risk Assessment (Optional)]
    │
    ├─→ Player navigates to Findings Tab
    │    └─→ Shows all ComplianceFindings
    │         ├─ A.5.1 - Compliant [Audit verdict created]
    │         ├─ Additional context from justification
    │         └─ Button: "ADD RISK ASSESSMENT"
    │
    ├─→ Creates Risk Assessment Dialog
    │    ├─ Probability: low/medium/high (dropdown)
    │    ├─ Impact: low/medium/high (dropdown)
    │    ├─ System calculates: Severity (using RISK_MATRIX)
    │    ├─ Recommendation: text
    │    └─ Button: "SUBMIT"
    │
    ├─→ Risk Assessment Created
    │    └─→ Risk added to state
    │         └─ May impact score if severity factored in

[Phase 5: Chapters 2, 3, 4 Repeat]
    │
    └─→ Same mission cycle repeats for each chapter transition
         ├─ PC-based missions (A.8.1, A.9.4, A.12.1, A.12.4, A.13.1)
         │  └─ Interact with Computer objects to collect config/log evidence
         ├─ Physical security missions (A.11.2.9)
         │  └─ Interact with Whiteboard to find data leaks
         └─ Compliance missions (A.18.1)
            └─ Search Director Safe for legal records

[Phase 6: Campaign Completion]
    │
    ├─→ All 11 Missions Completed
    │    └─→ Server detects:
    │         ├─ completedMissions == totalMissions
    │         ├─ Sets auditSession.status = "completed"
    │         └─ Sets auditSession.endTime = Date.now()
    │
    ├─→ Final Metrics Calculated
    │    ├─ Total Score: 75 (out of 100)
    │    ├─ Grade: "Good"
    │    ├─ Campaign Result: "warning" (or pass/fail)
    │    ├─ Total Findings: 11
    │    ├─ Risk Summary:
    │    │   ├─ Critical: 2
    │    │   ├─ High: 3
    │    │   └─ Medium: 5
    │    └─ Evidence Summary: 33+ pieces collected
    │
    ├─→ Final Report Dialog Opens (Proposed)
    │    ├─ Title: "Audit Campaign Complete"
    │    ├─ Grade Badge: "Good (75/100)"
    │    ├─ Executive Summary
    │    ├─ Key Findings Section
    │    ├─ Risk Assessment Summary
    │    ├─ Recommendations Section
    │    └─ Buttons: "EXPORT PDF" / "CLOSE"
    │
    └─→ Players can review audit trail in Journal Tab
         ├─ Full chronological record of all actions
         ├─ Timestamps, auditor IDs, evidence collected
         └─ Can export journal for documentation

[End Game]
    └─→ Session Complete
         ├─ Score persisted to database
         ├─ Report generated
         └─ Can start new audit or review this one
```

---

## Server Architecture

### Core Components

#### [AuditQuest.ts](server/rooms/AuditQuest.ts) - Main Room Handler

- Creates audit session on room creation
- Listens for audit messages:
  - `Message.START_MISSION`
  - `Message.COMPLETE_MISSION`
  - `Message.ADD_EVIDENCE`
  - `Message.VERIFY_EVIDENCE`
  - `Message.ADD_RISK`
- Dispatches commands to execute logic
- Broadcasts state changes to all clients

#### Audit Commands

- [AuditMissionCommand.ts](server/rooms/commands/AuditMissionCommand.ts) - **Mission Lifecycle**
  - `InitializeAuditMissionsCommand` - Create all missions at room creation
  - `StartMissionCommand` - Set mission to "in-progress"
  - `CompleteMissionCommand` - Complete mission with compliance determination
  - `unlockMissionsForCurrentChapter()` - Unlock next missions when prerequisites met
  - `progressStoryIfChapterCompleted()` - Transition to new chapter
  - `finalizeCampaignIfCompleted()` - Mark audit complete when all missions done

- [EvidenceCollectionCommand.ts](server/rooms/commands/EvidenceCollectionCommand.ts) - **Evidence Workflow**
  - `CollectEvidenceCommand` - Create evidence record
  - `VerifyEvidenceCommand` - Mark evidence as verified/rejected
  - `RemoveEvidenceCommand` - Delete evidence

- [RiskAssessmentCommand.ts](server/rooms/commands/RiskAssessmentCommand.ts) - **Risk Management**
  - `CreateRiskAssessmentCommand` - Assess probability/impact/severity
  - `UpdateRiskAssessmentCommand` - Modify risk assessment
  - `RemoveRiskAssessmentCommand` - Delete risk

#### [scoringSystem.ts](server/utils/scoringSystem.ts) - Scoring Engine

- `updateAuditSessionMetrics()` - Main scoring function
  - Calculates completion percentage
  - Aggregates domain scores
  - Applies risk penalties
  - Updates session total score

#### [authMatrix.ts](server/utils/authMatrix.ts) - Authorization

- `canPerformAction(role, action)` - Verify auditor has permission
- Roles: `auditor`, `auditee`, `observer`
- Actions: `start_mission`, `complete_mission`, `collect_evidence`, `verify_evidence`, `add_risk`

### Colyseus Schemas

#### [AuditState.ts](server/rooms/schema/AuditState.ts) - Audit-Specific State

```typescript
AuditSessionSchema {
  sessionId: string,
  status: 'pending' | 'in-progress' | 'completed',
  startTime: number,
  endTime?: number,
  totalScore: number,
  completionPercentage: number,
  currentChapterId: string,
  currentChapterTitle: string,
  currentChapterOrder: number,
  campaignResult: 'pass' | 'warning' | 'fail',
}

MissionSchema {
  id, name, description, isoControl, zone,
  status, priority, compliance, justification,
  collectedEvidence[], prerequisites[], evidenceRequired[],
  createdAt, completedAt,
}

FindingSchema {
  id, missionId, status (compliant/non-compliant/partial),
  evidence[], justification, auditorId,
  createdAt, lastModified,
}

EvidenceSchema {
  id, missionId, type, description, location,
  collectionTime, auditorId, verified, verifiedBy,
}

RiskAssessmentSchema {
  id, findingId, probability, impact, severity,
  recommendation, remediationDue, createdAt,
}

JournalEntrySchema {
  id, timestamp, auditorId, action, details,
  missionId?, findingId?, type,
}
```

---

## Client Architecture

### State Management (Redux)

#### [AuditStore.ts](client/src/stores/AuditStore.ts) - Mission & Audit State

```typescript
AuditState {
  sessionId, currentMission, activeMissions[], completedMissions[],
  collectedEvidence[], findings[], riskAssessments[],
  auditScore, progressPercentage, auditJournal[],
  status, startedAt, currentChapterId, currentChapterOrder,
  campaignResult, campaignConclusion,
}
```

Reducers:

- `openEvidenceDialog` / `closeEvidenceDialog`
- `openComplianceDialog` / `closeComplianceDialog`
- `initializeAuditSession` - Called when server sends initial state
- `addMission`, `updateMission`, `removeMission`
- `addEvidence`, `updateEvidence`, `removeEvidence`
- `setCurrentMission`, `setActiveTab`

#### Network Synchronization (Network.ts)

- Listens to Colyseus state changes
- Auto-syncs to Redux store on:
  - Mission created/updated
  - Evidence collected
  - Finding created
  - Risk assessment added
  - Journal entry logged

### UI Components

#### [AuditHUD.tsx](client/src/components/AuditHUD.tsx) - Main Audit Dashboard

- 6 Tabs: Overview | Missions | Evidence | Findings | Risks | Journal
- Score display, progress bar
- Shows current chapter info

#### [AuditMissionPanel.tsx](client/src/components/AuditMissionPanel.tsx) - Mission List

- Displays all active/completed missions
- Mission cards with expand/collapse
- Shows evidence progress per mission
- "OPEN BRIEFING" button links to MissionBriefing

#### [MissionBriefing.tsx](client/src/components/MissionBriefing.tsx) - Mission Details

- Shows full mission context, story background
- ISO control number, chapter name
- Required evidence checklist with progress
- Actor name, location, priority
- "ACCEPT MISSION" / "REVIEW" buttons

#### [EvidenceCollectionDialog.tsx](client/src/components/EvidenceCollectionDialog.tsx) - Evidence Entry

- Select evidence type dropdown
- Enter description, location
- Choose target (which mission)
- Submit to collect

#### [ComplianceEvaluationDialog.tsx](client/src/components/ComplianceEvaluationDialog.tsx) - Mission Verdict

- Radio buttons: Compliant / Non-Compliant / Partial
- Description of each status
- Justification text (required)
- Evidence selector (checkboxes)
- Submit to complete mission

#### [RiskAssessmentDialog.tsx](client/src/components/RiskAssessmentDialog.tsx) - Risk Input

- Probability selector: Low / Medium / High
- Impact selector: Low / Medium / High
- System shows calculated severity
- Recommendation text
- Submit to create risk

#### [EvidenceTab.tsx](client/src/components/EvidenceTab.tsx) - Evidence Review

- Lists all collected evidence
- Shows type, description, verification status
- Can verify/unverify evidence
- Links to which missions/findings

#### [FindingsTab.tsx](client/src/components/FindingsTab.tsx) - Findings List

- Shows all ComplianceFindings
- Compliance status badges
- Evidence count per finding
- Justification text

#### [RiskTab.tsx](client/src/components/RiskTab.tsx) - Risk Summary

- Lists all risk assessments
- Severity indicators (color-coded)
- Probability/Impact matrix visualization
- Summary stats (high/medium/low counts)

#### [PreAuditBriefingDialog.tsx](client/src/components/PreAuditBriefingDialog.tsx) - Campaign Intro

- Shown at campaign start
- Company info: Northbridge Health Group
- Audit objective and primary risks
- Story context and first stake
- "CONTINUE" button to start

---

## Integration Points

### Client → Server Communication

**Network.ts** sends messages:

```
Message.START_MISSION → { missionId }
Message.COMPLETE_MISSION → { missionId, compliance, justification }
Message.ADD_EVIDENCE → { missionId, type, description, location }
Message.VERIFY_EVIDENCE → { evidenceId, verified }
Message.ADD_RISK → { findingId, probability, impact, recommendation }
```

### Server → Client Synchronization

**Colyseus** broadcasts state changes:

```
auditSession updates → completion%, score, status
missions collection → mission added/updated
findings collection → finding added
evidence collection → evidence added
risks collection → risk added
journal array → entry appended
```

**Redux** auto-updates via Network.ts listener hooks

---

## Known Limitations

1. **Single Auditor Model** - System assumes one primary auditor; multi-auditor workflows not fully supported
2. **No Evidence Versioning** - Can't track evidence changes/corrections over time
3. **No Audit Scheduling** - Campaigns must be continuous; can't pause/resume
4. **No Report Customization** - Final report format fixed; no template options
5. **Limited NPC Interactions** - Only 4 NPCs with basic dialogue; extensibility moderate
6. **No Role-Based Viewing** - All players see same information regardless of role
7. **Manual Scoring** - No auto-detection of control compliance from system configs

---

## Future Enhancements

1. **Multi-Auditor Collaboration**
   - Lead auditor approves evidence from junior auditors
   - Real-time collaboration on findings
   - Role-based findings visibility

2. **Dynamic Risk Scoring**
   - ML-based risk prediction from evidence
   - Automatic control strength assessment
   - Risk recommendations engine

3. **Audit Scheduling & Tracking**
   - Campaign pause/resume functionality
   - Time-tracking per mission
   - Scheduled follow-up audits

4. **Extended Report Generation**
   - PDF/DOCX export
   - Custom templates
   - Executive summary generation
   - Recommended remediation timelines

5. **Configuration Management**
   - Custom mission creation
   - Custom control frameworks (SOC2, PCI-DSS, etc.)
   - Organization-specific risk matrices

6. **Gamification**
   - Auditor badges/achievements
   - Leaderboard of audit scores
   - Campaign replays with scoring

7. **Artificial Intelligence**
   - AI-generated interview questions
   - Anomaly detection in logs
   - Smart evidence suggestions

---

## Testing Recommendations

### Unit Tests

- **Scoring algorithm** - Verify score calculations with various compliance mixes
- **Evidence collection** - Check evidence links properly to missions
- **Risk matrix** - Validate probability/impact → severity mapping

### Integration Tests

- **Mission lifecycle** - Start → Collect Evidence → Evaluate → Complete
- **Chapter progression** - Verify chapter transitions unlock correctly
- **Prerequisite enforcement** - Ensure missions can't start before prerequisites
- **Multi-player sync** - Two auditors collecting evidence simultaneously

### UI Tests

- **Dialog flows** - Briefing → Evidence → Compliance → Submit
- **Data display** - Missions, findings, risks show correct data
- **Progress tracking** - Score and completion % update correctly
- **Accessibility** - All controls keyboard accessible

### Gameplay Tests

- **Full campaign** - Complete all 11 missions, verify final score
- **Different compliance mixes** - Compliant/Partial/Non-compliant combinations
- **Team scenarios** - Multiple players in same session

---

## Documentation Files Referenced

- [types/AuditTypes.ts](types/AuditTypes.ts) - Type definitions
- [types/AuditData.ts](types/AuditData.ts) - Mission and NPC data
- [client/src/utils/scoringSystem.ts](client/src/utils/scoringSystem.ts) - Score calculation
- [server/utils/scoringSystem.ts](server/utils/scoringSystem.ts) - Server-side scoring
- [PROJECT_STATUS.md](PROJECT_STATUS.md) - Project health status
- [ANALYSIS.md](ANALYSIS.md) - Technical analysis
