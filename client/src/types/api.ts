export type ResponseStatus = 'success' | 'error'

export interface ApiResponse<T = unknown> {
  status: ResponseStatus
  statusCode: number
  message?: string
  errorCode?: string
  isCustomError?: boolean
  data?: T
}

export interface Todo {
  _id: string
  title: string
  description: string
  done: boolean
  createdAt: string
}

export interface CreateTodoInput {
  title: string
  description?: string
}

export interface UpdateTodoInput {
  title: string
  description: string
}

export interface PaginatedTodos {
  items: Todo[]
  pagination: {
    page: number
    limit: number
    totalItems: number
    totalPages: number
  }
}

export const TodoStatus = {
  ALL: 'all',
  PENDING: 'pending',
  COMPLETED: 'completed',
} as const

export type TodoStatus = (typeof TodoStatus)[keyof typeof TodoStatus]

export interface TodoQuery {
  page: number
  limit: number
  search: string
  status: TodoStatus
}
