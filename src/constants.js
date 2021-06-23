'use strict';

const url = process.env.REST_ON_COUCH_URL;
const database = process.env.REST_ON_COUCH_DATABASE;
const username = process.env.REST_ON_COUCH_USERNAME;
const password = process.env.REST_ON_COUCH_PASSWORD;
const port = process.env.SERVER_PORT;
const protocol = process.env.PRINTER_PROTOCOL || 'http';

if (!url) {
  throw new Error('missing env variable REST_ON_COUCH_URL');
}

if (!database) {
  throw new Error('missing env variable REST_ON_COUCH_DATABASE');
}

if (!username) {
  throw new Error('missing env variable REST_ON_COUCH_USERNAME');
}

if (!password) {
  throw new Error('missing env variable REST_ON_COUCH_PASSWORD');
}

if (!port) {
  throw new Error('port is missing');
}

module.exports = {
  url,
  database,
  username,
  password,
  protocol,
  port,
};
