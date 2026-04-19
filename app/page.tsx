import { prisma } from '@/lib/prisma'
import { differenceInDays, format, isToday, isFuture } from 'date-fns'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const subjects = await prisma.subject.findMany({
    include: { topics: true, sessions: true, mockTests: true },
    orderBy: { name: 'asc' },
  })

  const today = new Date()
  const upcomingExams = subjects
    .filter((s) => s.examDate && isFuture(s.examDate))
    .sort((a, b) => a.examDate!.getTime() - b.examDate!.getTime())

  const todaySessions = subjects.flatMap((s) =>
    s.sessions
      .filter((sess) => isToday(new Date(sess.date)))
      .map((sess) => ({ ...sess, subjectName: s.name, color: s.color })),
  )

  const totalTopics = subjects.reduce((acc, s) => acc + s.topics.length, 0)
  const completedTopics = subjects.reduce((acc, s) => acc + s.topics.filter((t) => t.completed).length, 0)
  const totalSessions = subjects.reduce((acc, s) => acc + s.sessions.length, 0)
  const completedSessions = subjects.reduce((acc, s) => acc + s.sessions.filter((sess) => sess.completed).length, 0)

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>Dashboard</h2>
      <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '0.875rem' }}>
        {format(today, 'EEEE, MMMM d yyyy')}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        <StatCard label="Topics Covered" value={`${completedTopics} / ${totalTopics}`} color="#3b82f6" />
        <StatCard label="Sessions Done" value={`${completedSessions} / ${totalSessions}`} color="#10b981" />
        <StatCard label="Exams Upcoming" value={upcomingExams.length.toString()} color="#f59e0b" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <Card title="Upcoming Exams">
          {upcomingExams.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
              No exam dates set.{' '}
              <Link href="/subjects" style={{ color: '#3b82f6' }}>Add them →</Link>
            </p>
          ) : (
            upcomingExams.map((s) => {
              const days = differenceInDays(s.examDate!, today)
              return (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #1e293b' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: s.color, display: 'inline-block', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.875rem' }}>{s.name}</span>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{format(s.examDate!, 'dd MMM')}</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: days <= 7 ? '#ef4444' : days <= 14 ? '#f59e0b' : '#10b981' }}>
                      {days === 0 ? 'TODAY' : `${days}d`}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </Card>

        <Card title="Today's Sessions">
          {todaySessions.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
              No sessions today.{' '}
              <Link href="/sessions" style={{ color: '#3b82f6' }}>Schedule one →</Link>
            </p>
          ) : (
            todaySessions.map((sess) => (
              <div key={sess.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0', borderBottom: '1px solid #1e293b' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: sess.color, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.875rem' }}>{sess.subjectName}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{sess.durationMin} min{sess.notes ? ` · ${sess.notes}` : ''}</div>
                </div>
                <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: sess.completed ? '#10b981' : '#64748b', flexShrink: 0 }}>
                  {sess.completed ? '✓ Done' : 'Pending'}
                </span>
              </div>
            ))
          )}
        </Card>

        <div style={{ gridColumn: '1 / -1' }}>
          <Card title="Subject Progress">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
              {subjects.map((s) => {
                const pct = s.topics.length ? Math.round((s.topics.filter((t) => t.completed).length / s.topics.length) * 100) : 0
                return (
                  <Link key={s.id} href={`/subjects/${s.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{ padding: '0.75rem', borderRadius: '0.5rem', background: '#111827' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#f1f5f9' }}>{s.name}</span>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{pct}%</span>
                      </div>
                      <div style={{ height: 6, background: '#1e293b', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: s.color, borderRadius: 3 }} />
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ padding: '1rem 1.25rem', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '0.75rem' }}>
      <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>{label}</div>
      <div style={{ fontSize: '1.5rem', fontWeight: 700, color }}>{value}</div>
    </div>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: '1.25rem', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '0.75rem' }}>
      <h3 style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</h3>
      {children}
    </div>
  )
}
