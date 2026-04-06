import { Client, Room } from 'colyseus.js'
import { IComputer, IOfficeState, IPlayer, IWhiteboard } from '../../../types/IOfficeState'
import { AuditSession } from '../../../types/AuditTypes'
import { Message } from '../../../types/Messages'
import { IRoomData, RoomType } from '../../../types/Rooms'
import { ItemType } from '../../../types/Items'
import WebRTC from '../web/WebRTC'
import { phaserEvents, Event } from '../events/EventCenter'
import store from '../stores'
import {
  setSessionId,
  setPlayerNameMap,
  removePlayerNameMap,
  setAuditRole,
  upsertPlayerDirectory,
  removePlayerDirectory,
} from '../stores/UserStore'
import {
  setLobbyJoined,
  setJoinedRoomData,
  setAvailableRooms,
  addAvailableRooms,
  removeAvailableRooms,
} from '../stores/RoomStore'
import {
  pushChatMessage,
  pushPlayerJoinedMessage,
  pushPlayerLeftMessage,
} from '../stores/ChatStore'
import { setWhiteboardUrls } from '../stores/WhiteboardStore'
import {
  initializeAuditSession,
  addMission,
  addEvidence,
  updateEvidenceVerification,
  addJournalEntry,
  updateMissionStatus,
  updateMissionEvidence,
  addFinding,
  addRiskAssessment,
  updateAuditScore,
  addNotificationToState,
  syncAuditSessionMeta,
} from '../stores/AuditStore'

export default class Network {
  private client: Client
  private room?: Room<IOfficeState>
  private lobby!: Room
  webRTC?: WebRTC

  mySessionId!: string

  constructor() {
    const protocol = window.location.protocol.replace('http', 'ws')
    const endpoint =
      process.env.NODE_ENV === 'production'
        ? import.meta.env.VITE_SERVER_URL
        : `${protocol}//${window.location.hostname}:2567`
    this.client = new Client(endpoint)
    this.joinLobbyRoom().then(() => {
      store.dispatch(setLobbyJoined(true))
    })

    phaserEvents.on(Event.MY_PLAYER_NAME_CHANGE, this.updatePlayerName, this)
    phaserEvents.on(Event.MY_PLAYER_TEXTURE_CHANGE, this.updatePlayer, this)
    phaserEvents.on(Event.PLAYER_DISCONNECTED, this.playerStreamDisconnect, this)
  }

  async joinLobbyRoom() {
    this.lobby = await this.client.joinOrCreate(RoomType.LOBBY)

    this.lobby.onMessage('rooms', (rooms) => {
      store.dispatch(setAvailableRooms(rooms))
    })

    this.lobby.onMessage('+', ([roomId, room]) => {
      store.dispatch(addAvailableRooms({ roomId, room }))
    })

    this.lobby.onMessage('-', (roomId) => {
      store.dispatch(removeAvailableRooms(roomId))
    })
  }

  async joinOrCreatePublic() {
    this.room = await this.client.joinOrCreate(RoomType.PUBLIC)
    this.initialize()
  }

  async joinCustomById(roomId: string, password: string | null) {
    this.room = await this.client.joinById(roomId, { password })
    this.initialize()
  }

  async createCustom(roomData: IRoomData) {
    const { name, description, password, autoDispose } = roomData
    this.room = await this.client.create(RoomType.CUSTOM, {
      name,
      description,
      password,
      autoDispose,
    })
    this.initialize()
  }

