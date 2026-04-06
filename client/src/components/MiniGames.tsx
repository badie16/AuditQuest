import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Button from '@mui/material/Button'

const GameContainer = styled.div`
  background: linear-gradient(180deg, #102238, #0b1320);
  border: 4px solid #1b1b1b;
  box-shadow: 10px 10px 0 #000;
  padding: 20px;
  color: #f4f8ff;
  max-width: 500px;
  margin: 0 auto;
`

const GameTitle = styled.h2`
  font-family: 'Press Start 2P', cursive;
  font-size: 18px;
  margin: 0 0 16px;
  color: #42eacb;
  text-align: center;
`

const GameInstructions = styled.p`
  font-family: 'Share Tech Mono', monospace;
  font-size: 13px;
  line-height: 1.6;
  margin: 0 0 16px;
  text-align: center;
  color: #a5b4ff;
`

const GameBoard = styled.div`
  display: grid;
  gap: 12px;
  margin: 20px 0;
`

const ClickableItem = styled.div<{ found?: boolean; active?: boolean }>`
  background: ${(props) => (props.found ? '#1a3a1a' : props.active ? '#3a2a1a' : '#2f4a72')};
  border: 3px solid ${(props) => (props.found ? '#4ade80' : '#1b1b1b')};
  box-shadow: 4px 4px 0 #000;
  padding: 16px;
  cursor: ${(props) => (props.found ? 'default' : 'pointer')};
  font-family: 'Share Tech Mono', monospace;
  font-size: 13px;
  color: ${(props) => (props.found ? '#4ade80' : '#f4f8ff')};
  transition: all 0.2s;
  text-decoration: ${(props) => (props.found ? 'line-through' : 'none')};

  &:hover {
    background: ${(props) => (props.found ? '#1a3a1a' : '#3a5a92')};
  }
`

const ScoreBoard = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 16px 0;
  font-family: 'Share Tech Mono', monospace;
`

const ScoreStat = styled.div`
  background: #fff8ea;
  color: #1b1b1b;
  border: 3px solid #1b1b1b;
  box-shadow: 4px 4px 0 #000;
  padding: 10px 16px;
  text-align: center;

  .label {
    font-size: 10px;
    font-weight: bold;
    text-transform: uppercase;
  }

  .value {
    font-size: 18px;
    font-weight: bold;
    margin-top: 4px;
  }
`

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 16px;
`

const GameButton = styled(Button)`
  && {
    font-family: 'Press Start 2P', cursive;
    font-size: 10px;
    padding: 10px 16px;
    background: #42eacb;
    color: #0f1722;
    border: 3px solid #1b1b1b;
    border-radius: 0;
    box-shadow: 4px 4px 0 #000;
    text-transform: uppercase;

    &:hover {
      background: #4ade80;
    }
  }
`

interface ClearDeskGameProps {
  onComplete?: (success: boolean) => void
  onClose?: () => void
}

export function ClearDeskChallenge({ onComplete, onClose }: ClearDeskGameProps) {
  const [foundItems, setFoundItems] = useState<string[]>([])
  const [score, setScore] = useState(0)

  const items = [
    { id: 'doc1', label: '🔒 Classified Document Left Out' },
    { id: 'pwd1', label: '📝 Password Written on Sticky Note' },
    { id: 'id1', label: '🪪 Employee ID Card Visible' },
    { id: 'login1', label: '💻 Login Details on Monitor' },
  ]

  const handleItemClick = (itemId: string) => {
    if (!foundItems.includes(itemId)) {
      setFoundItems([...foundItems, itemId])
      setScore(score + 25)
    }
  }

  const allFound = foundItems.length === items.length

  const handleComplete = () => {
    onComplete?.(allFound)
    onClose?.()
  }

  return (
    <GameContainer>
      <GameTitle>🔍 Clear Desk Challenge</GameTitle>
      <GameInstructions>
        Find all security violations left on the desk. Click each item when you spot it!
      </GameInstructions>

      <ScoreBoard>
        <ScoreStat>
          <div className="label">Found</div>
          <div className="value">
            {foundItems.length}/{items.length}
          </div>
        </ScoreStat>
        <ScoreStat>
          <div className="label">Score</div>
          <div className="value">{score}%</div>
        </ScoreStat>
      </ScoreBoard>

      <GameBoard>
        {items.map((item) => (
          <ClickableItem
            key={item.id}
            found={foundItems.includes(item.id)}
            onClick={() => handleItemClick(item.id)}
          >
            {foundItems.includes(item.id) ? `✓ ${item.label}` : item.label}
          </ClickableItem>
        ))}
      </GameBoard>

      {allFound && (
        <div style={{ textAlign: 'center', color: '#4ade80', fontWeight: 'bold' }}>
          🎉 All violations found! Clear desk is compliant.
        </div>
      )}

      <ActionButtons>
        <GameButton onClick={handleComplete}>{allFound ? 'Confirm' : 'Done'}</GameButton>
        <GameButton onClick={onClose}>Cancel</GameButton>
      </ActionButtons>
    </GameContainer>
  )
}

interface PasswordPolicyGameProps {
  onComplete?: (success: boolean) => void
  onClose?: () => void
}

