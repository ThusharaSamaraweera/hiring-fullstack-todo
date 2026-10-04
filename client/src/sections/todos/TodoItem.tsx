import { useState } from 'react'
import { Button } from '@/components/Button'
import { Modal } from '@/components/Modal'
import type { Todo } from '@/types'
import { formatCreatedAt } from '@/utils/date'

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
  const [isViewing, setIsViewing] = useState(false)

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
        <Button
          type="button"
          variant="ghost"
          className="min-w-0 flex-1 text-left"
          onClick={() => setIsViewing(true)}
        >
          <span
            className={`block text-sm font-semibold ${
              todo.done ? 'text-stone-400 line-through' : 'text-stone-900'
            }`}
          >
            {todo.title}
          </span>
          {todo.description && (
            <span
              className={`mt-1 line-clamp-2 text-sm leading-5 text-stone-500 ${
                todo.done ? 'line-through' : ''
              }`}
            >
              {todo.description}
            </span>
          )}
        </Button>
      </div>

      <Modal open={isViewing} title={todo.title} onClose={() => setIsViewing(false)}>
        <p className="whitespace-pre-wrap text-sm leading-6 text-stone-600">
          {todo.description || 'No description added.'}
        </p>
        <p className="mt-5 text-xs text-stone-400">Created {formatCreatedAt(todo.createdAt)}</p>
      </Modal>
    </article>
  )
}
