import fastifyCors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import fastify from 'fastify';

import pkg from '../package.json';

import constants from './constants';
import registerRoutes from './registerRoutes';

const serviceDescription = `
Web service for sending print jobs to Zebra printers. The service is connected to a backend which manages printers and their associated label and print formats, and monitors which printers are ready to receive print jobs and which are not.

The service only allows to get the list of available printers and send print jobs, not to manage printers or layout formats.
`;

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
                description: serviceDescription,
            },
            host: constants.host,
            basePath: constants.basePath,
            tags: [
                {
                    name: 'list',
                    description: 'List printers and formats',
                },
                {
                    name: 'print',
                    description: 'Send print jobs',
                },
            ],
        },
    });

    await instance.register(swaggerUi, {
        routePrefix: '/documentation',
        uiConfig: {
            docExpansion: 'full',
            deepLinking: false,
            defaultModelExpandDepth: 2,
            filter: false,
        },
    });

    registerRoutes(instance);

    return instance;
});

export async function getFastify() {
    return instancePromise;
}
