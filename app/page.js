'use client'
import ChatSimulation from './components/ChatSimulation'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 dark:bg-gray-800">
      <ChatSimulation />
    </main>
  )
}
