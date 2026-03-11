import React from 'react'
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from '@mui/material'
import { useSelector } from 'react-redux'
import { RootState } from '../stores'

export default function EvidenceTab() {
  const evidence = useSelector((state: RootState) => state.audit.collectedEvidence)

  const getEvidenceTypeColor = (
    type: string
  ): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (type) {
      case 'document':
        return 'primary'
      case 'log':
        return 'info'
      case 'config':
        return 'secondary'
      case 'interview':
        return 'success'
      case 'observation':
        return 'warning'
      default:
        return 'default'
    }
  }

  return (
    <Box sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Collected Evidence ({evidence.length})
          </Typography>

          {evidence.length === 0 ? (
            <Card>
              <CardContent>
                <Typography color="textSecondary" textAlign="center">
                  No evidence collected yet. Interact with objects in the office to collect
                  evidence.
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell>Type</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Controls</TableCell>
                    <TableCell>Collected At</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {evidence.map((item: any) => (
                    <TableRow key={item.id} hover>
                      <TableCell>
                        <Chip
                          label={item.type}
                          size="small"
                          color={getEvidenceTypeColor(item.type)}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{item.description}</Typography>
                        {item.notes && (
                          <Typography variant="caption" color="textSecondary">
                            {item.notes}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.5} flexWrap="wrap">
                          {item.relatedControls?.map((control: string) => (
                            <Chip key={control} label={control} size="small" variant="outlined" />
                          ))}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption">
                          {new Date(item.collectionTime).toLocaleTimeString()}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>

        {evidence.length > 0 && (
          <Card sx={{ bgcolor: '#f5f5f5' }}>
            <CardHeader
              title="Evidence Summary"
              subheader={`Total evidence items: ${evidence.length}`}
              titleTypographyProps={{ variant: 'subtitle2' }}
            />
            <CardContent>
              <Stack spacing={1}>
                {Object.entries(
                  evidence.reduce((acc: Record<string, number>, item: any) => {
                    acc[item.type] = (acc[item.type] || 0) + 1
                    return acc
                  }, {})
                ).map(([type, count]) => (
                  <Box key={type} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">
                      <Chip
                        label={type}
                        size="small"
                        color={getEvidenceTypeColor(type)}
                        variant="outlined"
                        sx={{ mr: 1 }}
                      />
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {count}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        )}
      </Stack>
    </Box>
  )
}
