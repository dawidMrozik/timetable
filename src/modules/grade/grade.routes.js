const express = require('express')
const validate = require('express-validation')
const Joi = require('@hapi/joi')
const gradeCtrl = require('./grade.controller')

const router = express.Router() // eslint-disable-line new-cap
const paramValidation = {
  createGrade: {
    body: {
      student: Joi.string().required(),
      subject: Joi.string().required(),
      grade: Joi.string().required()
    }
  },
  updateGrade: {
    params: {
      gradeId: Joi.string().required()
    },
    body: {
      grade: Joi.string().required()
    }
  }
}

router
  .route('/')
  /** GET /api/grades - Get list of grades */
  .get(gradeCtrl.list)

  /** POST /api/grades - Create new grade */
  .post(validate(paramValidation.createGrade), gradeCtrl.create)

router
  .route('/:gradeId')
  /** GET /api/grades/:gradeId - Get grade */
  .get(gradeCtrl.get)

  /** PUT /api/grades/:gradeId - Update grade */
  .put(validate(paramValidation.updateGrade), gradeCtrl.update)

  /** DELETE /api/grades/:gradeId - Delete grade */
  .delete(gradeCtrl.remove)

/** Load grade when API with gradeId route parameter is hit */
router.param('gradeId', gradeCtrl.load)

module.exports = router
