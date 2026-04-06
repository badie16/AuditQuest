import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentMission } from '../stores/AuditStore'
import { RootState } from '../stores'
import { BackgroundMode } from '../../../types/BackgroundMode'
import { STORY_CHAPTERS, STORY_COMPANY } from '../../../types/AuditData'
import './AuditHUD.scss'

interface MissionBriefingProps {
  open: boolean
  mission: any | null
  onClose: () => void
  onStart: () => void
}

export default function MissionBriefing({ open, mission, onClose, onStart }: MissionBriefingProps) {
  const dispatch = useDispatch()
  const backgroundMode = useSelector((state: RootState) => state.user.backgroundMode)

  if (!open || !mission) return null

  const handleStart = () => {
    dispatch(setCurrentMission(mission))
    onStart()
  }

  const collectedEvidenceCount = Array.isArray(mission.collectedEvidence)
    ? mission.collectedEvidence.length
    : mission.evidenceCollected || 0

  const completionPercentage = mission.evidenceRequired?.length
    ? (collectedEvidenceCount / mission.evidenceRequired.length) * 100
    : 0

  const chapter = STORY_CHAPTERS.find((item) => item.id === mission.chapterId)

  const themeClass = backgroundMode === BackgroundMode.DAY ? 'theme-day' : 'theme-night'

  const controlId = mission.controlId || 'N/A'
  const missionTitle = mission.title || 'Untitled Mission'
  const missionZone = mission.category || mission.targetRoom || 'Office Area'

  return (
    <div className={`audit-hud mission-briefing-overlay ${themeClass}`}>
      <div className="audit-hud__container mission-briefing-container">
        <div className="audit-hud__header">
          <h1 className="audit-hud__title">Mission Briefing</h1>
          <button className="audit-hud__close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="audit-hud__content">
          <div className="mission-briefing-body">
            <div className="briefing-section">
              <div className="briefing-control-badge">ISO {controlId}</div>
              <div className="briefing-label">{STORY_COMPANY.name}</div>
              {chapter && (
                <div className="briefing-label">
                  Chapter {chapter.order}: {chapter.title}
                </div>
              )}
              <h2 className="briefing-title">{missionTitle}</h2>
            </div>

            <div className="briefing-card">
              <div className="briefing-label">Objective</div>
              <p className="briefing-text">{mission.description}</p>
              {mission.storyContext && (
                <p className="briefing-text small">{mission.storyContext}</p>
              )}
            </div>

            <div className="briefing-grid">
              <div className="briefing-stat">
                <div className="briefing-label">Location</div>
                <div className="briefing-value">{missionZone}</div>
                <div className="briefing-label" style={{ marginTop: '8px' }}>
                  Actor
                </div>
                <div className="briefing-value">{mission.actor || 'Unknown contact'}</div>
              </div>
              <div className="briefing-stat">
                <div className="briefing-label">Priority</div>
                <div className={`briefing-value priority-${mission.priority || 'medium'}`}>
                  {mission.priority || 'medium'}
                </div>
              </div>
            </div>

            <div className="briefing-section">
              <div className="briefing-label">
                Evidence Required ({collectedEvidenceCount}/{mission.evidenceRequired?.length || 0})
              </div>
              <div className="pixel-progress-bar large">
                <div
                  className="pixel-progress-fill"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>

              <div className="evidence-requirements-list">
                {mission.evidenceRequired?.map((req: string, idx: number) => (
                  <div key={idx} className="evidence-requirement-item">
                    • {req}
                  </div>
                ))}
              </div>
            </div>

            <div className="briefing-tips-card">
              <div className="briefing-label">Field Tips</div>
              <p className="briefing-text small">
                Explore the office and interact with items. Look for files, terminal logs, and speak
                with staff members to gather necessary proof.
              </p>
              {mission.consequence && (
                <p className="briefing-text small">
                  If this control is weak: {mission.consequence}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="briefing-actions">
          <button className="pixel-btn secondary" onClick={onClose}>
            DECLINE
          </button>
          <button className="pixel-btn primary" onClick={handleStart}>
            {mission.status === 'completed' ? 'REVIEW' : 'ACCEPT MISSION'}
          </button>
        </div>
      </div>
    </div>
  )
}
