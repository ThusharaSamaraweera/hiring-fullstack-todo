import { type FormEvent, useState } from 'react'
import { ValidationError } from 'yup'
import { Button } from '@/components/Button'
import { Modal } from '@/components/Modal'
import type { Todo, UpdateTodoInput } from '@/types'
import { todoFormSchema } from './TodoForm'

interface EditTodoModalProps {
  todo: Todo
  open: boolean
  isUpdatingTodo: boolean
  onClose: () => void
  onSaveTodo: (input: UpdateTodoInput) => Promise<unknown>
}

type FieldErrors = Partial<Record<keyof UpdateTodoInput, string>>

export function EditTodoModal({
  todo,
  open,
  isUpdatingTodo,
  onClose,
  onSaveTodo,
}: EditTodoModalProps) {
  const [title, setTitle] = useState(todo.title)
  const [description, setDescription] = useState(todo.description)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const hasErrors = Object.keys(fieldErrors).length > 0

  async function validateField(field: 'title' | 'description', value: string) {
    try {
      await todoFormSchema.validateAt(field, { title, description, [field]: value })
      setFieldErrors((current) => {
        const { [field]: _removed, ...rest } = current
        return rest
      })
    } catch (error) {
      if (error instanceof ValidationError) {
        setFieldErrors((current) => ({ ...current, [field]: error.message }))
      }
    }
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      const values = await todoFormSchema.validate(
        { title, description },
        { abortEarly: false },
      )
      await onSaveTodo({ title: values.title, description: values.description ?? '' })
      setFieldErrors({})
    } catch (error) {
      if (error instanceof ValidationError) {
        setFieldErrors(
          error.inner.reduce<FieldErrors>(
            (current, issue) => ({ ...current, [issue.path ?? 'title']: issue.message }),
            {},
          ),
        )
      }
    }
  }

  return (
    <Modal open={open} title="Edit task" onClose={onClose}>
      <form className="space-y-4" onSubmit={handleSave} noValidate>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700" htmlFor={`edit-title-${todo._id}`}>
            Title
          </label>
          <input
            id={`edit-title-${todo._id}`}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-lime-700"
            value={title}
            onChange={(event) => {
              const value = event.target.value
              setTitle(value)
              void validateField('title', value)
            }}
            onBlur={(event) => void validateField('title', event.target.value)}
          />
          {fieldErrors.title && <p className="mt-1 text-xs text-red-700">{fieldErrors.title}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700" htmlFor={`edit-description-${todo._id}`}>
            Description
          </label>
          <textarea
            id={`edit-description-${todo._id}`}
            className="min-h-24 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-lime-700"
            value={description}
            onChange={(event) => {
              const value = event.target.value
              setDescription(value)
              void validateField('description', value)
            }}
            onBlur={(event) => void validateField('description', event.target.value)}
          />
          {fieldErrors.description && (
            <p className="mt-1 text-xs text-red-700">{fieldErrors.description}</p>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-stone-100 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={hasErrors || isUpdatingTodo}>
            {isUpdatingTodo && (
              <span
                className="mr-2 inline-block size-3 animate-spin rounded-full border-2 border-lime-200 border-t-white"
                aria-hidden="true"
              />
            )}
            {isUpdatingTodo ? 'Saving...' : 'Save changes'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
