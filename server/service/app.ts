import path from "path";
import assert from "assert";
import Fastify from "fastify";
import helmet from "fastify-helmet";
import cors from "fastify-cors";
import fastifyStatic from "fastify-static";
import fastifyCookie from "fastify-cookie";
import server from "$/$server";

export const init = () => {
  const fastify = Fastify();
  const { CORS_ORIGIN, API_BASE_PATH, API_COOKIE_SECRET } = process.env;
  assert(CORS_ORIGIN, "CORS_ORIGIN");
  assert(API_BASE_PATH, "API_BASE_PATH");
  assert(API_COOKIE_SECRET, "API_COOKIE_SECRET");

  void fastify.register(helmet);
  void fastify.register(cors, {
    origin: CORS_ORIGIN,
  });
  void fastify.register(fastifyStatic, {
    root: path.join(__dirname, "public"),
    prefix: API_BASE_PATH,
  });
  void fastify.register(fastifyCookie, {
    secret: API_COOKIE_SECRET,
  });
  server(fastify, { basePath: API_BASE_PATH });
  return fastify;
};
