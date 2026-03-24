import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Collapse,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material'
import { useSelector } from 'react-redux'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import HourglassTopIcon from '@mui/icons-material/HourglassTop'
import { RootState } from '../stores'

interface ExpandMoreIconProps {
  expand: boolean
}

export default function AuditMissionPanel() {
  const activeMissions = useSelector((state: RootState) => state.audit.activeMissions)
  const completedMissions = useSelector((state: RootState) => state.audit.completedMissions)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const allMissions = [...activeMissions, ...completedMissions]
  const completionPercentage =
    allMissions.length > 0 ? (completedMissions.length / allMissions.length) * 100 : 0

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon sx={{ color: '#4caf50' }} />
      case 'in-progress':
        return <HourglassTopIcon sx={{ color: '#ff9800' }} />
      default:
        return <PendingActionsIcon sx={{ color: '#9e9e9e' }} />
    }
  }

  const getStatusColor = (status: string): 'success' | 'warning' | 'default' => {
    switch (status) {
      case 'completed':
        return 'success'
      case 'in-progress':
        return 'warning'
      default:
        return 'default'
    }
  }

  const handleToggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const MissionItem = ({ mission }: { mission: any }) => (
    <Card sx={{ mb: 2 }}>
      <CardHeader
        avatar={getStatusIcon(mission.status)}
        action={
          <IconButton
            onClick={() => handleToggleExpand(mission.id)}
            aria-expanded={expandedId === mission.id}
            aria-label="show more"
          >
            <ExpandMoreIcon
              sx={{
                transform: expandedId === mission.id ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s',
              }}
            />
          </IconButton>
        }
        title={
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {mission.isoControl}
            </Typography>
            <Chip
              label={mission.status}
              size="small"
              color={getStatusColor(mission.status)}
              variant="outlined"
            />
          </Stack>
        }
        subheader={mission.name}
        sx={{ pb: 1 }}
      />

      <Collapse in={expandedId === mission.id} timeout="auto" unmountOnExit>
        <CardContent sx={{ pt: 0 }}>
          <Stack spacing={2}>
            <Box>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                Description
              </Typography>
              <Typography variant="body2">{mission.description}</Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                Evidence Required: {mission.collectedEvidence?.length || 0} /{' '}
                {mission.evidenceRequired?.length || 0}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={
                  mission.collectedEvidence
                    ? (mission.collectedEvidence.length / (mission.evidenceRequired?.length || 1)) *
                      100
                    : 0
                }
              />
            </Box>

            {mission.evidenceRequired && mission.evidenceRequired.length > 0 && (
              <Box>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                  Required Evidence
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {mission.evidenceRequired.map((evidence: string, idx: number) => (
                    <Chip key={idx} label={evidence} size="small" variant="outlined" />
                  ))}
                </Stack>
              </Box>
            )}

            {mission.compliance && (
              <Box>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                  Compliance Status
                </Typography>
                <Chip
                  label={mission.compliance}
                  size="small"
                  color={mission.compliance === 'compliant' ? 'success' : 'error'}
                />
              </Box>
            )}

            {mission.justification && (
              <Box>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                  Notes
                </Typography>
                <Typography variant="body2">{mission.justification}</Typography>
              </Box>
            )}
          </Stack>
        </CardContent>
      </Collapse>
    </Card>
  )

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
          <Typography variant="h6">Audit Missions Progress</Typography>
          <Typography variant="body2" color="textSecondary">
            {completedMissions.length} / {allMissions.length} completed
          </Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={completionPercentage}
          sx={{ height: 8, borderRadius: 4 }}
        />
      </Box>

      {activeMissions.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
            Active Missions ({activeMissions.length})
          </Typography>
          {activeMissions.map((mission) => (
            <MissionItem key={mission.id} mission={mission} />
          ))}
        </Box>
      )}

      {completedMissions.length > 0 && (
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: '#4caf50' }}>
            Completed ({completedMissions.length})
          </Typography>
          {completedMissions.map((mission) => (
            <MissionItem key={mission.id} mission={mission} />
          ))}
        </Box>
      )}

      {allMissions.length === 0 && (
        <Box sx={{ p: 2, textAlign: 'center', color: 'textSecondary' }}>
          <Typography variant="body2">
            No missions available. Start an audit session to begin.
          </Typography>
        </Box>
      )}
    </Box>
  )
}
