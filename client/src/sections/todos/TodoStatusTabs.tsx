import { Button, Dropdown, type DropdownOption } from '@/components'
import { TodoSort, TodoStatus, type TodoQuery } from '@/types'

const statuses = Object.values(TodoStatus)
const sortOptions: readonly DropdownOption<TodoQuery['sort']>[] = [
  { value: TodoSort.NEWEST, label: 'Newly created' },
  { value: TodoSort.OLDEST, label: 'Older created' },
  { value: TodoSort.RECENTLY_MODIFIED, label: 'Recently modified' },
]

interface TodoStatusTabsProps {
  todoQuery: TodoQuery
  onTodoQueryChange: (query: TodoQuery) => void
}

export function TodoStatusTabs({ todoQuery, onTodoQueryChange }: TodoStatusTabsProps) {
  return (
    <div className="mt-6 flex w-full flex-wrap items-center justify-between gap-3">
      <div className="inline-flex rounded-lg bg-stone-100 p-1" role="group" aria-label="Todo status">
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

      <Dropdown
        options={sortOptions}
        value={todoQuery.sort}
        ariaLabel="Sort todos"
        onChange={(sort) => onTodoQueryChange({ ...todoQuery, sort, page: 1 })}
      />
    </div>
  )
}
