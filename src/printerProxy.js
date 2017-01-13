'use strict';

const proxy = require('http-proxy-middleware');
const Roc = require('rest-on-couch-client');
const config = require('./config/config');

const proxies = {};

console.log(config['rest-on-couch']);
const roc = new Roc(config['rest-on-couch']);
module.exports = function() {
    return function(req, res) {
        const mac = req.query.mac;
        if(!mac) {
            res.status(400).send('Please provide a printer id');
        } else {
            roc.view('printServerByMacAddress', {
                key: mac
            }).then(data => {
                if (!data.length) {
                    res.status(404).send('mac address not found');
                } else {
                    const content = data[0].$content;
                   if(!proxies[content.url]) {
                       proxies[content.url] = proxy({
                           target: content.url,
                           changeOrigin: true
                       });
                   }
                    proxies[content.url](req, res);
                }
            }).catch(err => {
                res.status(500).send('Internal server error');
                console.error('error:' + err);
            });
        }

    }
};