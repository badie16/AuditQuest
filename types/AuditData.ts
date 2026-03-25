import { AuditMission, Priority } from './AuditTypes'

export interface NPCData {
  id: string
  name: string
  texture: string
  portrait: string
  dialogue: string
  role: string
  room?: string
}

export const AUDIT_MISSIONS: Partial<AuditMission>[] = [
  {
    id: 'a5-1',
    controlId: 'A.5.1',
    title: 'Information Security Policies',
    description: 'Check if the security policies are documented and approved by the Director.',
    priority: 'high' as Priority,
    category: 'POLICIES',
    prerequisites: [],
    evidenceRequired: ['Information Security Policy Document', 'Policy Approval Records', 'Distribution Evidence'],
    targetObjectId: 'npc_director',
    targetRoom: 'Director Office',
  },
  {
    id: 'a6-1',
    controlId: 'A.6.1',
    title: 'Internal Organization',
    description: 'Verify roles and responsibilities in the meeting room with the manager.',
    priority: 'high' as Priority,
    category: 'ORGANIZATION',
    prerequisites: ['a5-1'],
    evidenceRequired: ['Organizational Chart', 'Role Definitions', 'Responsibility Matrix'],
    targetObjectId: 'npc_manager',
    targetRoom: 'Meeting Room',
  },
  {
    id: 'a7-2',
    controlId: 'A.7.2.2',
    title: 'Security Awareness',
    description: 'Interview employees in the break room about social engineering risks.',
    priority: 'medium' as Priority,
    category: 'HUMAN RESOURCE',
    prerequisites: ['a5-1'],
    evidenceRequired: ['User Security Agreement', 'Training Records', 'Acceptable Use Policy'],
    targetObjectId: 'npc_hr',
    targetRoom: 'Break Room',
  },
  {
    id: 'a8-1',
    controlId: 'A.8.1',
    title: 'User Registration',
    description: 'Check user access records on the main office workstations.',
    priority: 'high' as Priority,
    category: 'ASSET MANAGEMENT',
    prerequisites: ['a6-1'],
    evidenceRequired: ['User Access List', 'Access Request Forms', 'Access Review Reports'],
    targetObjectId: '0', // PC 0
    targetRoom: 'General Office',
  },
  {
    id: 'a9-4',
    controlId: 'A.9.4.3',
    title: 'Password Management',
    description: 'Verify password complexity and expiration settings on Office PC 1.',
    priority: 'high' as Priority,
    category: 'ACCESS CONTROL',
    prerequisites: ['a8-1'],
    evidenceRequired: ['Encryption Policy', 'Key Management Records', 'Encryption Implementation Evidence'],
    targetObjectId: '1', // PC 1
    targetRoom: 'General Office',
  },
  {
    id: 'a11-2',
    controlId: 'A.11.2.9',
    title: 'Clear Desk & Clear Screen',
    description: 'Ensure no sensitive data is left visible in the Meeting Room.',
    priority: 'medium' as Priority,
    category: 'PHYSICAL SECURITY',
    prerequisites: ['a6-1'],
    evidenceRequired: ['Physical Security Controls', 'Entry/Exit Logs', 'Security Barrier Documentation'],
    targetObjectId: 'meeting_whiteboard',
    targetRoom: 'Meeting Room',
  },
  {
    id: 'a12-1',
    controlId: 'A.12.1.1',
    title: 'Operating Procedures',
    description: 'Verify that IT operating procedures are available in the Office.',
    priority: 'high' as Priority,
    category: 'OPERATIONS',
    prerequisites: ['a5-1'],
    evidenceRequired: ['System Documentation', 'Procedure Manual', 'Configuration Records'],
    targetObjectId: '2', // PC 2
    targetRoom: 'General Office',
  },
  {
    id: 'a12-4',
    controlId: 'A.12.4.1',
    title: 'Event Logging',
    description: 'Check if system logs are being recorded and secured on PC 3.',
    priority: 'medium' as Priority,
    category: 'OPERATIONS',
    prerequisites: ['a12-1'],
    evidenceRequired: ['Incident Response Plan', 'Incident Log', 'Lessons Learned Records'],
    targetObjectId: '3', // PC 3
    targetRoom: 'General Office',
  },
  {
    id: 'a13-1',
    controlId: 'A.13.1.1',
    title: 'Network Controls',
    description: 'Inspect network configuration for segregation in the server area.',
    priority: 'high' as Priority,
    category: 'COMMUNICATIONS',
    prerequisites: ['a12-4'],
    evidenceRequired: ['Network Diagram', 'Firewall Configuration', 'VLAN Config'],
    targetObjectId: '4', // PC 4
    targetRoom: 'General Office',
  },
  {
    id: 'a18-1',
    controlId: 'A.18.1.1',
    title: 'Legal Identification',
    description: 'Verify identification of applicable legislation in the Director office.',
    priority: 'low' as Priority,
    category: 'COMPLIANCE',
    prerequisites: ['a5-1'],
    evidenceRequired: ['Legal Registry', 'Compliance Certificates', 'Contract Review'],
    targetObjectId: 'director_safe',
    targetRoom: 'Director Office',
  },
]

