const httpStatus = require('http-status')
const Grade = require('./grade.model')
const Student = require('../student/student.model')
const APIError = require('../../helpers/APIError')

/**
 * Load grade and append to req.
 */
function load(req, res, next, id) {
  Grade.get(id)
    .then(grade => {
      req.grade = grade // eslint-disable-line no-param-reassign
      return next()
    })
    .catch(e => next(e))
}

/**
 * Get grade
 * @returns {Grade}
 */
function get(req, res) {
  return res.json(req.grade)
}

/**
 * Create new book
 * @property {string} req.body.bookName - The name of book.
 * @property {string} req.body.author - Author name of book.
 * @property {string} req.body.isbn- The isbn of book.
 * @returns {Book}
 */
function create(req, res, next) {
  const grade = new Grade(req.body)
  grade.teacher = res.locals.session._id

  grade
    .save()
    .then(savedGrade => {
      Student.findById(savedGrade.student).then(student => {
        student.grades.push(savedGrade._id)

        student.save()
          .then(() => res.json(savedGrade))
          .catch(e => next(e))
      })
    })
    .catch(e => next(e))
}

/**
 * Update existing book
 * @property {string} req.body.bookName - The name of book.
 * @property {string} req.body.author - Author name of book.
 * @property {string} req.body.isbn- The isbn of book.
 * @returns {Book}
 */
function update(req, res, next) {
  const { grade } = req
  grade.grade = req.body.grade || grade.grade
  grade.type = req.body.type || grade.type
  grade.weight = req.body.weight || grade.weight

  grade
    .save()
    .then(editedGrade => {
      res.json(editedGrade)
    })
    .catch(e => next(new APIError(e.message, httpStatus.CONFLICT, true)))
}

/**
 * Get grade list.
 * @returns {Grade[]}
 */
function list(req, res, next) {
  Grade.list()
    .then(grades => res.json(grades))
    .catch(e => next(e))
}

/**
 * Delete book.
 * @returns {Grade}
 */
function remove(req, res, next) {
  const { grade } = req
  grade
    .remove()
    .then(deletedGrade => res.json(deletedGrade))
    .catch(e => next(e))
}

module.exports = {
  load,
  get,
  create,
  update,
  list,
  remove
}
