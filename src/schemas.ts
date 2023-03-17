import { Static, Type } from '@sinclair/typebox';
import { FastifySchema } from 'fastify';

export const pstprntSchema = {
    description: 'Forward a ZPL command to the specified printer.',
    tags: ['print'],
    querystring: Type.Object({
        mac: Type.String(),
    }),
    // Client must pass text/plain in Content-Type header
    body: Type.String(),
    response: {
        200: Type.Object({
            ok: Type.Boolean(),
        }),
    },
};

export const getPrintSchema = {
    description: `Send a print job through a GET request. The data can either be passed as a serialized JSON object in the "json" parameter, or encoded as different parameters in the query string.
        Example: \`/print?type=sample&json=%7B%22foo%22%3A%22one%22%2C%22bar%22%3A%22two%22%7D\` is equivalent to \`/print?type=sample&foo=one&bar=two\``,
    tags: ['print'],
    querystring: Type.Object(
        {
            type: Type.String({
                description: 'The type of data you would like printed.',
            }),
            json: Type.Optional(
                Type.String({
                    description: 'The data to print, as a JSON string.',
                }),
            ),
        },
        { additionalProperties: true },
    ),
};

export type PstprntQuery = Static<typeof pstprntSchema.querystring>;
export type GetPrintQuery = Static<typeof getPrintSchema.querystring>;

const queryStringSchema = Type.Object({
    type: Type.String(),
});

export const printersSchema: FastifySchema = {
    description:
        'Returns a list of printer-format pairs, along with an example of data which is valid for that format. Only online and available printers are returned.',
    tags: ['list'],
    querystring: queryStringSchema,
    response: {
        200: Type.Array(
            Type.Object({
                printer: Type.Object({
                    id: Type.String(),
                    name: Type.String(),
                }),
                format: Type.Object({
                    id: Type.String(),
                    name: Type.String(),
                    example: Type.Any({
                        description:
                            'An example of data which can be passed to the print endpoint',
                    }),
                }),
            }),
        ),
    },
};

export type PrintersQuery = Static<typeof queryStringSchema>;

const printInterpolateBody = Type.Object({
    printer: Type.String({
        description: 'The id of the printer to print to',
    }),
    format: Type.String({
        description: 'The id of the template format to print with',
    }),
    data: Type.Any({
        description: 'The data to interpolate into the template',
    }),
});

export const printInterpolateSchema: FastifySchema = {
    description:
        "Prints a label on the specified printer, using the specified format (aka layout). The passed data is used to interpolate the final ZPL command to send from the format's template.",
    tags: ['print'],
    body: printInterpolateBody,
    response: {
        200: Type.Object({
            ok: Type.Boolean(),
        }),
    },
};

export type PrintInterpolateBody = Static<typeof printInterpolateBody>;
