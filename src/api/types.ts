export interface Round {
  id: number
  number: number
  date: string // 'YYYY-MM-DD'
  time: string // 'HH:MM'
  map: string
  condition: string
  money: number
  xp: number
}

// Expected values by the backend for the creation of a run / round
export interface RoundPayload {
  round_number: number
  round_date: string
  round_time: string
  map: string
  map_condition: string
  money: number
  xp: number
}

export interface LootItem {
  key: string
  name: string
  price: number
  amount: number
}

export interface RankOption {
  key: string
  name: string
}

export interface Settings {
  rank: string | null
  ranks: RankOption[]
}