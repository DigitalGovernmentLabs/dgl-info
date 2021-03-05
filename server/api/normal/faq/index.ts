import type { FaqCreate, FaqInfo, FaqQuery, FaqQueryAnswer } from "$/types/faq";

export type Methods = {
  get: {
    query: FaqQuery;
    resBody: FaqQueryAnswer;
  };
  post: {
    reqBody: FaqCreate;
    resBody: FaqInfo;
  };
};
