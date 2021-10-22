'use strict';

const bodyParser = require('body-parser');
const schema = require('fluent-json-schema');

const roc = require('./roc');
const { printHttp, printTcp } = require('./print');

const { protocol } = require('./constants');

module.exports = function (fastify) {
  fastify.post(
    '/pstprnt',
    {
      schema: {
        querystring: schema
          .object()
          .prop('mac', schema.string())
          .required(['mac']),
        // Client must pass text/plain in Content-Type header
        body: schema.string(),
      },
    },
    async (request, reply) => {
      const mac = request.query.mac;
      const data = await roc.getView('printServerByMacAddress', {
        key: mac,
      });
      if (!data.length) {
        return reply.code(404).send('mac address not found');
      }
      const content = data[0].$content;
      try {
        if (protocol === 'tcp') {
          await printTcp(content.ip, req.body);
          reply.send({ ok: true });
        } else {
          await printHttp(content.url, req.body);
        }
      } catch (e) {
        return reply.send({ ok: false });
      }
      reply.send({ ok: true });
    },
  );
};
