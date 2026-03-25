// ISO 27001 Audit Training System - Type Definitions

export type AuditStatus = 'pending' | 'in-progress' | 'completed'
export type ComplianceStatus = 'compliant' | 'non-compliant' | 'partial'
export type EvidenceType = 'document' | 'log' | 'config' | 'interview' | 'observation'
export type RiskLevel = 'low' | 'medium' | 'high'
export type Priority = 'low' | 'medium' | 'high'

export interface AuditMission {
  id: string
  controlId: string
  title: string
  description: string
  status: AuditStatus | 'not_started'
  priority: Priority
  category: string
  prerequisites?: string[]
  evidenceRequired: string[]
  evidenceCollected: number
  completionPercentage: number
  assignedTo: string
  createdAt: string
  dueDate: string
  targetObjectId?: string
  targetRoom?: string
}

export interface Evidence {
  id: string
  missionId: string
  type: EvidenceType
  description: string
  location: string
  collectionTime: number
  auditorId: string
  attachments?: string[]
  verified: boolean
  verifiedBy?: string
  verifiedAt?: number
}

export interface ComplianceFinding {
  id: string
  missionId: string
  status: ComplianceStatus
  evidence: string[]
  justification: string
  auditorId: string
  createdAt: number
  lastModified: number
  notes?: string
}

export interface RiskAssessment {
  id: string
  findingId: string
  probability: RiskLevel
  impact: RiskLevel
  severity: RiskLevel
  recommendation: string
  remediationDue?: number
  createdAt: number
  assignedTo?: string
}

export interface AuditSession {
  sessionId: string
  startTime: number
  endTime?: number
  missions: AuditMission[]
  findings: ComplianceFinding[]
  risks: RiskAssessment[]
  totalScore: number
  completionPercentage: number
  auditors: string[]
  status: AuditStatus
}

export interface JournalEntry {
  id: string
  timestamp: number
  auditorId: string
  action: string
  details?: string
  missionId?: string
  findingId?: string
  type:
    | 'mission_started'
    | 'mission_completed'
    | 'evidence_collected'
    | 'compliance_evaluated'
    | 'risk_assessed'
    | 'finding_added'
    | 'note_added'
}

export interface Notification {
  id: string
  timestamp: number
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  action?: string
  actionUrl?: string
}

export interface AuditReport {
  id: string
  sessionId: string
  generatedAt: number
  generatedBy: string
  title: string
  executive_summary: string
  controls_audited: number
  compliant_count: number
  non_compliant_count: number
  partial_count: number
  findings: ComplianceFinding[]
  risks: RiskAssessment[]
  journal_entries: JournalEntry[]
  total_score: number
  recommendations: string[]
  next_steps: string[]
}

export interface AuditState {
  sessionId: string
  currentMission?: AuditMission
  activeMissions: AuditMission[]
  completedMissions: AuditMission[]
  collectedEvidence: Evidence[]
  findings: ComplianceFinding[]
  riskAssessments: RiskAssessment[]
  auditScore: number
  progressPercentage: number
  auditJournal: JournalEntry[]
  notifications: Notification[]
  status: AuditStatus
  startedAt: number
  completedAt?: number
  hudOpen?: boolean
  evidenceDialogOpen: boolean
  evidenceTargetName: string
  evidenceTargetId: string
  activeTab?: 'overview' | 'missions' | 'findings' | 'risks' | 'journal'
}

// ISO 27002 Controls Reference
export const ISO_27002_CONTROLS = [
  {
    id: 'A.5.1',
    name: 'Information Security Policies',
    description: 'Set of policies for information security',
    zone: 'office',
  },
  {
    id: 'A.6.1',
    name: 'Internal Organization',
    description: 'Organizational structure for information security',
    zone: 'office',
  },
  {
    id: 'A.7.1',
    name: 'Physical and Environmental Security',
    description: 'Physical barriers and environmental controls',
    zone: 'office',
  },
  {
    id: 'A.8.1',
    name: 'Communications and Operations Management',
    description: 'Operational procedures and responsibilities',
    zone: 'office',
  },
  {
    id: 'A.9.1',
    name: 'User Access Management',
    description: 'Granting and revoking user access rights',
    zone: 'office',
  },
  {
    id: 'A.9.2',
    name: 'User Responsibilities',
    description: 'User security responsibilities and behavior',
    zone: 'office',
  },
  {
    id: 'A.10.1',
    name: 'Cryptography Policy',
    description: 'Use of cryptographic controls',
    zone: 'office',
  },
  {
    id: 'A.11.1',
    name: 'Physical Entry',
    description: 'Protection of physical access',
    zone: 'office',
  },
  {
    id: 'A.12.1',
    name: 'Documented Operating Procedures',
    description: 'Documentation and procedures',
    zone: 'office',
  },
  {
    id: 'A.14.1',
    name: 'Information Security Requirements',
    description: 'Security in development and support processes',
    zone: 'office',
  },
  {
    id: 'A.15.1',
    name: 'Information Security in Relationships',
    description: 'Managing supplier relationships',
    zone: 'office',
  },
  {
    id: 'A.16.1',
    name: 'Incident Response',
    description: 'Managing information security incidents',
    zone: 'office',
  },
]

// Evidence Type Templates
export const EVIDENCE_TEMPLATES = {
  document: {
    name: 'Document Evidence',
    placeholder: 'e.g., Policy PDF, Access Control List, Security Procedure',
  },
  log: {
    name: 'System Log',
    placeholder: 'e.g., Authentication log, Access log, Firewall log',
  },
  config: {
    name: 'Configuration',
    placeholder: 'e.g., Firewall rules, User groups, System settings',
  },
  interview: {
    name: 'Interview Notes',
    placeholder: 'e.g., Staff interview, Manager discussion, IT staff Q&A',
  },
  observation: {
    name: 'Observation',
    placeholder: 'e.g., Physical security check, Workstation inspection',
  },
}

// Scoring Constants
export const AUDIT_SCORING = {
  BASE_SCORE: 100,
  CONTROL_AUDITED: 5,
  NON_COMPLIANT_PENALTY: -10,
  INCOMPLETE_EVIDENCE_PENALTY: -5,
  THOROUGH_DOCUMENTATION_BONUS: 5,
  MAX_SCORE: 100,
  MIN_SCORE: 0,
}

// Risk Matrix
export const RISK_MATRIX = {
  low_low: 'low',
  low_medium: 'low',
  low_high: 'medium',
  medium_low: 'low',
  medium_medium: 'medium',
  medium_high: 'high',
  high_low: 'medium',
  high_medium: 'high',
  high_high: 'high',
} as Record<string, RiskLevel>
