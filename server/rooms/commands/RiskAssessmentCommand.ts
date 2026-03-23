import { Command } from '@colyseus/command'
import { OfficeState } from '../schema/OfficeState'
import {
  RiskAssessmentSchema,
  JournalEntrySchema,
  NotificationSchema,
} from '../schema/AuditState'
import { RISK_MATRIX } from '../../../types/AuditTypes'
import { v4 as uuid } from 'uuid'

export class CreateRiskAssessmentCommand extends Command<OfficeState> {
  execute(client: any, {
    findingId,
    probability,
    impact,
    recommendation,
    remediationDue,
    assignedTo,
  }: {
    findingId: string
    probability: 'low' | 'medium' | 'high'
    impact: 'low' | 'medium' | 'high'
    recommendation: string
    remediationDue?: number
    assignedTo?: string
  }) {
    const finding = this.state.findings.get(findingId)

    if (!finding) {
      console.error(`Finding ${findingId} not found`)
      return
    }

    // Calculate severity
    const key = `${probability}_${impact}` as keyof typeof RISK_MATRIX
    const severity = RISK_MATRIX[key] || 'medium'

    // Create risk assessment
    const risk = new RiskAssessmentSchema()
    risk.id = uuid()
    risk.findingId = findingId
    risk.probability = probability
    risk.impact = impact
    risk.severity = severity
    risk.recommendation = recommendation
    risk.remediationDue = remediationDue
    risk.createdAt = Date.now()
    if (assignedTo) {
      risk.assignedTo = assignedTo
    }

    this.state.risks.set(risk.id, risk)

    // Add journal entry
    const journalEntry = new JournalEntrySchema()
    journalEntry.id = uuid()
    journalEntry.timestamp = Date.now()
    journalEntry.auditorId = client.sessionId || 'auditor'
    journalEntry.action = 'Assessed risk'
    journalEntry.details = `Severity: ${severity}`
    journalEntry.findingId = findingId
    journalEntry.type = 'risk_assessed'

    this.state.journal.push(journalEntry)

    // Add notification
    const notification = new NotificationSchema()
    notification.id = uuid()
    notification.timestamp = Date.now()
    notification.type = severity === 'high' ? 'error' : severity === 'medium' ? 'warning' : 'info'
    notification.title = 'Risk Assessment'
    notification.message = `${severity.toUpperCase()} - ${recommendation}`

    this.state.notifications.push(notification)

    console.log(`[Audit] Risk assessment for finding ${findingId}: ${severity}`)
  }
}

export class UpdateRiskAssessmentCommand extends Command<OfficeState> {
  execute(client: any, {
    riskId,
    probability,
    impact,
    recommendation,
    remediationDue,
    assignedTo,
  }: {
    riskId: string
    probability?: 'low' | 'medium' | 'high'
    impact?: 'low' | 'medium' | 'high'
    recommendation?: string
    remediationDue?: number
    assignedTo?: string
  }) {
    const risk = this.state.risks.get(riskId)

    if (!risk) {
      console.error(`Risk ${riskId} not found`)
      return
    }

    if (probability) risk.probability = probability
    if (impact) risk.impact = impact

    // Recalculate severity if probability or impact changed
    if (probability || impact) {
      const prob = probability || risk.probability
      const imp = impact || risk.impact
      const key = `${prob}_${imp}` as keyof typeof RISK_MATRIX
      risk.severity = RISK_MATRIX[key] || 'medium'
    }

    if (recommendation) risk.recommendation = recommendation
    if (remediationDue) risk.remediationDue = remediationDue
    if (assignedTo) risk.assignedTo = assignedTo
  }
}

export class RemoveRiskAssessmentCommand extends Command<OfficeState> {
  execute(client: any, { riskId }: { riskId: string }) {
    const risk = this.state.risks.get(riskId)

    if (!risk) {
      console.error(`Risk ${riskId} not found`)
      return
    }

    this.state.risks.delete(riskId)

    // Add journal entry
    const journalEntry = new JournalEntrySchema()
    journalEntry.id = uuid()
    journalEntry.timestamp = Date.now()
    journalEntry.auditorId = client.sessionId || 'auditor'
    journalEntry.action = 'Removed risk assessment'
    journalEntry.findingId = risk.findingId
    journalEntry.type = 'risk_assessed'

    this.state.journal.push(journalEntry)
  }
}

export const riskAssessmentCommands = [
  CreateRiskAssessmentCommand,
  UpdateRiskAssessmentCommand,
  RemoveRiskAssessmentCommand,
]
