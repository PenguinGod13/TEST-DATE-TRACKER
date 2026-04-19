import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/Sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Revision Planner',
  description: 'Track your IGCSE & AS revision',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex`} style={{ background: '#030712', color: '#f1f5f9' }}>
        <Sidebar />
        <main style={{ marginLeft: '240px', flex: 1, padding: '2rem', overflowY: 'auto' }}>
          {children}
        </main>
      </body>
    </html>
  )
}
