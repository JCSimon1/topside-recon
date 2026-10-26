import type { SteamStatus } from '../api/types' 

export const steamStatusDot: Record<SteamStatus, string> = {
  online: 'bg-positive',
  looking_to_play: 'bg-positive',
  busy: 'bg-negative',
  away: 'bg-accent',
  snooze: 'bg-accent',
  looking_to_trade: 'bg-accent-2',
  offline: 'bg-text-faint',
}

export const steamStatusLabel: Record<SteamStatus, string> = {
  online: 'Online',
  offline: 'Offline',
  busy: 'Beschäftigt',
  away: 'Abwesend',
  snooze: 'Schlummern',
  looking_to_trade: 'Handeln',
  looking_to_play: 'Spielbereit',
}