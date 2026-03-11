import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
  LinearProgress,
} from '@mui/material'
import { useDispatch } from 'react-redux'
import { setCurrentMission } from '../stores/AuditStore'
import SchoolIcon from '@mui/icons-material/School'
import ChecklistIcon from '@mui/icons-material/Checklist'
import LocationOnIcon from '@mui/icons-material/LocationOn'

interface MissionBriefingProps {
  open: boolean
  mission: any | null
  onClose: () => void
  onStart: () => void
}

export default function MissionBriefing({ open, mission, onClose, onStart }: MissionBriefingProps) {
  const dispatch = useDispatch()

  if (!mission) return null

  const handleStart = () => {
    dispatch(setCurrentMission(mission))
    onStart()
  }

  const getPriorityColor = (priority: string): 'error' | 'warning' | 'info' => {
    switch (priority) {
      case 'high':
        return 'error'
      case 'medium':
        return 'warning'
      default:
        return 'info'
    }
  }

  const completionPercentage = mission.evidenceRequired?.length
    ? ((mission.collectedEvidence?.length || 0) / mission.evidenceRequired.length) * 100
    : 0

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" spacing={1} alignItems="center">
          <SchoolIcon color="primary" />
          <Typography variant="h6">Mission Briefing</Typography>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={3}>
          {/* ISO Control */}
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                ISO 27002 Control
              </Typography>
              <Chip label={mission.isoControl} color="primary" size="small" />
            </Stack>
          </Box>

          {/* Mission Title */}
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              {mission.name}
            </Typography>
          </Box>

          {/* Description */}
          <Card sx={{ bgcolor: '#f9f9f9', border: '1px solid #e0e0e0' }}>
            <CardContent>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                Mission Description
              </Typography>
              <Typography variant="body2">{mission.description}</Typography>
            </CardContent>
          </Card>

          {/* Location */}
          <Box>
            <Stack direction="row" spacing={1} alignItems="flex-start">
              <LocationOnIcon sx={{ color: 'primary.main', mt: 0.5, fontSize: 20 }} />
              <Box>
                <Typography variant="body2" color="textSecondary">
                  Location
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {mission.zone || 'Office'}
                </Typography>
              </Box>
            </Stack>
          </Box>

          {/* Priority */}
          <Box>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
              Priority
            </Typography>
            <Chip
              label={mission.priority?.toUpperCase() || 'MEDIUM'}
              color={getPriorityColor(mission.priority || 'medium')}
              size="small"
              variant="outlined"
            />
          </Box>

          {/* Evidence Requirements */}
          <Box>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <ChecklistIcon sx={{ color: 'primary.main', fontSize: 20 }} />
              <Typography variant="body2" color="textSecondary">
                Evidence Required
              </Typography>
            </Stack>

            {mission.evidenceRequired && mission.evidenceRequired.length > 0 ? (
              <>
                <LinearProgress
                  variant="determinate"
                  value={completionPercentage}
                  sx={{ mb: 1, height: 6, borderRadius: 1 }}
                />
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{ mb: 2, display: 'block' }}
                >
                  {mission.collectedEvidence?.length || 0} of {mission.evidenceRequired.length}{' '}
                  collected
                </Typography>

                <Stack spacing={1}>
                  {mission.evidenceRequired.map((requirement: string, idx: number) => (
                    <Box
                      key={idx}
                      sx={{
                        p: 1.5,
                        bgcolor: '#f5f5f5',
                        borderLeft: '3px solid #1976d2',
                        borderRadius: 0.5,
                      }}
                    >
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        • {requirement}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </>
            ) : (
              <Typography variant="body2" color="textSecondary">
                No specific evidence requirements defined
              </Typography>
            )}
          </Box>

          {/* Status */}
          {mission.status && (
            <Box>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                Status
              </Typography>
              <Chip
                label={mission.status?.toUpperCase()}
                color={
                  mission.status === 'completed'
                    ? 'success'
                    : mission.status === 'in-progress'
                    ? 'warning'
                    : 'default'
                }
                size="small"
                variant="outlined"
              />
            </Box>
          )}

          {/* Tips */}
          <Card sx={{ bgcolor: '#e3f2fd', border: '1px solid #90caf9' }}>
            <CardContent sx={{ p: 1.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                Tips
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Interact with office objects to collect evidence. Look for computers, documents,
                whiteboards, and other items related to the control being audited.
              </Typography>
            </CardContent>
          </Card>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleStart} variant="contained" color="primary" autoFocus>
          {mission.status === 'completed' ? 'Review Mission' : 'Start Mission'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
