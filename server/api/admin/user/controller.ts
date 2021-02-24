import { getRepository } from "typeorm";
import argon2 from "argon2";
import { defineController } from "./$relay";
import { User } from "$/entity/User";
import { rules } from "$/service/form";

export default defineController(() => ({
  get: async () => {
    const userRepository = getRepository(User);
    const users = (await userRepository.find({})).map((user) => ({
      id: user.id,
      name: user.name,
      isAdmin: user.isAdmin,
    }));
    return { status: 200, body: users };
  },
  post: async ({ body: { userName, isAdmin, password } }) => {
    // 入力値のチェック
    if (rules.isUserName(userName) !== true) return { status: 400 };
    if (rules.isPassword(password) !== true) return { status: 400 };

    const userRepository = getRepository(User);
    const exist =
      (await userRepository.findOne({ name: userName })) !== undefined;
    if (exist) {
      return {
        status: 400,
        body: { errorMessage: "すでに存在しているユーザ名です。" },
      };
    }
    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id,
    });
    const user = userRepository.create({
      name: userName,
      isAdmin,
      passwordHash,
    });
    await userRepository.save(user);
    return {
      status: 201,
      body: {
        id: user.id,
        name: user.name,
        isAdmin: user.isAdmin,
      },
    };
  },
}));
