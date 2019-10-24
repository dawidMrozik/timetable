const httpStatus = require('http-status');
const Student = require('./student.model');
const APIError = require('../../helpers/APIError');

/**
 * Load student and append to req.
 */
function load(req, res, next, id) {
    Student.get(id)
    .then((student) => {
      req.student = student; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get student
 * @returns {Student}
 */
function get(req, res) {
  return res.json(req.student);
}

/**
 * Create new student
 * @property {string} req.body.firstName - The name of student.
 * @property {string} req.body.author - Author name of student.
 * @property {string} req.body.isbn- The isbn of student.
 * @returns {student}
 */
function create(req, res, next) {
  const student = new Student(req.body);

  student.save()
    .then(savedstudent => res.json(savedstudent))
    .catch(e => next(e));
}

/**
 * Update existing student
 * @property {string} req.body.firstName - The name of student.
 * @property {string} req.body.author - Author name of student.
 * @property {string} req.body.isbn- The isbn of student.
 * @returns {student}
 */
function update(req, res, next) {
  const { student } = req;
  student.firstName = req.body.firstName || student.firstName;
  student.lastName = req.body.lastName || student.lastName;
  student.save()
    .then(savedstudent => res.json(savedstudent))
    .catch(e => next(new APIError(e.message, httpStatus.CONFLICT, true)));
}

/**
 * Get student list.
 * @returns {student[]}
 */
function list(req, res, next) {
  Student.list()
    .then(students => res.json(students))
    .catch(e => next(e));
}

/**
 * Delete student.
 * @returns {student}
 */
function remove(req, res, next) {
  const { student } = req;
  student.remove()
    .then(deletedstudent => res.json(deletedstudent))
    .catch(e => next(e));
}

module.exports = {
  load,
  get,
  create,
  update,
  list,
  remove,
};
