const { body } = require('express-validator');

const jobValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Job title is required'),
  body('type')
    .isIn(['job', 'internship'])
    .withMessage('Job type must be either "job" or "internship"'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Job description is required'),
  body('workMode')
    .isIn(['remote', 'hybrid', 'onsite'])
    .withMessage('Work mode must be remote, hybrid, or onsite'),
  body('duration')
    .trim()
    .notEmpty()
    .withMessage('Duration is required (e.g. 3 Months, 6 Months, Full-time)'),
  body('salary')
    .optional()
    .trim()
];

module.exports = { jobValidation };
