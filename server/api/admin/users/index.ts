import { UserInfo } from "$/types/user";

export type Methods = {
  get: {
    resBody: UserInfo[];
  };
  post: {
    resBody: UserInfo;
    reqBody: {
      userName: string;
      password: string;
      isAdmin: boolean;
    };
  };
};
