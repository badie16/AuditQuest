import { ItemType } from '../../../types/Items'
import Item from './Item'

export default class Chair extends Item {
  itemDirection?: string
  isOccupied: boolean = false

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame)

    this.itemType = ItemType.CHAIR
  }

  onOverlapDialog() {
    if (this.isOccupied) {
      this.setDialogBox('Seat occupied')
    } else {
      this.setDialogBox('Press E to sit')
    }
  }
}
