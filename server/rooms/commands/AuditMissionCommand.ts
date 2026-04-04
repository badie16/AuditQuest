import { Command } from '@colyseus/command'
import { OfficeState } from '../schema/OfficeState'
import { MissionSchema, JournalEntrySchema, ComplianceFindingSchema } from '../schema/AuditState'
import { AUDIT_MISSIONS } from '../../../types/AuditData'
import { AUDIT_SCORING } from '../../../types/AuditTypes'
import { v4 as uuid } from 'uuid'

import { updateAuditSessionMetrics } from '../../utils/scoringSystem'
import { canPerformAction } from '../../utils/authMatrix'

export class InitializeAuditMissionsCommand extends Command<OfficeState> {
  execute() {
    // Initialize audit missions from shared AUDIT_MISSIONS data
    AUDIT_MISSIONS.forEach((data) => {
      const mission = new MissionSchema()
      mission.id = data.id || uuid()
      mission.name = data.title || ''
      mission.description = data.description || ''
      mission.isoControl = data.controlId || ''
      mission.zone = data.category || 'office'
      
      // Story logic: missions with no prerequisites are in-progress, others are pending
      if (data.prerequisites && data.prerequisites.length > 0) {
        mission.status = 'pending'
      } else {
        mission.status = 'in-progress'
      }
      
      mission.priority = data.priority || 'medium'
      mission.targetObjectId = data.targetObjectId || ''
      mission.targetRoom = data.targetRoom || ''
      
      if (data.evidenceRequired) {
        data.evidenceRequired.forEach(req => mission.evidenceRequired.push(req))
      }

      if (data.prerequisites) {
        data.prerequisites.forEach(req => mission.prerequisites.push(req))
      }
      
      mission.createdAt = Date.now()

      this.state.missions.set(mission.id, mission)
    })

    updateAuditSessionMetrics(this.state)

    // Create initial journal entry
    const journalEntry = new JournalEntrySchema()
    journalEntry.id = uuid()
    journalEntry.timestamp = Date.now()
    journalEntry.auditorId = 'system'
    journalEntry.action = 'Audit session initialized'
    journalEntry.type = 'mission_started'

    this.state.journal.push(journalEntry)
  }
}

export class StartMissionCommand extends Command<OfficeState> {
  execute({ client, missionId }: { client: any; missionId: string }) {
    const player = client ? this.state.players.get(client.sessionId) : undefined
    if (!player || !canPerformAction(player.role, 'start_mission')) {
      console.error(`Unauthorized mission start by ${client?.sessionId || 'unknown'}`)
      return
    }

    const mission = this.state.missions.get(missionId)

    if (!mission) {
      console.error(`Mission ${missionId} not found`)
      return
    }

    mission.status = 'in-progress'

    // Add journal entry
    const journalEntry = new JournalEntrySchema()
    journalEntry.id = uuid()
    journalEntry.timestamp = Date.now()
    journalEntry.auditorId = client?.sessionId || 'auditor'
    journalEntry.action = `Started audit mission: ${mission.name}`
    journalEntry.details = `ISO ${mission.isoControl}`
    journalEntry.missionId = missionId
    journalEntry.type = 'mission_started'

    this.state.journal.push(journalEntry)
  }
}

