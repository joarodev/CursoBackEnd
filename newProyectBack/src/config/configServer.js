const { connect } = require("mongoose")

//.env
//require("dotenv").config


//commander
/* const {commander} = require("../utils/commander")
const { mode } = commander.opts()

dotenv.config({
    path: mode === "development" ? "./env.development" : "./.env.production"
}) */


let url = "mongodb+srv://joarodDB:JoaRodDB3333@cluster0.rmh4eh5.mongodb.net/productsApp?retryWrites=true&w=majority"

module.exports = {
    port:8080,
    privateKey: "secretKey",

    connectDB: async () => {
        try {
            connect(url)
            console.log("Base de datos conectada")

        } catch (err) {
            console.log(err)
        }
    },
}