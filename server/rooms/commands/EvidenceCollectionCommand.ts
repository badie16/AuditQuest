import { Command } from '@colyseus/command'
import { OfficeState } from '../schema/OfficeState'
import { EvidenceSchema, JournalEntrySchema, NotificationSchema } from '../schema/AuditState'
import { v4 as uuid } from 'uuid'

export class CollectEvidenceCommand extends Command<OfficeState> {
  execute({
    client,
    missionId,
    type,
    description,
    location,
  }: {
    client: any
    missionId: string
    type: 'document' | 'log' | 'config' | 'interview' | 'observation'
    description: string
    location: string
  }) {
    const mission = this.state.missions.get(missionId)

    if (!mission) {
      console.error(`Mission ${missionId} not found`)
      return
    }

    // Create evidence record
    const evidence = new EvidenceSchema()
    evidence.id = uuid()
    evidence.missionId = missionId
    evidence.type = type
    evidence.description = description
    evidence.location = location
    evidence.collectionTime = Date.now()
    evidence.auditorId = client.sessionId || 'auditor'
    evidence.verified = false

    this.state.evidence.set(evidence.id, evidence)

    // Add to mission's collected evidence
    if (!mission.collectedEvidence.includes(evidence.id)) {
      mission.collectedEvidence.push(evidence.id)
    }

    // Add journal entry
    const journalEntry = new JournalEntrySchema()
    journalEntry.id = uuid()
    journalEntry.timestamp = Date.now()
    journalEntry.auditorId = client.sessionId || 'auditor'
    journalEntry.action = 'Collected evidence'
    journalEntry.details = `${type}: ${description}`
    journalEntry.missionId = missionId
    journalEntry.type = 'evidence_collected'

    this.state.journal.push(journalEntry)

    // Add notification
    const notification = new NotificationSchema()
    notification.id = uuid()
    notification.timestamp = Date.now()
    notification.type = 'success'
    notification.title = 'Evidence Collected'
    notification.message = `${type}: ${description}`

    this.state.notifications.push(notification)

    console.log(`[Audit] Evidence collected for mission ${missionId}: ${description}`)
  }
}

export class VerifyEvidenceCommand extends Command<OfficeState> {
  execute({ client, evidenceId, verified }: { client: any; evidenceId: string; verified: boolean }) {
    const evidence = this.state.evidence.get(evidenceId)

    if (!evidence) {
      console.error(`Evidence ${evidenceId} not found`)
      return
    }

    evidence.verified = verified
    if (verified) {
      evidence.verifiedBy = client?.sessionId || 'auditor'
      evidence.verifiedAt = Date.now()
    }
  }
}

export class RemoveEvidenceCommand extends Command<OfficeState> {
  execute({ client, evidenceId }: { client: any; evidenceId: string }) {
    const evidence = this.state.evidence.get(evidenceId)

    if (!evidence) {
      console.error(`Evidence ${evidenceId} not found`)
      return
    }

    // Remove from mission
    const mission = this.state.missions.get(evidence.missionId)
    if (mission) {
      mission.collectedEvidence = mission.collectedEvidence.filter((id) => id !== evidenceId)
    }

    // Remove evidence
    this.state.evidence.delete(evidenceId)

    // Add journal entry
    const journalEntry = new JournalEntrySchema()
    journalEntry.id = uuid()
    journalEntry.timestamp = Date.now()
    journalEntry.auditorId = client?.sessionId || 'auditor'
    journalEntry.action = 'Removed evidence'
    journalEntry.details = `Removed: ${evidence.description}`
    journalEntry.type = 'evidence_collected'

    this.state.journal.push(journalEntry)
  }
}

export const evidenceCommands = [CollectEvidenceCommand, VerifyEvidenceCommand, RemoveEvidenceCommand]
