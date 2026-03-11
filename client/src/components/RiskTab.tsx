import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Collapse,
  IconButton,
  Stack,
  Typography,
  Grid,
  LinearProgress,
} from '@mui/material'
import { useSelector } from 'react-redux'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import WarningIcon from '@mui/icons-material/Warning'
import { RootState } from '../stores'

export default function RiskTab() {
  const risks = useSelector((state: RootState) => state.audit.riskAssessments)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const getRiskColor = (severity: string): 'success' | 'warning' | 'error' => {
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

  const getRiskBgColor = (severity: string): string => {
    switch (severity) {
      case 'low':
        return '#f1f8e9'
      case 'medium':
        return '#fff3e0'
      case 'high':
        return '#ffebee'
      default:
        return '#f5f5f5'
    }
  }

  const getRiskBorderColor = (severity: string): string => {
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

  const getSeverityCount = (severity: string) => {
    return risks.filter((r: any) => r.severity === severity).length
  }

  const handleToggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const highRiskCount = getSeverityCount('high')
  const mediumRiskCount = getSeverityCount('medium')
  const lowRiskCount = getSeverityCount('low')

  const daysUntilRemediationDue = (remediationDue: number) => {
    const days = Math.ceil((remediationDue - Date.now()) / (1000 * 60 * 60 * 24))
    return days
  }

  return (
    <Box sx={{ p: 2 }}>
      <Stack spacing={3}>
        {/* Summary Stats */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ backgroundColor: '#f1f8e9' }}>
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <Typography color="textSecondary" variant="body2" sx={{ mb: 0.5 }}>
                  Low Risk
                </Typography>
                <Typography variant="h5" sx={{ color: '#4caf50', fontWeight: 700 }}>
                  {lowRiskCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ backgroundColor: '#fff3e0' }}>
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <Typography color="textSecondary" variant="body2" sx={{ mb: 0.5 }}>
                  Medium Risk
                </Typography>
                <Typography variant="h5" sx={{ color: '#ff9800', fontWeight: 700 }}>
                  {mediumRiskCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ backgroundColor: '#ffebee' }}>
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <Typography color="textSecondary" variant="body2" sx={{ mb: 0.5 }}>
                  High Risk
                </Typography>
                <Typography variant="h5" sx={{ color: '#f44336', fontWeight: 700 }}>
                  {highRiskCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Risk Summary */}
        {risks.length > 0 && (
          <Card sx={{ bgcolor: '#f9f9f9' }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                Risk Distribution
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                    <Typography variant="body2">High Risk</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {Math.round((highRiskCount / risks.length) * 100)}%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={(highRiskCount / risks.length) * 100}
                    sx={{
                      height: 6,
                      bgcolor: '#ffebee',
                      '& .MuiLinearProgress-bar': { bgcolor: '#f44336' },
                    }}
                  />
                </Box>
                <Box>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                    <Typography variant="body2">Medium Risk</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {Math.round((mediumRiskCount / risks.length) * 100)}%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={(mediumRiskCount / risks.length) * 100}
                    sx={{
                      height: 6,
                      bgcolor: '#fff3e0',
                      '& .MuiLinearProgress-bar': { bgcolor: '#ff9800' },
                    }}
                  />
                </Box>
                <Box>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                    <Typography variant="body2">Low Risk</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {Math.round((lowRiskCount / risks.length) * 100)}%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={(lowRiskCount / risks.length) * 100}
                    sx={{
                      height: 6,
                      bgcolor: '#f1f8e9',
                      '& .MuiLinearProgress-bar': { bgcolor: '#4caf50' },
                    }}
                  />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* Risks List */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Risk Assessments ({risks.length})
          </Typography>

          {risks.length === 0 ? (
            <Card>
              <CardContent>
                <Typography color="textSecondary" textAlign="center">
                  No risk assessments recorded yet. Assess risks for non-compliant findings.
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Stack spacing={2}>
              {/* High Risk Items First */}
              {risks
                .filter((r: any) => r.severity === 'high')
                .map((risk: any) => (
                  <RiskCard
                    key={risk.id}
                    risk={risk}
                    isExpanded={expandedId === risk.id}
                    onToggle={() => handleToggleExpand(risk.id)}
                  />
                ))}

              {/* Medium Risk Items */}
              {risks
                .filter((r: any) => r.severity === 'medium')
                .map((risk: any) => (
                  <RiskCard
                    key={risk.id}
                    risk={risk}
                    isExpanded={expandedId === risk.id}
                    onToggle={() => handleToggleExpand(risk.id)}
                  />
                ))}

              {/* Low Risk Items */}
              {risks
                .filter((r: any) => r.severity === 'low')
                .map((risk: any) => (
                  <RiskCard
                    key={risk.id}
                    risk={risk}
                    isExpanded={expandedId === risk.id}
                    onToggle={() => handleToggleExpand(risk.id)}
                  />
                ))}
            </Stack>
          )}
        </Box>
      </Stack>
    </Box>
  )
}

interface RiskCardProps {
  risk: any
  isExpanded: boolean
  onToggle: () => void
}

function RiskCard({ risk, isExpanded, onToggle }: RiskCardProps) {
  const getRiskColor = (severity: string) => {
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

  const getRiskChipColor = (severity: string): 'success' | 'warning' | 'error' => {
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

  const daysUntilDue = Math.ceil((risk.remediationDue - Date.now()) / (1000 * 60 * 60 * 24))

  return (
    <Card
      sx={{
        borderLeft: `4px solid ${getRiskColor(risk.severity)}`,
        backgroundColor: risk.severity === 'high' ? '#ffebee' : 'white',
      }}
    >
      <CardHeader
        avatar={risk.severity === 'high' ? <WarningIcon sx={{ color: '#f44336' }} /> : undefined}
        title={
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {risk.controlId}
            </Typography>
            <Chip
              label={risk.severity.toUpperCase()}
              size="small"
              color={getRiskChipColor(risk.severity)}
              variant="outlined"
            />
            <Chip
              label={`${daysUntilDue > 0 ? daysUntilDue : 'OVERDUE'} days`}
              size="small"
              variant="filled"
              sx={{
                bgcolor: daysUntilDue < 7 ? '#f44336' : daysUntilDue < 14 ? '#ff9800' : '#4caf50',
                color: 'white',
              }}
            />
          </Stack>
        }
        subheader={`Probability: ${risk.probability.toUpperCase()} | Impact: ${risk.impact.toUpperCase()}`}
        action={
          <IconButton onClick={onToggle} aria-expanded={isExpanded}>
            <ExpandMoreIcon
              sx={{
                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s',
              }}
            />
          </IconButton>
        }
        sx={{ pb: 1 }}
      />

      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <CardContent sx={{ pt: 0 }}>
          <Stack spacing={2}>
            <Box>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1, fontWeight: 600 }}>
                Remediation Recommendation
              </Typography>
              <Typography variant="body2">{risk.recommendation}</Typography>
            </Box>

            <Box sx={{ p: 1.5, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Stack direction="row" spacing={3}>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Status
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {risk.status.toUpperCase()}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Due Date
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {new Date(risk.remediationDue).toLocaleDateString()}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Collapse>
    </Card>
  )
}
