const Promise = require('bluebird')
const mongoose = require('mongoose')
const httpStatus = require('http-status')
const APIError = require('../../helpers/APIError')

/**
 * Subject Schema
 */
const SubjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    }
  ],
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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
SubjectSchema.method({})

/**
 * Statics
 */
SubjectSchema.statics = {
  /**
   * Get subject
   * @param {ObjectId} id - The objectId of subject.
   * @returns {Promise<Subject, APIError>}
   */
  get(id) {
    return this.findById(id)
      .populate({
        path: 'students',
        populate: { path: 'grades' }
      })
      .exec()
      .then(subject => {
        if (subject) {
          return subject
        }
        const err = new APIError(
          'No such subject exists!',
          httpStatus.NOT_FOUND,
          true
        )
        return Promise.reject(err)
      })
  },

  /**
   * List subjects and populate students details to wich the subject belongs to.
   * @returns {Promise<Subject[]>}
   */
  list() {
    return this.find().exec()
  },

  /**
   * List subjects in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of subjects to be skipped.
   * @param {number} limit - Limit number of subjects to be returned.
   * @returns {Promise<Subject[]>}
   */
  listLazy({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('students')
      .exec()
  }
}

/**
 * @typedef Subject
 */
module.exports = mongoose.model('Subject', SubjectSchema)
