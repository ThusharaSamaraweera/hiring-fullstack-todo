export enum TodoStatus {
  ALL = 'all',
  PENDING = 'pending',
  COMPLETED = 'completed',
}

export enum TodoOperation {
  UPDATE_STATUS = 'updateStatus',
  DELETE = 'delete',
  UPDATE = 'update',
}

export interface TodoUpdateFields {
  title?: string;
  description?: string;
  done?: boolean;
}
