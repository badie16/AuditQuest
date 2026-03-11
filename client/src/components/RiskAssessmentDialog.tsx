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
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material'
import { useDispatch } from 'react-redux'
import { addRiskAssessment } from '../stores/AuditStore'

interface RiskAssessmentDialogProps {
  open: boolean
  onClose: () => void
  finding: any | null
}

type RiskLevel = 'low' | 'medium' | 'high'

export default function RiskAssessmentDialog({
  open,
  onClose,
  finding,
}: RiskAssessmentDialogProps) {
  const dispatch = useDispatch()

  const [probability, setProbability] = useState<RiskLevel>('medium')
  const [impact, setImpact] = useState<RiskLevel>('medium')
  const [recommendation, setRecommendation] = useState('')
  const [remediationDays, setRemediationDays] = useState('30')
  const [errors, setErrors] = useState<string[]>([])

  if (!finding) return null

  // Risk matrix definition
  const riskMatrix: Record<string, Record<string, RiskLevel>> = {
    low: { low: 'low', medium: 'low', high: 'medium' },
    medium: { low: 'low', medium: 'medium', high: 'high' },
    high: { low: 'medium', medium: 'high', high: 'high' },
  }

  const getRiskSeverity = (): RiskLevel => {
    return riskMatrix[probability][impact]
  }

  const getRiskColor = (severity: RiskLevel): string => {
    switch (severity) {
      case 'low':
        return '#4caf50'
      case 'medium':
        return '#ff9800'
      case 'high':
        return '#f44336'
      default:
        return '#9e9e9e'
    }
  }

  const getRiskChipColor = (severity: RiskLevel): 'success' | 'warning' | 'error' => {
    switch (severity) {
      case 'low':
        return 'success'
      case 'medium':
        return 'warning'
      case 'high':
        return 'error'
      default:
        return 'success'
    }
  }

  const validateForm = (): boolean => {
    const newErrors: string[] = []

    if (!recommendation.trim()) {
      newErrors.push('Recommendation is required')
    }
    if (!remediationDays || isNaN(parseInt(remediationDays))) {
      newErrors.push('Valid remediation timeline is required')
    }

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    const severity = getRiskSeverity()

    const assessment = {
      id: `risk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      findingId: finding.id,
      controlId: finding.controlId,
      probability,
      impact,
      severity,
      recommendation,
      remediationDue: Date.now() + parseInt(remediationDays) * 24 * 60 * 60 * 1000,
      status: 'open',
      createdAt: Date.now(),
    }

    dispatch(addRiskAssessment(assessment))
    handleClose()
  }

  const handleClose = () => {
    setProbability('medium')
    setImpact('medium')
    setRecommendation('')
    setRemediationDays('30')
    setErrors([])
    onClose()
  }

  const severity = getRiskSeverity()

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Risk Assessment - {finding?.controlId}</DialogTitle>

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

          {/* Finding Info */}
          <Card sx={{ bgcolor: '#f5f5f5' }}>
            <CardContent>
              <Stack spacing={1}>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Non-Compliant Control
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {finding?.controlId}
                  </Typography>
                </Box>
                <Typography variant="body2">{finding?.justification}</Typography>
              </Stack>
            </CardContent>
          </Card>

          {/* Risk Matrix Selection */}
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
              Assess Risk Factors
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Probability</InputLabel>
                  <Select
                    value={probability}
                    onChange={(e) => setProbability(e.target.value as RiskLevel)}
                    label="Probability"
                  >
                    <MenuItem value="low">
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Box>Low - Unlikely to occur</Box>
                      </Stack>
                    </MenuItem>
                    <MenuItem value="medium">
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Box>Medium - Could occur</Box>
                      </Stack>
                    </MenuItem>
                    <MenuItem value="high">
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Box>High - Likely to occur</Box>
                      </Stack>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Impact</InputLabel>
                  <Select
                    value={impact}
                    onChange={(e) => setImpact(e.target.value as RiskLevel)}
                    label="Impact"
                  >
                    <MenuItem value="low">
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Box>Low - Minor consequences</Box>
                      </Stack>
                    </MenuItem>
                    <MenuItem value="medium">
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Box>Medium - Moderate consequences</Box>
                      </Stack>
                    </MenuItem>
                    <MenuItem value="high">
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Box>High - Severe consequences</Box>
                      </Stack>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          {/* Risk Matrix Visual */}
          <Box>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
              Risk Matrix
            </Typography>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell align="center" sx={{ fontWeight: 600 }}>
                      Probability \ Impact
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600 }}>
                      Low
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600 }}>
                      Medium
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600 }}>
                      High
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {['low', 'medium', 'high'].map((prob: any) => (
                    <TableRow key={prob}>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>
                        {prob.charAt(0).toUpperCase() + prob.slice(1)}
                      </TableCell>
                      {['low', 'medium', 'high'].map((imp: any) => (
                        <TableCell
                          key={`${prob}-${imp}`}
                          align="center"
                          sx={{
                            backgroundColor:
                              probability === prob && impact === imp
                                ? getRiskColor(riskMatrix[prob][imp])
                                : 'white',
                            color: probability === prob && impact === imp ? 'white' : 'black',
                            fontWeight: probability === prob && impact === imp ? 700 : 400,
                          }}
                        >
                          {riskMatrix[prob][imp].toUpperCase()}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Calculated Severity */}
          <Card
            sx={{
              bgcolor: getRiskColor(severity) + '15',
              borderLeft: `4px solid ${getRiskColor(severity)}`,
            }}
          >
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Calculated Risk Severity
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {severity.toUpperCase()}
                  </Typography>
                </Box>
                <Chip
                  label={severity.toUpperCase()}
                  color={getRiskChipColor(severity)}
                  variant="filled"
                  sx={{ fontSize: '16px', height: 'auto', p: 1 }}
                />
              </Stack>
            </CardContent>
          </Card>

          {/* Remediation Recommendation */}
          <TextField
            label="Remediation Recommendation"
            fullWidth
            multiline
            rows={4}
            value={recommendation}
            onChange={(e) => setRecommendation(e.target.value)}
            placeholder="Describe recommended remediation actions..."
            helperText="What steps should be taken to address this non-compliance?"
          />

          {/* Remediation Timeline */}
          <TextField
            label="Remediation Timeline (days)"
            type="number"
            fullWidth
            value={remediationDays}
            onChange={(e) => setRemediationDays(e.target.value)}
            inputProps={{ min: '1', max: '365' }}
            helperText="Expected number of days to implement remediation"
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Record Risk Assessment
        </Button>
      </DialogActions>
    </Dialog>
  )
}
