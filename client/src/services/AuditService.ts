import store from '../stores'
import {
  initializeAuditSession as initAuditSessionRedux,
  addMission,
  setActiveTab,
} from '../stores/AuditStore'
import { AuditMission, AuditSessionStatus } from '../../../types/AuditTypes'

/**
 * Initializes the audit session and creates default audit missions
 */
export const initializeAuditSession = () => {
  // Initialize audit session
  store.dispatch(
    initAuditSessionRedux({
      sessionId: `audit-${Date.now()}`,
      auditName: 'ISO 27001 Certification Audit',
      status: 'active' as AuditSessionStatus,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      auditScope: 'Information Security Management System',
      auditTeam: [],
      organization: 'AuditQuest Corp',
    })
  )

  // Create default ISO 27002 control audit missions
  const defaultMissions: AuditMission[] = [
    {
      id: 'a5-1',
      controlId: 'A.5.1',
      title: 'Access Control Policy',
      description: 'Policies for granting and revoking access to information and IT facilities',
      status: 'not_started',
      priority: 'high',
      category: 'ACCESS CONTROL',
      evidenceRequired: ['policy_document', 'access_logs', 'interview'],
      evidenceCollected: 0,
      completionPercentage: 0,
      assignedTo: '',
      createdAt: new Date().toISOString(),
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'a6-1',
      controlId: 'A.6.1',
      title: 'Internal Organization',
      description: 'Establish roles and responsibilities for managing information security',
      status: 'not_started',
      priority: 'high',
      category: 'ORGANIZATION OF INFORMATION SECURITY',
      evidenceRequired: ['org_chart', 'job_descriptions', 'interview'],
      evidenceCollected: 0,
      completionPercentage: 0,
      assignedTo: '',
      createdAt: new Date().toISOString(),
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'a7-1',
      controlId: 'A.7.1',
      title: 'Personnel Screening',
      description: 'Conduct background checks on personnel with access to information',
      status: 'not_started',
      priority: 'medium',
      category: 'HUMAN RESOURCE SECURITY',
      evidenceRequired: ['screening_records', 'employment_contracts', 'interview'],
      evidenceCollected: 0,
      completionPercentage: 0,
      assignedTo: '',
      createdAt: new Date().toISOString(),
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'a8-1',
      controlId: 'A.8.1',
      title: 'User Registration',
      description: 'Grant and revoke access to information and systems for all users',
      status: 'not_started',
      priority: 'high',
      category: 'ASSET MANAGEMENT',
      evidenceRequired: ['user_accounts', 'access_records', 'configuration'],
      evidenceCollected: 0,
      completionPercentage: 0,
      assignedTo: '',
      createdAt: new Date().toISOString(),
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'a9-1',
      controlId: 'A.9.1',
      title: 'Business Requirements for Access Control',
      description: 'Define access control requirements based on business and security requirements',
      status: 'not_started',
      priority: 'high',
      category: 'COMMUNICATIONS AND OPERATIONS MANAGEMENT',
      evidenceRequired: ['access_policy', 'role_definitions', 'interview'],
      evidenceCollected: 0,
      completionPercentage: 0,
      assignedTo: '',
      createdAt: new Date().toISOString(),
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'a10-1',
      controlId: 'A.10.1',
      title: 'Encryption Policy',
      description: 'Determine need for cryptographic controls to protect sensitive information',
      status: 'not_started',
      priority: 'medium',
      category: 'CRYPTOGRAPHY',
      evidenceRequired: ['encryption_standards', 'key_management', 'configuration'],
      evidenceCollected: 0,
      completionPercentage: 0,
      assignedTo: '',
      createdAt: new Date().toISOString(),
      dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]

  // Add each mission to the store
  defaultMissions.forEach((mission) => {
    store.dispatch(addMission(mission))
  })

  // Set the active tab to missions
  store.dispatch(setActiveTab('missions'))
}

export default {
  initializeAuditSession,
}
