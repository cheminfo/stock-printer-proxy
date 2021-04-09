'use strict';

const net = require('net');
const superagent = require('superagent');
const { createProxyMiddleware } = require('http-proxy-middleware');
const Roc = require('rest-on-couch-client');
const bodyParser = require('body-parser');

const config = require('./config/config');

const proxies = {};

const roc = new Roc(config['rest-on-couch']);
module.exports = function () {
  return function (req, res) {
    const mac = req.query.mac;
    if (!mac) {
      res.status(400).send('Please provide a printer id');
    } else {
      roc
        .view('printServerByMacAddress', {
          key: mac,
        })
        .then((data) => {
          if (!data.length) {
            res.status(404).send('mac address not found');
          } else {
            const content = data[0].$content;
            // Unfortunately, I was not able to make the proxy work. So I manually send the correct request here...
            if (req.path === '/pstprnt') {
              bodyParser.text()(req, res, function () {
                if (config.protocol === 'tcp') {
                  print(content.ip, req.body)
                    .then(() => {
                      res.json({ ok: true });
                    })
                    .catch(() => {
                      res.json({ ok: false });
                    });
                } else {
                  const url = content.url + req.path;
                  superagent
                    .post(url)
                    .timeout({
                      response: 10000,
                      deadline: 30000,
                    })
                    .send(req.body)
                    .set('Content-Length', req.body.length)
                    .then(() => {
                      res.json({ ok: true });
                    })
                    .catch(() => {
                      res.json({ ok: false });
                    });
                }
              });
            } else {
              if (!proxies[content.url]) {
                proxies[content.url] = createProxyMiddleware({
                  target: content.url,
                  changeOrigin: true,
                  proxyTimeout: 2500,
                });
              }
              proxies[content.url](req, res);
            }
          }
        })
        .catch((err) => {
          res.status(500).send('Internal server error');
          console.error('error:' + err);
        });
    }
  };
};

function print(address, data) {
  return new Promise((resolve, reject) => {
    const socket = net.connect(9100, address.split(':')[0], () => {
      socket.end(data, () => resolve(undefined));
    });
    socket.on('error', reject);
  });
}
