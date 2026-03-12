import React, { useState } from 'react'
import styled from 'styled-components'

import Tooltip from '@mui/material/Tooltip'
import FactCheckIcon from '@mui/icons-material/FactCheck'
import CloseIcon from '@mui/icons-material/Close'
import { BackgroundMode } from '../../types/BackgroundMode'

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
import EvidenceCollectionDialog from './components/EvidenceCollectionDialog'
import DialogueDialog from './components/DialogueDialog'
import VideoControls from './components/VideoControls'
import { closeEvidenceDialog } from './stores/AuditStore'
import { useAppDispatch } from './hooks'

const Backdrop = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
`

const HudButton = styled.button<{ $isDay: boolean }>`
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.$isDay ? '#3498db' : '#426dea'};
  color: white;
  border: 4px solid ${props => props.$isDay ? '#2c3e50' : '#eee'};
  box-shadow: 4px 4px 0px #000;
  cursor: pointer;
  transition: all 0.1s ease;

  &:hover {
    background-color: ${props => props.$isDay ? '#2980b9' : '#3557c0'};
    transform: translate(1px, 1px);
    box-shadow: 3px 3px 0px #000;
  }

  &:active {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0px #000;
  }

  svg {
    font-size: 25DOpx;
  }
`

function App() {
  const dispatch = useAppDispatch()
  const [hudOpen, setHudOpen] = useState(false) // Etat pour HUD

  const loggedIn = useAppSelector((state) => state.user.loggedIn)
  const backgroundMode = useAppSelector((state) => state.user.backgroundMode)
  const isDay = backgroundMode === BackgroundMode.DAY

  const computerDialogOpen = useAppSelector((state) => state.computer.computerDialogOpen)
  const whiteboardDialogOpen = useAppSelector((state) => state.whiteboard.whiteboardDialogOpen)
  const evidenceDialogOpen = useAppSelector((state) => state.audit.evidenceDialogOpen)
  const evidenceTargetName = useAppSelector((state) => state.audit.evidenceTargetName)
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
          {videoConnected ? <VideoControls /> : <VideoConnectionDialog />}
          <MobileVirtualJoystick />
          <DialogueDialog />
          {evidenceDialogOpen && (
            <EvidenceCollectionDialog
              open={evidenceDialogOpen}
              onClose={() => dispatch(closeEvidenceDialog())}
              objectName={evidenceTargetName}
              auditPoints={[]} // We can pass relevant points here later
            />
          )}
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
        <Tooltip title={hudOpen ? 'Close Audit HUD' : 'Open Audit HUD'} placement="right">
          <HudButton $isDay={isDay} onClick={() => setHudOpen((prev) => !prev)}>
            {hudOpen ? <CloseIcon /> : <FactCheckIcon />}
          </HudButton>
        </Tooltip>
      )}

      {/* AuditHUD rendu seulement si hudOpen */}
      {loggedIn && hudOpen && <AuditHUD isOpen={hudOpen} onClose={() => setHudOpen(false)} />}

      {/* Helper buttons si pas de dialogs */}
      {!computerDialogOpen && !whiteboardDialogOpen && <HelperButtonGroup />}
    </Backdrop>
  )
}

export default App
