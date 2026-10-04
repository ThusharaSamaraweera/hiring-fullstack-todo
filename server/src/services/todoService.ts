import type { CreateTodoInput, ListTodosInput, UpdateTodoInput } from '@/validators/index.js';
import { logger } from '@/utils/index.js';
import type { TodoRepository } from '@/repositories/index.js';
import { NotFoundException } from '@/exceptions/index.js';
import { TodoOperation } from '@/types/index.js';

export class TodoService {
  constructor(private readonly todoRepository: TodoRepository) {}

  async listTodos(todoQuery: ListTodosInput) {
    logger.info('Listing todos', {
      page: todoQuery.page,
      limit: todoQuery.limit,
      status: todoQuery.status,
      hasSearch: Boolean(todoQuery.search),
    });

    const todosResult = await this.todoRepository.findTodos(todoQuery);
    logger.info('Todos listed', {
      totalItems: todosResult.totalItems,
      returnedItems: todosResult.items.length,
    });

    return {
      items: todosResult.items,
      pagination: {
        page: todoQuery.page,
        limit: todoQuery.limit,
        totalItems: todosResult.totalItems,
        totalPages: Math.ceil(todosResult.totalItems / todoQuery.limit),
      },
    };
  }

  async createTodo(todoInput: CreateTodoInput) {
    logger.info('Creating todo');
    return this.todoRepository.createTodo(todoInput);
  }

  async updateTodo(todoId: string, todoInput: UpdateTodoInput) {
    logger.debug('Updating todo', { todoId, fields: Object.keys(todoInput) });
    const todo = await this.todoRepository.updateById(todoId, todoInput);

    if (!todo) {
      logger.warn('Todo not found', { operation: TodoOperation.UPDATE, todoId });
      throw new NotFoundException('Todo not found');
    }

    return todo;
  }
}
