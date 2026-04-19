import { prisma } from '@/lib/prisma'
import { AddMockForm, MockRow } from './MockClient'

export const dynamic = 'force-dynamic'

export default async function MocksPage() {
  const [subjects, mocks] = await Promise.all([
    prisma.subject.findMany({ orderBy: { name: 'asc' } }),
    prisma.mockTest.findMany({ include: { subject: true }, orderBy: { date: 'desc' } }),
  ])

  const bySubject = subjects.map((s) => ({
    ...s,
    tests: mocks.filter((m) => m.subjectId === s.id),
  }))

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>Mock Tests</h2>
      <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '2rem' }}>Record and track your mock exam scores</p>

      <div style={{ padding: '1.25rem', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '0.75rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Add Mock Test</h3>
        <AddMockForm subjects={subjects} />
      </div>

      {/* Per-subject summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {bySubject.map((s) => {
          const scored = s.tests.filter((m) => m.score != null && m.maxScore != null)
          const avg = scored.length ? scored.reduce((acc, m) => acc + (m.score! / m.maxScore!) * 100, 0) / scored.length : null
          return (
            <div key={s.id} style={{ padding: '0.75rem 1rem', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#94a3b8' }}>{s.name}</span>
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: avg == null ? '#64748b' : avg >= 70 ? '#10b981' : avg >= 50 ? '#f59e0b' : '#ef4444' }}>
                {avg == null ? '—' : `${avg.toFixed(0)}%`}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{s.tests.length} test{s.tests.length !== 1 ? 's' : ''}</div>
            </div>
          )
        })}
      </div>

      {/* All tests list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {mocks.length === 0 ? (
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>No mock tests recorded yet.</p>
        ) : (
          mocks.map((m) => <MockRow key={m.id} mock={m} />)
        )}
      </div>
    </div>
  )
}
