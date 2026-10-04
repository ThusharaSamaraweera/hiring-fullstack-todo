import { describe, expect, it } from 'vitest';
import { createTodoSchema, listTodosSchema, TodoStatus } from './todoValidators.js';

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

describe('listTodosSchema', () => {
  it('applies pagination and status defaults', () => {
    const result = listTodosSchema.parse({});

    expect(result).toEqual({
      page: 1,
      limit: 10,
      status: TodoStatus.ALL,
    });
  });

  it('coerces query values and preserves search filters', () => {
    const result = listTodosSchema.parse({
      page: '2',
      limit: '20',
      search: 'typescript',
      status: 'completed',
    });

    expect(result).toEqual({
      page: 2,
      limit: 20,
      search: 'typescript',
      status: TodoStatus.COMPLETED,
    });
  });

  it.each([
    [{ page: '0' }, 'page below 1'],
    [{ limit: '0' }, 'limit below 1'],
    [{ limit: '101' }, 'limit above 100'],
    [{ status: 'invalid' }, 'invalid status'],
  ])('rejects %s', (input, _description) => {
    expect(listTodosSchema.safeParse(input).success).toBe(false);
  });

  it('rejects a search query over 100 characters', () => {
    const result = listTodosSchema.safeParse({ search: 's'.repeat(101) });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Search must be 100 characters or less');
    }
  });
});
