/**
 * Helper function to determine which mini-game should be triggered for a mission
 */
export function getMiniGameForMission(
  missionId: string
): 'clearDesk' | 'passwordPolicy' | 'logAnalysis' | null {
  // Map mission IDs to mini-games
  const missionGameMap: Record<string, 'clearDesk' | 'passwordPolicy' | 'logAnalysis'> = {
    'a11-2': 'clearDesk', // A.11.2.9 - Clear Desk & Clear Screen
    'a9-4': 'passwordPolicy', // A.9.4.3 - Password Management
    'a12-4': 'logAnalysis', // A.12.4.1 - Event Logging
  }

  return missionGameMap[missionId] || null
}

/**
 * Get description of mini-game for UI
 */
export function getMiniGameDescription(
  gameType: 'clearDesk' | 'passwordPolicy' | 'logAnalysis' | null
): string {
  const descriptions: Record<string, string> = {
    clearDesk: 'Find all security violations left on the desk',
    passwordPolicy: 'Verify the password policy requirements',
    logAnalysis: 'Identify anomalous log entries',
  }

  return descriptions[gameType || ''] || ''
}
