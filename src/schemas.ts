import { Static, Type } from "@sinclair/typebox";

export const pstprntSchema = {
  querystring: Type.Object({
    mac: Type.String(),
  }),
  // Client must pass text/plain in Content-Type header
  body: Type.String(),
};

export type PstprntQuery = Static<typeof pstprntSchema.querystring>;

export const printersSchema = {
  querystring: Type.Object({
    type: Type.String(),
  }),
};

export type PrintersQuery = Static<typeof printersSchema.querystring>;
