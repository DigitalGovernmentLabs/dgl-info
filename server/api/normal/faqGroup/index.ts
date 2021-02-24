import { FaqGroupCreate, FaqGroupInfo } from "$/types/faq";

export type Methods = {
  get: {
    resBody: FaqGroupInfo[];
  };
  post: {
    reqBody: FaqGroupCreate;
  };
  /**
   * id がどういう順に並んでほしいかを指定する
   */
  patch: {
    reqBody: {
      newIdOrder: FaqGroupInfo["id"][];
    };
  };
};
