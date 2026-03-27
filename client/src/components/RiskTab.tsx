import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import WarningIcon from '@mui/icons-material/Warning'
import { RootState } from '../stores'

export default function RiskTab() {
  const risks = useSelector((state: RootState) => state.audit.riskAssessments) || []
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const getSeverityCount = (severity: string) => {
    return risks.filter((r: any) => r.severity === severity).length
  }

  const handleToggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const highRiskCount = getSeverityCount('high')
  const mediumRiskCount = getSeverityCount('medium')
  const lowRiskCount = getSeverityCount('low')

  return (
    <div className="audit-tab-content">
      {/* Summary Stats */}
      <div className="stats-grid">
        <div className="stat-card pixel-card high-risk">
          <div className="stat-label">High Risk</div>
          <div className="stat-value fail">{highRiskCount}</div>
        </div>
        <div className="stat-card pixel-card medium-risk">
          <div className="stat-label">Medium Risk</div>
          <div className="stat-value partial">{mediumRiskCount}</div>
        </div>
        <div className="stat-card pixel-card low-risk">
          <div className="stat-label">Low Risk</div>
          <div className="stat-value pass">{lowRiskCount}</div>
        </div>
      </div>

      {risks.length > 0 && (
        <div className="summary-card pixel-card mt-24">
          <h3 className="card-title">Risk Analysis</h3>
          <div className="risk-progress-container">
            <div className="risk-progress-item">
              <div className="risk-progress-label">
                <span>High Risk</span>
                <span>{Math.round((highRiskCount / risks.length) * 100)}%</span>
              </div>
              <div className="pixel-progress-bar">
                <div className="pixel-progress-fill high" style={{ width: `${(highRiskCount / risks.length) * 100}%` }} />
              </div>
            </div>
            <div className="risk-progress-item">
              <div className="risk-progress-label">
                <span>Medium Risk</span>
                <span>{Math.round((mediumRiskCount / risks.length) * 100)}%</span>
              </div>
              <div className="pixel-progress-bar">
                <div className="pixel-progress-fill medium" style={{ width: `${(mediumRiskCount / risks.length) * 100}%` }} />
              </div>
            </div>
            <div className="risk-progress-item">
              <div className="risk-progress-label">
                <span>Low Risk</span>
                <span>{Math.round((lowRiskCount / risks.length) * 100)}%</span>
              </div>
              <div className="pixel-progress-bar">
                <div className="pixel-progress-fill low" style={{ width: `${(lowRiskCount / risks.length) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="tab-header mt-24">
        <h2 className="tab-title">Risk Assessments ({risks.length})</h2>
      </div>

      {risks.length === 0 ? (
        <div className="empty-panel-state">
          No risk assessments recorded yet. Assess risks for non-compliant findings.
        </div>
      ) : (
        <div className="risks-list">
          {/* High Risk Items First */}
          {risks
            .filter((r: any) => r.severity === 'high')
            .map((risk: any) => (
              <RiskCard
                key={risk.id}
                risk={risk}
                isExpanded={expandedId === risk.id}
                onToggle={() => handleToggleExpand(risk.id)}
              />
            ))}

          {/* Medium Risk Items */}
          {risks
            .filter((r: any) => r.severity === 'medium')
            .map((risk: any) => (
              <RiskCard
                key={risk.id}
                risk={risk}
                isExpanded={expandedId === risk.id}
                onToggle={() => handleToggleExpand(risk.id)}
              />
            ))}

          {/* Low Risk Items */}
          {risks
            .filter((r: any) => r.severity === 'low')
            .map((risk: any) => (
              <RiskCard
                key={risk.id}
                risk={risk}
                isExpanded={expandedId === risk.id}
                onToggle={() => handleToggleExpand(risk.id)}
              />
            ))}
        </div>
      )}
    </div>
  )
}

interface RiskCardProps {
  risk: any
  isExpanded: boolean
  onToggle: () => void
}

function RiskCard({ risk, isExpanded, onToggle }: RiskCardProps) {
  const daysUntilDue = Math.ceil((risk.remediationDue - Date.now()) / (1000 * 60 * 60 * 24))

  return (
    <div className={`risk-card pixel-card ${risk.severity} ${isExpanded ? 'expanded' : ''}`}>
      <div className="risk-card-header" onClick={onToggle}>
        <div className="risk-info">
          {risk.severity === 'high' && <WarningIcon className="warning-icon" />}
          <div className="risk-meta">
            <span className="risk-id">RISK-{risk.id.substring(0, 4)}</span>
            <span className={`pixel-chip risk-${risk.severity}`}>
              {risk.severity}
            </span>
            <span className={`pixel-chip urgency ${daysUntilDue < 7 ? 'danger' : ''}`}>
              {daysUntilDue > 0 ? `${daysUntilDue} DAYS REMAINING` : 'OVERDUE'}
            </span>
          </div>
        </div>
        <div className="risk-expand">
          <ExpandMoreIcon
            style={{
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s',
            }}
          />
        </div>
      </div>

      <div className="risk-summary-line">
        Prob: {risk.probability} | Impact: {risk.impact}
      </div>

      {isExpanded && (
        <div className="risk-card-content">
          <div className="risk-section">
            <div className="risk-label">Remediation Recommendation</div>
            <div className="risk-text briefing-card">{risk.recommendation}</div>
          </div>

          <div className="risk-footer-grid">
            <div className="risk-stat-box">
              <div className="risk-label">Status</div>
              <div className="risk-value">{risk.status || 'OPEN'}</div>
            </div>
            <div className="risk-stat-box">
              <div className="risk-label">Due Date</div>
              <div className="risk-value">
                {new Date(risk.remediationDue).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
