import fastifyCors from '@fastify/cors';
import fastify from 'fastify';

import registerRoutes from './registerRoutes';

const instance = fastify({
    logger: true,
    // ajv: {
    //     customOptions: {
    //         strict: 'log',
    //         keywords: ['kind', 'modifier'],
    //     },
    // },
});

void instance.register(fastifyCors);

registerRoutes(instance);

export default instance;
