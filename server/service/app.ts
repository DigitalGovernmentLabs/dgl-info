import path from "path";
import Fastify from "fastify";
import helmet from "fastify-helmet";
import cors from "fastify-cors";
import fastifyStatic from "fastify-static";
import fastifyJwt from "fastify-jwt";
import server from "$/$server";

export const init = () => {
  const fastify = Fastify();

  void fastify.register(helmet);
  void fastify.register(cors, {
    origin: process.env.CORS_ORIGIN || "*",
  });
  void fastify.register(fastifyStatic, {
    root: path.join(__dirname, "public"),
    prefix: process.env.API_BASE_PATH,
  });
  void fastify.register(fastifyJwt, {
    secret: process.env.API_JWT_SECRET ?? "",
  });
  server(fastify, { basePath: process.env.API_BASE_PATH });
  return fastify;
};
