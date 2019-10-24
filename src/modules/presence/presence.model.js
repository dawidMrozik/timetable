const Promise = require('bluebird')
const mongoose = require('mongoose')
const httpStatus = require('http-status')
const APIError = require('../../helpers/APIError')

/**
 * Presence Schema
 */
const PresenceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  date: {
    type: String,
    required: true
  },
  present: {
    type: Boolean,
    default: false
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
PresenceSchema.method({})

/**
 * Statics
 */
PresenceSchema.statics = {
  /**
   * Get presence
   * @param {ObjectId} id - The objectId of presence.
   * @returns {Promise<Presence, APIError>}
   */
  get(id) {
    return this.findById(id)
      .populate('student')
      .exec()
      .then(presence => {
        if (presence) {
          return presence
        }
        const err = new APIError(
          'No such presence exists!',
          httpStatus.NOT_FOUND,
          true
        )
        return Promise.reject(err)
      })
  },

  /**
   * List presences and populate student details to wich the presence belongs to.
   * @returns {Promise<Presence[]>}
   */
  list() {
    return this.find()
      .populate('student')
      .exec()
  },

  /**
   * List presences in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of presences to be skipped.
   * @param {number} limit - Limit number of presences to be returned.
   * @returns {Promise<Presence[]>}
   */
  listLazy({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('student')
      .exec()
  }
}

/**
 * @typedef Presence
 */
module.exports = mongoose.model('Presence', PresenceSchema)
