import crypto from "crypto";
import assert from "assert";
import { getRepository } from "typeorm";
import argon2 from "argon2";
import { defineController } from "./$relay";
import { User } from "$/entity/User";

export default defineController(() => ({
  get: ({ user }) => ({
    status: 200,
    body: {
      user,
    },
  }),
  post: async ({ jwtSign, setAuthCookie, body: { userName, password } }) => {
    const { FIRST_ROOT_PASSWORD } = process.env;
    assert(FIRST_ROOT_PASSWORD);
    const userRepository = getRepository(User);
    const tryRootLogin = async () => {
      if (
        crypto.timingSafeEqual(
          Buffer.from(password),
          Buffer.from(FIRST_ROOT_PASSWORD),
        )
      ) {
        const token = await jwtSign({
          id: -1,
          name: "$root",
          isAdmin: true,
        });
        void setAuthCookie(token);
        return { status: 200 } as const;
      }
      return { status: 400 } as const;
    };
    const tryNormalLogin = async () => {
      const user = await userRepository.findOne({
        where: {
          name: userName,
        },
      });
      if (!user) {
        return { status: 400 } as const;
      }
      if (
        await argon2.verify(user.passwordHash, password, {
          type: argon2.argon2id,
        })
      ) {
        const token = await jwtSign({
          id: user.id,
          name: user.name,
          isAdmin: user.isAdmin,
        });
        void setAuthCookie(token);
      }
      return { status: 200 } as const;
    };
    const isNoAdmin =
      (await userRepository.count({ where: { isAdmin: true } })) === 0;
    if (isNoAdmin && userName === "$root") {
      return await tryRootLogin();
    }
    return await tryNormalLogin();
  },
  delete: ({ deleteAuthCookie }) => {
    void deleteAuthCookie();
    return {
      status: 200,
    };
  },
}));
