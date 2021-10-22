const url = process.env.REST_ON_COUCH_URL;
const database = process.env.REST_ON_COUCH_DATABASE;
const accessToken = process.env.REST_ON_COUCH_ACCESS_TOKEN;
const port = process.env.SERVER_PORT;
const protocol = process.env.PRINTER_PROTOCOL || 'http';
const disableMonitor = process.env.DISABLE_MONITOR || false;

if (!url) {
  throw new Error('missing env variable REST_ON_COUCH_URL');
}

if (!database) {
  throw new Error('missing env variable REST_ON_COUCH_DATABASE');
}

if (!accessToken) {
  throw new Error('missing env variable REST_ON_COUCH_ACCESS_TOKEN');
}

if (!port) {
  throw new Error('port is missing');
}

export default {
  url,
  database,
  accessToken,
  protocol,
  port,
  disableMonitor,
};
