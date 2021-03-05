import type { FaqInfo, FaqUpdate } from "$/types/faq";

export type Methods = {
  get: {
    resBody: FaqInfo;
  };
  patch: {
    reqBody: FaqUpdate;
    resBody: FaqInfo;
  };
  delete: {};
};
