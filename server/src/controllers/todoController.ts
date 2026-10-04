import type { Request, Response } from 'express';
import type { TodoDocument } from '../models/Todo.js';
import type { TodoService } from '../services/todoService.js';
import type { CreateTodoInput } from '../validators/todoValidators.js';
import { logger, sendResponse } from '../utils/index.js';

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

  createTodo = async (request: Request, response: Response): Promise<void> => {
    const todo = await this.todoService.createTodo(request.body as CreateTodoInput);
    logger.info('Todo created', { todoId: todo._id.toString() });
    sendResponse(response, 201, 'Todo created successfully', undefined, toTodoResponse(todo));
  };
}
