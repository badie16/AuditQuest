import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../stores'
import { getPerformanceGrade, getAuditSummary } from '../utils/scoringSystem'
import { BackgroundMode } from '../../../types/BackgroundMode'
import { AuditRole } from '../../../types/AuditTypes'
import phaserGame from '../PhaserGame'
import Game from '../scenes/Game'
import EvidenceTab from './EvidenceTab'
import FindingsTab from './FindingsTab'
import RiskTab from './RiskTab'
import AuditMissionPanel from './AuditMissionPanel'
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
  const auditRole = useSelector((state: RootState) => state.user.auditRole)
  const mySessionId = useSelector((state: RootState) => state.user.sessionId)
  const playerDirectory = useSelector((state: RootState) => state.user.playerDirectory)

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

  const handleRoleChange = (playerId: string, role: AuditRole) => {
    const game = phaserGame.scene.keys.game as Game
    const network = game?.network
    if (!network) return
    network.changePlayerRole(playerId, role)
  }

  return (
    <div className={`audit-hud ${themeClass}`}>
      <div className="audit-hud__container">
        <div className="audit-hud__header">
          <h1 className="audit-hud__title">Audit Dashboard</h1>
          <span className="pixel-chip" style={{ marginRight: '10px' }}>
            Role: {auditRole}
          </span>
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

              {auditRole === 'auditor' && (
                <div className="summary-card pixel-card mt-24">
                  <h3 className="card-title">Role Management</h3>
                  <div className="pixel-table-container">
                    <table className="pixel-table">
                      <thead>
                        <tr>
                          <th>Player</th>
                          <th>Role</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {playerDirectory.map((player) => (
                          <tr key={player.id}>
                            <td>{player.name || 'Anonymous'}</td>
                            <td>
                              <span className="pixel-chip">{player.role}</span>
                            </td>
                            <td>
                              {player.id === mySessionId ? (
                                <span className="time-stamp">Current user</span>
                              ) : (
                                <select
                                  className="pixel-input select"
                                  value={player.role}
                                  onChange={(e) =>
                                    handleRoleChange(player.id, e.target.value as AuditRole)
                                  }
                                >
                                  <option value="auditor">auditor</option>
                                  <option value="auditee">auditee</option>
                                  <option value="observer">observer</option>
                                </select>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'missions' && <AuditMissionPanel />}

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
