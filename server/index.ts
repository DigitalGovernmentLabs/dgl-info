import { run } from './$app'
import {
  SERVER_PORT,
  BASE_PATH,
  CORS_ORIGIN,
  TYPEORM_HOST,
  TYPEORM_USERNAME,
  TYPEORM_PASSWORD,
  TYPEORM_DATABASE,
  TYPEORM_PORT
} from './service/envValues'

run({
  port: Number(SERVER_PORT),
  basePath: BASE_PATH,
  cors: { origin: CORS_ORIGIN || '*' },
  typeorm: {
    type: 'mysql',
    host: TYPEORM_HOST,
    username: TYPEORM_USERNAME,
    password: TYPEORM_PASSWORD,
    database: TYPEORM_DATABASE,
    port: Number(TYPEORM_PORT),
    migrationsRun: true,
    synchronize: false,
    logging: false
  }
})
