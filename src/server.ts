import constants from './constants';
import fastify from './fastify';
import { startMonitoring } from './monitorZebra';

fastify.log.info({
    ...constants,
    accessToken: '***',
});

// Run the server!
const start = async () => {
    try {
        await fastify.listen(constants.port);
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
