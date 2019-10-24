const httpStatus = require('http-status')
const Presence = require('./presence.model')
const APIError = require('../../helpers/APIError')

/**
 * Load presence and append to req.
 */
function load(req, res, next, id) {
  Presence.get(id)
    .then(presence => {
      req.presence = presence // eslint-disable-line no-param-reassign
      return next()
    })
    .catch(e => next(e))
}

/**
 * Get presence
 * @returns {presence}
 */
function get(req, res) {
  return res.json(req.presence)
}

/**
 * Create new book
 * @property {string} req.body.bookName - The name of book.
 * @property {string} req.body.author - Author name of book.
 * @property {string} req.body.isbn- The isbn of book.
 * @returns {Book}
 */
function create(req, res, next) {
  const presence = new Presence(req.body)

  presence
    .save()
    .then(savedpresence => res.json(savedpresence))
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
  const { presence } = req
  presence.present = req.body.present

  presence
    .save()
    .then(savedpresence => res.json(savedpresence))
    .catch(e => next(new APIError(e.message, httpStatus.CONFLICT, true)))
}

/**
 * Get presence list.
 * @returns {presence[]}
 */
function list(req, res, next) {
  Presence.list()
    .then(presences => res.json(presences))
    .catch(e => next(e))
}

/**
 * Delete book.
 * @returns {presence}
 */
function remove(req, res, next) {
  const { presence } = req
  presence
    .remove()
    .then(deletedpresence => res.json(deletedpresence))
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
