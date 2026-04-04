import Phaser from 'phaser'

// import { debugDraw } from '../utils/debug'
import { createCharacterAnims } from '../anims/CharacterAnims'

import Item from '../items/Item'
import Chair from '../items/Chair'
import Computer from '../items/Computer'
import Whiteboard from '../items/Whiteboard'
import VendingMachine from '../items/VendingMachine'
import NPC from '../items/NPC'
import '../characters/MyPlayer'
import '../characters/OtherPlayer'
import MyPlayer from '../characters/MyPlayer'
import OtherPlayer from '../characters/OtherPlayer'
import PlayerSelector from '../characters/PlayerSelector'
import Network from '../services/Network'
import { IPlayer } from '../../../types/IOfficeState'
import { PlayerBehavior } from '../../../types/PlayerBehavior'
import { ItemType } from '../../../types/Items'

import store from '../stores'
import { setFocused, setShowChat } from '../stores/ChatStore'
import { setCurrentRoom } from '../stores/UserStore'
import { openEvidenceDialog } from '../stores/AuditStore'
import { NavKeys, Keyboard } from '../../../types/KeyboardState'
import { NPCS_DATA } from '../../../types/AuditData'

export default class Game extends Phaser.Scene {
  network!: Network
  private cursors!: NavKeys
  private keyE!: Phaser.Input.Keyboard.Key
  private keyR!: Phaser.Input.Keyboard.Key
  private keyF!: Phaser.Input.Keyboard.Key
  private map!: Phaser.Tilemaps.Tilemap
  private frameCounter = 0
  private roomShadowOverlay!: Phaser.GameObjects.RenderTexture
  private roomLightHole!: Phaser.GameObjects.Graphics
  myPlayer!: MyPlayer
  private playerSelector!: Phaser.GameObjects.Zone
  private otherPlayers!: Phaser.Physics.Arcade.Group
  private otherPlayerMap = new Map<string, OtherPlayer>()
  private itemMap = new Map<string, Item>()
  computerMap = new Map<string, Computer>()
  private whiteboardMap = new Map<string, Whiteboard>()
  private npcMap = new Map<string, NPC>()
  private vendingMachineMap = new Map<string, VendingMachine>()

  constructor() {
    super('game')
  }

  registerKeys() {
    this.cursors = {
      ...this.input.keyboard.createCursorKeys(),
      ...(this.input.keyboard.addKeys('W,S,A,D') as Keyboard),
    }

    // maybe we can have a dedicated method for adding keys if more keys are needed in the future
    this.keyE = this.input.keyboard.addKey('E')
    this.keyR = this.input.keyboard.addKey('R')
    this.keyF = this.input.keyboard.addKey('F')
    this.input.keyboard.disableGlobalCapture()
    this.input.keyboard.on('keydown-ENTER', (event) => {
      store.dispatch(setShowChat(true))
      store.dispatch(setFocused(true))
    })
    this.input.keyboard.on('keydown-ESC', (event) => {
      store.dispatch(setShowChat(false))
    })
  }

  disableKeys() {
    this.input.keyboard.enabled = false
  }

  enableKeys() {
    this.input.keyboard.enabled = true
  }

