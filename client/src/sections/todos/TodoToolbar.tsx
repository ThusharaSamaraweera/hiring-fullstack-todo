import { useEffect, useState } from 'react'
import type { TodoQuery } from '@/types'

const SEARCH_DEBOUNCE_MS = 300

interface TodoToolbarProps {
  todoQuery: TodoQuery
  onTodoQueryChange: (query: TodoQuery) => void
}

export function TodoToolbar({ todoQuery, onTodoQueryChange }: TodoToolbarProps) {
  const [searchText, setSearchText] = useState(todoQuery.search)

  useEffect(() => {
    setSearchText(todoQuery.search)
  }, [todoQuery.search])

  useEffect(() => {
    if (searchText === todoQuery.search) return

    const timeoutId = window.setTimeout(() => {
      onTodoQueryChange({ ...todoQuery, search: searchText, page: 1 })
    }, SEARCH_DEBOUNCE_MS)

    return () => window.clearTimeout(timeoutId)
  }, [onTodoQueryChange, searchText, todoQuery])

  return (
    <section className="mt-7 flex w-full">
      <label className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-500">
        <svg
          className="size-4 shrink-0 text-stone-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </svg>
        <input
          className="w-full border-0 bg-transparent outline-none placeholder:text-stone-400"
          placeholder="Search tasks by title or description"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />
      </label>
    </section>
  )
}