export class CompleteMissionCommand extends Command<OfficeState> {
  execute({ client, missionId, compliance, justification }: {
    client: any
    missionId: string
    compliance: 'compliant' | 'non-compliant' | 'partial'
    justification: string
  }) {
    const player = client ? this.state.players.get(client.sessionId) : undefined
    if (!player || !canPerformAction(player.role, 'complete_mission')) {
      console.error(`Unauthorized mission completion by ${client?.sessionId || 'unknown'}`)
      return
    }

    const mission = this.state.missions.get(missionId)

    if (!mission) {
      console.error(`Mission ${missionId} not found`)
      return
    }

    mission.status = 'completed'
    mission.compliance = compliance
    mission.justification = justification
    mission.completedAt = Date.now()

    // Create a finding
    const finding = new ComplianceFindingSchema()
    finding.id = uuid()
    finding.missionId = missionId
    finding.status = compliance
    finding.justification = justification
    finding.auditorId = client?.sessionId || 'auditor'
    finding.createdAt = Date.now()
    finding.lastModified = Date.now()
    
    // Link evidence from mission
    mission.collectedEvidence.forEach(evId => finding.evidence.push(evId))

    this.state.findings.set(finding.id, finding)

    updateAuditSessionMetrics(this.state)

    // Unlock next missions based on prerequisites
    this.state.missions.forEach((m) => {
      if (m.status === 'pending') {
        // Check if all prerequisites are completed
        const allPrereqsMet = m.prerequisites.every((prereqId) => {
          const prereqMission = this.state.missions.get(prereqId)
          return prereqMission && prereqMission.status === 'completed'
        })

        if (allPrereqsMet) {
          m.status = 'in-progress'
          
          // Notification for new mission
          console.log(`[Audit] Scenario progress: Next mission unlocked: ${m.name}`)
          
          // Add journal entry for unlock
          const unlockEntry = new JournalEntrySchema()
          unlockEntry.id = uuid()
          unlockEntry.timestamp = Date.now()
          unlockEntry.auditorId = 'system'
          unlockEntry.action = `Mission Unlocked: ${m.name}`
          unlockEntry.type = 'mission_started'
          this.state.journal.push(unlockEntry)
        }
      }
    })

    // Add journal entry
    const journalEntry = new JournalEntrySchema()
    journalEntry.id = uuid()
    journalEntry.timestamp = Date.now()
    journalEntry.auditorId = client?.sessionId || 'auditor'
    journalEntry.action = `Completed mission: ${mission.name}`
    journalEntry.details = `Compliance: ${compliance}`
    journalEntry.missionId = missionId
    journalEntry.type = 'mission_completed'

    this.state.journal.push(journalEntry)
  }
}

export class UpdateMissionStatusCommand extends Command<OfficeState> {
  execute({ client, missionId, status }: { client: any; missionId: string; status: 'pending' | 'in-progress' | 'completed' }) {
    const player = client ? this.state.players.get(client.sessionId) : undefined
    if (!player || !canPerformAction(player.role, 'start_mission')) {
      console.error(`Unauthorized mission status update by ${client?.sessionId || 'unknown'}`)
      return
    }
    const mission = this.state.missions.get(missionId)

    if (!mission) {
      console.error(`Mission ${missionId} not found`)
      return
    }

    mission.status = status
  }
}

/**
 * Generate evidence requirements for a control
 */
function generateEvidenceRequirements(controlId: string): string[] {
  const requirements: Record<string, string[]> = {
    'A.5.1': ['Information Security Policy Document', 'Policy Approval Records', 'Distribution Evidence'],
    'A.6.1': ['Organizational Chart', 'Role Definitions', 'Responsibility Matrix'],
    'A.7.1': ['Physical Access Log', 'Access Card Records', 'Security Incident Reports'],
    'A.8.1': ['Operations Procedures Document', 'Change Management Log', 'Incident Response Plan'],
    'A.9.1': ['User Access List', 'Access Request Forms', 'Access Review Reports'],
    'A.9.2': ['User Security Agreement', 'Training Records', 'Acceptable Use Policy'],
    'A.10.1': ['Encryption Policy', 'Key Management Records', 'Encryption Implementation Evidence'],
    'A.11.1': ['Physical Security Controls', 'Entry/Exit Logs', 'Security Barrier Documentation'],
    'A.12.1': ['System Documentation', 'Procedure Manual', 'Configuration Records'],
    'A.14.1': ['Development Security Policy', 'Code Review Records', 'Security Testing Evidence'],
    'A.15.1': ['Vendor Agreements', 'Security Requirements', 'Compliance Verification'],
    'A.16.1': ['Incident Response Plan', 'Incident Log', 'Lessons Learned Records'],
  }

  return requirements[controlId] || ['Documentation', 'Evidence Records', 'Verification']
}

export const auditMissionCommands = [
  InitializeAuditMissionsCommand,
  StartMissionCommand,
  CompleteMissionCommand,
  UpdateMissionStatusCommand,
]
