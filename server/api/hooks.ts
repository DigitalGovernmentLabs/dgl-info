import { FastifyRequest } from "fastify";
import { defineHooks } from "./$relay";

export type AdditionalRequest = Pick<
  FastifyRequest,
  "jwtSign" | "setAuthCookie" | "deleteAuthCookie" | "user"
>;

export default defineHooks(() => ({
  preValidation: (req, _reply, done) => {
    req.decorateUser();
    done();
  },
}));
