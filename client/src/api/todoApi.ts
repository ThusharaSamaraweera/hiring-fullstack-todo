import axios, { type AxiosRequestConfig } from 'axios'
import { apiClient } from '@/api/client'
import type {
  ApiResponse,
  CreateTodoInput,
  PaginatedTodos,
  Todo,
  TodoQuery,
  UpdateTodoInput,
} from '@/types'

async function request<T>(path: string, options?: AxiosRequestConfig): Promise<T> {
  try {
    const response = await apiClient.request<ApiResponse<T>>({ url: path, ...options })
    return response.data.data as T
  } catch (error: unknown) {
    if (axios.isAxiosError<ApiResponse>(error)) {
      const apiResponse = error.response?.data
      if (apiResponse?.isCustomError && apiResponse.message) {
        throw new Error(apiResponse.message, { cause: error })
      }
    }

    throw new Error('', { cause: error })
  }
}

export async function createTodo(input: CreateTodoInput): Promise<Todo> {
  return request<Todo>('/todos', { method: 'POST', data: input })
}

export function fetchTodos(query: TodoQuery): Promise<PaginatedTodos> {
  return request<PaginatedTodos>('/todos', {
    params: {
      page: query.page,
      limit: query.limit,
      status: query.status,
      sort: query.sort,
      ...(query.search ? { search: query.search } : {}),
    },
  })
}

export function updateTodoStatus(todoId: string): Promise<Todo> {
  return request<Todo>(`/todos/${todoId}/done`, { method: 'PATCH' })
}

export function updateTodo(todoId: string, input: UpdateTodoInput): Promise<Todo> {
  return request<Todo>(`/todos/${todoId}`, { method: 'PUT', data: input })
}

export function deleteTodo(todoId: string): Promise<void> {
  return request<void>(`/todos/${todoId}`, { method: 'DELETE' })
}
