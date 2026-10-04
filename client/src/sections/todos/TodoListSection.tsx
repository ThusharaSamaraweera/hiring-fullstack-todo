import { TodoStatus, type PaginatedTodos, type TodoQuery } from '@/types'
import { TodoItem } from './TodoItem'

interface TodoListSectionProps {
  todoQuery: TodoQuery
  todosPage: PaginatedTodos | undefined
  isLoadingTodos: boolean
  hasTodoLoadError: boolean
}

export function TodoListSection({ todoQuery, todosPage, isLoadingTodos, hasTodoLoadError }: TodoListSectionProps) {
  const todos = todosPage?.items ?? []

  return (
    <section className="mt-6 rounded-2xl border border-stone-200 bg-white px-5 py-2 shadow-sm sm:px-6">
      <div className="border-b border-stone-100 py-4">
        <h2 className="text-base font-semibold capitalize text-stone-900">
          {todoQuery.status === TodoStatus.ALL ? 'All tasks' : `${todoQuery.status} tasks`}
        </h2>
      </div>

      {isLoadingTodos ? (
        <p className="py-12 text-center text-sm text-stone-500">Loading tasks...</p>
      ) : hasTodoLoadError ? (
        <p className="py-12 text-center text-sm text-red-700">
          Could not load tasks. Please try again later.
        </p>
      ) : todos.length === 0 ? (
        <p className="py-12 text-center text-sm text-stone-500">{getEmptyMessage(todoQuery)}</p>
      ) : (
        todos.map((todo) => <TodoItem key={todo._id} todo={todo} />)
      )}
    </section>
  )
}

function getEmptyMessage(todoQuery: TodoQuery): string {
  if (todoQuery.search.trim()) return 'No matching todos.'
  if (todoQuery.status === TodoStatus.PENDING) return 'No pending todos. You are all caught up.'
  if (todoQuery.status === TodoStatus.COMPLETED) return 'No completed todos yet.'
  return 'Nothing here yet. Add your first task above.'
}
