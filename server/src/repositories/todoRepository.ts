import { TodoModel, type TodoDocument } from '@/models/index.js';
import { TodoStatus, type TodoUpdateFields } from '@/types/index.js';
import type { CreateTodoInput, ListTodosInput } from '@/validators/index.js';
import { escapeRegex } from '@/utils/regex.js';
import { logger } from '../utils/logger.js';

export class TodoRepository {
  async findTodos(todoQuery: ListTodosInput): Promise<{ items: TodoDocument[]; totalItems: number }> {
    logger.info('Finding todos in repository')

    const filter: Record<string, unknown> = {};

    if (todoQuery.status === TodoStatus.PENDING) filter.done = false;
    if (todoQuery.status === TodoStatus.COMPLETED) filter.done = true;

    if (todoQuery.search) {
      const searchPattern = escapeRegex(todoQuery.search);
      filter.$or = [
        { title: { $regex: searchPattern, $options: 'i' } },
        { description: { $regex: searchPattern, $options: 'i' } },
      ];
    }

    const [items, totalItems] = await Promise.all([
      TodoModel.find(filter)
        .sort({ createdAt: -1, _id: -1 })
        .skip((todoQuery.page - 1) * todoQuery.limit)
        .limit(todoQuery.limit)
        .lean<TodoDocument[]>()
        .exec(),
      TodoModel.countDocuments(filter).exec(),
    ]);

    return { items, totalItems };
  }

  async createTodo(todoInput: CreateTodoInput): Promise<TodoDocument> {
    const todo = new TodoModel({
      title: todoInput.title,
      ...(todoInput.description === undefined ? {} : { description: todoInput.description }),
    });
    await todo.save();
    return todo.toObject() as TodoDocument;
  }

  findById(todoId: string): Promise<TodoDocument | null> {
    return TodoModel.findById(todoId).lean<TodoDocument>().exec();
  }

  updateById(todoId: string, todoInput: TodoUpdateFields): Promise<TodoDocument | null> {
    const update: TodoUpdateFields = {};

    if (todoInput.title !== undefined) update.title = todoInput.title;
    if (todoInput.description !== undefined) update.description = todoInput.description;
    if (todoInput.done !== undefined) update.done = todoInput.done;

    return TodoModel.findByIdAndUpdate(todoId, update, { new: true, runValidators: true })
      .lean<TodoDocument>()
      .exec();
  }

  deleteById(todoId: string): Promise<TodoDocument | null> {
    return TodoModel.findByIdAndDelete(todoId).lean<TodoDocument>().exec();
  }
}
