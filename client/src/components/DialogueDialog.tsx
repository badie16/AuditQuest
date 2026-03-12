import React from 'react'
import styled from 'styled-components'
import { Typography, Box, Avatar } from '@mui/material'
import { useAppSelector, useAppDispatch } from '../hooks'
import { closeDialogue } from '../stores/DialogueStore'

const DialogueWrapper = styled.div`
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  max-width: 800px;
  background: rgba(0, 0, 0, 0.85);
  border: 3px solid #3498db;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: row;
  gap: 20px;
  z-index: 2000;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  cursor: pointer;
  animation: slideUp 0.3s ease-out;

  @keyframes slideUp {
    from { transform: translate(-50%, 100px); opacity: 0; }
    to { transform: translate(-50%, 0); opacity: 1; }
  }
`

const NameTag = styled.div`
  position: absolute;
  top: -15px;
  left: 20px;
  background: #3498db;
  color: white;
  padding: 4px 15px;
  border-radius: 4px;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 0.9rem;
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
      
      <Box sx={{ flexShrink: 0 }}>
        <Avatar
          src={portrait}
          alt={title}
          variant="rounded"
          sx={{ 
            width: 100, 
            height: 100, 
            border: '2px solid white',
            bgcolor: '#2c3e50'
          }}
        />
      </Box>

      <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
        <Typography variant="body1" sx={{ color: 'white', fontSize: '1.1rem', lineHeight: 1.5 }}>
          {content}
        </Typography>
      </Box>

      <Box sx={{ alignSelf: 'flex-end', color: '#3498db', fontSize: '0.8rem', opacity: 0.7 }}>
        Click to continue...
      </Box>
    </DialogueWrapper>
  )
}
