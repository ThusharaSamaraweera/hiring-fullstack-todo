import { z } from 'zod';
import { TodoStatus } from '@/types/index.js';

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
}).strict();

export const updateTodoSchema = z
  .object({
    title: title.optional(),
    description,
  })
  .strict()
  .refine((value) => value.title !== undefined || value.description !== undefined, {
    message: 'At least one field must be provided',
  });

export const todoIdSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid todo id'),
}).strict();

export const listTodosSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().max(100, 'Search must be 100 characters or less').optional(),
  status: z.enum([TodoStatus.ALL, TodoStatus.PENDING, TodoStatus.COMPLETED]).default(TodoStatus.ALL),
}).strict();

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
export type ListTodosInput = z.infer<typeof listTodosSchema>;
