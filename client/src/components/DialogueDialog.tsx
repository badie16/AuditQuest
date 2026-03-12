import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material'
import { useAppSelector, useAppDispatch } from '../hooks'
import { closeDialogue } from '../stores/DialogueStore'

export default function DialogueDialog() {
  const dispatch = useAppDispatch()
  const { isOpen, title, content } = useAppSelector((state) => state.dialogue)

  const handleClose = () => {
    dispatch(closeDialogue())
  }

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: '#1976d2', color: 'white' }}>
        {title}
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Box sx={{ p: 1 }}>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {content}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained" color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
}
