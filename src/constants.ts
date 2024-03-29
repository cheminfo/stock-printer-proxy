const url = process.env.REST_ON_COUCH_URL;
const database = process.env.REST_ON_COUCH_DATABASE;
const accessToken = process.env.REST_ON_COUCH_ACCESS_TOKEN;
const port = Number.parseInt(process.env.SERVER_PORT || '', 10);
const protocol = process.env.PRINTER_PROTOCOL || 'http';
const disableMonitor = process.env.DISABLE_MONITOR || false;
const host = process.env.HOST || `localhost:${port}`;
const basePath = process.env.BASE_PATH || '/';

if (!url) {
    throw new Error('missing env variable REST_ON_COUCH_URL');
}

if (!database) {
    throw new Error('missing env variable REST_ON_COUCH_DATABASE');
}

if (!accessToken) {
    throw new Error('missing env variable REST_ON_COUCH_ACCESS_TOKEN');
}

if (Number.isNaN(port)) {
    throw new Error('port is missing or is not a number');
}

export default {
    url,
    database,
    accessToken,
    protocol,
    port,
    disableMonitor,
    host,
    basePath,
};
