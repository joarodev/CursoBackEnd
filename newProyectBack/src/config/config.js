const {commander} = require("../utils/commander")
const { NODE_ENV } = require('../utils/persistence')
const { mode } = commander.opts()

require('dotenv').config({
    path: `.env.${mode}`
})

console.log("NODE ENV TRAE: " + NODE_ENV)
console.log(mode)
console.log(mode)

const envConfig = {

    /* SERVER */
    PORT: process.env.PORT,
    HOST_URL:  process.env.HOST_URL,
    PERSISTENCE: mode,

/* DATABASE */
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
    DATABASE_USERNAME: process.env.DATABASE_USERNAME,

/* GITHUB */
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GITHUB_CALLBACK_URL: process.env.GIT_CALLBACKURL,

/* ADMIN */
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,

/* PASSPORT */
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY
}

module.exports = {envConfig}