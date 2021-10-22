import fastify from 'fastify';
const instance = fastify({ logger: true });
import registerRoutes from './registerRoutes';
import fastifyCors from 'fastify-cors';

instance.register(fastifyCors);

registerRoutes(instance);

export default instance;
