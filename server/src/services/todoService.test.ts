import { describe, expect, it, vi } from 'vitest';
import type { TodoDocument } from '../models/Todo.js';
import type { TodoRepository } from '../repositories/todoRepository.js';
import { TodoService } from './todoService.js';

describe('TodoService.createTodo', () => {
  it('creates a todo through the repository and returns it', async () => {
    const input = {
      title: 'Learn TypeScript',
      description: 'Study advanced types',
    };
    const createdTodo = {
      _id: { toString: () => 'todo-id' },
      title: input.title,
      description: input.description,
      done: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as unknown as TodoDocument;
    const repository = {
      createTodo: vi.fn().mockResolvedValue(createdTodo),
    } as unknown as TodoRepository;
    const service = new TodoService(repository);

    await expect(service.createTodo(input)).resolves.toBe(createdTodo);
    expect(repository.createTodo).toHaveBeenCalledOnce();
    expect(repository.createTodo).toHaveBeenCalledWith(input);
  });

  it('propagates repository errors', async () => {
    const repositoryError = new Error('Database unavailable');
    const repository = {
      createTodo: vi.fn().mockRejectedValue(repositoryError),
    } as unknown as TodoRepository;
    const service = new TodoService(repository);

    await expect(service.createTodo({ title: 'Test todo' })).rejects.toBe(repositoryError);
  });
});
