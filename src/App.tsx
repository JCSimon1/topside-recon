import { useEffect, useState } from 'react'

interface Round {
  id: number
  number: number
  date: string
  time: string
  map: string
  condition: string
  money: number
  xp: number
}

export default function App() {
  const [rounds, setRounds] = useState<Round[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/rounds')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<Round[]>
      })
      .then(setRounds)
      .catch((e: Error) => setError(e.message))
  }, [])

  if (error) return <p className="p-6 text-red-400">Fehler: {error}</p>

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Arc Log</h1>
      <p className="mt-2">{rounds.length} Runden geladen</p>
    </main>
  )
}