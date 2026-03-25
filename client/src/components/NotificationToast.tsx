import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Alert, Snackbar } from '@mui/material'
import { RootState } from '../stores'
import { removeNotification } from '../stores/AuditStore'

export default function NotificationToast() {
  const notifications = useSelector((state: RootState) => state.audit.notifications)
  const dispatch = useDispatch()
  const [open, setOpen] = React.useState(false)
  const [currentNotification, setCurrentNotification] = React.useState<any>(null)

  useEffect(() => {
    if (notifications.length > 0 && !open) {
      setCurrentNotification(notifications[0])
      setOpen(true)
    } else if (notifications.length > 0 && open && currentNotification && currentNotification.id !== notifications[0].id) {
        // Switch to next notification if available
        setOpen(false)
        setTimeout(() => {
            setCurrentNotification(notifications[0])
            setOpen(true)
        }, 100)
    }
  }, [notifications, open, currentNotification])

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }

    setOpen(false)
    
    // Remove the notification from the store after a delay to allow animation
    if (currentNotification) {
      setTimeout(() => {
        dispatch(removeNotification(currentNotification.id))
      }, 300) 
    }
  }

  if (!currentNotification) return null

  return (
    <Snackbar 
        open={open} 
        autoHideDuration={6000} 
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={handleClose} severity={currentNotification.type} sx={{ width: '100%' }}>
        <strong>{currentNotification.title}</strong> — {currentNotification.message}
      </Alert>
    </Snackbar>
  )
}
