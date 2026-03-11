import { AuditReport, AuditMission, ComplianceFinding, RiskAssessment, JournalEntry } from '../../../types/AuditTypes'
import { calculateCompliancePercentage, getPerformanceGrade, generateRecommendations } from './scoringSystem'

/**
 * Generate audit report from audit data
 */
export function generateAuditReport(params: {
  sessionId: string
  missions: AuditMission[]
  findings: ComplianceFinding[]
  risks: RiskAssessment[]
  journal: JournalEntry[]
  totalScore: number
  auditorId: string
}): AuditReport {
  const compliant = params.findings.filter((f) => f.status === 'compliant')
  const nonCompliant = params.findings.filter((f) => f.status === 'non-compliant')
  const partial = params.findings.filter((f) => f.status === 'partial')

  const grade = getPerformanceGrade(params.totalScore)
  const recommendations = generateRecommendations(params.findings)

  return {
    id: `report_${Date.now()}`,
    sessionId: params.sessionId,
    generatedAt: Date.now(),
    generatedBy: params.auditorId,
    title: `ISO 27001 Audit Report - ${new Date(Date.now()).toLocaleDateString()}`,
    executive_summary: generateExecutiveSummary({
      grade: grade.grade,
      score: params.totalScore,
      compliant: compliant.length,
      nonCompliant: nonCompliant.length,
      partial: partial.length,
    }),
    controls_audited: params.missions.length,
    compliant_count: compliant.length,
    non_compliant_count: nonCompliant.length,
    partial_count: partial.length,
    findings: params.findings,
    risks: params.risks,
    journal_entries: params.journal,
    total_score: params.totalScore,
    recommendations,
    next_steps: generateNextSteps(nonCompliant),
  }
}

/**
 * Generate executive summary
 */
function generateExecutiveSummary(params: {
  grade: string
  score: number
  compliant: number
  nonCompliant: number
  partial: number
}): string {
  return `This audit assessed ${params.compliant + params.nonCompliant + params.partial} ISO 27001 controls. 
The organization received a grade of ${params.grade} with a score of ${params.score}/100. 
${params.compliant} controls are compliant, ${params.nonCompliant} have non-compliances, and ${params.partial} are partially compliant. 
Key remediation efforts should focus on addressing the identified non-compliant areas.`
}

/**
 * Generate next steps based on findings
 */
function generateNextSteps(nonCompliant: ComplianceFinding[]): string[] {
  const steps: string[] = []

  steps.push('1. Prioritize remediation of critical non-compliant findings')
  steps.push('2. Assign ownership for each non-compliant item')
  steps.push('3. Develop remediation plans with specific timelines')
  steps.push('4. Implement security controls to address gaps')
  steps.push('5. Schedule follow-up audit to verify remediation')

  return steps
}

/**
 * Export report as JSON
 */
export function exportReportAsJSON(report: AuditReport): string {
  return JSON.stringify(report, null, 2)
}

/**
 * Export report as CSV
 */
export function exportReportAsCSV(report: AuditReport): string {
  let csv = 'ISO 27001 Audit Report\n'
  csv += `Generated: ${new Date(report.generatedAt).toLocaleString()}\n`
  csv += `Auditor: ${report.generatedBy}\n`
  csv += `Score: ${report.total_score}/100\n\n`

  csv += 'FINDINGS\n'
  csv += 'Mission ID,Status,Justification,Auditor\n'

  report.findings.forEach((finding) => {
    csv += `"${finding.missionId}","${finding.status}","${finding.justification}","${finding.auditorId}"\n`
  })

  csv += '\nRISK ASSESSMENTS\n'
  csv += 'Finding ID,Probability,Impact,Severity,Recommendation\n'

  report.risks.forEach((risk) => {
    csv += `"${risk.findingId}","${risk.probability}","${risk.impact}","${risk.severity}","${risk.recommendation}"\n`
  })

  return csv
}

/**
 * Export report as HTML
 */
