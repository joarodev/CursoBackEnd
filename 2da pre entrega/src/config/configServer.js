const { connect } = require("mongoose")

let url = "mongodb+srv://joarodDB:joarodDB33@cluster0.rmh4eh5.mongodb.net/productsApp?retryWrites=true&w=majority"


module.exports = { 
    connectDB: () => {
        connect(url)
        console.log("Base de datos conectada")
    }
}