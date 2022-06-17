import fastifyGracefulShutdown from 'fastify-graceful-shutdown';

import constants from './constants';
import fastify from './fastify';
import { startMonitoring } from './monitorZebra';

void fastify.register(fastifyGracefulShutdown);

fastify.log.info({
    ...constants,
    accessToken: '***',
});

fastify.after(() => {
    fastify.gracefulShutdown((_, next) => {
        next();
    });
});

// Run the server!
const start = async () => {
    try {
        await fastify.listen({
            port: constants.port,
            host: process.env.NODE_ENV === 'production' ? '0.0.0.0' : undefined,
        });
        fastify.log.info(`listening on port ${constants.port}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
void start();

// Poll database for zebra printers
// and check their availability
if (constants.disableMonitor) {
    fastify.log.info('zebra printer monitoring is disabled');
} else {
    fastify.log.info('zebra printer monitoring is enabled');
    void startMonitoring();
}
