import React from 'react'
import styled from 'styled-components'
import Button from '@mui/material/Button'
import { AuditReport } from '../../../types/AuditTypes'

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
  width: min(960px, calc(100vw - 32px));
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

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const Title = styled.h2`
  margin: 0;
  font-family: 'Press Start 2P', cursive;
  font-size: clamp(14px, 2vw, 22px);
  line-height: 1.6;
`

const Meta = styled.div`
  font-family: 'Share Tech Mono', monospace;
  font-size: 14px;
  line-height: 1.6;
  color: #cfe3ff;
`

const Body = styled.div`
  padding: 20px;
  display: grid;
  gap: 16px;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`

const Stat = styled.div`
  background: #fff8ea;
  color: #1b1b1b;
  border: 3px solid #1b1b1b;
  box-shadow: 4px 4px 0 #000;
  padding: 12px;

  .label {
    font-family: 'Press Start 2P', cursive;
    font-size: 8px;
    line-height: 1.6;
    margin-bottom: 8px;
    text-transform: uppercase;
  }

  .value {
    font-family: 'Share Tech Mono', monospace;
    font-size: 16px;
    line-height: 1.6;
  }
`

const Section = styled.section`
  background: rgba(255, 255, 255, 0.03);
  border: 3px solid #2f4a72;
  box-shadow: 4px 4px 0 #000;
  padding: 14px;

  h3 {
    margin: 0 0 10px;
    font-family: 'Press Start 2P', cursive;
    font-size: 11px;
    line-height: 1.6;
    color: #42eacb;
  }

  p,
  li,
  div {
    font-family: 'Share Tech Mono', monospace;
    font-size: 14px;
    line-height: 1.7;
  }
`

const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-end;
  padding: 0 20px 20px;
`

const CloseButton = styled(Button)`
  && {
    font-family: 'Press Start 2P', cursive;
    font-size: 8px;
    line-height: 1.6;
    text-transform: uppercase;
    border: 4px solid #1b1b1b;
    border-radius: 0;
    box-shadow: 4px 4px 0 #000;
    background: #ff6d6d;
    color: #fff;
    padding: 12px 14px;
  }
`

const DownloadButton = styled(Button)`
  && {
    font-family: 'Press Start 2P', cursive;
    font-size: 8px;
    line-height: 1.6;
    text-transform: uppercase;
    border: 4px solid #1b1b1b;
    border-radius: 0;
    box-shadow: 4px 4px 0 #000;
    background: #42eacb;
    color: #0f1722;
    padding: 12px 14px;
  }
`

interface FinalReportDialogProps {
  open: boolean
  report: AuditReport
  campaignResult?: 'pass' | 'warning' | 'fail'
  campaignConclusion?: string
  currentChapterTitle?: string
  onClose: () => void
  onDownloadHTML: () => void
  onDownloadCSV: () => void
}

export default function FinalReportDialog({
  open,
  report,
  campaignResult,
  campaignConclusion,
  currentChapterTitle,
  onClose,
  onDownloadHTML,
  onDownloadCSV,
}: FinalReportDialogProps) {
  if (!open) return null

  const grade =
    report.total_score >= 90
      ? 'A'
      : report.total_score >= 80
        ? 'B'
        : report.total_score >= 70
          ? 'C'
          : report.total_score >= 60
            ? 'D'
            : 'F'

  return (
    <Overlay>
      <Card>
        <Header>
          <TitleBlock>
            <Title>Final Audit Report</Title>
            <Meta>{report.title}</Meta>
            <Meta>Session {report.sessionId}</Meta>
          </TitleBlock>
          <CloseButton onClick={onClose}>Close</CloseButton>
        </Header>

        <Body>
          <Grid>
            <Stat>
              <div className="label">Final Score</div>
              <div className="value">{report.total_score}/100</div>
            </Stat>
            <Stat>
              <div className="label">Grade</div>
              <div className="value">{grade}</div>
            </Stat>
            <Stat>
              <div className="label">Result</div>
              <div className="value">{campaignResult || 'warning'}</div>
            </Stat>
          </Grid>

          <Section>
            <h3>Campaign Conclusion</h3>
            <p>{campaignConclusion || report.executive_summary}</p>
            {currentChapterTitle && <p>Last active chapter: {currentChapterTitle}</p>}
          </Section>

          <Section>
            <h3>Executive Summary</h3>
            <p>{report.executive_summary}</p>
          </Section>

          <Grid>
            <Stat>
              <div className="label">Controls Audited</div>
              <div className="value">{report.controls_audited}</div>
            </Stat>
            <Stat>
              <div className="label">Compliant</div>
              <div className="value">{report.compliant_count}</div>
            </Stat>
            <Stat>
              <div className="label">Non-Compliant</div>
              <div className="value">{report.non_compliant_count}</div>
            </Stat>
          </Grid>

          <Section>
            <h3>Next Steps</h3>
            <ul>
              {report.next_steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </Section>

          <Section>
            <h3>Top Recommendations</h3>
            <ul>
              {report.recommendations.map((recommendation) => (
                <li key={recommendation}>{recommendation}</li>
              ))}
            </ul>
          </Section>
        </Body>

        <ButtonRow>
          <DownloadButton onClick={onDownloadCSV}>Download CSV</DownloadButton>
          <DownloadButton onClick={onDownloadHTML}>Download HTML</DownloadButton>
          <CloseButton onClick={onClose}>Dismiss</CloseButton>
        </ButtonRow>
      </Card>
    </Overlay>
  )
}
