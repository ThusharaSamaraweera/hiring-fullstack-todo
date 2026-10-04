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
    logger.info('listTodos is called in TodoController');
    const todosPage = await this.todoService.listTodos(request.query as unknown as ListTodosInput);
    sendResponse(response, 200, undefined, undefined, {
      ...todosPage,
      items: todosPage.items.map(toTodoResponse),
    });
  };

  createTodo = async (request: Request, response: Response): Promise<void> => {
    logger.info('createTodo is called in TodoController');
    const todo = await this.todoService.createTodo(request.body as CreateTodoInput);
    logger.info('Todo created', { todoId: todo._id.toString() });
    sendResponse(response, 201, undefined, undefined, toTodoResponse(todo));
  };

  updateTodo = async (request: Request, response: Response): Promise<void> => {
    logger.info('updateTodo is called in TodoController', { todoId: request.params.id });
    const todo = await this.todoService.updateTodo(
      request.params.id as string,
      request.body as UpdateTodoInput,
    );
    logger.info('Todo updated', { todoId: todo._id.toString() });
    sendResponse(response, 200, undefined, undefined, toTodoResponse(todo));
  };

  deleteTodo = async (request: Request, response: Response): Promise<void> => {
    logger.info('deleteTodo is called in TodoController', { todoId: request.params.id });
    await this.todoService.deleteTodo(request.params.id as string);
    logger.info('Todo deleted', { todoId: request.params.id });
    sendResponse(response, 200, undefined, undefined);
  };

  completeTodo = async (request: Request, response: Response): Promise<void> => {
    logger.info('completeTodo is called in TodoController', { todoId: request.params.id });
    const todo = await this.todoService.completeTodo(request.params.id as string);
    logger.info('Todo completed', { todoId: todo._id.toString() });
    sendResponse(response, 200, undefined, undefined, toTodoResponse(todo));
  };
}
