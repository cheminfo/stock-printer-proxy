import fastifyCors from '@fastify/cors';
import fastify from 'fastify';

import registerRoutes from './registerRoutes';

const instance = fastify({ logger: true });

void instance.register(fastifyCors);

registerRoutes(instance);

export default instance;
