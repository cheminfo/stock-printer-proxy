'use strict';

const yaml = require('js-yaml');
const argv = require('minimist')(process.argv.slice(2));
const fs = require('fs');
const path = require('path');
const def = require('./default');

var configFile = getPath('config.yml');

if (argv.config) {
  configFile = getPath(argv.config);
}

function getPath(p) {
  return path.resolve(path.join(__dirname, '../..'), p);
}

const config = yaml.load(fs.readFileSync(configFile));

module.exports = Object.assign({}, def, config);
