import React from 'react'
import styled from 'styled-components'
import { Button } from '@mui/material'
import { useAppSelector, useAppDispatch } from '../hooks'
import { closeDialogue } from '../stores/DialogueStore'
import phaserGame from '../PhaserGame'
import Game from '../scenes/Game'

const DialogueWrapper = styled.div`
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 700px;
  background: #2c3e50;
  border: 4px solid #eee;
  box-shadow: 8px 8px 0px #000;
  padding: 16px;
  display: flex;
  flex-direction: row;
  gap: 20px;
  z-index: 2000;
  font-family: 'Courier New', Courier, monospace;
  animation: slideUp 0.2s steps(4);

  @keyframes slideUp {
    from { transform: translate(-50%, 100%); opacity: 0; }
    to { transform: translate(-50%, 0); opacity: 1; }
  }
`

const NameTag = styled.div`
  position: absolute;
  top: -24px;
  left: 12px;
  background: #3498db;
  color: white;
  padding: 4px 12px;
  border: 4px solid #eee;
  border-bottom: none;
  font-weight: bold;
  font-size: 1rem;
  text-shadow: 2px 2px 0px #000;
`

const PortraitBox = styled.div`
  flex-shrink: 0;
  width: 100px;
  height: 100px;
  background: #000;
  border: 4px solid #eee;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    image-rendering: pixelated;
  }
`

const ContentBox = styled.div`
  flex-grow: 1;
  color: white;
  font-size: 1.2rem;
  line-height: 1.4;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  text-shadow: 2px 2px 0px #000;
`

const ActionBox = styled.div`
  position: absolute;
  bottom: 10px;
  right: 16px;
  display: flex;
  gap: 10px;
  z-index: 2001;
`

export default function DialogueDialog() {
  const dispatch = useAppDispatch()
  const { isOpen, title, content, portrait, npcId } = useAppSelector((state) => state.dialogue)
  const activeMissions = useAppSelector((state) => state.audit.activeMissions)

  if (!isOpen) return null

  const handleClose = () => {
    dispatch(closeDialogue())
  }

  const handleCollectEvidence = (e: React.MouseEvent) => {
    e.stopPropagation()
    const game = phaserGame.scene.keys.game as Game
    const network = game.network

    // Find if this NPC is a target for any active mission
    const mission = activeMissions.find(m => m.targetObjectId === npcId)
    
    if (network) {
      network.addEvidence(
        mission?.id || 'general',
        'interview',
        `Interview with ${title}: "${content}"`,
        'Office'
      )
    }
    dispatch(closeDialogue())
  }

  return (
    <DialogueWrapper onClick={handleClose}>
      <NameTag>{title}</NameTag>
      
      <PortraitBox>
        <img src={portrait} alt={title} />
      </PortraitBox>

      <ContentBox>
        {content}
      </ContentBox>

      <ActionBox>
        <Button 
          variant="contained" 
          color="primary" 
          size="small"
          onClick={handleCollectEvidence}
          sx={{ border: '2px solid white', boxShadow: '2px 2px 0 black' }}
        >
          Collect as Evidence
        </Button>
      </ActionBox>
    </DialogueWrapper>
  )
}
