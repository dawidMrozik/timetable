const express = require('express');
const validate = require('express-validation');
const Joi = require('@hapi/joi');
const subjectCtrl = require('./subject.controller');

const router = express.Router(); // eslint-disable-line new-cap
const paramValidation = {
  createSubject: {
    body: {
      name: Joi.string().required(),
      date: Joi.string().required(),
    },
  },
  updateSubject: {
    params: {
      subjectId: Joi.string().required(),
    },
    body: {
        name: Joi.string().required(),
        date: Joi.string().required(),
    },
  },
};

router.route('/')
  /** GET /api/subjects - Get list of subjects */
  .get(subjectCtrl.list)

  /** POST /api/subjects - Create new subject */
  .post(validate(paramValidation.createSubject), subjectCtrl.create);

router.route('/:subjectId')
  /** GET /api/subjects/:subjectId - Get subject */
  .get(subjectCtrl.get)

  /** PUT /api/subjects/:subjectId - Update subject */
  .put(validate(paramValidation.updateSubject), subjectCtrl.update)

  /** DELETE /api/subjects/:subjectId - Delete subject */
  .delete(subjectCtrl.remove);

router.put('/:subjectId/attachStudent', subjectCtrl.attachStudent)

/** Load subject when API with subjectId route parameter is hit */
router.param('subjectId', subjectCtrl.load);

module.exports = router;
