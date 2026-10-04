import { Router } from 'express';
import { TodoController } from '@/controllers/index.js';
import { validate } from '@/middleware/index.js';
import { TodoRepository } from '@/repositories/index.js';
import { TodoService } from '@/services/index.js';
import { createTodoSchema, listTodosSchema } from '@/validators/index.js';

const todoRepository = new TodoRepository();
const todoService = new TodoService(todoRepository);
const todoController = new TodoController(todoService);
const router = Router();

router.get('/', validate(listTodosSchema, 'query'), todoController.listTodos);
router.post('/', validate(createTodoSchema, 'body'), todoController.createTodo);

export default router;
