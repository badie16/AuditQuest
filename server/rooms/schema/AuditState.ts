import { Schema, ArraySchema, MapSchema, type } from '@colyseus/schema'
import {
  AuditMission,
  Evidence,
  ComplianceFinding,
  RiskAssessment,
  JournalEntry,
  Notification,
  AuditSession,
} from '../../../types/AuditTypes'

export class MissionSchema extends Schema implements AuditMission {
  @type('string') id = ''
  @type('string') controlId = ''
  @type('string') title = ''
  @type('string') description = ''
  @type('string') status: 'pending' | 'in-progress' | 'completed' = 'pending'
  @type(['string']) prerequisites = new ArraySchema<string>()
  @type(['string']) evidenceRequired = new ArraySchema<string>()
  @type(['string']) collectedEvidence = new ArraySchema<string>() // Track individual evidence items
  @type('number') evidenceCollected = 0 // Computed count for display
  @type('number') completionPercentage = 0
  @type('string') assignedTo = ''
  @type('string') compliance?: 'compliant' | 'non-compliant' | 'partial'
  @type('string') justification?: string
  @type('string') priority: 'low' | 'medium' | 'high' = 'medium'
  @type('string') category = ''
  @type('string') targetObjectId = ''
  @type('string') targetRoom = ''
  @type('string') chapterId = ''
  @type('string') storyContext = ''
  @type('string') actor = ''
  @type('string') consequence = ''
  @type('string') dueDate = ''
  @type('number') createdAt = 0
}

export class EvidenceSchema extends Schema implements Evidence {
  @type('string') id = ''
  @type('string') missionId = ''
  @type('string') type: 'document' | 'log' | 'config' | 'interview' | 'observation' = 'document'
  @type('string') description = ''
  @type('string') location = ''
  @type('number') collectionTime = 0
  @type('string') auditorId = ''
  @type(['string']) attachments = new ArraySchema<string>()
  @type('boolean') verified = false
  @type('string') verifiedBy?: string
  @type('number') verifiedAt?: number
}

export class ComplianceFindingSchema extends Schema implements ComplianceFinding {
  @type('string') id = ''
  @type('string') missionId = ''
  @type('string') status: 'compliant' | 'non-compliant' | 'partial' = 'non-compliant'
  @type(['string']) evidence = new ArraySchema<string>()
  @type('string') justification = ''
  @type('string') auditorId = ''
  @type('number') createdAt = 0
  @type('number') lastModified = 0
  @type('string') notes?: string
}

export class RiskAssessmentSchema extends Schema implements RiskAssessment {
  @type('string') id = ''
  @type('string') findingId = ''
  @type('string') probability: 'low' | 'medium' | 'high' = 'medium'
  @type('string') impact: 'low' | 'medium' | 'high' = 'medium'
  @type('string') severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  @type('string') recommendation = ''
  @type('number') remediationDue?: number
  @type('number') createdAt = 0
  @type('string') assignedTo?: string
}

export class JournalEntrySchema extends Schema implements JournalEntry {
  @type('string') id = ''
  @type('number') timestamp = 0
  @type('string') auditorId = ''
  @type('string') action = ''
  @type('string') details?: string
  @type('string') missionId?: string
  @type('string') findingId?: string
  @type('string') type:
    | 'mission_started'
    | 'mission_completed'
    | 'chapter_transition'
    | 'campaign_completed'
    | 'evidence_collected'
    | 'compliance_evaluated'
    | 'risk_assessed'
    | 'finding_added'
    | 'note_added' = 'mission_started'
}

export class NotificationSchema extends Schema implements Notification {
  @type('string') id = ''
  @type('number') timestamp = 0
  @type('string') type: 'info' | 'success' | 'warning' | 'error' = 'info'
  @type('string') title = ''
  @type('string') message = ''
  @type('string') action?: string
  @type('string') actionUrl?: string
}

export class AuditSessionSchema extends Schema implements AuditSession {
  @type('string') sessionId = ''
  @type('number') startTime = 0
  @type('number') endTime?: number
  @type([MissionSchema]) missions = new ArraySchema<MissionSchema>()
  @type([ComplianceFindingSchema]) findings = new ArraySchema<ComplianceFindingSchema>()
  @type([RiskAssessmentSchema]) risks = new ArraySchema<RiskAssessmentSchema>()
  @type('number') totalScore = 0
  @type('number') completionPercentage = 0
  @type(['string']) auditors = new ArraySchema<string>()
  @type('string') status: 'pending' | 'in-progress' | 'completed' = 'pending'
  @type('string') currentChapterId = ''
  @type('string') currentChapterTitle = ''
  @type('number') currentChapterOrder = 0
  @type('string') campaignResult: 'pass' | 'warning' | 'fail' = 'warning'
  @type('string') campaignConclusion = ''
}
