import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { sanitizeId } from '../util'
import { BackgroundMode } from '../../../types/BackgroundMode'

import phaserGame from '../PhaserGame'
import Bootstrap from '../scenes/Bootstrap'
import { AuditRole } from '../../../types/AuditTypes'

interface PlayerDirectoryEntry {
  id: string
  name: string
  role: AuditRole
}

export function getInitialBackgroundMode() {
  const currentHour = new Date().getHours()
  return currentHour > 6 && currentHour <= 18 ? BackgroundMode.DAY : BackgroundMode.NIGHT
}

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    backgroundMode: getInitialBackgroundMode(),
    sessionId: '',
    videoConnected: false,
    loggedIn: false,
    auditRole: 'observer' as AuditRole,
    playerNameMap: new Map<string, string>(),
    playerDirectory: [] as PlayerDirectoryEntry[],
    showJoystick: window.innerWidth < 650,
    currentRoom: 'Office',
  },
  reducers: {
    setCurrentRoom: (state, action: PayloadAction<string>) => {
      state.currentRoom = action.payload
    },
    toggleBackgroundMode: (state) => {
      const newMode =
        state.backgroundMode === BackgroundMode.DAY ? BackgroundMode.NIGHT : BackgroundMode.DAY

      state.backgroundMode = newMode
      const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
      bootstrap.changeBackgroundMode(newMode)
    },
    setSessionId: (state, action: PayloadAction<string>) => {
      state.sessionId = action.payload
    },
    setVideoConnected: (state, action: PayloadAction<boolean>) => {
      state.videoConnected = action.payload
    },
    setLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.loggedIn = action.payload
    },
    setAuditRole: (state, action: PayloadAction<AuditRole>) => {
      state.auditRole = action.payload
    },
    setPlayerNameMap: (state, action: PayloadAction<{ id: string; name: string }>) => {
      state.playerNameMap.set(sanitizeId(action.payload.id), action.payload.name)
    },
    upsertPlayerDirectory: (state, action: PayloadAction<PlayerDirectoryEntry>) => {
      const idx = state.playerDirectory.findIndex((p) => p.id === action.payload.id)
      if (idx === -1) {
        state.playerDirectory.push(action.payload)
      } else {
        state.playerDirectory[idx] = action.payload
      }
    },
    removePlayerDirectory: (state, action: PayloadAction<string>) => {
      state.playerDirectory = state.playerDirectory.filter((p) => p.id !== action.payload)
    },
    removePlayerNameMap: (state, action: PayloadAction<string>) => {
      state.playerNameMap.delete(sanitizeId(action.payload))
    },
    setShowJoystick: (state, action: PayloadAction<boolean>) => {
      state.showJoystick = action.payload
    },
  },
})

export const {
  toggleBackgroundMode,
  setSessionId,
  setVideoConnected,
  setLoggedIn,
  setAuditRole,
  setPlayerNameMap,
  upsertPlayerDirectory,
  removePlayerDirectory,
  removePlayerNameMap,
  setShowJoystick,
  setCurrentRoom,
} = userSlice.actions

export default userSlice.reducer
