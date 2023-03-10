import process from 'process';

import constants from './constants';
import { getFastify } from './fastify';
import { startMonitoring } from './monitorZebra';

// Run the server!
const start = async () => {
    const fastify = await getFastify();
    fastify.log.info({
        ...constants,
        accessToken: '***',
    });
    // Poll database for zebra printers
    // and check their availability
    if (constants.disableMonitor) {
        fastify.log.info('zebra printer monitoring is disabled');
    } else {
        fastify.log.info('zebra printer monitoring is enabled');
        const stopMonitoring = await startMonitoring();
        fastify.addHook('onClose', async () => {
            // TODO: this is actually not called after a SIGINT but it's unclear why
            // Does fastify exit on SIGINT?
            stopMonitoring();
        });
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
