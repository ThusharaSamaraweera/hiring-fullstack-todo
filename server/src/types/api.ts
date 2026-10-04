export type ApiStatus = 'success' | 'error';

export interface ApiResponse<T = unknown> {
  message: string;
  status: ApiStatus;
  statusCode: number;
  errorCode?: string;
  isCustomError?: boolean;
  data?: T;
}
