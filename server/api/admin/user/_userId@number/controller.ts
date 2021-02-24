import { getRepository } from "typeorm";
import argon2 from "argon2";
import { defineController } from "./$relay";
import { User } from "$/entity/User";
import { rules } from "$/service/form";

const patchUserName = (user: User, userName: string) => {
  if (!rules.isUserName(userName)) return { status: 400 } as const;
  user.name = userName;
};

const patchPassword = async (user: User, password: string) => {
  if (!rules.isPassword(password)) return { status: 400 } as const;
  user.passwordHash = await argon2.hash(password, {
    type: argon2.argon2id,
  });
};

export default defineController(() => ({
  get: async ({ params: { userId } }) => {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ id: userId });
    if (user === undefined) return { status: 404 };
    return {
      status: 200,
      body: {
        id: user.id,
        isAdmin: user.isAdmin,
        name: user.name,
      },
    };
  },
  patch: async ({ body }) => {
    const { userId } = body;
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ id: userId });
    if (user === undefined) {
      return { status: 400, body: { errorMessage: "User not found." } };
    }

    // NOTE: schema をおいていないので任意の入力が来ることを想定し、能動的なチェックを行う。

    if (typeof body.userName === "string") {
      const err = patchUserName(user, body.userName);
      if (err) return err;
    }

    if (typeof body.isAdmin === "boolean") {
      user.isAdmin = body.isAdmin;
    }

    if (typeof body.password === "string") {
      const err = await patchPassword(user, body.password);
      if (err) return err;
    }

    await userRepository.save(user);
    return {
      status: 200,
      body: {
        id: user.id,
        isAdmin: user.isAdmin,
        name: user.name,
      },
    };
  },
  delete: async ({ body: { userId } }) => {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ id: userId });
    if (user === undefined) {
      return { status: 400, body: { errorMessage: "User not found." } };
    }
    await userRepository.delete({ id: user.id });
    return {
      status: 200,
      body: {
        id: user.id,
        isAdmin: user.isAdmin,
        name: user.name,
      },
    };
  },
}));
