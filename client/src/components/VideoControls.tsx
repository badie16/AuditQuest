import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Tooltip from '@mui/material/Tooltip'
import MicIcon from '@mui/icons-material/Mic'
import MicOffIcon from '@mui/icons-material/MicOff'
import VideocamIcon from '@mui/icons-material/Videocam'
import VideocamOffIcon from '@mui/icons-material/VideocamOff'

import { useAppSelector } from '../hooks'
import { BackgroundMode } from '../../../types/BackgroundMode'
import phaserGame from '../PhaserGame'
import Game from '../scenes/Game'

const Wrapper = styled.div`
  position: fixed;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 10px;
  z-index: 1000;
`

const PixelButton = styled.button<{ $isDay: boolean; $active?: boolean }>`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.$active ? (props.$isDay ? '#3498db' : '#426dea') : '#555'};
  color: white;
  border: 3px solid ${props => props.$isDay ? '#2c3e50' : '#eee'};
  box-shadow: 3px 3px 0px #000;
  cursor: pointer;
  transition: all 0.1s ease;
  border-radius: 0;

  &:hover {
    background-color: ${props => props.$active ? (props.$isDay ? '#2980b9' : '#3557c0') : '#666'};
    transform: translate(1px, 1px);
    box-shadow: 2px 2px 0px #000;
  }

  &:active {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0px #000;
  }

  svg {
    font-size: 20px;
  }
`

export default function VideoControls() {
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [videoEnabled, setVideoEnabled] = useState(true)
  const backgroundMode = useAppSelector((state) => state.user.backgroundMode)
  const videoConnected = useAppSelector((state) => state.user.videoConnected)
  const isDay = backgroundMode === BackgroundMode.DAY

  const toggleAudio = () => {
    const game = phaserGame.scene.keys.game as Game
    const myStream = game.network.webRTC?.myStream
    if (myStream) {
      const audioTrack = myStream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setAudioEnabled(audioTrack.enabled)
      }
    }
  }

  const toggleVideo = () => {
    const game = phaserGame.scene.keys.game as Game
    const myStream = game.network.webRTC?.myStream
    if (myStream) {
      const videoTrack = myStream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setVideoEnabled(videoTrack.enabled)
      }
    }
  }

  // Update local state if stream changes or on mount
  useEffect(() => {
    if (videoConnected) {
      const game = phaserGame.scene.keys.game as Game
      const myStream = game.network.webRTC?.myStream
      if (myStream) {
        setAudioEnabled(myStream.getAudioTracks()[0]?.enabled ?? true)
        setVideoEnabled(myStream.getVideoTracks()[0]?.enabled ?? true)
      }
    }
  }, [videoConnected])

  if (!videoConnected) return null

  return (
    <Wrapper>
      <Tooltip title={audioEnabled ? 'Mute Mic' : 'Unmute Mic'}>
        <PixelButton $isDay={isDay} $active={audioEnabled} onClick={toggleAudio}>
          {audioEnabled ? <MicIcon /> : <MicOffIcon />}
        </PixelButton>
      </Tooltip>
      <Tooltip title={videoEnabled ? 'Disable Video' : 'Enable Video'}>
        <PixelButton $isDay={isDay} $active={videoEnabled} onClick={toggleVideo}>
          {videoEnabled ? <VideocamIcon /> : <VideocamOffIcon />}
        </PixelButton>
      </Tooltip>
    </Wrapper>
  )
}
