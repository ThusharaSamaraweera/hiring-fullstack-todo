import { TodoModel, type TodoDocument } from '../models/Todo.js';
import type { CreateTodoInput } from '../validators/todoValidators.js';

export class TodoRepository {
  async createTodo(todoInput: CreateTodoInput): Promise<TodoDocument> {
    const todo = new TodoModel({
      title: todoInput.title,
      ...(todoInput.description === undefined ? {} : { description: todoInput.description }),
    });
    await todo.save();
    return todo.toObject() as TodoDocument;
  }
}
