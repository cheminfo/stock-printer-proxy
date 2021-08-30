'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
const printerProxy = require('./printerProxy');
const monitorZebra = require('./monitorZebra');
const constants = require('./constants');
const { port } = constants;

app.use(cors());
app.use(printerProxy());

console.log({
  ...constants,
  accessToken: '***',
});

app.listen(port, function () {
  console.log(`listening on port ${port}`);
});

// Poll database for zebra printers
// and check their availability
monitorZebra.start();
