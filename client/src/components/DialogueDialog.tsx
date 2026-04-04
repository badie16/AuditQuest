import React from 'react'
import styled from 'styled-components'
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
  background: linear-gradient(180deg, #f4e4c2, #ead3a2);
  border: 4px solid #1b1b1b;
  box-shadow: 8px 8px 0px #000;
  padding: 16px;
  display: flex;
  flex-direction: row;
  gap: 20px;
  z-index: 2000;
  font-family: 'Courier New', Courier, monospace;
  animation: slideUp 0.2s steps(4);

  @keyframes slideUp {
    from {
      transform: translate(-50%, 100%);
      opacity: 0;
    }
    to {
      transform: translate(-50%, 0);
      opacity: 1;
    }
  }
`

const NameTag = styled.div`
  position: absolute;
  top: -24px;
  left: 12px;
  background: #20304f;
  color: #fff4d6;
  padding: 4px 12px;
  border: 4px solid #1b1b1b;
  border-bottom: none;
  font-family: 'Press Start 2P', cursive;
  font-size: 8px;
  line-height: 1.5;
  text-shadow: 2px 2px 0px #000;
`

const PortraitBox = styled.div`
  flex-shrink: 0;
  width: 100px;
  height: 100px;
  background: #fff7e7;
  border: 4px solid #1b1b1b;
  box-shadow: 4px 4px 0 #000;
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
  color: #1b1b1b;
  font-size: 12px;
  line-height: 1.4;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  text-shadow: none;
  padding: 4px 0;
`

const ActionBox = styled.div`
  position: absolute;
  bottom: 10px;
  right: 16px;
  display: flex;
  gap: 10px;
  z-index: 2001;
`

const PixelActionButton = styled.button`
  padding: 10px 12px;
  border: 3px solid #1b1b1b;
  box-shadow: 3px 3px 0 #000;
  background: #42eacb;
  color: #0f1722;
  font-family: 'Press Start 2P', cursive;
  font-size: 8px;
  line-height: 1.5;
  text-transform: uppercase;
  cursor: pointer;

  &:hover {
    transform: translate(1px, 1px);
    box-shadow: 2px 2px 0 #000;
  }

  &:active {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0 #000;
  }
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

    console.log('[Audit] Dialogue collect clicked. NPC ID:', npcId)
    console.log(
      '[Audit] Active missions in store:',
      activeMissions.map((m) => `ID: ${m.id}, Target: ${m.targetObjectId}`)
    )

    // Find if this NPC is a target for any active mission
    const mission = activeMissions.find((m) => m.targetObjectId === npcId)

    if (network) {
      console.log('[Audit] Sending addEvidence for mission:', mission?.id || 'general')
      network.addEvidence(
        mission?.id || 'general',
        'interview',
        `Interview with ${title}: "${content}"`,
        'Office'
      )

      // If this was a target NPC for a mission, auto-validate it as compliant for smoother demo flow
      if (mission) {
        console.log('[Audit] Auto-completing mission:', mission.id)
        network.completeMission(
          mission.id,
          'compliant',
          `Validated via interview with ${title}. Information provided matches requirements.`
        )
      }
    }
    dispatch(closeDialogue())
  }

  return (
    <DialogueWrapper onClick={handleClose}>
      <NameTag>{title}</NameTag>

      <PortraitBox>
        <img src={portrait} alt={title} />
      </PortraitBox>

      <ContentBox>{content}</ContentBox>

      <ActionBox>
        <PixelActionButton onClick={handleCollectEvidence}>Collect as Evidence</PixelActionButton>
      </ActionBox>
    </DialogueWrapper>
  )
}
