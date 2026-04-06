import React, { useState } from 'react'
import styled from 'styled-components'
import Button from '@mui/material/Button'
import { Evidence, EvidenceType } from '../../../types/AuditTypes'
import { RootState } from '../stores'
import { useSelector, useDispatch } from 'react-redux'

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1300;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(8, 10, 16, 0.9);
`

const Card = styled.div`
  width: min(900px, calc(100vw - 32px));
  max-height: calc(100vh - 32px);
  overflow: auto;
  border: 4px solid #1b1b1b;
  box-shadow: 10px 10px 0 #000;
  background: linear-gradient(180deg, #102238, #0b1320);
  color: #f4f8ff;
`

const Header = styled.div`
  padding: 18px 20px;
  background: #20304f;
  border-bottom: 4px solid #1b1b1b;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
`

const Title = styled.h2`
  margin: 0;
  font-family: 'Press Start 2P', cursive;
  font-size: clamp(14px, 2vw, 22px);
  line-height: 1.6;
`

const Body = styled.div`
  padding: 20px;
  display: grid;
  gap: 16px;
`

const EvidenceList = styled.div`
  display: grid;
  gap: 12px;
`

const EvidenceCard = styled.div<{ verified?: boolean; status?: 'pending' | 'approved' | 'rejected' }>`
  background: ${(props) => {
    if (props.status === 'approved') return '#1a3a1a'
    if (props.status === 'rejected') return '#3a1a1a'
    return 'rgba(255, 255, 255, 0.05)'
  }};
  border: 3px solid ${(props) => {
    if (props.status === 'approved') return '#4ade80'
    if (props.status === 'rejected') return '#f87171'
    return '#2f4a72'
  }};
  box-shadow: 4px 4px 0 #000;
  padding: 14px;
  display: grid;
  gap: 10px;
`

const EvidenceMeta = styled.div`
  display: grid;
  gap: 6px;
  font-family: 'Share Tech Mono', monospace;
  font-size: 12px;
`

const EvidenceLabel = styled.div`
  font-weight: bold;
  text-transform: uppercase;
  color: #cfe3ff;
`

const EvidenceValue = styled.div`
  color: #a5b4ff;
  word-break: break-word;
`

const EvidenceTypeBadge = styled.span`
  display: inline-block;
  background: #2f4a72;
  color: #f4f8ff;
  padding: 2px 6px;
  border-radius: 2px;
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
`

const ReviewActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 10px;
  flex-wrap: wrap;
`

const ReviewButton = styled(Button)<{ variant?: 'approve' | 'reject' | 'neutral' }>`
  && {
    background: ${(props) => {
      if (props.variant === 'approve') return '#4ade80'
      if (props.variant === 'reject') return '#f87171'
      return '#2f4a72'
    }};
    color: ${(props) => {
      if (props.variant === 'approve' || props.variant === 'reject') return '#000'
      return '#f4f8ff'
    }};
    font-family: 'Press Start 2P', cursive;
    font-size: 10px;
    padding: 6px 10px;
    border: 2px solid #1b1b1b;
    border-radius: 0;
    text-transform: uppercase;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }
  }
`

const FilterBar = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`

const FilterButton = styled(Button)<{ active?: boolean }>`
  && {
    background: ${(props) => (props.active ? '#2f4a72' : 'rgba(255, 255, 255, 0.05)')};
    color: #f4f8ff;
    font-family: 'Share Tech Mono', monospace;
    font-size: 12px;
    padding: 6px 12px;
    border: 2px solid ${(props) => (props.active ? '#4ade80' : '#1b1b1b')};
    border-radius: 0;
    text-transform: uppercase;
    cursor: pointer;

    &:hover {
      background: #2f4a72;
    }
  }
`

const TabContent = styled.div`
  display: grid;
  gap: 12px;
`

const NoEvidenceMessage = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid #2f4a72;
  padding: 16px;
  text-align: center;
  font-family: 'Share Tech Mono', monospace;
  color: #a5b4ff;
`

interface EvidenceReviewDialogProps {
  open: boolean
  onClose: () => void
  onVerifyEvidence?: (evidenceId: string, verified: boolean) => void
}

interface ReviewState {
  [evidenceId: string]: 'pending' | 'approved' | 'rejected'
}

export default function EvidenceReviewDialog({
  open,
  onClose,
  onVerifyEvidence,
}: EvidenceReviewDialogProps) {
  const collectedEvidence = useSelector((state: RootState) => state.audit.collectedEvidence)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
  const [reviewStatus, setReviewStatus] = useState<ReviewState>({})

  if (!open) return null

  const filteredEvidence = collectedEvidence.filter((ev) => {
    const status = reviewStatus[ev.id] || 'pending'
    if (filter === 'all') return true
    return status === filter
  })

  const handleApprove = (evidenceId: string) => {
    setReviewStatus((prev) => ({ ...prev, [evidenceId]: 'approved' }))
    onVerifyEvidence?.(evidenceId, true)
  }

  const handleReject = (evidenceId: string) => {
    setReviewStatus((prev) => ({ ...prev, [evidenceId]: 'rejected' }))
    onVerifyEvidence?.(evidenceId, false)
  }

  const handleReset = (evidenceId: string) => {
    setReviewStatus((prev) => {
      const newStatus = { ...prev }
      delete newStatus[evidenceId]
      return newStatus
    })
  }

  const pendingCount = collectedEvidence.filter(
    (ev) => (reviewStatus[ev.id] || 'pending') === 'pending'
  ).length
  const approvedCount = collectedEvidence.filter(
    (ev) => reviewStatus[ev.id] === 'approved'
  ).length
  const rejectedCount = collectedEvidence.filter(
    (ev) => reviewStatus[ev.id] === 'rejected'
  ).length

  const typeColors: Record<EvidenceType, string> = {
    document: '#4ade80',
    log: '#60a5fa',
    config: '#f59e0b',
    interview: '#8b5cf6',
    observation: '#ec4899',
  }

  return (
    <Overlay onClick={onClose}>
      <Card onClick={(e) => e.stopPropagation()}>
        <Header>
          <div>
            <Title>Evidence Review Panel</Title>
            <div style={{ fontSize: '12px', marginTop: '8px', color: '#a5b4ff' }}>
              Pending: {pendingCount} | Approved: {approvedCount} | Rejected: {rejectedCount}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#f4f8ff',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '0',
            }}
          >
            ✕
          </button>
        </Header>

        <Body>
          <FilterBar>
            {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
              <FilterButton
                key={f}
                active={filter === f}
                onClick={() => setFilter(f)}
                size="small"
              >
                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
              </FilterButton>
            ))}
          </FilterBar>

          <TabContent>
            {filteredEvidence.length === 0 ? (
              <NoEvidenceMessage>
                {filter === 'pending'
                  ? 'No pending evidence to review'
                  : `No ${filter} evidence`}
              </NoEvidenceMessage>
            ) : (
              <EvidenceList>
                {filteredEvidence.map((evidence) => {
                  const status = reviewStatus[evidence.id] || 'pending'
                  const typeColor = typeColors[evidence.type as EvidenceType] || '#2f4a72'

                  return (
                    <EvidenceCard key={evidence.id} status={status}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div style={{ flex: 1 }}>
                          <EvidenceMeta>
                            <EvidenceLabel>Type</EvidenceLabel>
                            <EvidenceValue>
                              <EvidenceTypeBadge style={{ backgroundColor: typeColor }}>
                                {evidence.type}
                              </EvidenceTypeBadge>
                            </EvidenceValue>

                            <EvidenceLabel style={{ marginTop: '8px' }}>Description</EvidenceLabel>
                            <EvidenceValue>{evidence.description}</EvidenceValue>

                            <EvidenceLabel style={{ marginTop: '8px' }}>Location</EvidenceLabel>
                            <EvidenceValue>{evidence.location}</EvidenceValue>

                            <EvidenceLabel style={{ marginTop: '8px' }}>Auditor</EvidenceLabel>
                            <EvidenceValue>{evidence.auditorId.substring(0, 8)}</EvidenceValue>

                            <EvidenceLabel style={{ marginTop: '8px' }}>Collected</EvidenceLabel>
                            <EvidenceValue>
                              {new Date(evidence.collectionTime).toLocaleString()}
                            </EvidenceValue>
                          </EvidenceMeta>
                        </div>

                        <div style={{ marginLeft: '12px', fontSize: '20px' }}>
                          {status === 'approved' && '✓'}
                          {status === 'rejected' && '✗'}
                        </div>
                      </div>

                      <ReviewActions>
                        <ReviewButton
                          variant="approve"
                          onClick={() => handleApprove(evidence.id)}
                          disabled={status === 'approved'}
                          size="small"
                        >
                          Approve
                        </ReviewButton>
                        <ReviewButton
                          variant="reject"
                          onClick={() => handleReject(evidence.id)}
                          disabled={status === 'rejected'}
                          size="small"
                        >
                          Reject
                        </ReviewButton>
                        {status !== 'pending' && (
                          <ReviewButton
                            variant="neutral"
                            onClick={() => handleReset(evidence.id)}
                            size="small"
                          >
                            Reset
                          </ReviewButton>
                        )}
                      </ReviewActions>
                    </EvidenceCard>
                  )
                })}
              </EvidenceList>
            )}
          </TabContent>
        </Body>
      </Card>
    </Overlay>
  )
}
