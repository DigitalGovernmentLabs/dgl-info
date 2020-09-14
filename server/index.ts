import 'reflect-metadata'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import { createConnection } from 'typeorm'
import server from './$server'
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
import ormOptions from './$orm'

const app = express()
app.use(helmet())
app.use(cors({ origin: CORS_ORIGIN || '*' }))

createConnection({
  type: 'mysql',
  host: TYPEORM_HOST,
  username: TYPEORM_USERNAME,
  password: TYPEORM_PASSWORD,
  database: TYPEORM_DATABASE,
  port: Number(TYPEORM_PORT),
  migrationsRun: true,
  synchronize: false,
  logging: false,
  ...ormOptions
}).then(() => server(app, { basePath: BASE_PATH }).listen(SERVER_PORT))
