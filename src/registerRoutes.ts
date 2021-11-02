import { FastifyInstance } from 'fastify';

import { print } from './print';
import {
    getPrinter,
    getPrinterFormatPairs,
    getPrintFormat,
    getPrintServersByMacAddress,
} from './roc/printers';
import {
    pstprntSchema,
    printersSchema,
    PstprntQuery,
    PrintersQuery,
    printInterpolateSchema,
    PrintInterpolateBody,
} from './schemas';
import { twigInterpolateFormat } from './util/twig';

export default function registerRoutes(fastify: FastifyInstance) {
    fastify.post<{
        Querystring: PstprntQuery;
        Body: string;
    }>(
        '/pstprnt',
        {
            schema: pstprntSchema,
        },
        async (request, reply) => {
            const mac = request.query.mac;
            const data = await getPrintServersByMacAddress(mac);
            if (!data.length) {
                return reply.code(404).send('mac address not found');
            }
            const content = data[0].$content;
            try {
                await print(content, request.body);
            } catch (e) {
                return reply.send({ ok: false });
            }
            await reply.send({ ok: true });
        },
    );

    fastify.get<{
        Querystring: PrintersQuery;
    }>(
        '/printers',
        {
            schema: printersSchema,
        },
        async (request, reply) => {
            const printers = await getPrinterFormatPairs(request.query.type);
            await reply.send(
                printers.map(({ printer, format }) => ({
                    printer: {
                        id: printer.id(),
                        name: printer.name(),
                    },
                    format: {
                        id: format.id(),
                        name: format.name(),
                    },
                })),
            );
        },
    );

    fastify.post<{
        Body: PrintInterpolateBody;
    }>(
        '/print',
        {
            schema: printInterpolateSchema,
        },
        async (request, reply) => {
            try {
                const printer = await getPrinter(request.body.printer);
                const format = await getPrintFormat(request.body.format);
                const content = twigInterpolateFormat(
                    format.$content,
                    request.body.data,
                );
                await print(printer.$content, content);
                await reply.send({ ok: true });
            } catch (e) {
                fastify.log.error(e);
                await reply.send({ ok: false });
            }
        },
    );
}
