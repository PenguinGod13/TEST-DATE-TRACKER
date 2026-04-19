'use client'

import { addSession, toggleSession, deleteSession } from '@/lib/actions'
import { useTransition, useState } from 'react'
import { format } from 'date-fns'

type Subject = { id: string; name: string; color: string }
type Session = {
  id: string
  subjectId: string
  date: Date
  durationMin: number
  notes: string | null
  completed: boolean
}

export function AddSessionForm({ subjects }: { subjects: Subject[] }) {
  const [pending, startTransition] = useTransition()
  const [form, setForm] = useState({ subjectId: subjects[0]?.id ?? '', date: '', durationMin: 60, notes: '' })

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.subjectId || !form.date) return
    startTransition(async () => {
      await addSession({ subjectId: form.subjectId, date: form.date, durationMin: form.durationMin, notes: form.notes || undefined })
      setForm((f) => ({ ...f, date: '', notes: '' }))
    })
  }

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'flex-end' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <label style={{ fontSize: '0.75rem', color: '#64748b' }}>Subject</label>
        <select
          value={form.subjectId}
          onChange={(e) => setForm((f) => ({ ...f, subjectId: e.target.value }))}
          style={inputStyle}
        >
          {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <label style={{ fontSize: '0.75rem', color: '#64748b' }}>Date</label>
        <input type="datetime-local" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} required style={inputStyle} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <label style={{ fontSize: '0.75rem', color: '#64748b' }}>Duration (min)</label>
        <input type="number" min={15} step={15} value={form.durationMin} onChange={(e) => setForm((f) => ({ ...f, durationMin: Number(e.target.value) }))} style={{ ...inputStyle, width: 90 }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1, minWidth: 140 }}>
        <label style={{ fontSize: '0.75rem', color: '#64748b' }}>Notes (optional)</label>
        <input type="text" placeholder="e.g. Chapter 3" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} style={inputStyle} />
      </div>
      <button type="submit" disabled={pending} style={btnStyle}>{pending ? 'Adding…' : 'Add Session'}</button>
    </form>
  )
}

export function SessionRow({ session, subjectColor }: { session: Session & { subject: Subject }; subjectColor: string }) {
  const [pending, startTransition] = useTransition()

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', background: '#111827', borderRadius: '0.5rem', opacity: pending ? 0.6 : 1 }}>
      <input
        type="checkbox"
        checked={session.completed}
        onChange={(e) => startTransition(() => toggleSession(session.id, e.target.checked))}
        style={{ width: 16, height: 16, accentColor: subjectColor, cursor: 'pointer', flexShrink: 0 }}
      />
      <span style={{ width: 10, height: 10, borderRadius: '50%', background: subjectColor, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '0.875rem', fontWeight: 500, color: session.completed ? '#64748b' : '#f1f5f9', textDecoration: session.completed ? 'line-through' : 'none' }}>
          {session.subject.name}
        </div>
        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
          {format(new Date(session.date), 'dd MMM yyyy, HH:mm')} · {session.durationMin} min{session.notes ? ` · ${session.notes}` : ''}
        </div>
      </div>
      <button
        onClick={() => startTransition(() => deleteSession(session.id))}
        style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '1rem', padding: '0.2rem 0.4rem', borderRadius: '0.25rem' }}
        title="Delete"
      >
        ×
      </button>
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
