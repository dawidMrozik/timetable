const httpStatus = require('http-status')
const Student = require('./student.model')
const APIError = require('../../helpers/APIError')
const Grades = require('../grade/grade.model')
const Subject = require('../subject/subject.model')
const Presence = require('../presence/presence.model')

/**
 * Load student and append to req.
 */
function load(req, res, next, id) {
  Student.get(id)
    .then(student => {
      req.student = student // eslint-disable-line no-param-reassign
      return next()
    })
    .catch(e => next(e))
}

/**
 * Get student
 * @returns {Student}
 */
function get(req, res) {
  return res.json(req.student)
}

/**
 * Create new student
 * @property {string} req.body.firstName - The name of student.
 * @property {string} req.body.author - Author name of student.
 * @property {string} req.body.isbn- The isbn of student.
 * @returns {student}
 */
function create(req, res, next) {
  const student = new Student(req.body)

  student
    .save()
    .then(savedstudent => res.json(savedstudent))
    .catch(e => next(e))
}

/**
 * Update existing student
 * @property {string} req.body.firstName - The name of student.
 * @property {string} req.body.author - Author name of student.
 * @property {string} req.body.isbn- The isbn of student.
 * @returns {student}
 */
function update(req, res, next) {
  const { student } = req
  student.firstName = req.body.firstName || student.firstName
  student.lastName = req.body.lastName || student.lastName
  student
    .save()
    .then(savedstudent => res.json(savedstudent))
    .catch(e => next(new APIError(e.message, httpStatus.CONFLICT, true)))
}

/**
 * Get student list.
 * @returns {student[]}
 */
function list(req, res, next) {
  Student.list()
    .then(students => res.json(students))
    .catch(e => next(e))
}

/**
 * Delete student.
 * @returns {student}
 */
function remove(req, res, next) {
  const { student } = req

  Subject.find().exec().then(subjects => {
    subjects.forEach(subject => {
      subject.students.remove(student._id)
      subject.save()
    })
  }).then(() => {
    student
      .remove()
      .then(deletedstudent => res.json(deletedstudent))
      .catch(e => next(e))
  })
}

function grades(req, res, next) {
  const { student } = req

  Grades.find()
    .where('student', student._id)
    .exec()
    .then(grades => res.json(grades))
    .catch(e => next(e))
}

function avg(req, res, next) {
  const { student } = req
  const { subject } = req.params

  let isReliefed = true

  function removeSmallest(arr) {
    const grades = arr.map(e => e.grade)
    const min = Math.min(...grades)

    for (var i = 0; i < arr.length; i++) {
      if (arr[i].grade === min) {
        arr.splice(i, 1);
        break
      }
    }

    return arr
  }

  function getAvarage(grades) {
    let sum = 0
    let weightSum = 0

    grades.forEach(e => {
      weightSum += e.weight
      sum += e.grade * e.weight
    })

    return (sum / weightSum).toFixed(2)
  }

  Presence.find().where('student', student._id).where('subject', subject)
    .exec().then(presences => {
      presences.forEach(presence => {
        if (presence.present === false) isReliefed = false
      })

      const grades = student.grades.filter(grade => grade.subject == subject)

      if (grades.length === 0) return res.json('Brak ocen')
      if (grades.length === 1) return res.json(grades[0].grade)

      if (isReliefed) {
        const newGrades = removeSmallest(grades)
        return res.json(getAvarage(newGrades))
      } else {
        return res.json(getAvarage(grades))
      }
    })
    .catch(e => next(e))
}

module.exports = {
  load,
  get,
  create,
  update,
  list,
  remove,
  grades,
  avg
}
