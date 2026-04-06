import { Command } from '@colyseus/command'
import { OfficeState } from '../schema/OfficeState'
import {
  MissionSchema,
  JournalEntrySchema,
  ComplianceFindingSchema,
  NotificationSchema,
} from '../schema/AuditState'
import { AUDIT_MISSIONS, STORY_CHAPTERS } from '../../../types/AuditData'
import { AUDIT_SCORING } from '../../../types/AuditTypes'
import { v4 as uuid } from 'uuid'

import { updateAuditSessionMetrics } from '../../utils/scoringSystem'
import { canPerformAction } from '../../utils/authMatrix'

export class InitializeAuditMissionsCommand extends Command<OfficeState> {
  execute() {
    const chapterOrderMap = new Map(STORY_CHAPTERS.map((chapter) => [chapter.id, chapter.order]))
    const firstChapter = [...STORY_CHAPTERS].sort((a, b) => a.order - b.order)[0]

    if (this.state.auditSession && firstChapter) {
      this.state.auditSession.currentChapterId = firstChapter.id
      this.state.auditSession.currentChapterTitle = firstChapter.title
      this.state.auditSession.currentChapterOrder = firstChapter.order
    }

    // Initialize audit missions from shared AUDIT_MISSIONS data
    AUDIT_MISSIONS.forEach((data) => {
      const mission = new MissionSchema()
      mission.id = data.id || uuid()
      mission.title = data.title || ''
      mission.description = data.description || ''
      mission.controlId = data.controlId || ''
      mission.category = data.category || 'general'

      const chapterOrder = chapterOrderMap.get(data.chapterId) || Number.MAX_SAFE_INTEGER
      const isFirstChapterMission = !!firstChapter && chapterOrder === firstChapter.order

      // Story-first logic: only first chapter can start; next chapters remain locked.
      if (!isFirstChapterMission || (data.prerequisites && data.prerequisites.length > 0)) {
        mission.status = 'pending'
      } else {
        mission.status = 'in-progress'
      }

      mission.priority = data.priority || 'medium'
      mission.targetObjectId = data.targetObjectId || ''
      mission.targetRoom = data.targetRoom || ''
      mission.chapterId = data.chapterId || ''
      mission.storyContext = data.storyContext || ''
      mission.actor = data.actor || ''
      mission.consequence = data.consequence || ''

      if (data.evidenceRequired) {
        data.evidenceRequired.forEach((req) => mission.evidenceRequired.push(req))
      }

      if (data.prerequisites) {
        data.prerequisites.forEach((req) => mission.prerequisites.push(req))
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
    journalEntry.action = `Started audit mission: ${mission.title}`
    journalEntry.details = `ISO ${mission.controlId}`
    journalEntry.missionId = missionId
    journalEntry.type = 'mission_started'

    this.state.journal.push(journalEntry)
  }
}

export class CompleteMissionCommand extends Command<OfficeState> {
  execute({
    client,
    missionId,
    compliance,
    justification,
  }: {
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
    mission.collectedEvidence.forEach((evId) => finding.evidence.push(evId))

    this.state.findings.set(finding.id, finding)

    updateAuditSessionMetrics(this.state)

    unlockMissionsForCurrentChapter(this.state)
    progressStoryIfChapterCompleted(this.state, missionId)
    finalizeCampaignIfCompleted(this.state)

    // Add journal entry
    const journalEntry = new JournalEntrySchema()
    journalEntry.id = uuid()
    journalEntry.timestamp = Date.now()
    journalEntry.auditorId = client?.sessionId || 'auditor'
    journalEntry.action = `Completed mission: ${mission.title}`
    journalEntry.details = `Compliance: ${compliance}`
    journalEntry.missionId = missionId
    journalEntry.type = 'mission_completed'

    this.state.journal.push(journalEntry)
  }
}

function areMissionPrerequisitesMet(state: OfficeState, mission: MissionSchema): boolean {
  return mission.prerequisites.every((prereqId) => {
    const prereqMission = state.missions.get(prereqId)
    return prereqMission && prereqMission.status === 'completed'
  })
}

function unlockMissionsForCurrentChapter(state: OfficeState): void {
  const currentChapterId = state.auditSession?.currentChapterId
  state.missions.forEach((mission) => {
    if (mission.status !== 'pending') return
    if (currentChapterId && mission.chapterId !== currentChapterId) return
    if (!areMissionPrerequisitesMet(state, mission)) return

    mission.status = 'in-progress'

    const unlockEntry = new JournalEntrySchema()
    unlockEntry.id = uuid()
    unlockEntry.timestamp = Date.now()
    unlockEntry.auditorId = 'system'
    unlockEntry.action = `Mission Unlocked: ${mission.title}`
    unlockEntry.type = 'mission_started'
    state.journal.push(unlockEntry)
  })
}

function progressStoryIfChapterCompleted(state: OfficeState, completedMissionId: string): void {
  const completedMission = state.missions.get(completedMissionId)
  if (!completedMission || !completedMission.chapterId || !state.auditSession) return

  const currentChapterId = state.auditSession.currentChapterId || completedMission.chapterId
  const chapterOrderMap = new Map(STORY_CHAPTERS.map((chapter) => [chapter.id, chapter.order]))
  const currentOrder = chapterOrderMap.get(currentChapterId)

  if (!currentOrder) return

  let chapterMissionCount = 0
  let chapterCompletedCount = 0
  let chapterEvidenceCount = 0

  state.missions.forEach((mission) => {
    if (mission.chapterId !== currentChapterId) return
    chapterMissionCount++
    chapterEvidenceCount += mission.collectedEvidence.length
    if (mission.status === 'completed') chapterCompletedCount++
  })

  if (chapterMissionCount === 0 || chapterCompletedCount !== chapterMissionCount) {
    return
  }

  const nextChapter = STORY_CHAPTERS.find((chapter) => chapter.order === currentOrder + 1)
  if (!nextChapter) return

  state.auditSession.currentChapterId = nextChapter.id
  state.auditSession.currentChapterTitle = nextChapter.title
  state.auditSession.currentChapterOrder = nextChapter.order

  unlockMissionsForCurrentChapter(state)

  const transitionEntry = new JournalEntrySchema()
  transitionEntry.id = uuid()
  transitionEntry.timestamp = Date.now()
  transitionEntry.auditorId = 'system'
  transitionEntry.action = `Chapter Transition: ${nextChapter.title}`
  transitionEntry.details = `Previous chapter completed (${chapterCompletedCount}/${chapterMissionCount} missions, ${chapterEvidenceCount} evidence collected).`
  transitionEntry.type = 'chapter_transition'
  state.journal.push(transitionEntry)

  const notification = new NotificationSchema()
  notification.id = uuid()
  notification.timestamp = Date.now()
  notification.type = 'info'
  notification.title = `Chapter ${nextChapter.order} Unlocked`
  notification.message = `Next objective: ${nextChapter.summary}`
  state.notifications.push(notification)
}

function finalizeCampaignIfCompleted(state: OfficeState): void {
  if (!state.auditSession) return
  if (state.auditSession.status === 'completed' && state.auditSession.campaignConclusion) return

  const totalMissions = state.missions.size
  if (totalMissions === 0) return

  let completedMissions = 0
  state.missions.forEach((mission) => {
    if (mission.status === 'completed') completedMissions++
  })

  if (completedMissions !== totalMissions) return

  state.auditSession.status = 'completed'
  state.auditSession.endTime = Date.now()

  const score = state.auditSession.totalScore || 0
  if (score >= 80) {
    state.auditSession.campaignResult = 'pass'
    state.auditSession.campaignConclusion =
      'The audit team delivered a robust evidence trail and demonstrated strong control maturity before external certification.'
  } else if (score >= 55) {
    state.auditSession.campaignResult = 'warning'
    state.auditSession.campaignConclusion =
      'The audit identified meaningful control gaps. The organization can progress, but corrective actions are required before certification confidence is acceptable.'
  } else {
    state.auditSession.campaignResult = 'fail'
    state.auditSession.campaignConclusion =
      'Critical weaknesses remain unresolved. Leadership must execute urgent remediation before the external review can be considered safe.'
  }

  const endEntry = new JournalEntrySchema()
  endEntry.id = uuid()
  endEntry.timestamp = Date.now()
  endEntry.auditorId = 'system'
  endEntry.action = 'Campaign Completed'
  endEntry.details = `Final score: ${score}/100. ${state.auditSession.campaignConclusion}`
  endEntry.type = 'campaign_completed'
  state.journal.push(endEntry)

  const notification = new NotificationSchema()
  notification.id = uuid()
  notification.timestamp = Date.now()
  notification.type = score >= 80 ? 'success' : score >= 55 ? 'warning' : 'error'
  notification.title = 'Audit Campaign Completed'
  notification.message = `Final score ${score}/100. Review the campaign conclusion in Overview.`
  state.notifications.push(notification)
}

export class UpdateMissionStatusCommand extends Command<OfficeState> {
  execute({
    client,
    missionId,
    status,
  }: {
    client: any
    missionId: string
    status: 'pending' | 'in-progress' | 'completed'
  }) {
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
    'A.5.1': [
      'Information Security Policy Document',
      'Policy Approval Records',
      'Distribution Evidence',
    ],
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
