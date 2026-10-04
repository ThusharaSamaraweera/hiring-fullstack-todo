import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
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

  useEffect(() => {
    if (todosQuery.error) {
      toast.error('Unable to load todos. Please try again.')
    }
  }, [todosQuery.error])

  const createMutation = useMutation({
    mutationFn: (input: CreateTodoInput) => createTodo(input),
    onError: () => toast.error('Unable to create todo. Please try again.'),
    onSuccess: () => {
      toast.success('Todo created successfully.')
      void queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  return {
    todoQuery,
    setTodoQuery,
    todosPage: todosQuery.data,
    isLoadingTodos: todosQuery.isLoading,
    isFetchingTodos: todosQuery.isFetching,
    hasTodoLoadError: todosQuery.isError,
    createTodo: createMutation.mutateAsync,
    isCreatingTodo: createMutation.isPending,
    createTodoError: createMutation.error,
  }
}
