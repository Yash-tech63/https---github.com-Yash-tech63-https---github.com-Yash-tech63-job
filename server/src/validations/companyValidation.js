const { body } = require('express-validator');

const companyValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Company name is required'),
  body('website')
    .optional({ checkFalsy: true })
    .trim(),
  body('industry')
    .optional()
    .trim(),
  body('size')
    .optional()
    .trim(),
  body('location')
    .optional()
    .trim(),
  body('description')
    .optional()
    .trim()
];

const verifyCompanyValidation = [
  body('status')
    .isIn(['valid', 'invalid'])
    .withMessage('Status must be either "valid" or "invalid"'),
  body('adminNote')
    .if(body('status').equals('invalid'))
    .trim()
    .notEmpty()
    .withMessage('Admin note is mandatory when rejecting or marking a company invalid')
];

module.exports = {
  companyValidation,
  verifyCompanyValidation
};
