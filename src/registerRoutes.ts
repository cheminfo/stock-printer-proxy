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
    GetPrintQuery,
    getPrintSchema,
} from './schemas';
import { twigInterpolateFormat } from './util/twig';

export default function registerRoutes(fastify: FastifyInstance) {
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
                        example: format.example(),
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

    fastify.get<{
        Querystring: GetPrintQuery;
    }>(
        '/print',
        {
            schema: getPrintSchema,
        },
        async (request, reply) => {
            const { json, type, ...otherProperties } = request.query;
            const formatPairs = await getPrinterFormatPairs(type);

            if (formatPairs.length === 0) {
                return reply.send(
                    'No printers are available for the given type.',
                );
            }
            const firstPair = formatPairs[0];

            const format = await getPrintFormat(firstPair.format.id());
            const printer = await getPrinter(firstPair.printer.id());
            const data = json
                ? {
                      ...otherProperties,
                      ...JSON.parse(json),
                  }
                : otherProperties;
            const printData = twigInterpolateFormat(format.$content, data);
            await print(printer.$content, printData);
            await reply.send(
                `Print job sent to ${printer.$content.name} using the ${format.$content.name} format.`,
            );
        },
    );

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
}
