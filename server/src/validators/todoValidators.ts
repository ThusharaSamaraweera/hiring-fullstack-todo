import { z } from 'zod';

export enum TodoStatus {
  ALL = 'all',
  PENDING = 'pending',
  COMPLETED = 'completed',
}

const title = z
  .string({
    error: (issue) => (issue.input === undefined ? 'Title is required' : 'Title must be a string'),
  })
  .trim()
  .min(1, 'Title is required')
  .max(120, 'Title must be 120 characters or less');
const description = z
  .string({ error: 'Description must be a string' })
  .trim()
  .max(1000, 'Description must be 1000 characters or less')
  .optional();

export const createTodoSchema = z.object({
  title,
  description,
});

export const listTodosSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().max(100, 'Search must be 100 characters or less').optional(),
  status: z.enum([TodoStatus.ALL, TodoStatus.PENDING, TodoStatus.COMPLETED]).default(TodoStatus.ALL),
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type ListTodosInput = z.infer<typeof listTodosSchema>;
