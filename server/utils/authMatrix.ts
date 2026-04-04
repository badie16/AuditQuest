export type AuditRole = 'auditor' | 'auditee' | 'observer'

export type AuditAction = 
  | 'manage_roles'
  | 'start_mission'
  | 'complete_mission'
  | 'collect_evidence'
  | 'remove_evidence'
  | 'verify_evidence'
  | 'add_finding'
  | 'update_finding'
  | 'add_risk'
  | 'update_risk'

const ROLE_PERMISSIONS: Record<AuditRole, AuditAction[]> = {
  auditor: [
    'manage_roles',
    'start_mission',
    'complete_mission',
    'collect_evidence',
    'remove_evidence',
    'verify_evidence',
    'add_finding',
    'update_finding',
    'add_risk',
    'update_risk',
  ],
  auditee: [
    'collect_evidence',
  ],
  observer: [],
}

export function canPerformAction(role: AuditRole | undefined, action: AuditAction): boolean {
  if (!role) return false;
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(action);
}
