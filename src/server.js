'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
const config = require('./config/config');
const printerProxy = require('./printerProxy');

app.use(cors());
app.use(printerProxy());

app.listen(config.server.port, function () {
    console.log(`listening on port ${config.server.port}`);
});