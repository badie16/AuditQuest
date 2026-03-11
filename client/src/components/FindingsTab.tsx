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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Grid,
} from '@mui/material'
import { useSelector } from 'react-redux'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { RootState } from '../stores'

export default function FindingsTab() {
  const findings = useSelector((state: RootState) => state.audit.findings)
  const missions = useSelector((state: RootState) =>
    state.audit.activeMissions.concat(state.audit.completedMissions)
  )
  const [expandedId, setExpandedId] = useState<string | null>(null)

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

  const getStatusCount = (status: string) => {
    return findings.filter((f: any) => f.status === status).length
  }

  const getMissionName = (missionId: string) => {
    const mission = missions.find((m: any) => m.id === missionId)
    return mission?.name || 'Unknown'
  }

  const handleToggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const compliantCount = getStatusCount('compliant')
  const nonCompliantCount = getStatusCount('non-compliant')
  const partialCount = getStatusCount('partial')

  return (
    <Box sx={{ p: 2 }}>
      <Stack spacing={3}>
        {/* Summary Stats */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <Typography color="textSecondary" variant="body2" sx={{ mb: 0.5 }}>
                  Compliant
                </Typography>
                <Typography variant="h5" sx={{ color: '#4caf50', fontWeight: 700 }}>
                  {compliantCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <Typography color="textSecondary" variant="body2" sx={{ mb: 0.5 }}>
                  Partially Compliant
                </Typography>
                <Typography variant="h5" sx={{ color: '#ff9800', fontWeight: 700 }}>
                  {partialCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <Typography color="textSecondary" variant="body2" sx={{ mb: 0.5 }}>
                  Non-Compliant
                </Typography>
                <Typography variant="h5" sx={{ color: '#f44336', fontWeight: 700 }}>
                  {nonCompliantCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Findings List */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Detailed Findings ({findings.length})
          </Typography>

          {findings.length === 0 ? (
            <Card>
              <CardContent>
                <Typography color="textSecondary" textAlign="center">
                  No findings recorded yet. Complete compliance evaluations to record findings.
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Stack spacing={2}>
              {findings.map((finding: any) => (
                <Card key={finding.id}>
                  <CardHeader
                    title={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {finding.controlId}
                        </Typography>
                        <Chip
                          label={finding.status.toUpperCase()}
                          size="small"
                          color={getStatusColor(finding.status)}
                          variant="outlined"
                        />
                      </Stack>
                    }
                    subheader={`Mission: ${getMissionName(finding.missionId)}`}
                    action={
                      <IconButton
                        onClick={() => handleToggleExpand(finding.id)}
                        aria-expanded={expandedId === finding.id}
                      >
                        <ExpandMoreIcon
                          sx={{
                            transform:
                              expandedId === finding.id ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s',
                          }}
                        />
                      </IconButton>
                    }
                    sx={{ pb: 1 }}
                  />

                  <Collapse in={expandedId === finding.id} timeout="auto" unmountOnExit>
                    <CardContent sx={{ pt: 0 }}>
                      <Stack spacing={2}>
                        {/* Justification */}
                        <Box>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{ mb: 1, fontWeight: 600 }}
                          >
                            Assessment Justification
                          </Typography>
                          <Typography variant="body2">{finding.justification}</Typography>
                        </Box>

                        {/* Notes */}
                        {finding.notes && (
                          <Box>
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              sx={{ mb: 1, fontWeight: 600 }}
                            >
                              Additional Notes
                            </Typography>
                            <Typography variant="body2">{finding.notes}</Typography>
                          </Box>
                        )}

                        {/* Related Evidence */}
                        {finding.relatedEvidence && finding.relatedEvidence.length > 0 && (
                          <Box>
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              sx={{ mb: 1, fontWeight: 600 }}
                            >
                              Related Evidence ({finding.relatedEvidence.length})
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                              {finding.relatedEvidence.map((evidenceId: string) => (
                                <Chip
                                  key={evidenceId}
                                  label={`Evidence #${evidenceId.substring(0, 8)}`}
                                  size="small"
                                  variant="outlined"
                                />
                              ))}
                            </Stack>
                          </Box>
                        )}

                        {/* Metadata */}
                        <Box sx={{ pt: 1, borderTop: '1px solid #eee' }}>
                          <Stack direction="row" spacing={2}>
                            <Box>
                              <Typography variant="caption" color="textSecondary">
                                Recorded by: {finding.auditorId}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="textSecondary">
                                {new Date(finding.timestamp).toLocaleString()}
                              </Typography>
                            </Box>
                          </Stack>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Collapse>
                </Card>
              ))}
            </Stack>
          )}
        </Box>

        {/* Compliance Summary */}
        {findings.length > 0 && (
          <Card sx={{ bgcolor: '#f9f9f9' }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                Compliance Overview
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Compliance Rate
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {findings.length > 0
                        ? Math.round((compliantCount / findings.length) * 100)
                        : 0}
                      %
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Controls Evaluated
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {findings.length}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
      </Stack>
    </Box>
  )
}
