import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../stores'
import phaserGame from '../PhaserGame'
import Game from '../scenes/Game'

export default function EvidenceTab() {
  const evidence = useSelector((state: RootState) => state.audit.collectedEvidence) || []
  const auditRole = useSelector((state: RootState) => state.user.auditRole)
  const documentEvidence = evidence.filter((item: any) => item.type === 'document')

  const handleVerifyEvidence = (evidenceId: string, verified: boolean) => {
    const game = phaserGame.scene.keys.game as Game
    const network = game?.network
    if (!network) return
    network.verifyEvidence(evidenceId, verified)
  }

  return (
    <div className="audit-tab-content">
      <div className="tab-header mt-24">
        <h2 className="tab-title">Evidence Log ({evidence.length})</h2>
      </div>

      {evidence.length === 0 ? (
        <div className="empty-panel-state">
          No evidence has been collected yet. Interact with mission targets in the office to log
          proof.
        </div>
      ) : (
        <div className="pixel-table-container">
          <table className="pixel-table">
            <thead>
              <tr>
                <th>Evidence Type</th>
                <th>Description</th>
                <th>Source</th>
                <th>Review Status</th>
                <th>Time Logged</th>
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
                            Unverify
                          </button>
                        ) : (
                          <button
                            className="pixel-btn primary"
                            onClick={() => handleVerifyEvidence(item.id, true)}
                          >
                            Confirm
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
          <h3 className="card-title">Evidence Overview</h3>
          <div className="summary-grid">
            <div
              className="summary-item"
              style={{ background: '#232d3d', padding: '24px', border: '3px solid #000' }}
            >
              <span className="pixel-label" style={{ display: 'block', marginBottom: '8px' }}>
                TOTAL ITEMS
              </span>
              <span
                className="summary-count"
                style={{ fontSize: '24px', display: 'block', color: 'var(--text-accent)' }}
              >
                {evidence.length} Items
              </span>
            </div>
            <div
              className="summary-item"
              style={{ background: '#232d3d', padding: '24px', border: '3px solid #000' }}
            >
              <span className="pixel-label" style={{ display: 'block', marginBottom: '8px' }}>
                CONFIRMED
              </span>
              <span
                className="summary-count"
                style={{ fontSize: '24px', display: 'block', color: 'var(--text-accent)' }}
              >
                {evidence.filter((e: any) => e.verified).length} / {evidence.length}
              </span>
            </div>
          </div>
        </div>
      )}

      {documentEvidence.length > 0 && (
        <div className="summary-card pixel-card mt-24">
          <h3 className="card-title">Document Previews</h3>
          <div className="summary-grid">
            {documentEvidence.map((item: any) => (
              <div
                key={item.id}
                style={{
                  background: '#f4e4c2',
                  color: '#1b1b1b',
                  border: '4px solid #1b1b1b',
                  boxShadow: '4px 4px 0 #000',
                  padding: '14px',
                  display: 'grid',
                  gap: '8px',
                }}
              >
                <div className="pixel-chip" style={{ margin: 0, width: 'fit-content' }}>
                  DOCUMENT
                </div>
                <div style={{ fontSize: '14px', lineHeight: 1.6, fontWeight: 700 }}>
                  {item.description}
                </div>
                <div style={{ fontSize: '11px', lineHeight: 1.6, opacity: 0.85 }}>
                  Source: {item.location}
                </div>
                <div
                  style={{
                    background: '#fff8ea',
                    border: '3px solid #1b1b1b',
                    padding: '10px',
                    fontFamily: 'Courier New, monospace',
                    fontSize: '11px',
                    lineHeight: 1.8,
                    display: 'grid',
                    gap: '4px',
                  }}
                >
                  <div>• Classification: Audit evidence</div>
                  <div>• Review status: {item.verified ? 'Confirmed' : 'Pending review'}</div>
                  <div>• Logged at: {new Date(item.collectionTime).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
