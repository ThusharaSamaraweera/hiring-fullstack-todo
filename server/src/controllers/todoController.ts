import type { Request, Response } from 'express';
import type { TodoDocument } from '@/models/index.js';
import type { TodoService } from '@/services/index.js';
import type { CreateTodoInput, ListTodosInput, UpdateTodoInput } from '@/validators/index.js';
import { logger, sendResponse } from '@/utils/index.js';

function toTodoResponse(todo: TodoDocument) {
  return {
    _id: todo._id,
    title: todo.title,
    description: todo.description,
    done: todo.done,
    createdAt: todo.createdAt,
  };
}

export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  listTodos = async (request: Request, response: Response): Promise<void> => {
    const todosPage = await this.todoService.listTodos(request.query as unknown as ListTodosInput);
    sendResponse(response, 200, undefined, undefined, {
      ...todosPage,
      items: todosPage.items.map(toTodoResponse),
    });
  };

  createTodo = async (request: Request, response: Response): Promise<void> => {
    const todo = await this.todoService.createTodo(request.body as CreateTodoInput);
    logger.info('Todo created', { todoId: todo._id.toString() });
    sendResponse(response, 201, undefined, undefined, toTodoResponse(todo));
  };

  updateTodo = async (request: Request, response: Response): Promise<void> => {
    const todo = await this.todoService.updateTodo(
      request.params.id as string,
      request.body as UpdateTodoInput,
    );
    logger.info('Todo updated', { todoId: todo._id.toString() });
    sendResponse(response, 200, undefined, undefined, toTodoResponse(todo));
  };
}
