import { TodoModel, type TodoDocument } from '@/models/index.js';
import { TodoStatus } from '@/types/index.js';
import type { CreateTodoInput, ListTodosInput, UpdateTodoInput } from '@/validators/index.js';
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

  updateById(todoId: string, todoInput: UpdateTodoInput): Promise<TodoDocument | null> {
    const update = {
      ...(todoInput.title === undefined ? {} : { title: todoInput.title }),
      ...(todoInput.description === undefined ? {} : { description: todoInput.description }),
    };

    return TodoModel.findByIdAndUpdate(todoId, update, { new: true, runValidators: true })
      .lean<TodoDocument>()
      .exec();
  }
}
