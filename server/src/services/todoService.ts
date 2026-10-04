import type { CreateTodoInput } from '../validators/todoValidators.js';
import { logger } from '../utils/index.js';
import type { TodoRepository } from '../repositories/todoRepository.js';

export class TodoService {
  constructor(private readonly todoRepository: TodoRepository) {}

  async createTodo(todoInput: CreateTodoInput) {
    logger.debug('Creating todo');
    return this.todoRepository.createTodo(todoInput);
  }
}
