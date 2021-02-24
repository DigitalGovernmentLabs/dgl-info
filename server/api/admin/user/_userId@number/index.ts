import { UserInfo } from "$/types/user";

export type Methods = {
  get: {
    resBody: UserInfo;
  };
  patch: {
    resBody: UserInfo;
    reqBody: {
      userId: number;
      userName?: string;
      isAdmin?: boolean;
      password?: string;
    };
  };
  delete: {
    resBody: UserInfo;
    reqBody: {
      userId: number;
    };
  };
};
