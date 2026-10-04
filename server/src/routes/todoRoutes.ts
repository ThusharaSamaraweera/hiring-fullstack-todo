import { Router } from 'express';
import { TodoController } from '../controllers/todoController.js';
import { validate } from '../middleware/validate.js';
import { TodoRepository } from '../repositories/todoRepository.js';
import { TodoService } from '../services/todoService.js';
import { createTodoSchema, listTodosSchema } from '../validators/todoValidators.js';

const todoRepository = new TodoRepository();
const todoService = new TodoService(todoRepository);
const todoController = new TodoController(todoService);
const router = Router();

router.get('/', validate(listTodosSchema, 'query'), todoController.listTodos);
router.post('/', validate(createTodoSchema, 'body'), todoController.createTodo);

export default router;
