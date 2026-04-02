import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  AuditMission,
  Evidence,
  ComplianceFinding,
  RiskAssessment,
  JournalEntry,
  Notification,
  AuditState,
  AuditStatus,
} from '../../../types/AuditTypes'

const initialState: AuditState = {
  sessionId: '',
  currentMission: undefined,
  activeMissions: [],
  completedMissions: [],
  collectedEvidence: [],
  findings: [],
  riskAssessments: [],
  auditScore: 100,
  progressPercentage: 0,
  auditJournal: [],
  notifications: [],
  status: 'pending',
  startedAt: 0,
  hudOpen: true,
  evidenceDialogOpen: false,
  evidenceTargetName: '',
  evidenceTargetId: '',
  complianceDialogOpen: false,
  selectedMissionId: '',
  activeTab: 'overview',
}

const auditSlice = createSlice({
  name: 'audit',
  initialState,
  reducers: {
    openEvidenceDialog: (
      state,
      action: PayloadAction<{ targetName: string; targetId: string }>
    ) => {
      state.evidenceDialogOpen = true
      state.evidenceTargetName = action.payload.targetName
      state.evidenceTargetId = action.payload.targetId
    },

    closeEvidenceDialog: (state) => {
      state.evidenceDialogOpen = false
      state.evidenceTargetName = ''
      state.evidenceTargetId = ''
    },

    openComplianceDialog: (state, action: PayloadAction<string>) => {
      state.complianceDialogOpen = true
      state.selectedMissionId = action.payload
    },

    closeComplianceDialog: (state) => {
      state.complianceDialogOpen = false
      state.selectedMissionId = ''
    },
    // Session management
    initializeAuditSession: (
      state,
      action: PayloadAction<{
        sessionId: string
        auditName?: string
        organization?: string
        auditScope?: string
        status?: AuditStatus
        startDate?: string
        endDate?: string
        missions?: AuditMission[]
      }>
    ) => {
      state.sessionId = action.payload.sessionId
      // ONLY update missions if they are explicitly provided in the payload
      if (action.payload.missions) {
        state.activeMissions = action.payload.missions
      }
      state.status = action.payload.status || 'in-progress'
      state.startedAt = action.payload.startDate
        ? new Date(action.payload.startDate).getTime()
        : Date.now()
      // Don't reset score/progress if session is already initialized
      if (!state.auditScore) state.auditScore = 100
      if (!state.progressPercentage) state.progressPercentage = 0
    },

    completeAuditSession: (state) => {
      state.status = 'completed'
      state.completedAt = Date.now()
    },

    // Mission management
    setCurrentMission: (state, action: PayloadAction<AuditMission | undefined>) => {
      state.currentMission = action.payload
      if (action.payload) {
        state.activeMissions =
          state.activeMissions?.filter((m) => m.id !== action.payload?.id) || []
        state.activeMissions.unshift(action.payload)
      }
    },

    startMission: (state, action: PayloadAction<AuditMission>) => {
      const mission = action.payload
      if (!mission) return

      mission.status = 'in-progress'
      state.currentMission = mission
      state.activeMissions = state.activeMissions?.filter((m) => m.id !== mission.id) || []
      state.activeMissions.unshift(mission)

      state.auditJournal = state.auditJournal || []
      state.auditJournal.push({
        id: `entry_${Date.now()}`,
        timestamp: Date.now(),
        auditorId: 'current_auditor',
        action: `Started audit mission: ${mission.title}`,
        details: `ISO ${mission.controlId}`,
        missionId: mission.id,
        type: 'mission_started',
      })
    },

    completeMission: (state, action: PayloadAction<AuditMission>) => {
      const mission = action.payload
      if (!mission) return

      mission.status = 'completed'

      state.completedMissions = state.completedMissions || []
      // Avoid duplicates
      if (!state.completedMissions.find((m) => m.id === mission.id)) {
        state.completedMissions.push(mission)
      }

      state.activeMissions = state.activeMissions?.filter((m) => m.id !== mission.id) || []
      state.currentMission = undefined

      state.auditJournal = state.auditJournal || []
      state.auditJournal.push({
        id: `entry_${Date.now()}`,
        timestamp: Date.now(),
        auditorId: 'current_auditor',
        action: `Completed audit mission: ${mission.title}`,
        details: `Status: ${mission.status}`,
        missionId: mission.id,
        type: 'mission_completed',
      })

      const totalMissions =
        (state.completedMissions.length || 0) + (state.activeMissions?.length || 0)
      state.progressPercentage =
        totalMissions > 0 ? Math.round((state.completedMissions.length / totalMissions) * 100) : 0
    },

    updateMissionStatus: (
      state,
      action: PayloadAction<{ missionId: string; status: AuditStatus }>
    ) => {
      const { missionId, status } = action.payload

      // Look in active missions
      const missionIdx = state.activeMissions?.findIndex((m) => m.id === missionId)

      if (missionIdx !== -1 && state.activeMissions) {
        const mission = state.activeMissions[missionIdx]
        mission.status = status

        if (status === 'completed') {
          state.completedMissions = state.completedMissions || []
          // Avoid duplicates in completed list
          if (!state.completedMissions.find((m) => m.id === missionId)) {
            state.completedMissions.push(mission)
          }
          state.activeMissions.splice(missionIdx, 1)
        }
      } else {
        // Check if it's already in completed missions (maybe redundant but safe)
        const completedMission = state.completedMissions?.find((m) => m.id === missionId)
        if (completedMission) {
          completedMission.status = status
        }
      }
    },

    updateMissionEvidence: (
      state,
      action: PayloadAction<{ missionId: string; evidenceCount: number }>
    ) => {
      const { missionId, evidenceCount } = action.payload
      // Check active missions
      const activeMission = state.activeMissions?.find((m) => m.id === missionId)
      if (activeMission) {
        activeMission.evidenceCollected = evidenceCount
      }
      // Also check completed missions just in case
      const completedMission = state.completedMissions?.find((m) => m.id === missionId)
      if (completedMission) {
        completedMission.evidenceCollected = evidenceCount
      }
    },

    // Evidence management
    addEvidence: (state, action: PayloadAction<Evidence>) => {
      const evidence = action.payload
      if (!evidence) return

      state.collectedEvidence = state.collectedEvidence || []
      // Avoid duplicates
      if (!state.collectedEvidence.find((e) => e.id === evidence.id)) {
        state.collectedEvidence.push(evidence)
      }
      console.log('Collected Evidence:', state.collectedEvidence)
      // Update evidence list in BOTH active and completed missions
      const activeMission = state.activeMissions?.find((m) => m.id === evidence.missionId)
      if (activeMission) {
        console.log('Adding evidence to active mission:', activeMission)
        activeMission.evidenceCollected = (activeMission.evidenceCollected || 0) + 1
      }

      const completedMission = state.completedMissions?.find((m) => m.id === evidence.missionId)
      if (completedMission) {
        completedMission.evidenceCollected = (completedMission.evidenceCollected || 0) + 1
      }

      state.auditJournal = state.auditJournal || []
      state.auditJournal.push({
        id: `entry_${Date.now()}`,
        timestamp: Date.now(),
        auditorId: evidence.auditorId,
        action: 'Collected evidence',
        details: `${evidence.type}: ${evidence.description}`,
        missionId: evidence.missionId,
        type: 'evidence_collected',
      })
    },

    removeEvidence: (state, action: PayloadAction<string>) => {
      state.collectedEvidence =
        state.collectedEvidence?.filter((e) => e.id !== action.payload) || []
    },

    updateEvidenceVerification: (
      state,
      action: PayloadAction<{
        evidenceId: string
        verified: boolean
        verifiedBy?: string
        verifiedAt?: number
      }>
    ) => {
      const targetEvidence = state.collectedEvidence?.find(
        (e) => e.id === action.payload.evidenceId
      )
      if (!targetEvidence) return

      targetEvidence.verified = action.payload.verified
      targetEvidence.verifiedBy = action.payload.verifiedBy
      targetEvidence.verifiedAt = action.payload.verifiedAt
    },

    // Compliance findings
    addFinding: (state, action: PayloadAction<ComplianceFinding>) => {
      const finding = action.payload
      if (!finding) return

      state.findings = state.findings || []
      state.findings.push(finding)

      state.auditJournal = state.auditJournal || []
      state.auditJournal.push({
        id: `entry_${Date.now()}`,
        timestamp: Date.now(),
        auditorId: finding.auditorId,
        action: 'Added compliance finding',
        details: `Status: ${finding.status}`,
        findingId: finding.id,
        type: 'finding_added',
      })
    },

    updateFinding: (state, action: PayloadAction<ComplianceFinding>) => {
      const idx = state.findings?.findIndex((f) => f.id === action.payload.id)
      if (idx !== -1 && state.findings) {
        state.findings[idx] = action.payload
      }
    },

    // Risk assessments
    addRiskAssessment: (state, action: PayloadAction<RiskAssessment>) => {
      const risk = action.payload
      if (!risk) return

      state.riskAssessments = state.riskAssessments || []
      state.riskAssessments.push(risk)

      state.auditJournal = state.auditJournal || []
      state.auditJournal.push({
        id: `entry_${Date.now()}`,
        timestamp: Date.now(),
        auditorId: 'current_auditor',
        action: 'Assessed risk',
        details: `Severity: ${risk.severity}`,
        findingId: risk.findingId,
        type: 'risk_assessed',
      })
    },

    updateRiskAssessment: (state, action: PayloadAction<RiskAssessment>) => {
      const idx = state.riskAssessments?.findIndex((r) => r.id === action.payload.id)
      if (idx !== -1 && state.riskAssessments) {
        state.riskAssessments[idx] = action.payload
      }
    },

    // Journal management
    addJournalEntry: (state, action: PayloadAction<JournalEntry>) => {
      state.auditJournal = state.auditJournal || []
      state.auditJournal.push(action.payload)
    },

    // Notification management
    addNotificationToState: (state, action: PayloadAction<Notification>) => {
      state.notifications = state.notifications || []
      state.notifications.push(action.payload)
    },

    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications?.filter((n) => n.id !== action.payload) || []
    },

    clearNotifications: (state) => {
      state.notifications = []
    },

    // Score management
    updateAuditScore: (state, action: PayloadAction<number>) => {
      state.auditScore = Math.max(0, Math.min(100, action.payload))
    },

    // Reset audit session
    resetAuditSession: (state) => {
      Object.assign(state, initialState)
    },

    // UI Control
    toggleAuditHUD: (state) => {
      state.hudOpen = !state.hudOpen
    },

    setActiveTab: (
      state,
      action: PayloadAction<'overview' | 'missions' | 'findings' | 'risks' | 'journal'>
    ) => {
      state.activeTab = action.payload
    },

    addMission: (state, action: PayloadAction<AuditMission>) => {
      state.activeMissions = state.activeMissions || []
      if (action.payload) {
        // Avoid duplicates
        if (
          !state.activeMissions.find((m) => m.id === action.payload.id) &&
          !state.completedMissions?.find((m) => m.id === action.payload.id)
        ) {
          state.activeMissions.push(action.payload)
        }
      }
    },
  },
})

export const {
  initializeAuditSession,
  completeAuditSession,
  setCurrentMission,
  startMission,
  completeMission,
  updateMissionStatus,
  updateMissionEvidence,
  addEvidence,
  removeEvidence,
  updateEvidenceVerification,
  addFinding,
  updateFinding,
  addRiskAssessment,
  updateRiskAssessment,
  addJournalEntry,
  addNotificationToState,
  removeNotification,
  clearNotifications,
  updateAuditScore,
  resetAuditSession,
  toggleAuditHUD,
  setActiveTab,
  addMission,
  openEvidenceDialog,
  closeEvidenceDialog,
} = auditSlice.actions

export default auditSlice.reducer
