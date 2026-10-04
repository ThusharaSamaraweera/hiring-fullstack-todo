import { Button } from '@/components'
import { TodoStatus, type PaginatedTodos, type TodoQuery, type UpdateTodoInput } from '@/types'
import { TodoItem } from './TodoItem'

interface TodoListSectionProps {
  todoQuery: TodoQuery
  todosPage: PaginatedTodos | undefined
  isLoadingTodos: boolean
  isFetchingTodos: boolean
  hasTodoLoadError: boolean
  onTodoQueryChange: (query: TodoQuery) => void
  isUpdatingTodoStatus: boolean
  onTodoStatusChange: (todoId: string, nextDone: boolean) => void
  isUpdatingTodo: boolean
  onUpdateTodo: (todoId: string, input: UpdateTodoInput) => Promise<unknown>
  isDeletingTodo: boolean
  onDeleteTodo: (todoId: string) => void
}

export function TodoListSection({
  todoQuery,
  todosPage,
  isLoadingTodos,
  isFetchingTodos,
  hasTodoLoadError,
  onTodoQueryChange,
  isUpdatingTodoStatus,
  onTodoStatusChange,
  isUpdatingTodo,
  onUpdateTodo,
  isDeletingTodo,
  onDeleteTodo,
}: TodoListSectionProps) {
  const todos = todosPage?.items ?? []

  return (
    <section className="relative mt-6 rounded-2xl border border-stone-200 bg-white px-5 py-2 shadow-sm sm:px-6">
      <div className="flex items-baseline justify-between border-b border-stone-100 py-4">
        <h2 className="text-base font-semibold capitalize text-stone-900">
          {todoQuery.status === TodoStatus.ALL ? 'All tasks' : `${todoQuery.status} tasks`}
        </h2>
        <span className="text-xs text-stone-400">
          {todosPage?.pagination.totalItems ?? 0} total
        </span>
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
        todos.map((todo) => (
          <TodoItem
            key={todo._id}
            todo={todo}
            isUpdatingTodoStatus={isUpdatingTodoStatus}
            onTodoStatusChange={onTodoStatusChange}
            isUpdatingTodo={isUpdatingTodo}
            onUpdateTodo={onUpdateTodo}
            isDeletingTodo={isDeletingTodo}
            onDeleteTodo={onDeleteTodo}
          />
        ))
      )}

      {todosPage && todosPage.pagination.totalPages > 1 && (
        <nav className="flex items-center justify-center gap-4 py-5 text-xs text-stone-500" aria-label="Task pages">
          <Button
            type="button"
            variant="outline"
            disabled={todoQuery.page === 1}
            onClick={() => onTodoQueryChange({ ...todoQuery, page: todoQuery.page - 1 })}
          >
            Previous
          </Button>
          <span>
            Page {todoQuery.page} of {todosPage.pagination.totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            disabled={todoQuery.page === todosPage.pagination.totalPages}
            onClick={() => onTodoQueryChange({ ...todoQuery, page: todoQuery.page + 1 })}
          >
            Next
          </Button>
        </nav>
      )}

      {isFetchingTodos && !isLoadingTodos && (
        <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center rounded-2xl bg-white/55" aria-live="polite">
          <span className="size-8 animate-spin rounded-full border-4 border-stone-200 border-t-lime-700" aria-label="Loading updated todos" />
        </div>
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