export function exportReportAsHTML(report: AuditReport): string {
  const timestamp = new Date(report.generatedAt).toLocaleString()
  const gradeColor = getGradeColor(extractGrade(report.total_score))

  let html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${report.title}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 900px;
      margin: 0 auto;
      padding: 20px;
      background: #f5f5f5;
    }
    .header {
      background: #1976d2;
      color: white;
      padding: 20px;
      border-radius: 5px;
      margin-bottom: 30px;
    }
    .header h1 {
      margin: 0 0 10px 0;
    }
    .score-card {
      background: white;
      padding: 20px;
      border-radius: 5px;
      margin-bottom: 20px;
      border-left: 5px solid ${gradeColor};
    }
    .score-display {
      font-size: 48px;
      font-weight: bold;
      color: ${gradeColor};
      text-align: center;
      margin: 10px 0;
    }
    .section {
      background: white;
      padding: 20px;
      margin-bottom: 20px;
      border-radius: 5px;
    }
    .section h2 {
      color: #1976d2;
      border-bottom: 2px solid #1976d2;
      padding-bottom: 10px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    th {
      background: #f0f0f0;
      padding: 10px;
      text-align: left;
      font-weight: bold;
      border-bottom: 2px solid #ddd;
    }
    td {
      padding: 10px;
      border-bottom: 1px solid #ddd;
    }
    .status-compliant {
      color: #4CAF50;
      font-weight: bold;
    }
    .status-non-compliant {
      color: #F44336;
      font-weight: bold;
    }
    .status-partial {
      color: #FFC107;
      font-weight: bold;
    }
    .risk-high {
      color: #F44336;
      font-weight: bold;
    }
    .risk-medium {
      color: #FFC107;
      font-weight: bold;
    }
    .risk-low {
      color: #4CAF50;
      font-weight: bold;
    }
    .recommendation {
      background: #f9f9f9;
      padding: 10px;
      margin: 5px 0;
      border-left: 3px solid #1976d2;
    }
    .footer {
      text-align: center;
      color: #666;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${report.title}</h1>
    <p>Generated: ${timestamp}</p>
    <p>Auditor: ${report.generatedBy}</p>
  </div>

  <div class="score-card">
    <h2>Audit Score</h2>
    <div class="score-display">${report.total_score}/100</div>
    <p style="text-align: center; font-size: 18px;">Grade: ${extractGrade(report.total_score)}</p>
  </div>

  <div class="section">
    <h2>Executive Summary</h2>
    <p>${report.executive_summary}</p>
  </div>

  <div class="section">
    <h2>Compliance Overview</h2>
    <table>
      <tr>
        <th>Total Controls Audited</th>
        <th>Compliant</th>
        <th>Non-Compliant</th>
        <th>Partial</th>
      </tr>
      <tr>
        <td>${report.controls_audited}</td>
        <td class="status-compliant">${report.compliant_count}</td>
        <td class="status-non-compliant">${report.non_compliant_count}</td>
        <td class="status-partial">${report.partial_count}</td>
      </tr>
    </table>
  </div>

  ${
    report.findings.length > 0
      ? `
  <div class="section">
    <h2>Findings</h2>
    <table>
      <tr>
        <th>Control</th>
        <th>Status</th>
        <th>Justification</th>
      </tr>
      ${report.findings
        .map(
          (finding) => `
      <tr>
        <td>${finding.missionId}</td>
        <td class="status-${finding.status}">${finding.status}</td>
        <td>${finding.justification}</td>
      </tr>
      `,
        )
        .join('')}
    </table>
  </div>
  `
      : ''
  }

  ${
    report.risks.length > 0
      ? `
  <div class="section">
    <h2>Risk Assessments</h2>
    <table>
      <tr>
        <th>Probability</th>
        <th>Impact</th>
        <th>Severity</th>
        <th>Recommendation</th>
      </tr>
      ${report.risks
        .map(
          (risk) => `
      <tr>
        <td>${risk.probability}</td>
        <td>${risk.impact}</td>
        <td class="risk-${risk.severity}">${risk.severity}</td>
        <td>${risk.recommendation}</td>
      </tr>
      `,
        )
        .join('')}
    </table>
  </div>
  `
      : ''
  }

  <div class="section">
    <h2>Recommendations</h2>
    ${report.recommendations.map((rec) => `<div class="recommendation">${rec}</div>`).join('')}
  </div>

  <div class="section">
    <h2>Next Steps</h2>
    <ol>
      ${report.next_steps.map((step) => `<li>${step}</li>`).join('')}
    </ol>
  </div>

  <div class="footer">
    <p>© 2024 ISO 27001 Audit Training System</p>
  </div>
</body>
</html>
  `

  return html
}

/**
 * Extract grade from score
 */
function extractGrade(score: number): string {
  if (score >= 90) return 'A'
  if (score >= 80) return 'B'
  if (score >= 70) return 'C'
  if (score >= 60) return 'D'
  return 'F'
}

/**
 * Get color for grade
 */
function getGradeColor(grade: string): string {
  const colors: Record<string, string> = {
    A: '#4CAF50',
    B: '#8BC34A',
    C: '#FFC107',
    D: '#FF9800',
    F: '#F44336',
  }
  return colors[grade] || '#9E9E9E'
}

/**
 * Download file helper
 */
export function downloadFile(filename: string, content: string, type: string = 'text/plain'): void {
  const element = document.createElement('a')
  element.setAttribute('href', `data:${type};charset=utf-8,${encodeURIComponent(content)}`)
  element.setAttribute('download', filename)
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}
