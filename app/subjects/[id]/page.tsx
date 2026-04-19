import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { TopicList, ExamDateForm } from './SubjectClient'

export const dynamic = 'force-dynamic'

export default async function SubjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const subject = await prisma.subject.findUnique({
    where: { id },
    include: { topics: { orderBy: { name: 'asc' } }, sessions: { orderBy: { date: 'asc' } }, mockTests: { orderBy: { date: 'desc' } } },
  })

  if (!subject) notFound()

  const done = subject.topics.filter((t) => t.completed).length
  const pct = subject.topics.length ? Math.round((done / subject.topics.length) * 100) : 0

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
        <span style={{ width: 16, height: 16, borderRadius: '50%', background: subject.color, flexShrink: 0 }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{subject.name}</h2>
      </div>
      <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '2rem' }}>
        {done}/{subject.topics.length} topics · {pct}% complete
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Topics */}
        <div style={{ gridColumn: '1 / -1' }}>
          <SectionCard title="Topics">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ flex: 1, height: 8, background: '#1e293b', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: subject.color, borderRadius: 4 }} />
              </div>
              <span style={{ fontSize: '0.8rem', color: '#64748b', flexShrink: 0 }}>{pct}%</span>
            </div>
            <TopicList topics={subject.topics} subjectId={subject.id} />
          </SectionCard>
        </div>

        {/* Exam date */}
        <SectionCard title="Exam Date">
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.75rem' }}>
            {subject.examDate
              ? `Set to ${format(new Date(subject.examDate), 'dd MMMM yyyy')}`
              : 'No exam date set'}
          </p>
          <ExamDateForm subjectId={subject.id} current={subject.examDate?.toISOString()} />
        </SectionCard>

        {/* Mock tests */}
        <SectionCard title="Mock Tests">
          {subject.mockTests.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>No mock tests recorded yet.</p>
          ) : (
            subject.mockTests.map((m) => (
              <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #1e293b', fontSize: '0.875rem' }}>
                <span style={{ color: '#94a3b8' }}>{format(new Date(m.date), 'dd MMM yyyy')}</span>
                {m.score != null && m.maxScore != null ? (
                  <span style={{ fontWeight: 600, color: (m.score / m.maxScore) >= 0.7 ? '#10b981' : '#f59e0b' }}>
                    {m.score}/{m.maxScore} ({Math.round((m.score / m.maxScore) * 100)}%)
                  </span>
                ) : (
                  <span style={{ color: '#64748b' }}>No score</span>
                )}
              </div>
            ))
          )}
        </SectionCard>
      </div>
    </div>
  )
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: '1.25rem', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '0.75rem' }}>
      <h3 style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</h3>
      {children}
    </div>
  )
}
