import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../stores'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import HourglassTopIcon from '@mui/icons-material/HourglassTop'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import MissionBriefing from './MissionBriefing'
import phaserGame from '../PhaserGame'
import Game from '../scenes/Game'

export default function AuditMissionPanel() {
  const activeMissions = useSelector((state: RootState) => state.audit.activeMissions) || []
  const completedMissions = useSelector((state: RootState) => state.audit.completedMissions) || []
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [briefingMission, setBriefingMission] = useState<any | null>(null)

  const allMissions = [...activeMissions, ...completedMissions]
  const completionPercentage =
    allMissions.length > 0 ? (completedMissions.length / allMissions.length) * 100 : 0

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="status-icon completed" />
      case 'in-progress':
        return <HourglassTopIcon className="status-icon in-progress" />
      default:
        return <PendingActionsIcon className="status-icon pending" />
    }
  }

  const handleToggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const openBriefing = (mission: any) => {
    setBriefingMission(mission)
  }

  const closeBriefing = () => {
    setBriefingMission(null)
  }

  const startMissionFromBriefing = () => {
    if (!briefingMission) return
    const game = phaserGame.scene.keys.game as Game
    const network = game?.network
    network?.startMission(briefingMission.id)
    closeBriefing()
  }

  const MissionItem = ({ mission }: { mission: any }) => (
    <div
      className={`mission-card ${mission.status} ${expandedId === mission.id ? 'expanded' : ''}`}
    >
      <div className="mission-card__header" onClick={() => handleToggleExpand(mission.id)}>
        <div className="mission-card__icon">{getStatusIcon(mission.status)}</div>
        <div className="mission-card__title-group">
          <div className="mission-card__meta">
            <span className="mission-card__control">{mission.controlId || mission.isoControl}</span>
            <span className={`mission-card__status-badge status-${mission.status}`}>
              {mission.status}
            </span>
          </div>
          <div className="mission-card__name">{mission.title || mission.name}</div>
        </div>
        <div className="mission-card__expand">
          <ExpandMoreIcon
            style={{
              transform: expandedId === mission.id ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s',
            }}
          />
        </div>
      </div>

      {expandedId === mission.id && (
        <div className="mission-card__content">
          {(() => {
            const evidenceCount = Array.isArray(mission.collectedEvidence)
              ? mission.collectedEvidence.length
              : mission.evidenceCollected || 0
            const requiredCount = mission.evidenceRequired?.length || 0
            const progress = requiredCount > 0 ? (evidenceCount / requiredCount) * 100 : 0

            return (
              <>
                <div className="mission-section">
                  <div className="mission-label">Description</div>
                  <div className="mission-text">{mission.description}</div>
                </div>

                <div className="mission-section">
                  <div className="mission-label">
                    Evidence: {evidenceCount} / {requiredCount}
                  </div>
                  <div className="pixel-progress-bar">
                    <div
                      className="pixel-progress-fill"
                      style={{
                        width: `${progress}%`,
                      }}
                    />
                  </div>
                </div>

                {mission.evidenceRequired && mission.evidenceRequired.length > 0 && (
                  <div className="mission-section">
                    <div className="mission-label">Required Evidence</div>
                    <div className="mission-chips">
                      {mission.evidenceRequired.map((evidence: string, idx: number) => (
                        <span key={idx} className="pixel-chip">
                          {evidence}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mission-section">
                  <button className="pixel-btn secondary" onClick={() => openBriefing(mission)}>
                    OPEN BRIEFING
                  </button>
                </div>

                {mission.compliance && (
                  <div className="mission-section">
                    <div className="mission-label">Compliance Status</div>
                    <span className={`pixel-chip compliance-${mission.compliance}`}>
                      {mission.compliance}
                    </span>
                  </div>
                )}

                {mission.justification && (
                  <div className="mission-section">
                    <div className="mission-label">Notes</div>
                    <div className="mission-text note-box">{mission.justification}</div>
                  </div>
                )}
              </>
            )
          })()}
        </div>
      )}
    </div>
  )

  return (
    <>
      <div className="audit-mission-panel">
        <div className="panel-header">
          <div className="panel-title-row">
            <h2 className="panel-title">Missions Progress</h2>
            <span className="panel-stats">
              {completedMissions.length} / {allMissions.length} DONE
            </span>
          </div>
          <div className="pixel-progress-bar large">
            <div className="pixel-progress-fill" style={{ width: `${completionPercentage}%` }} />
          </div>
        </div>

        <div className="missions-container">
          {activeMissions.length > 0 && (
            <div className="mission-group">
              <h3 className="group-title">Active Missions</h3>
              {activeMissions.map((mission) => (
                <MissionItem key={mission.id} mission={mission} />
              ))}
            </div>
          )}

          {completedMissions.length > 0 && (
            <div className="mission-group">
              <h3 className="group-title completed-title">Completed</h3>
              {completedMissions.map((mission) => (
                <MissionItem key={mission.id} mission={mission} />
              ))}
            </div>
          )}

          {allMissions.length === 0 && (
            <div className="empty-panel-state">
              No missions available. Start an audit session to begin.
            </div>
          )}
        </div>
      </div>

      <MissionBriefing
        open={!!briefingMission}
        mission={briefingMission}
        onClose={closeBriefing}
        onStart={startMissionFromBriefing}
      />
    </>
  )
}
