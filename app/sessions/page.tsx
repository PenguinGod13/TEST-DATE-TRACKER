import { prisma } from '@/lib/prisma'
import { AddSessionForm, SessionRow } from './SessionClient'
import { isThisWeek, isFuture, isPast } from 'date-fns'

export const dynamic = 'force-dynamic'

export default async function SessionsPage() {
  const [subjects, sessions] = await Promise.all([
    prisma.subject.findMany({ orderBy: { name: 'asc' } }),
    prisma.session.findMany({ include: { subject: true }, orderBy: { date: 'asc' } }),
  ])

  const upcoming = sessions.filter((s) => isFuture(new Date(s.date)))
  const past = sessions.filter((s) => isPast(new Date(s.date)))

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>Sessions</h2>
      <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '2rem' }}>Plan and track your revision sessions</p>

      <div style={{ padding: '1.25rem', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '0.75rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Add Session</h3>
        <AddSessionForm subjects={subjects} />
      </div>

      {upcoming.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Upcoming</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {upcoming.map((s) => (
              <SessionRow key={s.id} session={s} subjectColor={s.subject.color} />
            ))}
          </div>
        </div>
      )}

      {past.length > 0 && (
        <div>
          <h3 style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Past</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[...past].reverse().map((s) => (
              <SessionRow key={s.id} session={s} subjectColor={s.subject.color} />
            ))}
          </div>
        </div>
      )}

      {sessions.length === 0 && (
        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>No sessions yet. Add one above.</p>
      )}
    </div>
  )
}
