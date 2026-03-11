import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
  TextField,
  Box,
  Alert,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
  Checkbox,
  FormGroup,
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { addFinding } from '../stores/AuditStore'
import { RootState } from '../stores'

interface ComplianceEvaluationDialogProps {
  open: boolean
  onClose: () => void
  mission: any | null
}

export default function ComplianceEvaluationDialog({
  open,
  onClose,
  mission,
}: ComplianceEvaluationDialogProps) {
  const dispatch = useDispatch()
  const evidence = useSelector((state: RootState) => state.audit.collectedEvidence)

  const [complianceStatus, setComplianceStatus] = useState<
    'compliant' | 'non-compliant' | 'partial'
  >('compliant')
  const [justification, setJustification] = useState('')
  const [relatedEvidence, setRelatedEvidence] = useState<string[]>([])
  const [notes, setNotes] = useState('')
  const [errors, setErrors] = useState<string[]>([])

  if (!mission) return null

  const missionEvidence = evidence.filter((e: any) => mission.collectedEvidence?.includes(e.id))

  const validateForm = (): boolean => {
    const newErrors: string[] = []

    if (!justification.trim()) {
      newErrors.push('Justification is required')
    }
    if (relatedEvidence.length === 0) {
      newErrors.push('At least one evidence item must be selected')
    }

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleToggleEvidence = (evidenceId: string) => {
    setRelatedEvidence((prev) =>
      prev.includes(evidenceId) ? prev.filter((id) => id !== evidenceId) : [...prev, evidenceId]
    )
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    const finding = {
      id: `finding_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      missionId: mission.id,
      controlId: mission.isoControl,
      status: complianceStatus,
      justification,
      notes,
      relatedEvidence,
      timestamp: Date.now(),
      auditorId: 'current-user',
    }

    dispatch(addFinding(finding))
    handleClose()
  }

  const handleClose = () => {
    setComplianceStatus('compliant')
    setJustification('')
    setRelatedEvidence([])
    setNotes('')
    setErrors([])
    onClose()
  }

  const getComplianceDescription = (status: string): string => {
    switch (status) {
      case 'compliant':
        return 'The organization has implemented and maintains effective controls for this requirement'
      case 'non-compliant':
        return 'The organization has not implemented or fails to maintain controls for this requirement'
      case 'partial':
        return 'The organization has implemented some controls but there are gaps or deficiencies'
      default:
        return ''
    }
  }

  const getStatusColor = (status: string): 'success' | 'error' | 'warning' => {
    switch (status) {
      case 'compliant':
        return 'success'
      case 'non-compliant':
        return 'error'
      case 'partial':
        return 'warning'
      default:
        return 'success'
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Compliance Evaluation - {mission?.isoControl}</DialogTitle>

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

          {/* Mission Info */}
          <Card sx={{ bgcolor: '#f5f5f5' }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                {mission?.name}
              </Typography>
              <Typography variant="body2">{mission?.description}</Typography>
            </CardContent>
          </Card>

          {/* Compliance Status Selection */}
          <FormControl fullWidth>
            <FormLabel sx={{ mb: 2, fontWeight: 600 }}>Compliance Status</FormLabel>
            <RadioGroup
              value={complianceStatus}
              onChange={(e) => setComplianceStatus(e.target.value as any)}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Card
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    border:
                      complianceStatus === 'compliant' ? '2px solid #4caf50' : '1px solid #ddd',
                    bgcolor: complianceStatus === 'compliant' ? '#f1f8e9' : 'white',
                  }}
                  onClick={() => setComplianceStatus('compliant')}
                >
                  <FormControlLabel
                    value="compliant"
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          Compliant
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {getComplianceDescription('compliant')}
                        </Typography>
                      </Box>
                    }
                  />
                </Card>

                <Card
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    border: complianceStatus === 'partial' ? '2px solid #ff9800' : '1px solid #ddd',
                    bgcolor: complianceStatus === 'partial' ? '#fff3e0' : 'white',
                  }}
                  onClick={() => setComplianceStatus('partial')}
                >
                  <FormControlLabel
                    value="partial"
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          Partially Compliant
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {getComplianceDescription('partial')}
                        </Typography>
                      </Box>
                    }
                  />
                </Card>

                <Card
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    border:
                      complianceStatus === 'non-compliant' ? '2px solid #f44336' : '1px solid #ddd',
                    bgcolor: complianceStatus === 'non-compliant' ? '#ffebee' : 'white',
                  }}
                  onClick={() => setComplianceStatus('non-compliant')}
                >
                  <FormControlLabel
                    value="non-compliant"
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          Non-Compliant
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {getComplianceDescription('non-compliant')}
                        </Typography>
                      </Box>
                    }
                  />
                </Card>
              </Box>
            </RadioGroup>
          </FormControl>

          {/* Evidence Selection */}
          {missionEvidence.length > 0 && (
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                Link Evidence
              </Typography>
              <FormGroup>
                {missionEvidence.map((item: any) => (
                  <FormControlLabel
                    key={item.id}
                    control={
                      <Checkbox
                        checked={relatedEvidence.includes(item.id)}
                        onChange={() => handleToggleEvidence(item.id)}
                      />
                    }
                    label={
                      <Box>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="body2">{item.description}</Typography>
                          <Chip label={item.type} size="small" variant="outlined" />
                        </Stack>
                      </Box>
                    }
                  />
                ))}
              </FormGroup>
            </Box>
          )}

          {/* Justification */}
          <TextField
            label="Justification"
            fullWidth
            multiline
            rows={4}
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            placeholder="Explain your compliance assessment based on the evidence..."
            helperText="Describe how the evidence supports your compliance determination"
          />

          {/* Additional Notes */}
          <TextField
            label="Additional Notes"
            fullWidth
            multiline
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional observations or comments..."
          />

          {/* Status Badge */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2,
              bgcolor: '#f9f9f9',
              borderRadius: 1,
            }}
          >
            <Typography variant="body2" color="textSecondary">
              Assessment Summary:
            </Typography>
            <Chip
              label={complianceStatus.toUpperCase()}
              color={getStatusColor(complianceStatus)}
              variant="outlined"
            />
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Record Finding
        </Button>
      </DialogActions>
    </Dialog>
  )
}
