import assert from "assert";
import Fastify from "fastify";
import helmet from "fastify-helmet";
import cors from "fastify-cors";
import cookie from "fastify-cookie";
import server from "$/$server";
import auth from "$/fastify-plugins/auth";
import { logger } from "$/service/logger";

export const init = () => {
  const fastify = Fastify({
    logger,
  });
  const {
    CORS_ORIGIN,
    API_BASE_PATH,
    API_COOKIE_SECRET,
    API_JWT_SECRET,
  } = process.env;
  assert(API_COOKIE_SECRET, "API_COOKIE_SECRET");
  assert(API_JWT_SECRET, "API_JWT_SECRET");

  void fastify.register(helmet);
  void fastify.register(cors, {
    origin: !CORS_ORIGIN ? false : CORS_ORIGIN === "true" ? true : CORS_ORIGIN,
    credentials: true,
  });
  void fastify.register(cookie, {
    secret: API_COOKIE_SECRET,
  });
  void fastify.register(auth, {
    secret: API_JWT_SECRET,
  });

  fastify.route({
    url: "/_healthcheck",
    method: "GET",
    schema: {
      response: {
        200: {
          type: "object",
          properties: { status: { type: "string" } },

          required: ["status"],
        },
      },
    },
    handler: async (_req, reply) => {
      await reply.code(200).send({ status: "ok" });
    },
  });

  server(fastify, { basePath: API_BASE_PATH });
  return fastify;
};
