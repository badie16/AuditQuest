import React from 'react'
import styled from 'styled-components'
import { useAppSelector, useAppDispatch } from '../hooks'
import { closeDialogue } from '../stores/DialogueStore'
import phaserGame from '../PhaserGame'
import Game from '../scenes/Game'
import { STORY_CHAPTERS } from '../../../types/AuditData'

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

const OptionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
`

const OptionButton = styled.button<{ $active: boolean }>`
  width: 100%;
  text-align: left;
  padding: 8px 10px;
  border: 3px solid #1b1b1b;
  box-shadow: 3px 3px 0 #000;
  background: ${(props) => (props.$active ? '#42eacb' : '#fff7e7')};
  color: #0f1722;
  font-family: 'Press Start 2P', cursive;
  font-size: 7px;
  line-height: 1.7;
  cursor: pointer;

  &:hover {
    transform: translate(1px, 1px);
    box-shadow: 2px 2px 0 #000;
  }
`

export default function DialogueDialog() {
  const dispatch = useAppDispatch()
  const { isOpen, title, content, portrait, npcId, options } = useAppSelector(
    (state) => state.dialogue
  )
  const activeMissions = useAppSelector((state) => state.audit.activeMissions)
  const currentChapterOrder = useAppSelector((state) => state.audit.currentChapterOrder)
  const [selectedOptionId, setSelectedOptionId] = React.useState<string>('')

  if (!isOpen) return null

  const handleClose = () => {
    setSelectedOptionId('')
    dispatch(closeDialogue())
  }

  const availableOptions = (options || []).filter((option) => {
    if (!option.unlockChapterOrder) return true
    return currentChapterOrder >= option.unlockChapterOrder
  })

  const selectedOption = availableOptions.find((option) => option.id === selectedOptionId)
  const displayedContent = selectedOption?.answer || content

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
        `Interview with ${title}: "${displayedContent}"`,
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
    setSelectedOptionId('')
    dispatch(closeDialogue())
  }

  return (
    <DialogueWrapper onClick={handleClose}>
      <NameTag>{title}</NameTag>

      <PortraitBox>
        <img src={portrait} alt={title} />
      </PortraitBox>

      <ContentBox>
        {displayedContent}
        {availableOptions.length > 0 && (
          <OptionList>
            {availableOptions.map((option) => (
              <OptionButton
                key={option.id}
                $active={selectedOptionId === option.id}
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedOptionId(option.id)
                }}
              >
                {option.question}
              </OptionButton>
            ))}
          </OptionList>
        )}
      </ContentBox>

      <ActionBox>
        <PixelActionButton onClick={handleCollectEvidence}>Collect as Evidence</PixelActionButton>
      </ActionBox>
    </DialogueWrapper>
  )
}
