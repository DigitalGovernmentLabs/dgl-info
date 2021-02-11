import "reflect-metadata";
import { createConnection } from "typeorm";
import dotenv from "dotenv";
import ormOptions from "$/$orm";

import ormConfig from "$/ormconfig";
import { init } from "$/service/app";

dotenv.config();

const app = init();

void createConnection({
  ...ormConfig,
  ...ormOptions,
}).then(() => app.listen(Number(process.env.API_SERVER_PORT || "3000")));
