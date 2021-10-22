import fastify from "fastify";
import fastifyCors from "fastify-cors";

import registerRoutes from "./registerRoutes";

const instance = fastify({ logger: true });

void instance.register(fastifyCors);

registerRoutes(instance);

export default instance;
