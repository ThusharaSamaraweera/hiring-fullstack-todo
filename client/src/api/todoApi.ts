import axios, { type AxiosRequestConfig } from 'axios'
import { apiClient } from '@/api/client'
import type { ApiResponse, CreateTodoInput, PaginatedTodos, Todo, TodoQuery } from '@/types'

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
    params: query,
  })
}