  initialize() {
    if (!this.room) return

    this.lobby.leave()
    this.mySessionId = this.room.sessionId
    store.dispatch(setSessionId(this.room.sessionId))
    this.webRTC = new WebRTC(this.mySessionId, this)

    // --- AUDIT STATE SYNCHRONIZATION ---

    this.room.state.listen('auditSession', (currentValue) => {
      if (currentValue) {
        const session = currentValue as unknown as AuditSession
        store.dispatch(
          initializeAuditSession({
            sessionId: session.sessionId,
            status: session.status as any,
            startDate: new Date(session.startTime).toISOString(),
            currentChapterId: session.currentChapterId,
            currentChapterTitle: session.currentChapterTitle,
            currentChapterOrder: session.currentChapterOrder,
            campaignResult: session.campaignResult,
            campaignConclusion: session.campaignConclusion,
          })
        )
        store.dispatch(updateAuditScore(session.totalScore ?? 100))

        const syncSessionMeta = () => {
          store.dispatch(updateAuditScore(session.totalScore ?? 100))
          store.dispatch(
            syncAuditSessionMeta({
              status: session.status as any,
              currentChapterId: session.currentChapterId,
              currentChapterTitle: session.currentChapterTitle,
              currentChapterOrder: session.currentChapterOrder,
              campaignResult: session.campaignResult as any,
              campaignConclusion: session.campaignConclusion,
            })
          )
        }

        // Keep chapter and campaign progression synchronized live.
        ;(currentValue as any).onChange = () => {
          syncSessionMeta()
        }

        syncSessionMeta()

        // Trigger marker update once session is loaded
        phaserEvents.emit(Event.UPDATE_AUDIT_STATE)
      }
    })

    this.room.state.missions.onAdd = (mission, key) => {
      store.dispatch(
        addMission({
          id: mission.id,
          controlId: mission.controlId,
          title: mission.title,
          description: mission.description,
          status: mission.status as any,
          priority: mission.priority as any,
          category: mission.category,
          evidenceRequired: Array.from(mission.evidenceRequired),
          evidenceCollected: mission.evidenceCollected,
          completionPercentage: mission.status === 'completed' ? 100 : 0,
          assignedTo: mission.assignedTo || '',
          createdAt: new Date(mission.createdAt).toISOString(),
          dueDate: mission.dueDate || '',
          targetObjectId: mission.targetObjectId,
          targetRoom: mission.targetRoom,
          chapterId: mission.chapterId,
          storyContext: mission.storyContext,
          actor: mission.actor,
          consequence: mission.consequence,
        })
      )

      mission.onChange = (changes) => {
        changes.forEach((change) => {
          if (change.field === 'status') {
            store.dispatch(
              updateMissionStatus({ missionId: mission.id, status: change.value as any })
            )
            phaserEvents.emit(Event.UPDATE_AUDIT_STATE)
          }
        })
      }

      mission.collectedEvidence.onAdd = (evId, index) => {
        store.dispatch(
          updateMissionEvidence({
            missionId: mission.id,
            evidenceCount: mission.collectedEvidence.length,
          })
        )
        phaserEvents.emit(Event.UPDATE_AUDIT_STATE)
      }
    }

    this.room.state.evidence.onAdd = (evidence, key) => {
      store.dispatch(
        addEvidence({
          id: evidence.id,
          missionId: evidence.missionId,
          type: evidence.type as any,
          description: evidence.description,
          location: evidence.location,
          collectionTime: evidence.collectionTime,
          auditorId: evidence.auditorId,
          verified: evidence.verified,
        })
      )

      evidence.onChange = (changes) => {
        changes.forEach((change) => {
          if (
            change.field === 'verified' ||
            change.field === 'verifiedBy' ||
            change.field === 'verifiedAt'
          ) {
            store.dispatch(
              updateEvidenceVerification({
                evidenceId: evidence.id,
                verified: evidence.verified,
                verifiedBy: evidence.verifiedBy,
                verifiedAt: evidence.verifiedAt,
              })
            )
          }
        })
      }
    }

    this.room.state.findings.onAdd = (finding, key) => {
      store.dispatch(
        addFinding({
          id: finding.id,
          missionId: finding.missionId,
          status: finding.status as any,
          evidence: Array.from(finding.evidence),
          justification: finding.justification,
          auditorId: finding.auditorId,
          createdAt: finding.createdAt,
          lastModified: finding.lastModified,
        })
      )
    }

    this.room.state.risks.onAdd = (risk, key) => {
      store.dispatch(
        addRiskAssessment({
          id: risk.id,
          findingId: risk.findingId,
          probability: risk.probability as any,
          impact: risk.impact as any,
          severity: risk.severity as any,
          recommendation: risk.recommendation,
          remediationDue: risk.remediationDue,
          createdAt: risk.createdAt,
        })
      )
    }

    this.room.state.journal.onAdd = (entry, key) => {
      store.dispatch(
        addJournalEntry({
          id: entry.id,
          timestamp: entry.timestamp,
          auditorId: entry.auditorId,
          action: entry.action,
          details: entry.details,
          missionId: entry.missionId,
          type: entry.type as any,
        })
      )
    }

    this.room.state.notifications.onAdd = (notification) => {
      store.dispatch(
        addNotificationToState({
          id: notification.id,
          timestamp: notification.timestamp,
          type: notification.type as any,
          title: notification.title,
          message: notification.message,
          action: notification.action,
          actionUrl: notification.actionUrl,
        })
      )
    }

    // --- OFFICE STATE SYNCHRONIZATION ---

    this.room.state.players.onAdd = (player: IPlayer, key: string) => {
      store.dispatch(
        upsertPlayerDirectory({
          id: key,
          name: player.name || 'Anonymous',
          role: player.role,
        })
      )

      if (key === this.mySessionId) {
        store.dispatch(setAuditRole(player.role))
        return
      }
      player.onChange = (changes) => {
        changes.forEach((change) => {
          const { field, value } = change
          if (field === 'role' && key === this.mySessionId) {
            store.dispatch(setAuditRole(value as any))
          }

          const nextName = field === 'name' ? String(value || '') : player.name
          const nextRole = field === 'role' ? (value as any) : player.role
          store.dispatch(
            upsertPlayerDirectory({
              id: key,
              name: nextName || 'Anonymous',
              role: nextRole,
            })
          )

          phaserEvents.emit(Event.PLAYER_UPDATED, field, value, key)
          if (field === 'name' && value !== '') {
            phaserEvents.emit(Event.PLAYER_JOINED, player, key)
            store.dispatch(setPlayerNameMap({ id: key, name: value }))
            store.dispatch(pushPlayerJoinedMessage(value))
          }
        })
      }
    }

    this.room.state.players.onRemove = (player: IPlayer, key: string) => {
      phaserEvents.emit(Event.PLAYER_LEFT, key)
      this.webRTC?.deleteVideoStream(key)
      this.webRTC?.deleteOnCalledVideoStream(key)
      store.dispatch(pushPlayerLeftMessage(player.name))
      store.dispatch(removePlayerNameMap(key))
      store.dispatch(removePlayerDirectory(key))
    }

    this.room.state.computers.onAdd = (computer: IComputer, key: string) => {
      computer.connectedUser.onAdd = (item, index) => {
        phaserEvents.emit(Event.ITEM_USER_ADDED, item, key, ItemType.COMPUTER)
      }
      computer.connectedUser.onRemove = (item, index) => {
        phaserEvents.emit(Event.ITEM_USER_REMOVED, item, key, ItemType.COMPUTER)
      }
    }

    this.room.state.whiteboards.onAdd = (whiteboard: IWhiteboard, key: string) => {
      store.dispatch(setWhiteboardUrls({ whiteboardId: key, roomId: whiteboard.roomId }))
      whiteboard.connectedUser.onAdd = (item, index) => {
        phaserEvents.emit(Event.ITEM_USER_ADDED, item, key, ItemType.WHITEBOARD)
      }
      whiteboard.connectedUser.onRemove = (item, index) => {
        phaserEvents.emit(Event.ITEM_USER_REMOVED, item, key, ItemType.WHITEBOARD)
      }
    }

    this.room.state.chatMessages.onAdd = (item, index) => {
      store.dispatch(pushChatMessage(item))
    }

    this.room.onMessage(Message.SEND_ROOM_DATA, (content) => {
      store.dispatch(setJoinedRoomData(content))
    })

    this.room.onMessage(Message.ADD_CHAT_MESSAGE, ({ clientId, content }) => {
      phaserEvents.emit(Event.UPDATE_DIALOG_BUBBLE, clientId, content)
    })

    this.room.onMessage(Message.DISCONNECT_STREAM, (clientId: string) => {
      this.webRTC?.deleteOnCalledVideoStream(clientId)
    })

    this.room.onMessage(Message.STOP_SCREEN_SHARE, (clientId: string) => {
      const computerState = store.getState().computer
      computerState.shareScreenManager?.onUserLeft(clientId)
    })
  }

