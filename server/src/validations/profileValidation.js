const { body } = require('express-validator');

const profileValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required'),
  body('headline')
    .optional()
    .trim(),
  body('education')
    .optional()
    .isArray()
    .withMessage('Education must be an array'),
  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array of strings'),
  body('experience')
    .optional()
    .isArray()
    .withMessage('Experience must be an array')
];

module.exports = { profileValidation };
