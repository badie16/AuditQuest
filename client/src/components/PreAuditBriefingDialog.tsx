import React from 'react'
import styled from 'styled-components'
import Button from '@mui/material/Button'
import { STORY_COMPANY, STORY_INTRO_DIALOGUE } from '../../../types/AuditData'

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(8, 10, 16, 0.86);
`

const Card = styled.div`
  width: min(760px, calc(100vw - 32px));
  max-height: calc(100vh - 32px);
  overflow: auto;
  border: 4px solid #1b1b1b;
  box-shadow: 10px 10px 0 #000;
  background: linear-gradient(180deg, #f4e4c2, #e8ce98);
  padding: 18px;
  color: #1b1b1b;
`

const Badge = styled.div`
  display: inline-block;
  padding: 8px 10px;
  border: 3px solid #1b1b1b;
  box-shadow: 3px 3px 0 #000;
  background: #20304f;
  color: #fff4d6;
  font-family: 'Press Start 2P', cursive;
  font-size: 8px;
  text-transform: uppercase;
  margin-bottom: 12px;
`

const Title = styled.h2`
  margin: 0 0 12px;
  font-family: 'Press Start 2P', cursive;
  font-size: clamp(14px, 2vw, 22px);
  line-height: 1.6;
`

const Lead = styled.p`
  margin: 0 0 14px;
  font-size: 13px;
  line-height: 1.7;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin: 12px 0;

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
  }
`

const InfoBlock = styled.div`
  background: #fff8ea;
  border: 3px solid #1b1b1b;
  box-shadow: 4px 4px 0 #000;
  padding: 12px;

  .label {
    font-family: 'Press Start 2P', cursive;
    font-size: 8px;
    text-transform: uppercase;
    color: #20304f;
    margin-bottom: 8px;
  }

  .value {
    font-size: 13px;
    line-height: 1.6;
  }
`

const RiskList = styled.ul`
  margin: 8px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 8px;

  li {
    border: 3px solid #1b1b1b;
    box-shadow: 4px 4px 0 #000;
    background: #fff8ea;
    padding: 10px;
    font-size: 12px;
    line-height: 1.5;
  }
`

const ContinueButton = styled(Button)`
  && {
    margin-top: 14px;
    width: 100%;
    font-family: 'Press Start 2P', cursive;
    font-size: 9px;
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

interface PreAuditBriefingDialogProps {
  open: boolean
  onContinue: () => void
}

export default function PreAuditBriefingDialog({ open, onContinue }: PreAuditBriefingDialogProps) {
  if (!open) return null

  return (
    <Overlay>
      <Card>
        <Badge>Pre-Audit Briefing</Badge>
        <Title>{STORY_INTRO_DIALOGUE.title}</Title>
        <Lead>{STORY_INTRO_DIALOGUE.content}</Lead>

        <Grid>
          <InfoBlock>
            <div className="label">Company</div>
            <div className="value">{STORY_COMPANY.name}</div>
          </InfoBlock>
          <InfoBlock>
            <div className="label">Sector</div>
            <div className="value">{STORY_COMPANY.sector}</div>
          </InfoBlock>
          <InfoBlock>
            <div className="label">Objective</div>
            <div className="value">{STORY_INTRO_DIALOGUE.objective}</div>
          </InfoBlock>
          <InfoBlock>
            <div className="label">First Stake</div>
            <div className="value">{STORY_INTRO_DIALOGUE.firstEnjeu}</div>
          </InfoBlock>
        </Grid>

        <InfoBlock>
          <div className="label">Main Risks</div>
          <RiskList>
            {STORY_COMPANY.primaryRisks.map((risk) => (
              <li key={risk}>{risk}</li>
            ))}
          </RiskList>
        </InfoBlock>

        <ContinueButton variant="contained" onClick={onContinue}>
          Continue to Mission
        </ContinueButton>
      </Card>
    </Overlay>
  )
}
