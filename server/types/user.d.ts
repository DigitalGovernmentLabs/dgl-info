export type UserInfo = {
  id: number;
  name: string;
  isAdmin: boolean;

  // SECURITY NOTE: user を渡すだけで楽するのは問題ないが、確実に明示的に消す。
  password?: undefined;
  passwordHash?: undefined;
};

export type UserJwtPayload = UserInfo;
