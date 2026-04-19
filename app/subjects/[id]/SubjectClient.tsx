'use client'

import { toggleTopic, setExamDate } from '@/lib/actions'
import { useTransition, useState } from 'react'

export function TopicList({ topics, subjectId }: {
  topics: { id: string; name: string; completed: boolean }[]
  subjectId: string
}) {
  const [pending, startTransition] = useTransition()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      {topics.map((t) => (
        <label key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem', borderRadius: '0.5rem', background: '#111827', cursor: 'pointer', opacity: pending ? 0.7 : 1 }}>
          <input
            type="checkbox"
            checked={t.completed}
            onChange={(e) => startTransition(() => toggleTopic(t.id, e.target.checked))}
            style={{ width: 16, height: 16, accentColor: '#3b82f6', cursor: 'pointer' }}
          />
          <span style={{ fontSize: '0.875rem', textDecoration: t.completed ? 'line-through' : 'none', color: t.completed ? '#64748b' : '#f1f5f9' }}>
            {t.name}
          </span>
        </label>
      ))}
    </div>
  )
}

export function ExamDateForm({ subjectId, current }: { subjectId: string; current?: string | null }) {
  const [pending, startTransition] = useTransition()
  const [val, setVal] = useState(current ? current.split('T')[0] : '')

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        startTransition(() => setExamDate(subjectId, val))
      }}
      style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
    >
      <input
        type="date"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        style={{ padding: '0.4rem 0.6rem', borderRadius: '0.4rem', background: '#111827', border: '1px solid #334155', color: '#f1f5f9', fontSize: '0.875rem' }}
      />
      <button
        type="submit"
        disabled={pending}
        style={{ padding: '0.4rem 0.9rem', borderRadius: '0.4rem', background: '#1e3a5f', color: '#93c5fd', border: 'none', cursor: 'pointer', fontSize: '0.875rem' }}
      >
        {pending ? 'Saving…' : 'Set Date'}
      </button>
    </form>
  )
}
