import { FastifyReply } from "fastify";
import fp from "fastify-plugin";
import jwt from "fastify-jwt";
import { UserJwtPayload } from "$/types/user";
import { authCookieName } from "$/const";

export type FastifyUserOption = {
  secret: string;
};

declare module "fastify-jwt" {
  interface FastifyJWT {
    payload: UserJwtPayload;
    user: UserJwtPayload | null;
  }
}

// eslint-disable-next-line require-await
export default fp(async (fastify, opts: FastifyUserOption) => {
  void fastify.register(jwt, {
    secret: opts.secret,
    cookie: {
      cookieName: authCookieName,
    },
  });

  const authCookieConfig = {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  } as const;

  fastify.decorateRequest("jwtSign", null);
  fastify.decorateRequest("decorateUser", null);
  fastify.decorateRequest("setAuthCookie", null);
  fastify.decorateRequest("deleteAuthCookie", null);

  // eslint-disable-next-line require-await
  fastify.addHook("onRequest", (request, reply, done) => {
    request.jwtSign = reply.jwtSign.bind(reply);
    request.decorateUser = async () => {
      request.user = null;
      try {
        await request.jwtVerify();
      } catch (err: unknown) {
        // ignore
      }
    };
    request.setAuthCookie = (token: string) => {
      void reply.setCookie(authCookieName, token, {
        ...authCookieConfig,
        maxAge: 60 * 60 * 24 * 30,
      });
    };
    request.deleteAuthCookie = () => {
      void reply.setCookie(authCookieName, "", {
        ...authCookieConfig,
        maxAge: 0,
      });
    };
    done();
  });
});

declare module "fastify" {
  interface FastifyRequest {
    decorateUser: () => void;
    jwtSign: FastifyReply["jwtSign"];
    setAuthCookie: (token: string) => void;
    deleteAuthCookie: () => void;
  }
}
