import Item from './Item'
import Network from '../services/Network'

export interface AuditPoint {
  id: string
  name: string
  description: string
  type: 'document' | 'log' | 'config' | 'interview' | 'observation'
  relatedControls: string[]
  location: string
}

export default class AuditableObject extends Item {
  auditPoints: AuditPoint[] = []
  isAuditable: boolean = true
  lastAuditedBy?: string
  auditCount: number = 0

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame)
    this.isAuditable = true
  }

  /**
   * Register audit points for this object
   * Each audit point represents evidence that can be collected
   */
  setAuditPoints(points: AuditPoint[]) {
    this.auditPoints = points
  }

  /**
   * Get audit points filtered by control
   */
  getAuditPointsByControl(controlId: string): AuditPoint[] {
    return this.auditPoints.filter((point) => point.relatedControls.includes(controlId))
  }

  /**
   * Called when player interacts with this object for audit
   */
  onAuditInteraction(playerId: string, network: Network) {
    this.lastAuditedBy = playerId
    this.auditCount++
    this.updateAuditStatus()
  }

  /**
   * Update the visual status display for audit
   */
  private updateAuditStatus() {
    this.clearStatusBox()
    // Disabled to use mission stars instead of default white dots
    /*
    if (this.auditCount > 0) {
      this.setStatusBox(`Audited ${this.auditCount}x`)
    } else {
      this.setStatusBox('Ready for audit')
    }
    */
  }

  /**
   * Get all available evidence from this object
   */
  getAvailableEvidence(): string[] {
    return this.auditPoints.map((point) => point.description)
  }

  /**
   * Check if this object has been audited for a specific control
   */
  hasBeenAuditedForControl(controlId: string): boolean {
    return (
      this.auditCount > 0 &&
      this.auditPoints.some((point) => point.relatedControls.includes(controlId))
    )
  }

  /**
   * Reset audit data (useful for test scenarios)
   */
  resetAuditData() {
    this.lastAuditedBy = undefined
    this.auditCount = 0
    this.clearStatusBox()
  }
}
