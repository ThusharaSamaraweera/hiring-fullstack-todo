import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { createTodo, fetchTodos, updateTodoStatus } from '@/api'
import { TodoStatus, type CreateTodoInput, type PaginatedTodos, type TodoQuery } from '@/types'
import { getErrorMessage } from '@/utils/errorMessage'

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
      toast.error(getErrorMessage(todosQuery.error, 'Unable to load todos. Please try again.'))
    }
  }, [todosQuery.error])

  const createMutation = useMutation({
    mutationFn: (input: CreateTodoInput) => createTodo(input),
    onError: (error) => toast.error(getErrorMessage(error, 'Unable to create todo. Please try again.')),
    onSuccess: () => {
      toast.success('Todo created successfully.')
      void queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  const statusMutation = useMutation({
    mutationFn: ({ todoId }: { todoId: string; nextDone: boolean }) => updateTodoStatus(todoId),
    onMutate: async ({ todoId, nextDone }) => {
      const queryKey = ['todos', todoQuery] as const
      await queryClient.cancelQueries({ queryKey })
      const previousTodosPage = queryClient.getQueryData<PaginatedTodos>(queryKey)

      queryClient.setQueryData<PaginatedTodos>(queryKey, (currentTodosPage) => {
        if (!currentTodosPage) return currentTodosPage

        return {
          ...currentTodosPage,
          items: currentTodosPage.items.map((todo) =>
            todo._id === todoId ? { ...todo, done: nextDone } : todo,
          ),
        }
      })

      return { previousTodosPage }
    },
    onError: (error, _variables, context) => {
      const queryKey = ['todos', todoQuery] as const
      if (context?.previousTodosPage) queryClient.setQueryData(queryKey, context.previousTodosPage)
      toast.error(getErrorMessage(error, 'Unable to update todo status. Please try again.'))
    },
    onSuccess: (_todo, { nextDone }) => {
      toast.success(nextDone ? 'Todo completed successfully.' : 'Todo marked as pending.')
    },
    onSettled: () => {
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
    updateTodoStatus: (todoId: string, nextDone: boolean) =>
      statusMutation.mutate({ todoId, nextDone }),
    isUpdatingTodoStatus: statusMutation.isPending,
  }
}
