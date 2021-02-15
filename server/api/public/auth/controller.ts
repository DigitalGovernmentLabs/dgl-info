import crypto from "crypto";
import assert from "assert";
import { getRepository } from "typeorm";
import argon2 from "argon2";
import { defineController } from "./$relay";
import { User } from "$/entity/User";
import { rules } from "$/service/form";

export default defineController(() => ({
  get: ({ user }) => ({
    status: 200,
    body: {
      user,
    },
  }),
  post: async ({ jwtSign, setAuthCookie, body: { userName, password } }) => {
    const { FIRST_ROOT_PASSWORD } = process.env;
    {
      const ok = rules.isPassword(FIRST_ROOT_PASSWORD || "");
      if (ok !== true) throw new Error(`FIRST_ROOT_PASSWORD: ${ok}`);
    }
    assert(FIRST_ROOT_PASSWORD, "FIRST_ROOT_PASSWORD non-null");
    const userRepository = getRepository(User);
    const tryRootLogin = async () => {
      if (
        password.length === FIRST_ROOT_PASSWORD.length &&
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
      return {
        status: 400,
        body: { errorMessage: "ルートログインに失敗しました。" },
      } as const;
    };
    const tryNormalLogin = async () => {
      const user = await userRepository.findOne({
        where: {
          name: userName,
        },
        select: ["id", "name", "isAdmin", "passwordHash"],
      });
      if (!user) {
        return {
          status: 400,
          body: {
            errorMessage: "該当のユーザ名は存在しません。",
          },
        } as const;
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
      } else {
        return {
          status: 400,
          body: {
            errorMessage: "ユーザ名、もしくはパスワードが間違っています。",
          },
        } as const;
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
