import { Button } from '@/components/Button'
import { TodoStatus, type TodoQuery } from '@/types'

const statuses = Object.values(TodoStatus)

interface TodoStatusTabsProps {
  todoQuery: TodoQuery
  onTodoQueryChange: (query: TodoQuery) => void
}

export function TodoStatusTabs({ todoQuery, onTodoQueryChange }: TodoStatusTabsProps) {
  return (
    <div className="mt-6 inline-flex rounded-lg bg-stone-100 p-1" role="group">
      {statuses.map((status) => {
        const isActive = todoQuery.status === status

        return (
          <Button
            key={status}
            type="button"
            variant="ghost"
            aria-pressed={isActive}
            className={`rounded-md px-4 py-2 text-xs font-medium capitalize transition ${
              isActive ? 'bg-white text-stone-900 shadow-sm' : ''
            }`}
            onClick={() => onTodoQueryChange({ ...todoQuery, status, page: 1 })}
          >
            {status}
          </Button>
        )
      })}
    </div>
  )
}