  // --- NETWORK METHODS ---

  onChatMessageAdded(callback: (playerId: string, content: string) => void, context?: any) {
    phaserEvents.on(Event.UPDATE_DIALOG_BUBBLE, callback, context)
  }

  onItemUserAdded(
    callback: (playerId: string, key: string, itemType: ItemType) => void,
    context?: any
  ) {
    phaserEvents.on(Event.ITEM_USER_ADDED, callback, context)
  }

  onItemUserRemoved(
    callback: (playerId: string, key: string, itemType: ItemType) => void,
    context?: any
  ) {
    phaserEvents.on(Event.ITEM_USER_REMOVED, callback, context)
  }

  onPlayerJoined(callback: (Player: IPlayer, key: string) => void, context?: any) {
    phaserEvents.on(Event.PLAYER_JOINED, callback, context)
  }

  onPlayerLeft(callback: (key: string) => void, context?: any) {
    phaserEvents.on(Event.PLAYER_LEFT, callback, context)
  }

  onMyPlayerReady(callback: (key: string) => void, context?: any) {
    phaserEvents.on(Event.MY_PLAYER_READY, callback, context)
  }

  onMyPlayerVideoConnected(callback: (key: string) => void, context?: any) {
    phaserEvents.on(Event.MY_PLAYER_VIDEO_CONNECTED, callback, context)
  }
  onPlayerUpdated(
    callback: (field: string, value: number | string, key: string) => void,
    context?: any
  ) {
    phaserEvents.on(Event.PLAYER_UPDATED, callback, context)
  }

