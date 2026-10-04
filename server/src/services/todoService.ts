import type { CreateTodoInput, ListTodosInput, UpdateTodoInput } from '@/validators/index.js';
import { logger } from '@/utils/index.js';
import type { TodoRepository } from '@/repositories/index.js';
import { NotFoundException } from '@/exceptions/index.js';
import { TodoOperation, type TodoUpdateFields } from '@/types/index.js';

export class TodoService {
  constructor(private readonly todoRepository: TodoRepository) {}

  async listTodos(todoQuery: ListTodosInput) {
    logger.info('Listing todos in TodoRepository', {
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
    logger.debug('Creating todo in TodoRepository', { fields: Object.keys(todoInput) });
    return this.todoRepository.createTodo(todoInput);
  }

  async updateTodo(todoId: string, todoInput: UpdateTodoInput) {
    logger.debug('Updating todo in TodoRepository', { todoId, fields: Object.keys(todoInput) });
    const updateFields: TodoUpdateFields = {};
    if (todoInput.title !== undefined) updateFields.title = todoInput.title;
    if (todoInput.description !== undefined) updateFields.description = todoInput.description;

    const todo = await this.todoRepository.updateById(todoId, updateFields);

    if (!todo) {
      logger.warn('Todo not found', { operation: TodoOperation.UPDATE, todoId });
      throw new NotFoundException('Todo not found');
    }

    return todo;
  }

  async deleteTodo(todoId: string): Promise<void> {
    logger.debug('Deleting todo in TodoRepository', { todoId });
    const todo = await this.todoRepository.deleteById(todoId);

    if (!todo) {
      logger.warn('Todo not found', { operation: TodoOperation.DELETE, todoId });
      throw new NotFoundException('Todo not found');
    }
  }

  async completeTodo(todoId: string) {
    logger.debug('Completing todo', { todoId });
    const currentTodo = await this.todoRepository.findById(todoId);

    if (!currentTodo) {
      logger.warn('Todo not found', { operation: TodoOperation.COMPLETE, todoId });
      throw new NotFoundException('Todo not found');
    }

    const completedTodo = await this.todoRepository.updateById(todoId, { done: true });
    if (!completedTodo) {
      logger.warn('Todo not found after completion', { operation: TodoOperation.COMPLETE, todoId });
      throw new NotFoundException('Todo not found');
    }

    return completedTodo;
  }
}
