import { describe, expect, it, vi } from 'vitest';
import type { TodoDocument } from '../models/Todo.js';
import type { TodoRepository } from '../repositories/todoRepository.js';
import { NotFoundException } from '../exceptions/ApiException.js';
import { TodoSort, TodoStatus } from '@/types/index.js';
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
    const query = { page: 2, limit: 10, status: TodoStatus.ALL, sort: TodoSort.NEWEST };

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
      sort: TodoSort.NEWEST,
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

describe('TodoService.deleteTodo', () => {
  it('deletes a todo through the repository', async () => {
    const repository = {
      deleteById: vi.fn().mockResolvedValue({ _id: 'todo-id' }),
    } as unknown as TodoRepository;
    const service = new TodoService(repository);

    await expect(service.deleteTodo('todo-id')).resolves.toBeUndefined();
    expect(repository.deleteById).toHaveBeenCalledWith('todo-id');
  });

  it('throws NotFoundException when the todo does not exist', async () => {
    const repository = {
      deleteById: vi.fn().mockResolvedValue(null),
    } as unknown as TodoRepository;
    const service = new TodoService(repository);

    await expect(service.deleteTodo('missing-id')).rejects.toBeInstanceOf(NotFoundException);
  });
});

describe('TodoService.updateTodoStatus', () => {
  it('marks an existing todo as complete', async () => {
    const completedTodo = {
      _id: { toString: () => 'todo-id' },
      title: 'Todo',
      done: true,
    } as unknown as TodoDocument;
    const repository = {
      findById: vi.fn().mockResolvedValue({ _id: 'todo-id', done: false }),
      updateById: vi.fn().mockResolvedValue(completedTodo),
    } as unknown as TodoRepository;
    const service = new TodoService(repository);

    await expect(service.updateTodoStatus('todo-id')).resolves.toBe(completedTodo);
    expect(repository.updateById).toHaveBeenCalledWith('todo-id', { done: true });
  });

  it('throws NotFoundException when the todo does not exist', async () => {
    const repository = {
      findById: vi.fn().mockResolvedValue(null),
    } as unknown as TodoRepository;
    const service = new TodoService(repository);

    await expect(service.updateTodoStatus('missing-id')).rejects.toBeInstanceOf(NotFoundException);
    expect(repository.updateById).toBeUndefined();
  });

  it('marks a completed todo as pending', async () => {
    const pendingTodo = {
      _id: { toString: () => 'todo-id' },
      title: 'Todo',
      done: false,
    } as unknown as TodoDocument;
    const repository = {
      findById: vi.fn().mockResolvedValue({ _id: 'todo-id', done: true }),
      updateById: vi.fn().mockResolvedValue(pendingTodo),
    } as unknown as TodoRepository;
    const service = new TodoService(repository);

    await expect(service.updateTodoStatus('todo-id')).resolves.toBe(pendingTodo);
    expect(repository.updateById).toHaveBeenCalledWith('todo-id', { done: false });
  });
});
