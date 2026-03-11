import { AUDIT_SCORING, RISK_MATRIX } from '../../../types/AuditTypes'
import type { AuditMission, ComplianceFinding, RiskAssessment, Evidence } from '../../../types/AuditTypes'

/**
 * Calculate audit score based on missions completed and findings
 */
export function calculateAuditScore(params: {
  completedMissions: number
  totalMissions: number
  nonCompliantFindings: number
  incompleteEvidence: number
  hasDocumentation: boolean
}): number {
  let score = AUDIT_SCORING.BASE_SCORE

  // Add points for each mission audited
  score += params.completedMissions * AUDIT_SCORING.CONTROL_AUDITED

  // Deduct for non-compliant findings
  score += params.nonCompliantFindings * AUDIT_SCORING.NON_COMPLIANT_PENALTY

  // Deduct for incomplete evidence
  score += params.incompleteEvidence * AUDIT_SCORING.INCOMPLETE_EVIDENCE_PENALTY

  // Add bonus for thorough documentation
  if (params.hasDocumentation) {
    score += AUDIT_SCORING.THOROUGH_DOCUMENTATION_BONUS
  }

  // Cap score between min and max
  return Math.max(AUDIT_SCORING.MIN_SCORE, Math.min(AUDIT_SCORING.MAX_SCORE, score))
}

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
): 'low' | 'medium' | 'high' {
  const key = `${probability}_${impact}` as keyof typeof RISK_MATRIX
  return RISK_MATRIX[key] || 'medium'
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
 * Get performance grade based on score
 */
export function getPerformanceGrade(score: number): { grade: string; description: string; color: string } {
  if (score >= 90) {
    return {
      grade: 'A',
      description: 'Excellent - Strong information security posture',
      color: '#4CAF50',
    }
  }
  if (score >= 80) {
    return {
      grade: 'B',
      description: 'Good - Adequate security controls in place',
      color: '#8BC34A',
    }
  }
  if (score >= 70) {
    return {
      grade: 'C',
      description: 'Satisfactory - Some security gaps identified',
      color: '#FFC107',
    }
  }
  if (score >= 60) {
    return {
      grade: 'D',
      description: 'Poor - Multiple security concerns',
      color: '#FF9800',
    }
  }
  return {
    grade: 'F',
    description: 'Critical - Significant security risks',
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
