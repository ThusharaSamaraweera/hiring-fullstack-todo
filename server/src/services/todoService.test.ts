import { describe, expect, it, vi } from 'vitest';
import type { TodoDocument } from '../models/Todo.js';
import type { TodoRepository } from '../repositories/todoRepository.js';
import { NotFoundException } from '../exceptions/ApiException.js';
import { TodoStatus } from '@/types/index.js';
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

  it('adds pagination metadata when listing todos', async () => {
    const items = [{ title: 'Todo' }];
    const repository = {
      findTodos: vi.fn().mockResolvedValue({ items, totalItems: 21 }),
    } as unknown as TodoRepository;
    const service = new TodoService(repository);
    const query = { page: 2, limit: 10, status: TodoStatus.ALL };

    await expect(service.listTodos(query)).resolves.toEqual({
      items,
      pagination: {
        page: 2,
        limit: 10,
        totalItems: 21,
        totalPages: 3,
      },
    });
    expect(repository.findTodos).toHaveBeenCalledWith(query);
  });

  it('returns an empty page when no todos match', async () => {
    const repository = {
      findTodos: vi.fn().mockResolvedValue({ items: [], totalItems: 0 }),
    } as unknown as TodoRepository;
    const service = new TodoService(repository);
    const query = {
      page: 1,
      limit: 10,
      search: 'missing',
      status: TodoStatus.PENDING,
    };

    await expect(service.listTodos(query)).resolves.toEqual({
      items: [],
      pagination: {
        page: 1,
        limit: 10,
        totalItems: 0,
        totalPages: 0,
      },
    });
    expect(repository.findTodos).toHaveBeenCalledWith(query);
  });
});

describe('TodoService.updateTodo', () => {
  it('updates a todo through the repository', async () => {
    const updatedTodo = { _id: { toString: () => 'todo-id' }, title: 'Updated todo' } as unknown as TodoDocument;
    const input = { title: 'Updated todo' };
    const repository = {
      updateById: vi.fn().mockResolvedValue(updatedTodo),
    } as unknown as TodoRepository;
    const service = new TodoService(repository);

    await expect(service.updateTodo('todo-id', input)).resolves.toBe(updatedTodo);
    expect(repository.updateById).toHaveBeenCalledWith('todo-id', input);
  });

  it('throws NotFoundException when the todo does not exist', async () => {
    const repository = {
      updateById: vi.fn().mockResolvedValue(null),
    } as unknown as TodoRepository;
    const service = new TodoService(repository);

    await expect(service.updateTodo('missing-id', { title: 'Updated todo' })).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
