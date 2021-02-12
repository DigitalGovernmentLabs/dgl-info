import { UserJwtPayload } from "$/types/user";

export type Methods = {
  get: {
    resBody: {
      user: UserJwtPayload | null;
    };
  };
  // try login
  post: {
    reqBody: {
      userName: string;
      password: string;
    };
  };
  // logout
  delete: {};
};
