import type { Todo } from '@/types'

interface TodoItemProps {
  todo: Todo
}

export function TodoItem({ todo }: TodoItemProps) {
  return (
    <article className="border-b border-stone-200 py-5 last:border-0">
      <div className="flex items-start gap-3">
        <span
          className={`mt-1 size-3 shrink-0 rounded-full ${
            todo.done ? 'bg-lime-700' : 'border-2 border-stone-300'
          }`}
          aria-label={todo.done ? 'Completed' : 'Pending'}
        />
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
