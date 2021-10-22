'use strict';

const fastify = require('fastify')({ logger: true });
const registerRoutes = require('./registerRoutes');
const monitorZebra = require('./monitorZebra');
const constants = require('./constants');
const { port } = constants;

fastify.register(require('fastify-cors'));

registerRoutes(fastify);

fastify.log.info({
  ...constants,
  accessToken: '***',
});

// Run the server!
const start = async () => {
  try {
    await fastify.listen(port);
    console.log(`listening on port ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();

// Poll database for zebra printers
// and check their availability
if (constants.disableMonitor) {
  fastify.log.info('zebra printer monitoring is disabled');
} else {
  fastify.log.info('zebra printer monitoring is enabled');
  monitorZebra.start();
}
