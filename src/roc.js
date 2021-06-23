'use strict';

const Roc = require('rest-on-couch-client');

const { url, database, username, password } = require('./constants');

const roc = new Roc({
  url,
  database,
  username,
  password,
});

module.exports = roc;
