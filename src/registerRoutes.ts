import { FastifyInstance } from "fastify";

import constants from "./constants";
import { printHttp, printTcp } from "./print";
import roc from "./roc/roc";
import { pstprntSchema, printersSchema, PstprntQuery } from "./schemas";

export default function registerRoutes(fastify: FastifyInstance) {
  fastify.post<{
    Querystring: PstprntQuery;
    Body: string;
  }>(
    "/pstprnt",
    {
      schema: pstprntSchema,
    },
    async (request, reply) => {
      const mac = request.query.mac;
      const data = await roc.getView("printServerByMacAddress", {
        key: mac,
      });
      if (!data.length) {
        return reply.code(404).send("mac address not found");
      }
      const content = data[0].$content;
      try {
        if (constants.protocol === "tcp") {
          await printTcp(content.ip, request.body);
          await reply.send({ ok: true });
        } else {
          await printHttp(content.url, request.body);
        }
      } catch (e) {
        return reply.send({ ok: false });
      }
      await reply.send({ ok: true });
    }
  );

  fastify.get(
    "/printers",
    {
      schema: printersSchema,
    },
    async (request, reply) => {
      return reply.send({ hello: "world" });
    }
  );
}
