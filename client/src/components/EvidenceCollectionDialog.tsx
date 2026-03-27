import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { closeEvidenceDialog } from '../stores/AuditStore'
import { AuditPoint } from '../items/AuditableObject'
import phaserGame from '../PhaserGame'
import Game from '../scenes/Game'
import { RootState } from '../stores'
import { BackgroundMode } from '../../../types/BackgroundMode'
import './AuditHUD.scss'

interface EvidenceCollectionDialogProps {
  open: boolean
  onClose: () => void
  objectName: string
  auditPoints: AuditPoint[]
}

export default function EvidenceCollectionDialog({
  open,
  onClose,
  objectName,
  auditPoints,
}: EvidenceCollectionDialogProps) {
  const dispatch = useDispatch()
  const [selectedPoint, setSelectedPoint] = useState<AuditPoint | null>(null)
  const [evidenceType, setEvidenceType] = useState<
    'document' | 'log' | 'config' | 'interview' | 'observation'
  >('observation')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState(objectName)
  const [notes, setNotes] = useState('')
  const [errors, setErrors] = useState<string[]>([])

  const activeMissions = useSelector((state: RootState) => state.audit.activeMissions) || []
  const targetId = useSelector((state: RootState) => state.audit.evidenceTargetId)
  const backgroundMode = useSelector((state: RootState) => state.user.backgroundMode)

  if (!open) return null

  const themeClass = backgroundMode === BackgroundMode.DAY ? 'theme-day' : 'theme-night'

  const handleSelectPoint = (point: AuditPoint) => {
    setSelectedPoint(point)
    setEvidenceType(point.type as any)
    setDescription(point.description)
  }

  const validateForm = (): boolean => {
    const newErrors: string[] = []
    if (!description.trim()) newErrors.push('Description required')
    if (!location.trim()) newErrors.push('Location required')
    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleCollectEvidence = () => {
    if (!validateForm()) return

    const game = phaserGame.scene.keys.game as Game
    const network = game.network

    if (network) {
      const mission = activeMissions.find(m => m.targetObjectId === targetId)
      const missionId = mission?.id || 'a5-1'

      network.addEvidence(missionId, evidenceType, description, location)
      dispatch(closeEvidenceDialog())
    }
  }

  return (
    <div className={`audit-hud dialog-overlay mission-style ${themeClass}`}>
      <div className="audit-hud__container dialog-container mission-intel-container">
        <div className="audit-hud__header mission-header">
          <div className="header-status">
            <span className="blink-dot"></span>
            SCANNING TARGET: {objectName.toUpperCase()}
          </div>
          <button className="audit-hud__close" onClick={onClose}>✕</button>
        </div>

        <div className="mission-intel-layout">
          {/* Left Column: Target Info */}
          <div className="intel-sidebar">
            <div className="sidebar-section">
              <h3 className="section-title">Available Intel</h3>
              <div className="pixel-chips-column">
                {auditPoints.map((point) => (
                  <button
                    key={point.id}
                    className={`intel-point-btn ${selectedPoint?.id === point.id ? 'active' : ''}`}
                    onClick={() => handleSelectPoint(point)}
                  >
                    <span className="point-type">[{point.type.substring(0, 3).toUpperCase()}]</span>
                    <span className="point-name">{point.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {selectedPoint && (
              <div className="sidebar-section mt-16 animate-fade-in">
                <h3 className="section-title">Point Details</h3>
                <div className="intel-details-box">
                  <div className="detail-row">
                    <span className="label">TARGET:</span>
                    <span className="value">{objectName}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">CONTROLS:</span>
                    <div className="chips-inline">
                      {selectedPoint.relatedControls.map(c => (
                        <span key={c} className="pixel-chip small">{c}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="sidebar-decor">
              <div className="decor-line"></div>
              <div className="decor-dots"></div>
            </div>
          </div>

          {/* Right Column: Collection Form */}
          <div className="intel-main">
            <h3 className="section-title">Evidence Log Entry</h3>
            
            <div className="pixel-form">
              {errors.length > 0 && (
                <div className="pixel-alert error mb-16">
                  {errors.map((error, idx) => <div key={idx}>! {error.toUpperCase()}</div>)}
                </div>
              )}

              <div className="form-grid">
                <div className="form-section">
                  <label className="pixel-label">Collection Type</label>
                  <select 
                    className="pixel-input select"
                    value={evidenceType}
                    onChange={(e) => setEvidenceType(e.target.value as any)}
                  >
                    <option value="observation">OBSERVATION</option>
                    <option value="document">DOCUMENT</option>
                    <option value="log">SYSTEM LOG</option>
                    <option value="config">CONFIGURATION</option>
                    <option value="interview">INTERVIEW</option>
                  </select>
                </div>

                <div className="form-section">
                  <label className="pixel-label">Site Location</label>
                  <input
                    type="text"
                    className="pixel-input"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-section">
                <label className="pixel-label">Data Description</label>
                <textarea
                  className="pixel-input textarea"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Input detailed evidence description..."
                />
              </div>

              <div className="form-section">
                <label className="pixel-label">Field Notes</label>
                <textarea
                  className="pixel-input textarea"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional observations (optional)..."
                />
              </div>
            </div>

            <div className="intel-footer-decor">
              DATA SECURE // AUDIT MODE V1.0 // {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>

        <div className="dialog-actions mission-actions">
          <button className="pixel-btn secondary" onClick={onClose}>ABORT</button>
          <button className="pixel-btn primary" onClick={handleCollectEvidence}>COLLECT DATA</button>
        </div>
      </div>
    </div>
  )
}
