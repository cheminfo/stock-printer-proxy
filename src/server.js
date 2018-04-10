'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
const config = require('./config/config');
const printerProxy = require('./printerProxy');
const monitorZebra = require('./monitorZebra');

app.use(cors());
app.use(printerProxy());

app.listen(config.server.port, function() {
  console.log(`listening on port ${config.server.port}`);
});

// Poll database for zebra printers
// and check their availability
monitorZebra.start();
