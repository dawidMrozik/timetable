const express = require('express');
const validate = require('express-validation');
const Joi = require('@hapi/joi');
const presenceCtrl = require('./presence.controller');

const router = express.Router(); // eslint-disable-line new-cap
const paramValidation = {
  createPresence: {
    body: {
      student: Joi.string().required(),
      subject: Joi.string().required(),
      date: Joi.string().required(),
      present: Joi.boolean().required(),
    },
  },
  updatePresence: {
    params: {
      presenceId: Joi.string().required(),
    },
    body: {
        present: Joi.boolean().required(),
    },
  },
};

router.route('/')
  /** GET /api/presences - Get list of presences */
  .get(presenceCtrl.list)

  /** POST /api/presences - Create new presence */
  .post(validate(paramValidation.createPresence), presenceCtrl.create);

router.route('/:presenceId')
  /** GET /api/presences/:presenceId - Get presence */
  .get(presenceCtrl.get)

  /** PUT /api/presences/:presenceId - Update presence */
  .put(validate(paramValidation.updatePresence), presenceCtrl.update)

  /** DELETE /api/presences/:presenceId - Delete presence */
  .delete(presenceCtrl.remove);

/** Load presence when API with presenceId route parameter is hit */
router.param('presenceId', presenceCtrl.load);

module.exports = router;
