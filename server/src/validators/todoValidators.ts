import { z } from 'zod';

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

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
