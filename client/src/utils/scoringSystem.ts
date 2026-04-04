import { AUDIT_SCORING, RISK_MATRIX } from '../../../types/AuditTypes'
import type { AuditMission, ComplianceFinding, RiskAssessment, Evidence } from '../../../types/AuditTypes'

import { DOMAIN_MAPPING } from '../../../types/AuditTypes'

/**
 * Calculate completion percentage
 */
export function calculateCompletionPercentage(
  completedMissions: number,
  totalMissions: number,
  collectedEvidence: number,
  requiredEvidence: number,
  findingsIdentified: number,
  expectedFindings: number,
): number {
  const missionCompletion = totalMissions > 0 ? (completedMissions / totalMissions) * 100 : 0
  const evidenceCompletion = requiredEvidence > 0 ? (collectedEvidence / requiredEvidence) * 100 : 0
  const findingCompletion = expectedFindings > 0 ? (findingsIdentified / expectedFindings) * 100 : 0

  return Math.round((missionCompletion + evidenceCompletion + findingCompletion) / 3)
}

/**
 * Determine risk severity based on probability and impact
 */
export function calculateRiskSeverity(
  probability: 'low' | 'medium' | 'high',
  impact: 'low' | 'medium' | 'high',
): 'low' | 'medium' | 'high' | 'critical' {
  const key = `${probability}_${impact}` as keyof typeof RISK_MATRIX
  return (RISK_MATRIX[key] as any) || 'medium'
}

/**
 * Get risk matrix color for visualization
 */
export function getRiskMatrixColor(severity: 'low' | 'medium' | 'high'): string {
  const colors = {
    low: '#4CAF50',
    medium: '#FFC107',
    high: '#F44336',
  }
  return colors[severity] || '#9E9E9E'
}

/**
 * Calculate audit summary statistics
 */
export function getAuditSummary(params: {
  missions: AuditMission[]
  findings: ComplianceFinding[]
  risks: RiskAssessment[]
  evidence: Evidence[]
}): {
  totalMissions: number
  completedMissions: number
  compliantCount: number
  nonCompliantCount: number
  partialCount: number
  highRiskCount: number
  mediumRiskCount: number
  lowRiskCount: number
  totalEvidence: number
  averageEvidencePerMission: number
} {
  const completed = params.missions.filter((m) => m.status === 'completed')
  const compliant = params.findings.filter((f) => f.status === 'compliant')
  const nonCompliant = params.findings.filter((f) => f.status === 'non-compliant')
  const partial = params.findings.filter((f) => f.status === 'partial')

  const highRisk = params.risks.filter((r) => r.severity === 'high')
  const mediumRisk = params.risks.filter((r) => r.severity === 'medium')
  const lowRisk = params.risks.filter((r) => r.severity === 'low')

  return {
    totalMissions: params.missions.length,
    completedMissions: completed.length,
    compliantCount: compliant.length,
    nonCompliantCount: nonCompliant.length,
    partialCount: partial.length,
    highRiskCount: highRisk.length,
    mediumRiskCount: mediumRisk.length,
    lowRiskCount: lowRisk.length,
    totalEvidence: params.evidence.length,
    averageEvidencePerMission:
      params.missions.length > 0 ? Math.round((params.evidence.length / params.missions.length) * 100) / 100 : 0,
  }
}

/**
 * Calculate security auditor 6-step breakdown with granular mission data
 */
