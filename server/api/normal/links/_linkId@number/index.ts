import { Link } from "$/types";

export type Methods = {
  patch: {
    reqBody: Link;
    status: 204;
  };
  delete: {
    status: 204;
  };
};
