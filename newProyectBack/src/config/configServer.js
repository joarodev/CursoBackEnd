const { connect } = require("mongoose")
const { envConfig } = require("./config")

//.env
//require("dotenv").config


//commander
/* const {commander} = require("../utils/commander")
const { mode } = commander.opts()

dotenv.config({
    path: mode === "development" ? "./env.development" : "./.env.production"
}) */


let url = envConfig.DATABASE_URL

module.exports = {
    privateKey: envConfig.PRIVATE_KEY,

    connectDB: async () => {
        try {
            connect(url)
            console.log("Base de datos conectada")

        } catch (err) {
            console.log(err)
        }
    },
}