import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  Alert,
  Chip,
  Stack,
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { addEvidence, closeEvidenceDialog } from '../stores/AuditStore'
import { AuditPoint } from '../items/AuditableObject'
import phaserGame from '../PhaserGame'
import Game from '../scenes/Game'
import { RootState } from '../stores'

interface EvidenceCollectionDialogProps {
  open: boolean
  onClose: () => void
  objectName: string
  auditPoints: AuditPoint[]
}

export default function EvidenceCollectionDialog({
  open,
  onClose,
  objectName,
  auditPoints,
}: EvidenceCollectionDialogProps) {
  const dispatch = useDispatch()
  const [selectedPoint, setSelectedPoint] = useState<AuditPoint | null>(null)
  const [evidenceType, setEvidenceType] = useState<
    'document' | 'log' | 'config' | 'interview' | 'observation'
  >('observation')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState(objectName)
  const [notes, setNotes] = useState('')
  const [errors, setErrors] = useState<string[]>([])

  const activeMissions = useSelector((state: RootState) => state.audit.activeMissions)
  const targetId = useSelector((state: RootState) => state.audit.evidenceTargetId)

  const handleSelectPoint = (point: AuditPoint) => {
    setSelectedPoint(point)
    setEvidenceType(point.type)
    setDescription(point.description)
  }

  const validateForm = (): boolean => {
    const newErrors: string[] = []

    if (!description.trim()) {
      newErrors.push('Evidence description is required')
    }
    if (!location.trim()) {
      newErrors.push('Location is required')
    }

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleCollectEvidence = () => {
    if (!validateForm()) return

    const game = phaserGame.scene.keys.game as Game
    const network = game.network

    if (network) {
      // Find the mission associated with this object
      const mission = activeMissions.find(m => m.targetObjectId === targetId)
      const missionId = mission?.id || 'a5-1' // Fallback for demo

      // Send to server
      network.addEvidence(
        missionId,
        evidenceType,
        description,
        location
      )
      
      // Close dialog (the Redux state will be updated by the server response)
      dispatch(closeEvidenceDialog())
    }
  }

  const handleClose = () => {
    setSelectedPoint(null)
    setEvidenceType('observation')
    setDescription('')
    setLocation(objectName)
    setNotes('')
    setErrors([])
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Collect Evidence - {objectName}</DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={3}>
          {errors.length > 0 && (
            <Alert severity="error">
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {errors.map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </Alert>
          )}

          <Box>
            <InputLabel sx={{ mb: 1 }}>Available Audit Points</InputLabel>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {auditPoints.map((point) => (
                <Chip
                  key={point.id}
                  label={point.name}
                  onClick={() => handleSelectPoint(point)}
                  variant={selectedPoint?.id === point.id ? 'filled' : 'outlined'}
                  color={selectedPoint?.id === point.id ? 'primary' : 'default'}
                  size="small"
                />
              ))}
            </Stack>
          </Box>

          <FormControl fullWidth>
            <InputLabel>Evidence Type</InputLabel>
            <Select
              value={evidenceType}
              onChange={(e) => setEvidenceType(e.target.value as any)}
              label="Evidence Type"
            >
              <MenuItem value="observation">Observation</MenuItem>
              <MenuItem value="document">Document</MenuItem>
              <MenuItem value="log">System Log</MenuItem>
              <MenuItem value="config">Configuration</MenuItem>
              <MenuItem value="interview">Interview</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Evidence Description"
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the evidence collected..."
          />

          <TextField
            label="Location"
            fullWidth
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <TextField
            label="Additional Notes"
            fullWidth
            multiline
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional notes about this evidence..."
          />

          {selectedPoint && (
            <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <strong>Related Controls:</strong>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                {selectedPoint.relatedControls.map((control) => (
                  <Chip key={control} label={control} size="small" variant="outlined" />
                ))}
              </Stack>
            </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleCollectEvidence} variant="contained" color="primary">
          Collect Evidence
        </Button>
      </DialogActions>
    </Dialog>
  )
}
