import { type FormEvent, useState } from 'react'
import * as yup from 'yup'
import { ValidationError } from 'yup'
import { Button } from '@/components/Button'

export const todoFormSchema = yup.object({
  title: yup
    .string()
    .trim()
    .required('A task title is required.')
    .max(120, 'Title must be 120 characters or fewer.'),
  description: yup
    .string()
    .trim()
    .max(1000, 'Description must be 1000 characters or fewer.'),
})

type FormErrors = Partial<Record<'title' | 'description', string>>

export function TodoForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})

  async function validateField(field: 'title' | 'description', value: string) {
    try {
      await todoFormSchema.validateAt(field, { title, description, [field]: value })
      setErrors((current) => {
        const { [field]: _removed, ...rest } = current
        return rest
      })
    } catch (error) {
      if (error instanceof ValidationError) {
        setErrors((current) => ({ ...current, [field]: error.message }))
      }
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      await todoFormSchema.validate(
        { title, description },
        { abortEarly: false },
      )

      setErrors({})
    } catch (error) {
      if (error instanceof ValidationError) {
        setErrors(
          error.inner.reduce<FormErrors>(
            (current, issue) => ({ ...current, [issue.path ?? 'title']: issue.message }),
            {},
          ),
        )
      }
    }
  }

  return (
    <form
      className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
      onSubmit={handleSubmit}
      noValidate
    >
      <label className="sr-only" htmlFor="new-task-title">
        Task title
      </label>
      <input
        id="new-task-title"
        className="w-full border-0 bg-transparent pb-1 text-xl font-semibold outline-none placeholder:text-stone-400"
        placeholder="What needs doing?"
        value={title}
        onChange={(event) => {
          const value = event.target.value
          setTitle(value)
          void validateField('title', value)
        }}
        onBlur={(event) => void validateField('title', event.target.value)}
        aria-invalid={Boolean(errors.title)}
        aria-describedby={errors.title ? 'new-task-title-error' : undefined}
      />
      {errors.title && (
        <p id="new-task-title-error" className="pb-3 text-xs text-red-700">
          {errors.title}
        </p>
      )}

      <div className="flex flex-col gap-3 border-t border-stone-100 pt-4 sm:flex-row sm:items-start">
        <div className="min-w-0 flex-1">
          <label className="sr-only" htmlFor="new-task-description">
            Task description
          </label>
          <input
            id="new-task-description"
            className="w-full border-0 bg-transparent text-sm outline-none placeholder:text-stone-400"
            placeholder="Add a note (optional)"
            value={description}
            onChange={(event) => {
              const value = event.target.value
              setDescription(value)
              void validateField('description', value)
            }}
            onBlur={(event) => void validateField('description', event.target.value)}
            aria-invalid={Boolean(errors.description)}
            aria-describedby={errors.description ? 'new-task-description-error' : undefined}
          />
          {errors.description && (
            <p id="new-task-description-error" className="mt-1 text-xs text-red-700">
              {errors.description}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={Object.keys(errors).length > 0}
        >
          <svg
            aria-hidden="true"
            className="mr-1 inline-block size-4 text-lime-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
          </svg>
          Add task
        </Button>
      </div>
    </form>
  )
}
