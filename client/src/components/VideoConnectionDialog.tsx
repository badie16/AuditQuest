import React, { useState } from 'react'
import styled from 'styled-components'
import Tooltip from '@mui/material/Tooltip'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import VideocamIcon from '@mui/icons-material/Videocam'

import phaserGame from '../PhaserGame'
import Game from '../scenes/Game'
import { useAppSelector } from '../hooks'
import { BackgroundMode } from '../../../types/BackgroundMode'

const Backdrop = styled.div`
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 1000;
`

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
`

const PixelButton = styled.button<{ $isDay: boolean }>`
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.$isDay ? '#3498db' : '#426dea'};
  color: white;
  border: 4px solid ${props => props.$isDay ? '#2c3e50' : '#eee'};
  box-shadow: 4px 4px 0px #000;
  cursor: pointer;
  transition: all 0.1s ease;
  border-radius: 0;

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
    font-size: 28px;
  }
`

export default function VideoConnectionDialog() {
  const [connectionWarning, setConnectionWarning] = useState(true)
  const backgroundMode = useAppSelector((state) => state.user.backgroundMode)
  const isDay = backgroundMode === BackgroundMode.DAY

  return (
    <Backdrop>
      <Wrapper>
        {connectionWarning && (
          <Alert
            severity="warning"
            onClose={() => {
              setConnectionWarning(!connectionWarning)
            }}
            style={{ maxWidth: '300px' }}
          >
            <AlertTitle>Warning</AlertTitle>
            No webcam connected
          </Alert>
        )}
        <Tooltip title="Connect Webcam" placement="left">
          <PixelButton
            $isDay={isDay}
            onClick={() => {
              const game = phaserGame.scene.keys.game as Game
              game.network.webRTC?.getUserMedia()
            }}
          >
            <VideocamIcon />
          </PixelButton>
        </Tooltip>
      </Wrapper>
    </Backdrop>
  )
}
