import { request } from './client'
import type { SteamProfile } from './types'

export const getSteamProfile = () => request<SteamProfile>('/api/steam/profile')