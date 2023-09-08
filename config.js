const dotenv = require('dotenv')

dotenv.config({
  path: '.env',
  sample: '.env.default',
  allowEmptyValues: false
})

module.exports = {
  APP: {
    host: process.env.APP_HOST,
    port: process.env.APP_PORT,
    secretKey: process.env.APP_SECRET_KEY,
    secretKeyTimeOut: process.env.APP_SECRET_KEY_EXPIRES_IN,
  },
  DB: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_DATABASE_NAME,
    poolLimit: Number.parseInt(process.env.DB_POOL_LIMIT),
    appName: process.env.DB_APP_NAME,
    type: process.env.DB_TYPE
  },

  HASH: {
    algorithm: process.env.HASH_ALGORITHM,
    hash: process.env.HASH_CODE
  },

  FOLDER: process.env.UPLOAD_FOLDER_NAME,
}