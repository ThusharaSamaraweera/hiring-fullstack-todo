export enum TodoStatus {
  ALL = 'all',
  PENDING = 'pending',
  COMPLETED = 'completed',
}

export enum TodoOperation {
  COMPLETE = 'complete',
  DELETE = 'delete',
  UPDATE = 'update',
}

export interface TodoUpdateFields {
  title?: string;
  description?: string;
  done?: boolean;
}
