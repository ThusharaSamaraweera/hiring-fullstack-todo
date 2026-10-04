import { useMutation } from '@tanstack/react-query'
import { createTodo } from '@/api'
import type { CreateTodoInput } from '@/types'

export function useTodos() {
  const createMutation = useMutation({
    mutationFn: (input: CreateTodoInput) => createTodo(input),
  })

  return {
    createTodo: createMutation.mutateAsync,
    isCreatingTodo: createMutation.isPending,
    createTodoError: createMutation.error,
  }
}
