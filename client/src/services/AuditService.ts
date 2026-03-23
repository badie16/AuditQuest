import store from '../stores'
import { setActiveTab } from '../stores/AuditStore'

/**
 * Initializes the audit session and creates default audit missions
 */
export const initializeAuditSession = () => {
  // Client-side initialization is now handled by Network.ts listening to server state.
  // This function remains to set the initial active tab or other client-specific UI defaults.

  // Set the active tab to missions
  store.dispatch(setActiveTab('missions'))
}

export default {
  initializeAuditSession,
}