export function PasswordPolicyGame({ onComplete, onClose }: PasswordPolicyGameProps) {
  const [answers, setAnswers] = useState<Record<string, boolean>>({
    minLength: false,
    uppercase: false,
    numbers: false,
    symbols: false,
  })
  const [score, setScore] = useState(0)

  const requirements = [
    { id: 'minLength', label: '✓ Minimum 12 characters' },
    { id: 'uppercase', label: '✓ At least one UPPERCASE letter' },
    { id: 'numbers', label: '✓ At least one number (0-9)' },
    { id: 'symbols', label: '✓ At least one special character (!@#$)' },
  ]

  const handleToggle = (id: string) => {
    setAnswers((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  useEffect(() => {
    const correctAnswers = Object.values(answers).filter((v) => v).length
    setScore(Math.ceil((correctAnswers / 4) * 100))
  }, [answers])

  const allCorrect = Object.values(answers).every((v) => v)

  const handleComplete = () => {
    onComplete?.(allCorrect)
    onClose?.()
  }

  return (
    <GameContainer>
      <GameTitle>🔐 Password Policy Verifier</GameTitle>
      <GameInstructions>
        Select all the password policy requirements that should be enforced.
      </GameInstructions>

      <ScoreBoard>
        <ScoreStat>
          <div className="label">Selected</div>
          <div className="value">{Object.values(answers).filter((v) => v).length}/4</div>
        </ScoreStat>
        <ScoreStat>
          <div className="label">Score</div>
          <div className="value">{score}%</div>
        </ScoreStat>
      </ScoreBoard>

      <GameBoard>
        {requirements.map((req) => (
          <ClickableItem
            key={req.id}
            found={answers[req.id as keyof typeof answers]}
            active={answers[req.id as keyof typeof answers]}
            onClick={() => handleToggle(req.id)}
          >
            {answers[req.id as keyof typeof answers] ? '✓' : '○'} {req.label}
          </ClickableItem>
        ))}
      </GameBoard>

      {allCorrect && (
        <div style={{ textAlign: 'center', color: '#4ade80', fontWeight: 'bold' }}>
          ✓ Strong password policy configured!
        </div>
      )}

      <ActionButtons>
        <GameButton onClick={handleComplete}>{allCorrect ? 'Confirm' : 'Done'}</GameButton>
        <GameButton onClick={onClose}>Cancel</GameButton>
      </ActionButtons>
    </GameContainer>
  )
}

interface LogAnalysisGameProps {
  onComplete?: (success: boolean) => void
  onClose?: () => void
}

export function LogAnalysisGame({ onComplete, onClose }: LogAnalysisGameProps) {
  const [selectedAnomalies, setSelectedAnomalies] = useState<string[]>([])

  const logEntries = [
    { id: 'ok1', label: '✓ 2024-04-06 09:15 - User login from office', anomaly: false },
    {
      id: 'anom1',
      label: '⚠️ 2024-04-06 11:45 - Multiple failed login attempts (5x)',
      anomaly: true,
    },
    { id: 'ok2', label: '✓ 2024-04-06 14:30 - File access: /audit/reports', anomaly: false },
    {
      id: 'anom2',
      label: '⚠️ 2024-04-06 15:22 - Access from unknown IP: 192.168.0.150',
      anomaly: true,
    },
    { id: 'anom3', label: '⚠️ 2024-04-06 16:00 - Large data export (2GB)', anomaly: true },
  ]

  const handleToggle = (id: string) => {
    setSelectedAnomalies((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const correctAnomalies = logEntries.filter((log) => log.anomaly).map((log) => log.id)
  const allAnomaliesFound =
    selectedAnomalies.length === correctAnomalies.length &&
    selectedAnomalies.every((id) => correctAnomalies.includes(id))

  const score = Math.ceil(
    (selectedAnomalies.filter((id) => correctAnomalies.includes(id)).length /
      correctAnomalies.length) *
      100
  )

  const handleComplete = () => {
    onComplete?.(allAnomaliesFound)
    onClose?.()
  }

  return (
    <GameContainer>
      <GameTitle>📊 Log Analysis Challenge</GameTitle>
      <GameInstructions>
        Identify all anomalous log entries that might indicate security issues.
      </GameInstructions>

      <ScoreBoard>
        <ScoreStat>
          <div className="label">Found</div>
          <div className="value">
            {selectedAnomalies.filter((id) => correctAnomalies.includes(id)).length}/
            {correctAnomalies.length}
          </div>
        </ScoreStat>
        <ScoreStat>
          <div className="label">Score</div>
          <div className="value">{score}%</div>
        </ScoreStat>
      </ScoreBoard>

      <GameBoard>
        {logEntries.map((log) => (
          <ClickableItem
            key={log.id}
            found={selectedAnomalies.includes(log.id)}
            onClick={() => handleToggle(log.id)}
          >
            {selectedAnomalies.includes(log.id) ? '✓' : '○'} {log.label}
          </ClickableItem>
        ))}
      </GameBoard>

      {allAnomaliesFound && (
        <div style={{ textAlign: 'center', color: '#4ade80', fontWeight: 'bold' }}>
          ✓ All anomalies identified! Logging controls are working.
        </div>
      )}

      <ActionButtons>
        <GameButton onClick={handleComplete}>{allAnomaliesFound ? 'Confirm' : 'Done'}</GameButton>
        <GameButton onClick={onClose}>Cancel</GameButton>
      </ActionButtons>
    </GameContainer>
  )
}
