import { describe, expect, it } from 'vitest';
import { createTodoSchema } from './todoValidators.js';

describe('createTodoSchema', () => {
  it('accepts a valid todo', () => {
    const result = createTodoSchema.safeParse({
      title: 'Learn TypeScript',
      description: 'Study advanced types',
    });

    expect(result.success).toBe(true);
  });

  it('rejects a missing title', () => {
    const result = createTodoSchema.safeParse({ description: 'Without a title' });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Title is required');
    }
  });

  it('rejects non-string title and description values', () => {
    const titleResult = createTodoSchema.safeParse({ title: 123 });
    const descriptionResult = createTodoSchema.safeParse({ title: 'Valid title', description: 123 });

    expect(titleResult.success).toBe(false);
    expect(descriptionResult.success).toBe(false);
    if (!titleResult.success) {
      expect(titleResult.error.issues[0]?.message).toBe('Title must be a string');
    }
    if (!descriptionResult.success) {
      expect(descriptionResult.error.issues[0]?.message).toBe('Description must be a string');
    }
  });

  it('rejects values that exceed field limits', () => {
    const result = createTodoSchema.safeParse({
      title: 't'.repeat(121),
      description: 'd'.repeat(1001),
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.message)).toEqual([
        'Title must be 120 characters or less',
        'Description must be 1000 characters or less',
      ]);
    }
  });
});
