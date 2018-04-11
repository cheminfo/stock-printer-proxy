'use strict';

const superagent = require('superagent');
const proxy = require('http-proxy-middleware');
const Roc = require('rest-on-couch-client');
const bodyParser = require('body-parser');

const config = require('./config/config');

const proxies = {};

const roc = new Roc(config['rest-on-couch']);
module.exports = function() {
  return function(req, res) {
    const mac = req.query.mac;
    if (!mac) {
      res.status(400).send('Please provide a printer id');
    } else {
      roc
        .view('printServerByMacAddress', {
          key: mac
        })
        .then(data => {
          if (!data.length) {
            res.status(404).send('mac address not found');
          } else {
            const content = data[0].$content;
            // Unfortunately, I was not able to make the proxy work. So I manually send the correct request here...
            if (req.path === '/pstprnt') {
              bodyParser.text()(req, res, function() {
                const url = content.url + req.path;
                superagent.post(url).send(req.body);
                res.json({ ok: true });
              });
            } else {
              if (!proxies[content.url]) {
                proxies[content.url] = proxy({
                  target: content.url,
                  changeOrigin: true,
                  proxyTimeout: 2500
                });
              }
              proxies[content.url](req, res);
            }
          }
        })
        .catch(err => {
          res.status(500).send('Internal server error');
          console.error('error:' + err);
        });
    }
  };
};
