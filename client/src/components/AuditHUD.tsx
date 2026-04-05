import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../stores'
import { getPerformanceGrade, getAuditSummary, calculateScoreBreakdown } from '../utils/scoringSystem'
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

  // Calculate professional 6-step breakdown for display
  const breakdown = calculateScoreBreakdown({
    missions: [...activeMissions, ...completedMissions],
    findings,
    risks: riskAssessments,
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
          <span className="pixel-chip">
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
              {/* Score Hero Section */}
              <div className="score-hero">
                <div className="score-label">Security Posture Assessment</div>
                <div className="score-value">{auditState.auditScore || 0}</div>
                <div className="pixel-progress-bar large">
                  <div 
                    className="pixel-progress-fill" 
                    style={{ 
                      width: `${auditState.auditScore || 0}%`
                    }} 
                  />
                </div>
                <div className="score-status-badge">
                  {grade.grade.toUpperCase()}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="overview-stats">
                <div className="stat-box">
                  <div className="stat-header">Total Controls</div>
                  <div className="stat-num">{summary.totalMissions || 0}</div>
                </div>
                <div className="stat-box">
                  <div className="stat-header">Done</div>
                  <div className="stat-num">
                    {summary.completedMissions || 0}
                  </div>
                </div>
                <div className="stat-box">
                  <div className="stat-header">Compliant</div>
                  <div className="stat-num">
                    {summary.compliantCount || 0}
                  </div>
                </div>
                <div className="stat-box">
                  <div className="stat-header">Risks</div>
                  <div className="stat-num">
                    {summary.highRiskCount || 0}
                  </div>
                </div>
              </div>

              {/* Calculation Logic Box */}
              <div className="calculation-logic">
                <h4>Calculation Methodology</h4>
                <ol>
                  <li>
                    <strong>Strategic Mapping:</strong> Each control is weighted by mission importance.
                  </li>
                  <li>
                    <strong>Baseline Rating:</strong> Status weights (<em>Completed: 10</em> / <em>In-Progress: 6</em> / <em>Pending: 3</em>).
                  </li>
                  <li>
                    <strong>Risk Impact:</strong> Severity penalties (<em>Critical: -4</em> / <em>High: -3</em> / <em>Medium: -2</em> / <em>Low: -1</em>).
                  </li>
                  <li>
                    <strong>Net Compliance:</strong> Final score = (Base - Penalty) × Weight ➔ Normalized to 100.
                  </li>
                </ol>
              </div>

              {/* Professional Posture Table */}
              <div className="posture-table-section">
                <div className="section-header">Detailed Posture Breakdown</div>
                <div className="pro-table-wrapper">
                  <table className="pro-table">
                    <thead>
                      <tr>
                        <th>Mission & Domain</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'center' }}>Weight</th>
                        <th>Finding</th>
                        <th style={{ textAlign: 'center' }}>Rating</th>
                        <th style={{ textAlign: 'right' }}>Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {breakdown.missionResults.length === 0 ? (
                        <tr>
                          <td colSpan={6} style={{ textAlign: 'center', opacity: 0.5, padding: '40px' }}>
                            Initialize missions to begin assessment...
                          </td>
                        </tr>
                      ) : (
                        breakdown.missionResults.map((m: any) => (
                          <tr key={m.id}>
                            <td>
                              <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{m.name}</div>
                              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>{m.domain}</div>
                            </td>
                            <td className="td-status">
                              <span className={`status-badge ${m.status}`}>
                                {m.status}
                              </span>
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              {m.weight.toFixed(1)}%
                            </td>
                            <td className="td-finding">
                              <span className={`status-badge ${m.finding}`}>
                                {m.finding}
                              </span>
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <span style={{ fontWeight: 700, color: m.rating < 5 ? 'var(--danger)' : 'var(--success)' }}>
                                {m.rating}
                              </span>/10
                            </td>
                            <td className="td-score">
                              {m.score.toFixed(1)}
                            </td>
                          </tr>
                        ))
                      )}
                      <tr className="total-row">
                        <td colSpan={5}>
                          Weighted total posture score 
                        </td>
                        <td className="final-score-val">
                          {breakdown.finalScore}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Risk Level Scale footer */}
              <div className="scale-section">
                <div className="section-header">Organization Risk Benchmark</div>
                <div className="risk-scale">
                  <div className="scale-box excellent">
                    <div>90 - 100</div>
                    <div className="range">Excellent</div>
                  </div>
                  <div className="scale-box good">
                    <div>75 - 89</div>
                    <div className="range">Good</div>
                  </div>
                  <div className="scale-box improve">
                    <div>50 - 74</div>
                    <div className="range">Improve</div>
                  </div>
                  <div className="scale-box high">
                    <div>25 - 49</div>
                    <div className="range">High Risk</div>
                  </div>
                  <div className="scale-box critical">
                    <div>0 - 24</div>
                    <div className="range">Critical</div>
                  </div>
                </div>
              </div>

              {/* Role management remained for auditors */}
              {auditRole === 'auditor' && (
                <div style={{ marginTop: '32px', borderTop: '1px solid var(--border-main)', paddingTop: '24px' }}>
                  <div className="section-header" style={{ marginBottom: '16px' }}>Personnel & Role Directory</div>
                  <div className="pro-table-wrapper">
                    <table className="pro-table">
                      <thead>
                        <tr>
                          <th>Stakeholder</th>
                          <th>Current Role</th>
                          <th style={{ textAlign: 'right' }}>Authorization</th>
                        </tr>
                      </thead>
                      <tbody>
                        {playerDirectory.map((player) => (
                          <tr key={player.id}>
                            <td>
                              <div style={{ fontWeight: 600 }}>{player.name || 'Anonymous User'}</div>
                            </td>
                            <td>
                              <span className="status-badge" style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                                {player.role.toUpperCase()}
                              </span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              {player.id === mySessionId ? (
                                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>SYSTEM ACCESS GRANTED</span>
                              ) : (
                                <select
                                  style={{
                                    background: 'var(--bg-main)',
                                    color: 'var(--text-main)',
                                    border: '1px solid var(--border-main)',
                                    borderRadius: '4px',
                                    fontSize: '11px',
                                    padding: '4px 8px'
                                  }}
                                  value={player.role}
                                  onChange={(e) =>
                                    handleRoleChange(player.id, e.target.value as AuditRole)
                                  }
                                >
                                  <option value="auditor">Auditor</option>
                                  <option value="auditee">Auditee</option>
                                  <option value="observer">Observer</option>
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
