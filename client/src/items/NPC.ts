import { ItemType } from '../../../types/Items'
import store from '../stores'
import AuditableObject from './AuditableObject'
import { openDialogue } from '../stores/DialogueStore'
import { sittingShiftData } from '../characters/Player'
import Chair from './Chair'

export default class NPC extends AuditableObject {
  npcName: string
  dialogueText: string
  npcTexture: string
  portrait: string
  targetObjectId?: string

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    npcName: string,
    dialogueText: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame)

    this.itemType = ItemType.NPC
    this.npcName = npcName
    this.dialogueText = dialogueText
    this.npcTexture = texture
    
    // Default portrait mapping based on texture name
    const portraitMap: Record<string, string> = {
      'adam': 'assets/images/login/Adam_login.png',
      'ash': 'assets/images/login/Ash_login.png',
      'lucy': 'assets/images/login/Lucy_login.png',
      'nancy': 'assets/images/login/Nancy_login.png'
    }
    this.portrait = portraitMap[texture] || portraitMap['adam']
    
    // Play idle animation by default
    this.anims.play(`${this.npcTexture}_idle_down`, true)
  }

  // Method to make the NPC sit on a specific chair intelligently
  sit(chair: Chair) {
    if (!chair.itemDirection) return

    chair.isOccupied = true // Mark chair as occupied
    const shift = sittingShiftData[chair.itemDirection]
    this.setPosition(chair.x + shift[0], chair.y + shift[1])
    this.setDepth(chair.depth + shift[2])
    
    // Crucial for static bodies: update the physics body position
    if (this.body instanceof Phaser.Physics.Arcade.StaticBody) {
      this.refreshBody()
    }
    
    // Play the sitting animation for this specific character
    this.anims.play(`${this.npcTexture}_sit_${chair.itemDirection}`, true)
  }

  onOverlapDialog() {
    this.setDialogBox(`Press F to talk to ${this.npcName}`)
  }

  talk() {
    store.dispatch(
      openDialogue({
        title: this.npcName,
        content: this.dialogueText,
        npcId: this.npcName.toLowerCase().replace(/\s/g, '_'),
        portrait: this.portrait,
      })
    )
  }
}