  create(data: { network: Network }) {
    if (!data.network) {
      throw new Error('server instance missing')
    } else {
      this.network = data.network
    }

    createCharacterAnims(this.anims)

    this.map = this.make.tilemap({ key: 'tilemap' })
    const FloorAndGround = this.map.addTilesetImage('FloorAndGround', 'tiles_wall')

    const groundLayer = this.map.createLayer('Ground', FloorAndGround)
    groundLayer.setCollisionByProperty({ collides: true })

    // debugDraw(groundLayer, this)

    this.myPlayer = this.add.myPlayer(705, 500, 'adam', this.network.mySessionId)
    this.playerSelector = new PlayerSelector(this, 0, 0, 32, 32)

    // import chair objects from Tiled map to Phaser
    const chairs = this.physics.add.staticGroup({ classType: Chair })
    const chairLayer = this.map.getObjectLayer('Chair')
    chairLayer.objects.forEach((chairObj) => {
      const item = this.addObjectFromTiled(chairs, chairObj, 'chairs', 'chair') as Chair
      // custom properties[0] is the object direction specified in Tiled
      item.itemDirection = chairObj.properties[0].value
    })

    // import computers objects from Tiled map to Phaser
    const computers = this.physics.add.staticGroup({ classType: Computer })
    const computerLayer = this.map.getObjectLayer('Computer')
    computerLayer.objects.forEach((obj, i) => {
      const item = this.addObjectFromTiled(computers, obj, 'computers', 'computer') as Computer
      item.setDepth(item.y + item.height * 0.27)
      // Check for a custom "id" property in Tiled, otherwise use the index
      const id = obj.properties?.find((p) => p.name === 'id')?.value?.toString() || `${i}`
      item.id = id
      this.computerMap.set(id, item)
      this.itemMap.set(id, item)
    })

    // import whiteboards objects from Tiled map to Phaser
    const whiteboards = this.physics.add.staticGroup({ classType: Whiteboard })
    const whiteboardLayer = this.map.getObjectLayer('Whiteboard')
    whiteboardLayer.objects.forEach((obj, i) => {
      const item = this.addObjectFromTiled(
        whiteboards,
        obj,
        'whiteboards',
        'whiteboard'
      ) as Whiteboard
      const id = obj.properties?.find((p) => p.name === 'id')?.value?.toString() || `${i}`
      item.id = id
      this.whiteboardMap.set(id, item)
      this.itemMap.set(id, item)
    })

    // import vending machine objects from Tiled map to Phaser
    const vendingMachines = this.physics.add.staticGroup({ classType: VendingMachine })
    const vendingMachineLayer = this.map.getObjectLayer('VendingMachine')
    vendingMachineLayer.objects.forEach((obj, i) => {
      const item = this.addObjectFromTiled(
        vendingMachines,
        obj,
        'vendingmachines',
        'vendingmachine'
      ) as VendingMachine
      const id = obj.properties?.find((p) => p.name === 'id')?.value?.toString() || `vending_${i}`
      item.id = id
      this.vendingMachineMap.set(id, item)
      this.itemMap.set(id, item)
    })

    // import other objects from Tiled map to Phaser
    this.addGroupFromTiled('Wall', 'tiles_wall', 'FloorAndGround', false)
    this.addGroupFromTiled('Objects', 'office', 'Modern_Office_Black_Shadow', false)
    this.addGroupFromTiled('ObjectsOnCollide', 'office', 'Modern_Office_Black_Shadow', true)
    this.addGroupFromTiled('GenericObjects', 'generic', 'Generic', false)
    this.addGroupFromTiled('GenericObjectsOnCollide', 'generic', 'Generic', true)
    this.addGroupFromTiled('Basement', 'basement', 'Basement', true)

    this.otherPlayers = this.physics.add.group({ classType: OtherPlayer })

    // Spawn NPCs dynamically from NPCS_DATA
    const npcs = this.physics.add.staticGroup({ classType: NPC })
    const allChairs = chairs.getChildren() as Chair[]

    NPCS_DATA.forEach((data, index) => {
      // Find a suitable chair for each NPC based on their data or index
      // In a real scenario, we might want to specify chair IDs in NPCS_DATA
      const chairIndex =
        data.id === 'npc_director'
          ? 8
          : data.id === 'npc_manager'
            ? 15
            : data.id === 'npc_hr'
              ? 10
              : 20

      if (allChairs[chairIndex]) {
        // Instantiate NPC with the correct arguments (including portrait)
        const npc = npcs.get(0, 0, data.texture) as NPC
        npc.npcName = data.name
        npc.dialogueText = data.dialogue
        npc.portrait = data.portrait // Set property
        npc.targetObjectId = data.id // Set targetObjectId for evidence linking

        // Re-initialize using constructor-like logic if needed, or simply ensure properties are set.
        // Since Phaser group.get() reuses objects, we must manually set properties if the constructor isn't called again.
        // However, here we are likely creating new ones initially.
        // Let's ensure the sprite uses the correct frame/anim
        npc.anims.play(`${data.texture}_idle_down`, true)

        npc.sit(allChairs[chairIndex])
        this.npcMap.set(data.id, npc)
        this.itemMap.set(data.id, npc)
      }
    })

    this.cameras.main.zoom = 1.5
    this.cameras.main.startFollow(this.myPlayer, true)

    this.createRoomLighting()

    this.physics.add.collider([this.myPlayer, this.myPlayer.playerContainer], groundLayer)
    this.physics.add.collider([this.myPlayer, this.myPlayer.playerContainer], vendingMachines)

    this.physics.add.overlap(
      this.playerSelector,
      [chairs, computers, whiteboards, vendingMachines, npcs],
      this.handleItemSelectorOverlap,
      undefined,
      this
    )

    this.physics.add.overlap(
      this.myPlayer,
      this.otherPlayers,
      this.handlePlayersOverlap,
      undefined,
      this
    )

    // register network event listeners
    this.network.onPlayerJoined(this.handlePlayerJoined, this)
    this.network.onPlayerLeft(this.handlePlayerLeft, this)
    this.network.onMyPlayerReady(this.handleMyPlayerReady, this)
    this.network.onMyPlayerVideoConnected(this.handleMyVideoConnected, this)
    this.network.onPlayerUpdated(this.handlePlayerUpdated, this)
    this.network.onItemUserAdded(this.handleItemUserAdded, this)
    this.network.onItemUserRemoved(this.handleItemUserRemoved, this)
    this.network.onChatMessageAdded(this.handleChatMessageAdded, this)

    // Handle mission star clicks
    this.events.on('mission-marker-clicked', this.handleMissionMarkerClicked, this)

    // Initial sync
    this.syncMissions()
    this.updateRoomIndicator()
    this.updateRoomLighting()
  }

