import fastifyCors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import fastify from 'fastify';

import pkg from '../package.json';

import registerRoutes from './registerRoutes';

let instancePromise = Promise.resolve(
    fastify({
        logger: true,
        ajv: {
            customOptions: {
                strict: 'log',
                keywords: ['kind', 'modifier'],
            },
        },
    }),
).then(async (instance) => {
    void instance.register(fastifyCors);

    await instance.register(fastifySwagger, {
        swagger: {
            info: {
                title: 'Zebra printer proxy API',
                version: pkg.version,
            },
        },
    });

    await instance.register(swaggerUi, {
        routePrefix: '/documentation',
        uiConfig: {
            docExpansion: 'full',
            deepLinking: false,
            defaultModelExpandDepth: 2,
        },
    });

    registerRoutes(instance);

    return instance;
});

export async function getFastify() {
    return instancePromise;
}
