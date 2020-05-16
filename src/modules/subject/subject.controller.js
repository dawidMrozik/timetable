const httpStatus = require('http-status')
const Subject = require('./subject.model')
const APIError = require('../../helpers/APIError')
const mongoose = require('mongoose')
const Grade = require('../grade/grade.model')
const set = require('lodash.set')

/**
 * Load subject and append to req.
 */
function load(req, res, next, id) {
  Subject.get(id)
    .then(subject => {
      req.subject = subject // eslint-disable-line no-param-reassign
      return next()
    })
    .catch(e => next(e))
}

/**
 * Get subject
 * @returns {subject}
 */
function get(req, res) {
  return res.json(req.subject)
}

/**
 * Create new subject
 * @property {string} req.body.firstName - The name of subject.
 * @property {string} req.body.author - Author name of subject.
 * @property {string} req.body.isbn- The isbn of subject.
 * @returns {subject}
 */
function create(req, res, next) {
  const subject = new Subject(req.body)
  subject.teacher = res.locals.session._id

  subject
    .save()
    .then(savedsubject => res.json(savedsubject))
    .catch(e => next(e))
}

/**
 * Update existing subject
 * @property {string} req.body.firstName - The name of subject.
 * @property {string} req.body.author - Author name of subject.
 * @property {string} req.body.isbn- The isbn of subject.
 * @returns {subject}
 */
function update(req, res, next) {
  const { subject } = req
  subject.name = req.body.name || subject.name
  subject.date = req.body.date || subject.date
  subject.students = req.body.students || subject.students
  subject
    .save()
    .then(savedsubject => res.json(savedsubject))
    .catch(e => next(new APIError(e.message, httpStatus.CONFLICT, true)))
}

/**
 * Get subject list.
 * @returns {subject[]}
 */
function list(req, res, next) {
  Subject.list()
    .then(subjects => res.json(subjects))
    .catch(e => next(e))
}

/**
 * Delete subject.
 * @returns {subject}
 */
function remove(req, res, next) {
  const { subject } = req
  subject
    .remove()
    .then(deletedsubject => res.json(deletedsubject))
    .catch(e => next(e))
}

function attachStudent(req, res, next) {
  const { subject } = req
  const studentId = req.body.studentId

  const isStudentAttached = Boolean(subject.students.find(student => student._id == studentId))

  if (!isStudentAttached) {
    subject.students.push(mongoose.Types.ObjectId(studentId))

    subject
      .save()
      .then(savedsubject => res.json(savedsubject))
      .catch(e => next(e))
  } else {
    res.json(subject)
  }
}

function deattachStudent(req, res, next) {
  const { subject } = req
  const { student } = req.params

  subject.students.remove(mongoose.Types.ObjectId(student))
  subject
    .save()
    .then(() => res.json(student))
    .catch(e => next(e))
}

module.exports = {
  load,
  get,
  create,
  update,
  list,
  remove,
  attachStudent,
  deattachStudent
}
