'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, BookOpen, Calendar, FlaskConical } from 'lucide-react'

const NAV = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/subjects', label: 'Subjects', icon: BookOpen },
  { href: '/sessions', label: 'Sessions', icon: Calendar },
  { href: '/mocks', label: 'Mock Tests', icon: FlaskConical },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 240,
        height: '100vh',
        background: '#0f172a',
        borderRight: '1px solid #1e293b',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem 1rem',
        zIndex: 50,
      }}
    >
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.02em' }}>
          📚 Revision Planner
        </h1>
        <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>IGCSE & AS Level</p>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.6rem 0.75rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: active ? 600 : 400,
                color: active ? '#f1f5f9' : '#94a3b8',
                background: active ? '#1e3a5f' : 'transparent',
                transition: 'all 0.15s',
              }}
            >
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
