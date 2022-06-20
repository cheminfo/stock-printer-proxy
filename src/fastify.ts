import fastifyCors from '@fastify/cors';
import fastify from 'fastify';

import registerRoutes from './registerRoutes';

const instance = fastify({
    logger: true,
    // TODO: uncomment this when upgrading to fastify v4
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
