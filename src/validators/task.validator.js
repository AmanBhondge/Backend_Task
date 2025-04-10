import { body, param, query } from 'express-validator';

export const taskValidationRules = [
  body('title')
    .notEmpty()
    .withMessage('Title is required'),

  body('description')
    .notEmpty()
    .withMessage('Description is required'),

  body('status')
    .isIn(['pending', 'inProgress', 'completed'])
    .withMessage('Status must be pending, inProgress, or completed'),
];

export const validateTaskId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid Task ID'),
];

export const filterValidation = [
  query('status')
    .optional()
    .isIn(['pending', 'inProgress', 'completed'])
    .withMessage('Invalid status filter'),
];