export function calculateScoreBreakdown(params: {
  missions: AuditMission[]
  findings: ComplianceFinding[]
  risks: RiskAssessment[]
}) {
  const domainMissionCounts: Record<string, number> = {}
  
  // First pass: count missions per domain
  params.missions.forEach(m => {
    const domainKey = m.category || 'default'
    domainMissionCounts[domainKey] = (domainMissionCounts[domainKey] || 0) + 1
  })

  const missionResults: any[] = []
  let weightedTotalScore = 0

  params.missions.forEach((mission) => {
    // 1. Identify Domain & Weight
    const domainKey = mission.category || 'default'
    const domainMapping = DOMAIN_MAPPING[domainKey] || DOMAIN_MAPPING['default']
    const missionCountInDomain = domainMissionCounts[domainKey]
    
    // Mission's share of the total 100 points
    // If domain weight is 0.4 and there are 2 missions, each is 0.2 of the total score (20 points)
    const missionWeightPercent = (domainMapping.weight / missionCountInDomain) * 100
    
    // 2. Base rating per control
    let baseRating = 0
    if (mission.status === 'completed') {
      baseRating = 10
      if (mission.compliance === 'non-compliant') baseRating = 0
      else if (mission.compliance === 'partial') baseRating = 5
    } else if (mission.status === 'in-progress') {
      baseRating = 6 // Partial credit for work in progress as seen in user mockup
    } else {
      baseRating = 3 // Starting credit for pending as seen in user mockup
    }
    
    // 3. Find Risks for this mission to penalize
    let riskPenalty = 0
    const finding = params.findings.find(f => f.missionId === mission.id)
    if (finding) {
      params.risks.forEach((risk) => {
        if (risk.findingId === finding.id) {
          if (risk.severity === 'critical') riskPenalty += AUDIT_SCORING.PENALTY_CRITICAL_RISK
          if (risk.severity === 'high') riskPenalty += AUDIT_SCORING.PENALTY_HIGH_RISK
          if (risk.severity === 'medium') riskPenalty += AUDIT_SCORING.PENALTY_MEDIUM_RISK
          if (risk.severity === 'low') riskPenalty += AUDIT_SCORING.PENALTY_LOW_RISK
        }
      })
    }
    
    // 4. Net score = max(0, base - penalty)
    const netRating = Math.max(0, baseRating + riskPenalty)
    const contribution = (netRating / 10) * missionWeightPercent
    
    weightedTotalScore += contribution
    
    missionResults.push({
      id: mission.id,
      name: mission.title,
      domain: domainMapping.name,
      status: mission.status,
      weight: missionWeightPercent,
      finding: finding ? finding.status : 'compliant',
      rating: netRating,
      score: contribution
    })
  })
  
  return {
    missionResults,
    finalScore: Math.round(weightedTotalScore)
  }
}

/**
 * Get performance grade based on score using Security Standards
 */
export function getPerformanceGrade(score: number): { grade: string; description: string; color: string } {
  if (score >= 90) {
    return {
      grade: 'Excellent',
      description: 'Low Risk - Strong information security posture',
      color: '#4CAF50',
    }
  }
  if (score >= 70) {
    return {
      grade: 'Good',
      description: 'Moderate Risk - Adequate security controls with some gaps',
      color: '#8BC34A',
    }
  }
  if (score >= 50) {
    return {
      grade: 'High Risk',
      description: 'High Risk - Multiple concerning security gaps identified',
      color: '#FF9800',
    }
  }
  return {
    grade: 'Critical Risk',
    description: 'Critical Risk - Severe organizational vulnerabilities present',
    color: '#F44336',
  }
}

/**
 * Generate recommendations based on findings
 */
export function generateRecommendations(findings: ComplianceFinding[]): string[] {
  const recommendations: string[] = []
  const nonCompliant = findings.filter((f) => f.status === 'non-compliant')

  nonCompliant.forEach((finding, index) => {
    recommendations.push(`Address finding ${index + 1}: ${finding.justification}`)
  })

  if (recommendations.length === 0) {
    recommendations.push('Maintain current security posture and conduct periodic reviews')
  }

  return recommendations
}

/**
 * Calculate compliance percentage
 */
export function calculateCompliancePercentage(findings: ComplianceFinding[]): number {
  if (findings.length === 0) return 100

  const compliant = findings.filter((f) => f.status === 'compliant')
  return Math.round((compliant.length / findings.length) * 100)
}
