import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../stores'
import phaserGame from '../PhaserGame'
import Game from '../scenes/Game'

export default function EvidenceTab() {
  const evidence = useSelector((state: RootState) => state.audit.collectedEvidence) || []
  const auditRole = useSelector((state: RootState) => state.user.auditRole)

  const handleVerifyEvidence = (evidenceId: string, verified: boolean) => {
    const game = phaserGame.scene.keys.game as Game
    const network = game?.network
    if (!network) return
    network.verifyEvidence(evidenceId, verified)
  }

  return (
    <div className="audit-tab-content">
      <div className="tab-header mt-24">
        <h2 className="tab-title">Collected Evidence ({evidence.length})</h2>
      </div>

      {evidence.length === 0 ? (
        <div className="empty-panel-state">
          No evidence collected yet. Interact with objects in the office to collect evidence.
        </div>
      ) : (
        <div className="pixel-table-container">
          <table className="pixel-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Description</th>
                <th>Location</th>
                <th>Verification</th>
                <th>Collected At</th>
              </tr>
            </thead>
            <tbody>
              {evidence.map((item: any) => (
                <tr key={item.id}>
                  <td>
                    <span className={`pixel-chip evidence-${item.type}`}>{item.type}</span>
                  </td>
                  <td>
                    <div className="evidence-desc">{item.description}</div>
                    {item.notes && <div className="evidence-notes">{item.notes}</div>}
                  </td>
                  <td>{item.location}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span
                        className={`pixel-chip ${item.verified ? 'evidence-document' : 'evidence-observation'}`}
                      >
                        {item.verified ? 'verified' : 'pending'}
                      </span>
                      {auditRole === 'auditor' &&
                        (item.verified ? (
                          <button
                            className="pixel-btn secondary"
                            onClick={() => handleVerifyEvidence(item.id, false)}
                          >
                            Revoke
                          </button>
                        ) : (
                          <button
                            className="pixel-btn primary"
                            onClick={() => handleVerifyEvidence(item.id, true)}
                          >
                            Verify
                          </button>
                        ))}
                    </div>
                  </td>
                  <td>
                    <span className="time-stamp">
                      {new Date(item.collectionTime).toLocaleTimeString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {evidence.length > 0 && (
        <div className="summary-card pixel-card mt-24">
          <h3 className="card-title">Evidence Summary</h3>
          <div className="summary-grid">
            <div className="summary-item" style={{ background: '#232d3d', padding: '24px', border: '3px solid #000' }}>
              <span className="pixel-label" style={{ display: 'block', marginBottom: '8px' }}>TOTAL</span>
              <span className="summary-count" style={{ fontSize: '24px', display: 'block', color: 'var(--text-accent)' }}>
                {evidence.length} Items
              </span>
            </div>
            <div className="summary-item" style={{ background: '#232d3d', padding: '24px', border: '3px solid #000' }}>
              <span className="pixel-label" style={{ display: 'block', marginBottom: '8px' }}>VERIFIED</span>
              <span className="summary-count" style={{ fontSize: '24px', display: 'block', color: 'var(--text-accent)' }}>
                {evidence.filter((e: any) => e.verified).length} / {evidence.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
