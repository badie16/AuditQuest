import React, { useState } from 'react'
import styled from 'styled-components'

import { useAppSelector } from './hooks'

import RoomSelectionDialog from './components/RoomSelectionDialog'
import LoginDialog from './components/LoginDialog'
import ComputerDialog from './components/ComputerDialog'
import WhiteboardDialog from './components/WhiteboardDialog'
import VideoConnectionDialog from './components/VideoConnectionDialog'
import Chat from './components/Chat'
import HelperButtonGroup from './components/HelperButtonGroup'
import MobileVirtualJoystick from './components/MobileVirtualJoystick'
import AuditHUD from './components/AuditHUD'

const Backdrop = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
`

const HudButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  padding: 10px 15px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
`

function App() {
  const [hudOpen, setHudOpen] = useState(false) // Etat pour HUD

  const loggedIn = useAppSelector((state) => state.user.loggedIn)
  const computerDialogOpen = useAppSelector((state) => state.computer.computerDialogOpen)
  const whiteboardDialogOpen = useAppSelector((state) => state.whiteboard.whiteboardDialogOpen)
  const videoConnected = useAppSelector((state) => state.user.videoConnected)
  const roomJoined = useAppSelector((state) => state.room.roomJoined)

  let ui: JSX.Element
  if (loggedIn) {
    if (computerDialogOpen) {
      ui = <ComputerDialog />
    } else if (whiteboardDialogOpen) {
      ui = <WhiteboardDialog />
    } else {
      ui = (
        <>
          <Chat />
          {!videoConnected && <VideoConnectionDialog />}
          <MobileVirtualJoystick />
        </>
      )
    }
  } else if (roomJoined) {
    ui = <LoginDialog />
  } else {
    ui = <RoomSelectionDialog />
  }

  return (
    <Backdrop>
      {ui}

      {/* Bouton pour ouvrir/fermer l'AuditHUD */}
      {loggedIn && (
        <HudButton onClick={() => setHudOpen((prev) => !prev)}>
          {hudOpen ? 'Close Audit HUD' : 'Open Audit HUD'}
        </HudButton>
      )}

      {/* AuditHUD rendu seulement si hudOpen */}
      {loggedIn && hudOpen && <AuditHUD isOpen={hudOpen} onClose={() => setHudOpen(false)} />}

      {/* Helper buttons si pas de dialogs */}
      {!computerDialogOpen && !whiteboardDialogOpen && <HelperButtonGroup />}
    </Backdrop>
  )
}

export default App