  private handleMissionMarkerClicked(targetId: string) {
    if (!targetId) return

    const activeMissions = store.getState().audit.activeMissions
    const mission = activeMissions.find(
      (m) =>
        m.targetObjectId === targetId &&
        (m.status === 'pending' || m.status === 'in-progress')
    )

    if (mission) {
      console.log('[Audit] Mission marker clicked. Opening dialog for:', mission.title)
      store.dispatch(
        openEvidenceDialog({
          targetName: mission.title,
          targetId: targetId,
        })
      )
    }
  }

  private handleItemSelectorOverlap(playerSelector, selectionItem) {
    const currentItem = playerSelector.selectedItem as Item

    // Always prioritize NPCs over any other item if they overlap
    if (currentItem?.itemType === ItemType.NPC && selectionItem.itemType !== ItemType.NPC) {
      return
    }

    // if selection changes, clear pervious dialog
    if (currentItem && currentItem !== selectionItem) {
      if (this.myPlayer.playerBehavior !== PlayerBehavior.SITTING) currentItem.clearDialogBox()
    }

    // set selected item and set up new dialog
    playerSelector.selectedItem = selectionItem
    selectionItem.onOverlapDialog()
  }

  private addObjectFromTiled(
    group: Phaser.Physics.Arcade.StaticGroup,
    object: Phaser.Types.Tilemaps.TiledObject,
    key: string,
    tilesetName: string
  ) {
    const actualX = object.x! + object.width! * 0.5
    const actualY = object.y! - object.height! * 0.5
    const obj = group
      .get(actualX, actualY, key, object.gid! - this.map.getTileset(tilesetName).firstgid)
      .setDepth(actualY)
    return obj
  }

  private addGroupFromTiled(
    objectLayerName: string,
    key: string,
    tilesetName: string,
    collidable: boolean
  ) {
    const group = this.physics.add.staticGroup()
    const objectLayer = this.map.getObjectLayer(objectLayerName)
    objectLayer.objects.forEach((object) => {
      const actualX = object.x! + object.width! * 0.5
      const actualY = object.y! - object.height! * 0.5
      group
        .get(actualX, actualY, key, object.gid! - this.map.getTileset(tilesetName).firstgid)
        .setDepth(actualY)
    })
    if (this.myPlayer && collidable)
      this.physics.add.collider([this.myPlayer, this.myPlayer.playerContainer], group)
  }

  // function to add new player to the otherPlayer group
  private handlePlayerJoined(newPlayer: IPlayer, id: string) {
    const otherPlayer = this.add.otherPlayer(newPlayer.x, newPlayer.y, 'adam', id, newPlayer.name)
    this.otherPlayers.add(otherPlayer)
    this.otherPlayerMap.set(id, otherPlayer)
  }

  // function to remove the player who left from the otherPlayer group
  private handlePlayerLeft(id: string) {
    if (this.otherPlayerMap.has(id)) {
      const otherPlayer = this.otherPlayerMap.get(id)
      if (!otherPlayer) return
      this.otherPlayers.remove(otherPlayer, true, true)
      this.otherPlayerMap.delete(id)
    }
  }

  private handleMyPlayerReady() {
    this.myPlayer.readyToConnect = true
  }

  private handleMyVideoConnected() {
    this.myPlayer.videoConnected = true
  }

  // function to update target position upon receiving player updates
  private handlePlayerUpdated(field: string, value: number | string, id: string) {
    const otherPlayer = this.otherPlayerMap.get(id)
    otherPlayer?.updateOtherPlayer(field, value)
  }

  private handlePlayersOverlap(myPlayer, otherPlayer) {
    otherPlayer.makeCall(myPlayer, this.network?.webRTC)
  }

  private handleItemUserAdded(playerId: string, itemId: string, itemType: ItemType) {
    if (itemType === ItemType.COMPUTER) {
      const computer = this.computerMap.get(itemId)
      computer?.addCurrentUser(playerId)
    } else if (itemType === ItemType.WHITEBOARD) {
      const whiteboard = this.whiteboardMap.get(itemId)
      whiteboard?.addCurrentUser(playerId)
    }
  }

