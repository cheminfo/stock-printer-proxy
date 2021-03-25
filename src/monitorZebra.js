'use strict';

const Roc = require('rest-on-couch-client');
const superagent = require('superagent');

const util = require('./util');
const config = require('./config/config');
console.log({
  ...config,
  password: '***',
});

const roc = new Roc(config['rest-on-couch']);

const interval = 60000 * 5; // Every 5 minute
const failInterval = 60000; // Every 1 minute if it fails

async function start() {
  try {
    await updateStatus();
    setTimeout(start, interval);
  } catch (e) {
    console.log('Error while updating zebra printer status', e);
    setTimeout(start, failInterval);
  }
}

async function updateStatus() {
  let printers = await roc.view('entryByKind', {
    key: 'printer',
  });
  printers = printers.filter(
    (printer) => printer.$content.kind === 'zebra' && printer.$content.ip,
  );

  for (let printer of printers) {
    const data = printer.$content;
    const printerCheck = await checkPrinter(data);
    await updatePrinterServer(data, printerCheck);
  }
}

async function checkPrinter(printer) {
  const result = {
    isOnline: false,
  };
  try {
    const res = await superagent.get(`http://${printer.ip}`);
    if (res.status !== 200) return false;

    const parsed = util.parsePrinterResponse(res.text);
    result.isOnline = parsed.isOnline;
    result.serialNumber = parsed.serialNumber;

    return result;
  } catch (e) {
    console.error('Error while checking printer', new Date());
    console.error(e);
    return result;
  }
}

function updatePrinterServer(printer, printerCheck) {
  return roc
    .view('printServerByMacAddress', {
      key: printer.macAddress,
    })
    .then((data) => {
      const content = {
        macAddress: printerCheck.isOnline
          ? printerCheck.serialNumber
          : printer.macAddress,
        ip: printer.ip,
        version: 1,
        port: 80,
        protocol: 'http',
        url: `http://${printer.ip}`,
        isOnline: printerCheck.isOnline,
        kind: 'zebra',
      };
      if (!data.length) {
        return roc.create({
          $kind: 'printServer',
          $content: content,
          $owners: ['printerAdmin'],
        });
      } else {
        return roc.update(Object.assign(data[0], { $content: content }));
      }
    })
    .catch((err) => {
      console.error('Error logging printServer to couchdb', err);
    });
}

module.exports = {
  start,
};
