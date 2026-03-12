import React from 'react'
import styled from 'styled-components'
import { Box } from '@mui/material'
import { useAppSelector, useAppDispatch } from '../hooks'
import { closeDialogue } from '../stores/DialogueStore'

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
  cursor: pointer;
  font-family: 'Courier New', Courier, monospace;
  animation: slideUp 0.2s steps(4);

  @keyframes slideUp {
    from { transform: translate(-50%, 100%); opacity: 0; }
    to { transform: translate(-50%, 0); opacity: 1; }
  }

  &:active {
    transform: translate(-50%, 2px);
    box-shadow: 6px 6px 0px #000;
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

const BlinkingArrow = styled.div`
  position: absolute;
  bottom: -8px;
  right: 0;
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 12px solid #3498db;
  animation: blink 0.8s steps(2) infinite;

  @keyframes blink {
    from { visibility: visible; }
    to { visibility: hidden; }
  }
`

export default function DialogueDialog() {
  const dispatch = useAppDispatch()
  const { isOpen, title, content, portrait } = useAppSelector((state) => state.dialogue)

  if (!isOpen) return null

  const handleClose = () => {
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
        <BlinkingArrow />
      </ContentBox>
    </DialogueWrapper>
  )
}
