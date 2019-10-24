const Promise = require('bluebird')
const mongoose = require('mongoose')
const httpStatus = require('http-status')
const APIError = require('../../helpers/APIError')

/**
 * Grade Schema
 */
const GradeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  },
  type: {
    type: String,
    default: ''
  },
  grade: {
    type: Number,
    required: true
  },
  weight: {
    type: Number,
    default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

/**
 * - pre-post-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
GradeSchema.method({})

/**
 * Statics
 */
GradeSchema.statics = {
  /**
   * Get grade
   * @param {ObjectId} id - The objectId of grade.
   * @returns {Promise<grade, APIError>}
   */
  get(id) {
    return this.findById(id)
      .populate('teacher')
      .exec()
      .then(grade => {
        if (grade) {
          return grade
        }
        const err = new APIError(
          'No such grade exists!',
          httpStatus.NOT_FOUND,
          true
        )
        return Promise.reject(err)
      })
  },

  /**
   * List books and populate owner details to wich the book belongs to.
   * @returns {Promise<Grade[]>}
   */
  list() {
    return this.find()
      .populate('teacher')
      .exec()
  },

  /**
   * List books in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of books to be skipped.
   * @param {number} limit - Limit number of books to be returned.
   * @returns {Promise<Grade[]>}
   */
  listLazy({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('teacher')
      .exec()
  }
}

/**
 * @typedef Grade
 */
module.exports = mongoose.model('Grade', GradeSchema)
