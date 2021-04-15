'use strict';

const net = require('net');
const superagent = require('superagent');

function printTcp(address, data) {
  return new Promise((resolve, reject) => {
    const socket = net.connect(9100, address.split(':')[0], () => {
      socket.end(data, () => resolve(undefined));
    });
    socket.on('error', reject);
  });
}

console.log('haha');
function printHttp(url, data) {
  const printUrl = url + '/pstprnt';
  return superagent
    .post(printUrl)
    .timeout({
      response: 10000,
      deadline: 30000,
    })
    .send(data)
    .set('Content-Length', data.length);
}

module.exports = {
  printTcp,
  printHttp,
};