  updatePlayer(currentX: number, currentY: number, currentAnim: string) {
    if (this.room) {
      this.room.send(Message.UPDATE_PLAYER, { x: currentX, y: currentY, anim: currentAnim })
    }
  }

  updatePlayerName(currentName: string) {
    if (this.room) {
      this.room.send(Message.UPDATE_PLAYER_NAME, { name: currentName })
    }
  }

  readyToConnect() {
    if (this.room) {
      this.room.send(Message.READY_TO_CONNECT)
    }
    phaserEvents.emit(Event.MY_PLAYER_READY)
  }

  videoConnected() {
    if (this.room) {
      this.room.send(Message.VIDEO_CONNECTED)
    }
    phaserEvents.emit(Event.MY_PLAYER_VIDEO_CONNECTED)
  }

  playerStreamDisconnect(id: string) {
    if (this.room) {
      this.room.send(Message.DISCONNECT_STREAM, { clientId: id })
    }
    this.webRTC?.deleteVideoStream(id)
  }

  // --- AUDIT ACTIONS ---

  startMission(missionId: string) {
    if (this.room) {
      this.room.send(Message.START_MISSION, { missionId })
    }
  }

  completeMission(missionId: string, compliance: string, justification: string) {
    if (this.room) {
      console.log('Completing mission with data:', { missionId, compliance, justification })
      this.room.send(Message.COMPLETE_MISSION, { missionId, compliance, justification })
    }
  }

  addEvidence(missionId: string, type: string, description: string, location: string) {
    if (this.room) {
      this.room.send(Message.ADD_EVIDENCE, { missionId, type, description, location })
    }
  }

  addRisk(findingId: string, probability: string, impact: string, recommendation: string) {
    if (this.room) {
      this.room.send(Message.ADD_RISK, { findingId, probability, impact, recommendation })
    }
  }

  verifyEvidence(evidenceId: string, verified: boolean) {
    if (this.room) {
      this.room.send(Message.VERIFY_EVIDENCE, { evidenceId, verified })
    }
  }

  changePlayerRole(targetPlayerId: string, role: 'auditor' | 'auditee' | 'observer') {
    if (this.room) {
      this.room.send(Message.CHANGE_PLAYER_ROLE, { targetPlayerId, role })
    }
  }

  // --- ITEM ACTIONS ---

  connectToComputer(id: string) {
    if (this.room) {
      this.room.send(Message.CONNECT_TO_COMPUTER, { computerId: id })
    }
  }

  disconnectFromComputer(id: string) {
    if (this.room) {
      this.room.send(Message.DISCONNECT_FROM_COMPUTER, { computerId: id })
    }
  }

  connectToWhiteboard(id: string) {
    if (this.room) {
      this.room.send(Message.CONNECT_TO_WHITEBOARD, { whiteboardId: id })
    }
  }

  disconnectFromWhiteboard(id: string) {
    if (this.room) {
      this.room.send(Message.DISCONNECT_FROM_WHITEBOARD, { whiteboardId: id })
    }
  }

  onStopScreenShare(id: string) {
    if (this.room) {
      this.room.send(Message.STOP_SCREEN_SHARE, { computerId: id })
    }
  }

  addChatMessage(content: string) {
    if (this.room) {
      this.room.send(Message.ADD_CHAT_MESSAGE, { content: content })
    }
  }
}
