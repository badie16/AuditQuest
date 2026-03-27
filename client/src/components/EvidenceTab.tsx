import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../stores'

export default function EvidenceTab() {
  const evidence = useSelector((state: RootState) => state.audit.collectedEvidence) || []

  return (
    <div className="audit-tab-content">
      <div className="tab-header">
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
                <th>Collected At</th>
              </tr>
            </thead>
            <tbody>
              {evidence.map((item: any) => (
                <tr key={item.id}>
                  <td>
                    <span className={`pixel-chip evidence-${item.type}`}>
                      {item.type}
                    </span>
                  </td>
                  <td>
                    <div className="evidence-desc">{item.description}</div>
                    {item.notes && <div className="evidence-notes">{item.notes}</div>}
                  </td>
                  <td>{item.location}</td>
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
            {Object.entries(
              evidence.reduce((acc: Record<string, number>, item: any) => {
                acc[item.type] = (acc[item.type] || 0) + 1
                return acc
              }, {})
            ).map(([type, count]) => (
              <div key={type} className="summary-item">
                <span className={`pixel-chip evidence-${type}`}>{type}</span>
                <span className="summary-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
