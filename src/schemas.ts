import { Static, Type } from '@sinclair/typebox';

export const pstprntSchema = {
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

export type PstprntQuery = Static<typeof pstprntSchema.querystring>;

export const printersSchema = {
    querystring: Type.Object({
        type: Type.String(),
    }),
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

export type PrintersQuery = Static<typeof printersSchema.querystring>;

export const printInterpolateSchema = {
    description: 'Prints a label',
    body: Type.Object({
        printer: Type.String({
            description: 'The id of the printer to print to',
        }),
        format: Type.String({
            description: 'The id of the template format to print with',
        }),
        data: Type.Any({
            description: 'The data to interpolate into the template',
        }),
    }),
    response: {
        200: Type.Object({
            ok: Type.Boolean(),
        }),
    },
};

export type PrintInterpolateBody = Static<typeof printInterpolateSchema.body>;
