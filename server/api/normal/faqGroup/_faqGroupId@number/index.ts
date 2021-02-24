import type { FaqGroupInfo, FaqGroupUpdate } from "$/types/faq";

export type Methods = {
  get: {
    resBody: FaqGroupInfo;
  };
  patch: {
    reqBody: FaqGroupUpdate;
  };
  delete: {};
};
