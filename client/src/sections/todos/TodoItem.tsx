import { Button } from '@/components/Button'
import type { Todo } from '@/types'

interface TodoItemProps {
  todo: Todo
  isUpdatingTodoStatus: boolean
  onTodoStatusChange: (todoId: string, nextDone: boolean) => void
}

export function TodoItem({
  todo,
  isUpdatingTodoStatus,
  onTodoStatusChange,
}: TodoItemProps) {
  return (
    <article className="border-b border-stone-200 py-5 last:border-0">
      <div className="flex items-start gap-3">
        <Button
          type="button"
          variant="icon"
          className={todo.done
            ? 'mt-1 border-lime-700 bg-lime-700 text-white hover:bg-lime-800'
            : 'mt-1 border-stone-300 bg-white hover:border-lime-600'}
          aria-label={todo.done ? 'Mark as pending' : 'Mark as completed'}
          onClick={() => onTodoStatusChange(todo._id, !todo.done)}
          disabled={isUpdatingTodoStatus}
        >
          {todo.done && (
            <svg
              aria-hidden="true"
              className="size-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 4 4L19 6" />
            </svg>
          )}
        </Button>
        <div className="min-w-0">
          <h3
            className={`text-sm font-semibold ${
              todo.done ? 'text-stone-400 line-through' : 'text-stone-900'
            }`}
          >
            {todo.title}
          </h3>
          {todo.description && (
            <p
              className={`mt-1 line-clamp-2 text-sm leading-5 text-stone-500 ${
                todo.done ? 'line-through' : ''
              }`}
            >
              {todo.description}
            </p>
          )}
        </div>
      </div>
    </article>
  )
}
