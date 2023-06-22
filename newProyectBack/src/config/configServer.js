const { connect } = require("mongoose")

//.env
//require("dotenv").config
const dotenv = require("dotenv")

//commander
const {commander} = require("../utils/commander")
const {mode} = commander.opts()

dotenv.config({
    path: mode === "development" ? "./env.development" : "./.env.production"
})


let url = process.env.MONGO_URL_LOCAL

module.exports = { 

    port: process.env.PORT,
    persistence: process.env.PERSISTENCE,
    
    privateKey: process.env.JWT_SECRET_KEY,

    connectDB: async () => {
        try {
            connect(url)
            console.log("Base de datos conectada")

        } catch (err) {
            console.log(err)
        }
    },
}