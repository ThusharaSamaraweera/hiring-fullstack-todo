export enum TodoStatus {
  ALL = 'all',
  PENDING = 'pending',
  COMPLETED = 'completed',
}

export enum TodoSort {
  NEWEST = 'newest',
  OLDEST = 'oldest',
  RECENTLY_MODIFIED = 'recentlyModified',
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
