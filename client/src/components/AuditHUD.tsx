import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../stores'
import { getPerformanceGrade, getAuditSummary } from '../utils/scoringSystem'
import { BackgroundMode } from '../../../types/BackgroundMode'
import EvidenceTab from './EvidenceTab'
import FindingsTab from './FindingsTab'
import RiskTab from './RiskTab'
import './AuditHUD.scss'

interface AuditHUDProps {
  isOpen: boolean
  onClose: () => void
  onMissionSelected?: (missionId: string) => void
}

export const AuditHUD: React.FC<AuditHUDProps> = ({ isOpen, onClose, onMissionSelected }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'missions' | 'evidence' | 'findings' | 'risks' | 'journal'>(
    'overview'
  )

  const auditState = useSelector((state: RootState) => state.audit)
  const backgroundMode = useSelector((state: RootState) => state.user.backgroundMode)

  // Sécurisation : toujours fournir des tableaux par défaut
  const activeMissions = auditState.activeMissions || []
  const completedMissions = auditState.completedMissions || []
  const findings = auditState.findings || []
  const auditJournal = auditState.auditJournal || []
  const riskAssessments = auditState.riskAssessments || []
  const collectedEvidence = auditState.collectedEvidence || []

  const summary = getAuditSummary({
    missions: [...activeMissions, ...completedMissions],
    findings,
    risks: riskAssessments,
    evidence: collectedEvidence,
  })

  const grade = getPerformanceGrade(auditState.auditScore || 0)

  if (!isOpen) return null

  const themeClass = backgroundMode === BackgroundMode.DAY ? 'theme-day' : 'theme-night'

  return (
    <div className={`audit-hud ${themeClass}`}>
      <div className="audit-hud__container">
        <div className="audit-hud__header">
          <h1 className="audit-hud__title">Audit Dashboard</h1>
          <button className="audit-hud__close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="audit-hud__tabs">
          <button
            className={`audit-hud__tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`audit-hud__tab ${activeTab === 'missions' ? 'active' : ''}`}
            onClick={() => setActiveTab('missions')}
          >
            Missions ({activeMissions.length})
          </button>
          <button
            className={`audit-hud__tab ${activeTab === 'evidence' ? 'active' : ''}`}
            onClick={() => setActiveTab('evidence')}
          >
            Evidence ({collectedEvidence.length})
          </button>
          <button
            className={`audit-hud__tab ${activeTab === 'findings' ? 'active' : ''}`}
            onClick={() => setActiveTab('findings')}
          >
            Findings ({findings.length})
          </button>
          <button
            className={`audit-hud__tab ${activeTab === 'risks' ? 'active' : ''}`}
            onClick={() => setActiveTab('risks')}
          >
            Risks ({riskAssessments.length})
          </button>
          <button
            className={`audit-hud__tab ${activeTab === 'journal' ? 'active' : ''}`}
            onClick={() => setActiveTab('journal')}
          >
            Journal ({auditJournal.length})
          </button>
        </div>

        <div className="audit-hud__content">
          {activeTab === 'overview' && (
            <div className="audit-overview">
              <div className="score-section">
                <div className="score-display">
                  <div className="score-number">{auditState.auditScore || 0}</div>
                  <div className="score-grade" style={{ color: grade.color }}>{grade.grade}</div>
                  <div className="score-description">{grade.description}</div>
                </div>
              </div>

              <div className="progress-section">
                <h3>Audit Progress</h3>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${auditState.progressPercentage || 0}%` }}
                  >
                    <span style={{marginLeft:'30px',display:"block"}}>{auditState.progressPercentage || 0}%</span>
                  </div>
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-label">Total</div>
                  <div className="stat-value">{summary.totalMissions || 0}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Done</div>
                  <div className="stat-value done">
                    {summary.completedMissions || 0}
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Pass</div>
                  <div className="stat-value pass">
                    {summary.compliantCount || 0}
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Fail</div>
                  <div className="stat-value fail">
                    {summary.nonCompliantCount || 0}
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Risks</div>
                  <div className="stat-value risk">
                    {summary.highRiskCount || 0}
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Evid.</div>
                  <div className="stat-value">{summary.totalEvidence || 0}</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'missions' && (
            <div className="audit-missions">
              <div className="missions-list">
                <h3>Active Missions</h3>
                {activeMissions.length === 0 ? (
                  <p className="empty-state">
                    No active missions. Start by selecting a control to audit.
                  </p>
                ) : (
                  activeMissions.map((mission) => (
                    <div
                      key={mission.id}
                      className="mission-item"
                      onClick={() => onMissionSelected?.(mission.id)}
                    >
                      <div className="mission-info">
                        <div className="mission-code">{mission.controlId}</div>
                        <div className="mission-name">{mission.title}</div>
                        <div className="mission-status">
                          <span className={`status-badge status-${mission.status || 'pending'}`}>
                            {mission.status || 'pending'}
                          </span>
                        </div>
                      </div>
                      <div className="mission-progress">
                        <div className="evidence-progress">
                          {mission.collectedEvidence?.length || 0}/
                          {mission.evidenceRequired?.length || 0} Evidence
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="missions-list">
                <h3>Completed Missions</h3>
                {completedMissions.length === 0 ? (
                  <p className="empty-state">No completed missions yet.</p>
                ) : (
                  completedMissions.map((mission) => (
                    <div key={mission.id} className="mission-item completed">
                      <div className="mission-info">
                        <div className="mission-code">{mission.isoControl}</div>
                        <div className="mission-name">{mission.name}</div>
                        <div className="mission-status">
                          <span
                            className={`compliance-badge compliance-${
                              mission.compliance || 'unknown'
                            }`}
                          >
                            {mission.compliance || 'unknown'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'evidence' && <EvidenceTab />}
          {activeTab === 'findings' && <FindingsTab />}
          {activeTab === 'risks' && <RiskTab />}

          {activeTab === 'journal' && (
            <div className="audit-journal">
              <div className="journal-entries">
                {auditJournal.length === 0 ? (
                  <p className="empty-state">No journal entries yet.</p>
                ) : (
                  auditJournal.map((entry) => (
                    <div
                      key={entry.id}
                      className={`journal-entry journal-${entry.type || 'unknown'}`}
                    >
                      <div className="entry-time">
                        {entry.timestamp ? new Date(entry.timestamp).toLocaleTimeString() : '-'}
                      </div>
                      <div className="entry-action">{entry.action || '-'}</div>
                      {entry.details && <div className="entry-details">{entry.details}</div>}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuditHUD
