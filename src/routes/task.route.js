import express from 'express';
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} from '../controllers/task.controller.js';

import authorize from '../middlewares/authorize.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import {
  taskValidationRules,
  validateTaskId,
  filterValidation
} from '../validators/task.validator.js';

const taskRouter = express.Router();

taskRouter.use(authorize);

// GET /tasks?status=pending
taskRouter.get('/', filterValidation, validate, getAllTasks);

taskRouter.get('/:id', validateTaskId, validate, getTaskById);

taskRouter.post('/', taskValidationRules, validate, createTask);

taskRouter.put('/:id', validateTaskId, validate, updateTask);

taskRouter.delete('/:id', validateTaskId, validate, deleteTask);

export default taskRouter;
