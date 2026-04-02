import { Command } from '@colyseus/command'
import { OfficeState } from '../schema/OfficeState'
import { JournalEntrySchema, NotificationSchema } from '../schema/AuditState'
import { v4 as uuid } from 'uuid'

type AuditRole = 'auditor' | 'auditee' | 'observer'

export class ChangePlayerRoleCommand extends Command<OfficeState> {
  execute({
    client,
    targetPlayerId,
    role,
  }: {
    client: any
    targetPlayerId: string
    role: AuditRole
  }) {
    const actor = client ? this.state.players.get(client.sessionId) : undefined
    if (!actor || actor.role !== 'auditor') {
      console.error(`Unauthorized role change by ${client?.sessionId || 'unknown'}`)
      return
    }

    const targetPlayer = this.state.players.get(targetPlayerId)
    if (!targetPlayer) {
      console.error(`Target player ${targetPlayerId} not found for role change`)
      return
    }

    targetPlayer.role = role

    const journalEntry = new JournalEntrySchema()
    journalEntry.id = uuid()
    journalEntry.timestamp = Date.now()
    journalEntry.auditorId = client?.sessionId || 'auditor'
    journalEntry.action = 'Changed player role'
    journalEntry.details = `${targetPlayerId} -> ${role}`
    journalEntry.type = 'note_added'
    this.state.journal.push(journalEntry)

    const notification = new NotificationSchema()
    notification.id = uuid()
    notification.timestamp = Date.now()
    notification.type = 'info'
    notification.title = 'Role Updated'
    notification.message = `Player role set to ${role}`
    this.state.notifications.push(notification)
  }
}

export const playerRoleCommands = [ChangePlayerRoleCommand]
