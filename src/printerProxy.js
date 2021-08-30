'use strict';

const bodyParser = require('body-parser');

const roc = require('./roc');
const { printHttp, printTcp } = require('./print');

const { protocol } = require('./constants');

module.exports = function () {
  return function (req, res) {
    const mac = req.query.mac;
    if (!mac) {
      res.status(400).send('Please provide a printer id');
    } else {
      const query = roc.getView('printServerByMacAddress', {
        key: mac,
      });

      query
        .fetch()
        .then((data) => {
          if (!data.length) {
            res.status(404).send('mac address not found');
          } else {
            const content = data[0].$content;
            // Unfortunately, I was not able to make the proxy work. So I manually send the correct request here...
            if (req.path === '/pstprnt') {
              bodyParser.text()(req, res, function () {
                if (protocol === 'tcp') {
                  printTcp(content.ip, req.body)
                    .then(() => {
                      res.json({ ok: true });
                    })
                    .catch(() => {
                      res.json({ ok: false });
                    });
                } else {
                  printHttp(content.url, req.body)
                    .then(() => {
                      res.json({ ok: true });
                    })
                    .catch(() => {
                      res.json({ ok: false });
                    });
                }
              });
            } else {
              throw new Error(
                'only /pstprnt route for Zebra printers is supported',
              );
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
