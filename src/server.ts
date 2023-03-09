import fastifyGracefulShutdown from 'fastify-graceful-shutdown';

import constants from './constants';
import { getFastify } from './fastify';
import { startMonitoring } from './monitorZebra';

// Run the server!
const start = async () => {
    const fastify = await getFastify();

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

    // Poll database for zebra printers
    // and check their availability
    if (constants.disableMonitor) {
        fastify.log.info('zebra printer monitoring is disabled');
    } else {
        fastify.log.info('zebra printer monitoring is enabled');
        void startMonitoring();
    }

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
