// THIS FILE IS A MODIFIED COPY OF https://github.com/requarks/wiki/blob/18f91659454cba8ea6bf7c8332cd4fc54b233b35/server/controllers/ssl.js
// TO ENABLE HTTPS REDIRECTION BECAUSE OF https://github.com/Requarks/wiki-heroku/issues/24

const express = require('express')
const router = express.Router()
const _ = require('lodash')
const qs = require('querystring')

/* global WIKI */

/**
 * Let's Encrypt Challenge
 */
router.get('/.well-known/acme-challenge/:token', (req, res, next) => {
  res.type('text/plain')
  if (_.get(WIKI.config, 'letsencrypt.challenge', false)) {
    if (WIKI.config.letsencrypt.challenge.token === req.params.token) {
      res.send(WIKI.config.letsencrypt.challenge.keyAuthorization)
      WIKI.logger.info(`(LETSENCRYPT) Received valid challenge request. [ ACCEPTED ]`)
    } else {
      res.status(406).send('Invalid Challenge Token!')
      WIKI.logger.warn(`(LETSENCRYPT) Received invalid challenge request. [ REJECTED ]`)
    }
  } else {
    res.status(418).end()
  }
})

/**
 * Redirect to HTTPS if HTTP Redirection is enabled
 */
router.all('/*', (req, res, next) => {
  if (!req.secure) {
    let query = (!_.isEmpty(req.query)) ? `?${qs.stringify(req.query)}` : ``
    return res.redirect(`https://${req.hostname}${req.originalUrl}${query}`)
  } else {
    next()
  }
})

module.exports = router