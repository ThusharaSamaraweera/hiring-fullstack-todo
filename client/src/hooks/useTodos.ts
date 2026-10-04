import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createTodo, fetchTodos } from '@/api'
import { TodoStatus, type CreateTodoInput, type TodoQuery } from '@/types'

const initialTodoQuery: TodoQuery = {
  page: 1,
  limit: 10,
  status: TodoStatus.ALL,
}

export function useTodos() {
  const queryClient = useQueryClient()
  const todosQuery = useQuery({
    queryKey: ['todos', initialTodoQuery],
    queryFn: () => fetchTodos(initialTodoQuery),
  })

  const createMutation = useMutation({
    mutationFn: (input: CreateTodoInput) => createTodo(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  })

  return {
    todosPage: todosQuery.data,
    isLoadingTodos: todosQuery.isLoading,
    hasTodoLoadError: todosQuery.isError,
    createTodo: createMutation.mutateAsync,
    isCreatingTodo: createMutation.isPending,
    createTodoError: createMutation.error,
  }
}