  private handleItemUserRemoved(playerId: string, itemId: string, itemType: ItemType) {
    if (itemType === ItemType.COMPUTER) {
      const computer = this.computerMap.get(itemId)
      computer?.removeCurrentUser(playerId)
    } else if (itemType === ItemType.WHITEBOARD) {
      const whiteboard = this.whiteboardMap.get(itemId)
      whiteboard?.removeCurrentUser(playerId)
    }
  }

  private handleChatMessageAdded(playerId: string, content: string) {
    const otherPlayer = this.otherPlayerMap.get(playerId)
    otherPlayer?.updateDialogBubble(content)
  }

  private syncMissions() {
    const activeMissions = store.getState().audit.activeMissions
    console.log('[Audit] syncMissions called. Active missions:', activeMissions.length)

    // Reset all markers first
    this.itemMap.forEach((item) => item.setMissionStatus('none'))
    this.npcMap.forEach((item) => item.setMissionStatus('none'))
    this.computerMap.forEach((item) => item.setMissionStatus('none'))
    this.whiteboardMap.forEach((item) => item.setMissionStatus('none'))
    this.vendingMachineMap.forEach((item) => item.setMissionStatus('none'))

    // Set markers for objects that have active missions
    activeMissions.forEach((mission) => {
      console.log(
        `[Audit] Checking mission ${mission.id} status: ${mission.status} target: ${mission.targetObjectId}`
      )
      // Show markers for all non-completed missions (to perform as tasks)
      if (mission.status !== 'completed') {
        if (mission.targetObjectId) {
          // Check all maps for the target object
          const item =
            this.itemMap.get(mission.targetObjectId) ||
            this.npcMap.get(mission.targetObjectId) ||
            this.computerMap.get(mission.targetObjectId) ||
            this.whiteboardMap.get(mission.targetObjectId) ||
            this.vendingMachineMap.get(mission.targetObjectId)

          const hasEvidence = mission.evidenceCollected > 0

          if (item) {
            console.log(
              `[Audit] SUCCESS: Found item for target ${mission.targetObjectId}. Setting status.`
            )
            item.setMissionStatus(hasEvidence ? 'completed' : 'active')
          } else {
            console.warn(
              `[Audit] WARNING: Target item ${mission.targetObjectId} not found in any map!`
            )
          }
        }
      }
    })
  }

  private updateRoomIndicator() {
    if (!this.myPlayer) return

    const x = this.myPlayer.x
    const y = this.myPlayer.y
    let roomName = 'Main Office'

    // Define room boundaries (approximate based on map layout)
    if (x < 400 && y < 450) roomName = 'Server Room'
    else if (x > 1000 && y < 450) roomName = 'Meeting Room'
    else if (x > 900 && y > 700) roomName = 'Break Room'
    else if (x < 450 && y > 700) roomName = 'Director Office'
    else if (y > 900) roomName = 'Basement'

    const currentRoom = store.getState().user.currentRoom
    if (roomName !== currentRoom) {
      store.dispatch(setCurrentRoom(roomName))
    }
  }

  private createRoomLighting() {
    const width = this.cameras.main.width
    const height = this.cameras.main.height

    this.roomShadowOverlay = this.add
      .renderTexture(0, 0, width, height)
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(9000)

    this.roomLightHole = this.add
      .graphics()
      .setScrollFactor(0)
      .setDepth(9000)
      .setBlendMode(Phaser.BlendModes.ERASE)

    this.updateRoomLighting()
  }

  private updateRoomLighting() {
    if (!this.myPlayer || !this.roomShadowOverlay) return

    const rt = this.roomShadowOverlay
    const camera = this.cameras.main

    const holeSize = 250
    const radius = holeSize / 2

    const screenX = Phaser.Math.Clamp(
      this.myPlayer.x - camera.scrollX,
      radius,
      camera.width - radius
    )

    const screenY = Phaser.Math.Clamp(
      this.myPlayer.y - camera.scrollY,
      radius,
      camera.height - radius
    )

    // clear previous frame
    rt.clear()

    // draw dark overlay
    rt.fill(0x000000, 0.9)

    // create circular transparent hole around the player
    const graphics = this.add.graphics()
    graphics.fillStyle(0xffffff)
    graphics.fillCircle(screenX, screenY, radius)

    // erase the circle from the overlay
    rt.erase(graphics)

    graphics.destroy()
  }

  update(t: number, dt: number) {
    this.frameCounter += 1

    if (this.myPlayer && this.network) {
      this.playerSelector.update(this.myPlayer, this.cursors)
      this.myPlayer.update(
        this.playerSelector,
        this.cursors,
        this.keyE,
        this.keyR,
        this.keyF,
        this.network
      )
    }

    // Only sync missions and room every 30 frames for performance
    if (this.frameCounter % 30 === 0) {
      this.syncMissions()
      this.updateRoomIndicator()
      this.updateRoomLighting()
    }
  }
}
