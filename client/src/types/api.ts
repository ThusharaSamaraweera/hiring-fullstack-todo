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
