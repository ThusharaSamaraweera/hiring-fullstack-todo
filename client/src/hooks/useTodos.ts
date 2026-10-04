import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createTodo, fetchTodos } from '@/api'
import { TodoStatus, type CreateTodoInput, type TodoQuery } from '@/types'

const initialTodoQuery: TodoQuery = {
  page: 1,
  limit: 10,
  search: '',
  status: TodoStatus.ALL,
}

export function useTodos() {
  const [todoQuery, setTodoQuery] = useState<TodoQuery>(initialTodoQuery)
  const queryClient = useQueryClient()
  const todosQuery = useQuery({
    queryKey: ['todos', todoQuery],
    queryFn: () => fetchTodos(todoQuery),
    placeholderData: (previous) => previous,
  })

  const createMutation = useMutation({
    mutationFn: (input: CreateTodoInput) => createTodo(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  })

  return {
    todoQuery,
    setTodoQuery,
    todosPage: todosQuery.data,
    isLoadingTodos: todosQuery.isLoading,
    hasTodoLoadError: todosQuery.isError,
    createTodo: createMutation.mutateAsync,
    isCreatingTodo: createMutation.isPending,
    createTodoError: createMutation.error,
  }
}
