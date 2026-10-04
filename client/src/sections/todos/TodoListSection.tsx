import type { PaginatedTodos } from '@/types'
import { TodoItem } from './TodoItem'

interface TodoListSectionProps {
  todosPage: PaginatedTodos | undefined
  isLoadingTodos: boolean
  hasTodoLoadError: boolean
}

export function TodoListSection({ todosPage, isLoadingTodos, hasTodoLoadError }: TodoListSectionProps) {
  const todos = todosPage?.items ?? []

  return (
    <section className="mt-6 rounded-2xl border border-stone-200 bg-white px-5 py-2 shadow-sm sm:px-6">
      <div className="border-b border-stone-100 py-4">
        <h2 className="text-base font-semibold text-stone-900">Tasks</h2>
      </div>

      {isLoadingTodos ? (
        <p className="py-12 text-center text-sm text-stone-500">Loading tasks...</p>
      ) : hasTodoLoadError ? (
        <p className="py-12 text-center text-sm text-red-700">
          Could not load tasks. Please try again later.
        </p>
      ) : todos.length === 0 ? (
        <p className="py-12 text-center text-sm text-stone-500">
          Nothing here yet. Add your first task above.
        </p>
      ) : (
        todos.map((todo) => <TodoItem key={todo._id} todo={todo} />)
      )}
    </section>
  )
}
