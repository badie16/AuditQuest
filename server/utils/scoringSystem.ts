import { OfficeState } from '../rooms/schema/OfficeState'
import { AUDIT_SCORING, DOMAIN_MAPPING } from '../../types/AuditTypes'

export function updateAuditSessionMetrics(state: OfficeState) {
  const totalMissions = state.missions.size
  let completedMissions = 0
  
  // Track domain scores: domains -> { totalControls, scoreSum }
  const domainTracker: Record<string, { totalControls: number, scoreSum: number }> = {}

  state.missions.forEach((mission: any) => {
    if (mission.status !== 'completed') return
    completedMissions++
    
    // 1. Identify Domain
    const domainKey = mission.category || 'default'
    
    if (!domainTracker[domainKey]) {
      domainTracker[domainKey] = { totalControls: 0, scoreSum: 0 }
    }
    
    domainTracker[domainKey].totalControls++
    
    // 2. Base rating per control
    let controlScore = AUDIT_SCORING.CONTROL_COMPLIANT
    if (mission.compliance === 'non-compliant') {
      controlScore = AUDIT_SCORING.CONTROL_NON_COMPLIANT
    } else if (mission.compliance === 'partial') {
      controlScore = AUDIT_SCORING.CONTROL_PARTIAL
    }
    
    // 3. Find Risks for this mission to penalize
    let riskPenalty = 0
    state.findings.forEach((finding: any) => {
      if (finding.missionId === mission.id) {
        state.risks.forEach((risk: any) => {
          if (risk.findingId === finding.id) {
            if (risk.severity === 'critical') riskPenalty += AUDIT_SCORING.PENALTY_CRITICAL_RISK
            if (risk.severity === 'high') riskPenalty += AUDIT_SCORING.PENALTY_HIGH_RISK
            if (risk.severity === 'medium') riskPenalty += AUDIT_SCORING.PENALTY_MEDIUM_RISK
            if (risk.severity === 'low') riskPenalty += AUDIT_SCORING.PENALTY_LOW_RISK
          }
        })
      }
    })
    
    // 4. Apply penalty to the control score (preventing it from dropping below 0)
    controlScore = Math.max(0, controlScore + riskPenalty)
    
    domainTracker[domainKey].scoreSum += controlScore
  })

  // 5. Calculate weighted final score across domains
  let weightedTotal = 0
  let weightsUsed = 0
  
  Object.keys(domainTracker).forEach(key => {
    const data = domainTracker[key]
    const weight = (DOMAIN_MAPPING[key] || DOMAIN_MAPPING['default']).weight
    
    // Average score for this domain out of 10
    const domainAvg = data.scoreSum / data.totalControls
    
    weightedTotal += domainAvg * weight
    weightsUsed += weight
  })
  
  let finalScore = 100
  if (weightsUsed > 0) {
    const normalizedOutOf10 = weightedTotal / weightsUsed
    finalScore = normalizedOutOf10 * 10 // scale 0-10 to 0-100
  }
  
  finalScore = Math.round(finalScore)

  if (state.auditSession) {
    state.auditSession.totalScore = Math.max(AUDIT_SCORING.MIN_SCORE, Math.min(AUDIT_SCORING.MAX_SCORE, finalScore))
    state.auditSession.completionPercentage = totalMissions > 0 ? Math.round((completedMissions / totalMissions) * 100) : 0
    
    if (completedMissions === totalMissions && totalMissions > 0) {
      state.auditSession.status = 'completed'
      state.auditSession.endTime = Date.now()
    }
  }
}
