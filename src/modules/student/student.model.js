const Promise = require('bluebird')
const mongoose = require('mongoose')
const httpStatus = require('http-status')
const APIError = require('../../helpers/APIError')

/**
 * Student Schema
 */
const StudentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
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
StudentSchema.method({})

/**
 * Statics
 */
StudentSchema.statics = {
  /**
   * Get student
   * @param {ObjectId} id - The objectId of student.
   * @returns {Promise<Student, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then(student => {
        if (student) {
          return student
        }
        const err = new APIError(
          'No such student exists!',
          httpStatus.NOT_FOUND,
          true
        )
        return Promise.reject(err)
      })
  },

  /**
   * List students and populate owner details to wich the student belongs to.
   * @returns {Promise<Student[]>}
   */
  list() {
    return this.find().exec()
  },

  /**
   * List students in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of students to be skipped.
   * @param {number} limit - Limit number of students to be returned.
   * @returns {Promise<Student[]>}
   */
  listLazy({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec()
  }
}

/**
 * @typedef Student
 */
module.exports = mongoose.model('Student', StudentSchema)
