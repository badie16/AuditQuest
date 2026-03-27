import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { RootState } from '../stores'

export default function FindingsTab() {
  const findings = useSelector((state: RootState) => state.audit.findings) || []
  const missions = useSelector((state: RootState) =>
    (state.audit.activeMissions || []).concat(state.audit.completedMissions || [])
  )
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const getStatusCount = (status: string) => {
    return findings.filter((f: any) => f.status === status).length
  }

  const getMissionName = (missionId: string) => {
    const mission = missions.find((m: any) => m.id === missionId)
    return mission?.name || 'Unknown Mission'
  }

  const handleToggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const compliantCount = getStatusCount('compliant')
  const nonCompliantCount = getStatusCount('non-compliant')
  const partialCount = getStatusCount('partial')

  return (
    <div className="audit-tab-content">
      {/* Summary Stats */}
      <div className="stats-grid">
        <div className="stat-card pixel-card">
          <div className="stat-label">Compliant</div>
          <div className="stat-value compliant">{compliantCount}</div>
        </div>
        <div className="stat-card pixel-card">
          <div className="stat-label">Partial</div>
          <div className="stat-value partial">{partialCount}</div>
        </div>
        <div className="stat-card pixel-card">
          <div className="stat-label">Non-Compliant</div>
          <div className="stat-value non-compliant">{nonCompliantCount}</div>
        </div>
      </div>

      <div className="tab-header mt-24">
        <h2 className="tab-title">Detailed Findings ({findings.length})</h2>
      </div>

      {findings.length === 0 ? (
        <div className="empty-panel-state">
          No findings recorded yet. Complete compliance evaluations to record findings.
        </div>
      ) : (
        <div className="findings-list">
          {findings.map((finding: any) => (
            <div key={finding.id} className={`finding-card pixel-card ${finding.status} ${expandedId === finding.id ? 'expanded' : ''}`}>
              <div className="finding-card-header" onClick={() => handleToggleExpand(finding.id)}>
                <div className="finding-info">
                  <div className="finding-meta">
                    <span className="finding-control">{finding.controlId}</span>
                    <span className={`pixel-chip compliance-${finding.status}`}>
                      {finding.status}
                    </span>
                  </div>
                  <div className="finding-mission">
                    Mission: {getMissionName(finding.missionId)}
                  </div>
                </div>
                <div className="finding-expand">
                  <ExpandMoreIcon
                    style={{
                      transform: expandedId === finding.id ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s',
                    }}
                  />
                </div>
              </div>

              {expandedId === finding.id && (
                <div className="finding-card-content">
                  <div className="finding-section">
                    <div className="finding-label">Justification</div>
                    <div className="finding-text briefing-card">{finding.justification}</div>
                  </div>

                  {finding.notes && (
                    <div className="finding-section">
                      <div className="finding-label">Notes</div>
                      <div className="finding-text">{finding.notes}</div>
                    </div>
                  )}

                  {finding.evidence && finding.evidence.length > 0 && (
                    <div className="finding-section">
                      <div className="finding-label">Linked Evidence ({finding.evidence.length})</div>
                      <div className="evidence-chips">
                        {finding.evidence.map((evidenceId: string) => (
                          <span key={evidenceId} className="pixel-chip small">
                            ID: {evidenceId.substring(0, 8)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="finding-footer">
                    <div className="auditor-id">By: {finding.auditorId}</div>
                    <div className="timestamp">
                      {new Date(finding.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {findings.length > 0 && (
        <div className="summary-card pixel-card mt-24">
          <h3 className="card-title">Compliance Metrics</h3>
          <div className="metrics-grid">
            <div className="metric-item">
              <span className="metric-label">Rate</span>
              <span className="metric-value">
                {Math.round((compliantCount / findings.length) * 100)}%
              </span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Evaluated</span>
              <span className="metric-value">{findings.length} Controls</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
