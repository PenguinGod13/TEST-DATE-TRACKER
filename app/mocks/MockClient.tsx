'use client'

import { addMockTest, deleteMockTest } from '@/lib/actions'
import { useTransition, useState } from 'react'
import { format } from 'date-fns'

type Subject = { id: string; name: string; color: string }
type MockTest = {
  id: string
  subjectId: string
  date: Date
  score: number | null
  maxScore: number | null
  notes: string | null
  subject: Subject
}

export function AddMockForm({ subjects }: { subjects: Subject[] }) {
  const [pending, startTransition] = useTransition()
  const [form, setForm] = useState({ subjectId: subjects[0]?.id ?? '', date: '', score: '', maxScore: '100', notes: '' })

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.subjectId || !form.date) return
    startTransition(async () => {
      await addMockTest({
        subjectId: form.subjectId,
        date: form.date,
        score: form.score ? Number(form.score) : undefined,
        maxScore: form.maxScore ? Number(form.maxScore) : undefined,
        notes: form.notes || undefined,
      })
      setForm((f) => ({ ...f, date: '', score: '', notes: '' }))
    })
  }

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'flex-end' }}>
      <Field label="Subject">
        <select value={form.subjectId} onChange={(e) => setForm((f) => ({ ...f, subjectId: e.target.value }))} style={inputStyle}>
          {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </Field>
      <Field label="Date">
        <input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} required style={inputStyle} />
      </Field>
      <Field label="Score">
        <input type="number" min={0} placeholder="e.g. 72" value={form.score} onChange={(e) => setForm((f) => ({ ...f, score: e.target.value }))} style={{ ...inputStyle, width: 80 }} />
      </Field>
      <Field label="Out of">
        <input type="number" min={1} value={form.maxScore} onChange={(e) => setForm((f) => ({ ...f, maxScore: e.target.value }))} style={{ ...inputStyle, width: 80 }} />
      </Field>
      <Field label="Notes" style={{ flex: 1, minWidth: 120 }}>
        <input type="text" placeholder="Optional" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} style={inputStyle} />
      </Field>
      <button type="submit" disabled={pending} style={btnStyle}>{pending ? 'Adding…' : 'Add Mock'}</button>
    </form>
  )
}

export function MockRow({ mock }: { mock: MockTest }) {
  const [pending, startTransition] = useTransition()
  const pct = mock.score != null && mock.maxScore != null ? (mock.score / mock.maxScore) * 100 : null

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', background: '#111827', borderRadius: '0.5rem', opacity: pending ? 0.6 : 1 }}>
      <span style={{ width: 10, height: 10, borderRadius: '50%', background: mock.subject.color, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{mock.subject.name}</div>
        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
          {format(new Date(mock.date), 'dd MMM yyyy')}{mock.notes ? ` · ${mock.notes}` : ''}
        </div>
      </div>
      {pct != null ? (
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: pct >= 70 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444' }}>
            {pct.toFixed(0)}%
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{mock.score}/{mock.maxScore}</div>
        </div>
      ) : (
        <span style={{ color: '#64748b', fontSize: '0.875rem' }}>No score</span>
      )}
      <button
        onClick={() => startTransition(() => deleteMockTest(mock.id))}
        style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '1rem', padding: '0.2rem 0.4rem', borderRadius: '0.25rem' }}
        title="Delete"
      >
        ×
      </button>
    </div>
  )
}

function Field({ label, children, style }: { label: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', ...style }}>
      <label style={{ fontSize: '0.75rem', color: '#64748b' }}>{label}</label>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  padding: '0.45rem 0.65rem',
  borderRadius: '0.4rem',
  background: '#111827',
  border: '1px solid #334155',
  color: '#f1f5f9',
  fontSize: '0.875rem',
}

const btnStyle: React.CSSProperties = {
  padding: '0.45rem 1rem',
  borderRadius: '0.4rem',
  background: '#1e3a5f',
  color: '#93c5fd',
  border: 'none',
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: 500,
  alignSelf: 'flex-end',
}
