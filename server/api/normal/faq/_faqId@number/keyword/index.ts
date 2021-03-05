export type Methods = {
  post: {
    reqBody: {
      keyword: string;
    };
    resBody: {
      keywords: string[];
    };
  };
  delete: {
    reqBody: {
      keyword: string;
    };
    resBody: {
      keywords: string[];
    };
  };
};