export const NPCS_DATA: NPCData[] = [
  {
    id: 'npc_director',
    name: 'Director Bahida',
    texture: 'adam',
    portrait: 'assets/images/login/Adam_login.png',
    role: 'Managing Director',
    dialogue: 'Welcome to the audit. I assure you we follow all ISO 27001 guidelines strictly here.',
    room: 'Director Office',
  },
  {
    id: 'npc_manager',
    name: 'Manager Sarah',
    texture: 'lucy',
    portrait: 'assets/images/login/Lucy_login.png',
    role: 'IT Manager',
    dialogue: 'I have all the logs and organizational charts ready for your review in the meeting room.',
    room: 'Meeting Room',
  },
  {
    id: 'npc_it_admin',
    name: 'Admin Joe',
    texture: 'ash',
    portrait: 'assets/images/login/Ash_login.png',
    role: 'System Administrator',
    dialogue: 'The servers are segregated and all backups are encrypted. You can verify the configs on PC 4.',
    room: 'General Office',
  },
  {
    id: 'npc_hr',
    name: 'HR Maria',
    texture: 'nancy',
    portrait: 'assets/images/login/Nancy_login.png',
    role: 'HR Specialist',
    dialogue: 'All employees have signed their non-disclosure agreements and completed the awareness training.',
    room: 'Break Room',
  },
]

export const AUDIT_POINTS_DATA: Record<string, {
    id: string
    name: string
    description: string
    type: 'document' | 'log' | 'config' | 'interview' | 'observation'
    relatedControls: string[]
    location: string
}[]> = {
    'npc_director': [
        { id: 'ap_policy_doc', name: 'Security Policy', description: 'Signed Information Security Policy v2.0', type: 'document', relatedControls: ['A.5.1'], location: 'Director Office' },
        { id: 'ap_policy_review', name: 'Policy Review', description: 'Minutes of policy review meeting', type: 'document', relatedControls: ['A.5.1'], location: 'Director Office' }
    ],
    'npc_manager': [
        { id: 'ap_org_chart', name: 'Org Chart', description: 'Updated Organizational Chart', type: 'document', relatedControls: ['A.6.1'], location: 'Meeting Room' },
        { id: 'ap_roles', name: 'Job Descriptions', description: 'Security responsibilities in job descriptions', type: 'document', relatedControls: ['A.6.1'], location: 'Meeting Room' }
    ],
    'npc_hr': [
        { id: 'ap_nda', name: 'NDAs', description: 'Sample of signed Non-Disclosure Agreements', type: 'document', relatedControls: ['A.7.2.2', 'A.13.2.4'], location: 'Break Room' },
        { id: 'ap_training', name: 'Training Logs', description: 'Security awareness training completion logs', type: 'document', relatedControls: ['A.7.2.2'], location: 'Break Room' }
    ],
    '0': [ // PC 0 - Reception
        { id: 'ap_access_list', name: 'Visitor Log', description: 'Digital visitor access log', type: 'log', relatedControls: ['A.11.1'], location: 'Reception PC' },
        { id: 'ap_user_reg', name: 'User Registration', description: 'User registration process documentation', type: 'document', relatedControls: ['A.9.2.1'], location: 'Reception PC' }
    ],
    '1': [ // PC 1 - General Office
        { id: 'ap_password', name: 'Password Policy', description: 'System password complexity configuration', type: 'config', relatedControls: ['A.9.4.3'], location: 'General Office PC 1' },
        { id: 'ap_screen_lock', name: 'Screen Lock', description: 'Automatic screen lock set to 5 minutes', type: 'config', relatedControls: ['A.11.2.9'], location: 'General Office PC 1' }
    ],
    '2': [ // PC 2
        { id: 'ap_ops_procedures', name: 'Ops Procedures', description: 'Standard Operating Procedures for IT', type: 'document', relatedControls: ['A.12.1.1'], location: 'General Office PC 2' },
        { id: 'ap_change_mgmt', name: 'Change Logs', description: 'Change management tracking system', type: 'log', relatedControls: ['A.12.1.2'], location: 'General Office PC 2' }
    ],
    '3': [ // PC 3
        { id: 'ap_event_logs', name: 'Security Logs', description: 'Centralized security event logs', type: 'log', relatedControls: ['A.12.4.1'], location: 'General Office PC 3' },
        { id: 'ap_clock_sync', name: 'NTP Config', description: 'NTP synchronization configuration', type: 'config', relatedControls: ['A.12.4.4'], location: 'General Office PC 3' }
    ],
    '4': [ // PC 4 - Server Admin
        { id: 'ap_network_diag', name: 'Network Diagram', description: 'Current network topology diagram', type: 'document', relatedControls: ['A.13.1.1'], location: 'Server Admin PC' },
        { id: 'ap_firewall', name: 'Firewall Rules', description: 'Firewall rule set configuration', type: 'config', relatedControls: ['A.13.1.2'], location: 'Server Admin PC' },
        { id: 'ap_backups', name: 'Backup Config', description: 'Daily backup schedule configuration', type: 'config', relatedControls: ['A.12.3.1'], location: 'Server Admin PC' }
    ],
    'meeting_whiteboard': [
        { id: 'ap_clear_desk', name: 'Whiteboard Info', description: 'Sensitive network architecture drawn on whiteboard', type: 'observation', relatedControls: ['A.11.2.9'], location: 'Meeting Room' }
    ]
}
