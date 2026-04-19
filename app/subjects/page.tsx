import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function SubjectsPage() {
  const subjects = await prisma.subject.findMany({
    include: { topics: true, mockTests: true },
    orderBy: { name: 'asc' },
  })

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>Subjects</h2>
      <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '0.875rem' }}>Click a subject to manage topics and exam date</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
        {subjects.map((s) => {
          const pct = s.topics.length ? Math.round((s.topics.filter((t) => t.completed).length / s.topics.length) * 100) : 0
          const avgScore = s.mockTests.length
            ? s.mockTests.filter((m) => m.score != null && m.maxScore != null)
                .reduce((acc, m) => acc + (m.score! / m.maxScore!) * 100, 0) /
              s.mockTests.filter((m) => m.score != null && m.maxScore != null).length
            : null

          return (
            <Link key={s.id} href={`/subjects/${s.id}`} style={{ textDecoration: 'none' }}>
              <div style={{ padding: '1.25rem', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '0.75rem', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <span style={{ width: 14, height: 14, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                  <h3 style={{ fontWeight: 600, fontSize: '0.95rem', color: '#f1f5f9' }}>{s.name}</h3>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
                  <span>Topics: {s.topics.filter((t) => t.completed).length}/{s.topics.length}</span>
                  {avgScore != null && <span>Avg mock: {avgScore.toFixed(0)}%</span>}
                  {s.examDate && <span>Exam: {new Date(s.examDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>}
                </div>
                <div style={{ height: 6, background: '#1e293b', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: s.color, borderRadius: 3 }} />
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
