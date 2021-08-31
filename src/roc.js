'use strict';

const { Roc } = require('rest-on-couch-client');

const { url, database, accessToken } = require('./constants');

/** @type{Roc} */
const roc = new Roc({
  url,
  database,
  accessToken,
});

module.exports = roc;
