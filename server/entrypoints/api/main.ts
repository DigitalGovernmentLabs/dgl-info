import "reflect-metadata";
import { createConnection } from "typeorm";
import ormOptions from "$/$orm";

import ormConfig from "$/ormconfig";
import { init } from "$/service/app";

const app = init();
const { API_SERVER_PORT } = process.env;

void createConnection({
  ...ormConfig,
  ...ormOptions,
}).then(() => app.listen(Number(API_SERVER_PORT || "3000")));
