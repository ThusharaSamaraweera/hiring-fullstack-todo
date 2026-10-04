import { useState } from 'react'
import { Button } from '@/components/Button'
import { Modal } from '@/components/Modal'
import type { Todo, UpdateTodoInput } from '@/types'
import { formatCreatedAt } from '@/utils/date'
import { EditTodoModal } from './EditTodoModal'

interface TodoItemProps {
  todo: Todo
  isUpdatingTodoStatus: boolean
  onTodoStatusChange: (todoId: string, nextDone: boolean) => void
  isUpdatingTodo: boolean
  onUpdateTodo: (todoId: string, input: UpdateTodoInput) => Promise<unknown>
  isDeletingTodo: boolean
  onDeleteTodo: (todoId: string) => void
}

export function TodoItem({
  todo,
  isUpdatingTodoStatus,
  onTodoStatusChange,
  isUpdatingTodo,
  onUpdateTodo,
  isDeletingTodo,
  onDeleteTodo,
}: TodoItemProps) {
  const [isViewing, setIsViewing] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleteConfirming, setIsDeleteConfirming] = useState(false)

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

      <div className="ml-8 mt-2 flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="ghost"
          aria-label="Edit task"
          title="Edit task"
          onClick={() => setIsEditing(true)}
        >
          <svg
            aria-hidden="true"
            className="size-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
          </svg>
        </Button>
        <Button
          type="button"
          variant="danger"
          aria-label="Delete task"
          title="Delete task"
          onClick={() => setIsDeleteConfirming(true)}
        >
          <svg
            aria-hidden="true"
            className="size-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M3 6h18" />
            <path d="M8 6V4h8v2" />
            <path d="m19 6-1 14H6L5 6" />
            <path d="M10 11v5M14 11v5" />
          </svg>
        </Button>
      </div>

      <Modal open={isViewing} title={todo.title} onClose={() => setIsViewing(false)}>
        <p className="whitespace-pre-wrap text-sm leading-6 text-stone-600">
          {todo.description || 'No description added.'}
        </p>
        <p className="mt-5 text-xs text-stone-400">Created {formatCreatedAt(todo.createdAt)}</p>
        <div className="mt-8 flex justify-end gap-2 border-t border-stone-100 pt-4">
          <Button type="button" variant="danger" onClick={() => {
            setIsViewing(false)
            setIsDeleteConfirming(true)
          }}>
            Delete
          </Button>
          <Button
            type="button"
            onClick={() => {
              setIsViewing(false)
              setIsEditing(true)
            }}
          >
            Edit task
          </Button>
        </div>
      </Modal>

      <EditTodoModal
        todo={todo}
        open={isEditing}
        isUpdatingTodo={isUpdatingTodo}
        onClose={() => setIsEditing(false)}
        onSaveTodo={async (input) => {
          await onUpdateTodo(todo._id, input)
          setIsEditing(false)
        }}
      />

      <Modal
        open={isDeleteConfirming}
        title="Delete task?"
        onClose={() => setIsDeleteConfirming(false)}
      >
        <p className="text-sm leading-6 text-stone-600">
          This will permanently remove “{todo.title}”. This action cannot be undone.
        </p>
        <div className="mt-8 flex justify-end gap-2 border-t border-stone-100 pt-4">
          <Button type="button" variant="ghost" onClick={() => setIsDeleteConfirming(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            disabled={isDeletingTodo}
            onClick={() => {
              onDeleteTodo(todo._id)
              setIsDeleteConfirming(false)
            }}
          >
            {isDeletingTodo ? 'Deleting...' : 'Delete task'}
          </Button>
        </div>
      </Modal>
    </article>
  )
}
