const { connect } = require("mongoose")
const { orderModel } = require("../manager/mongo/models/order.model")
const { orders } = require("./orders")

let url = "mongodb+srv://joarodDB:JoaRodDB3333@cluster0.rmh4eh5.mongodb.net/productsApp?retryWrites=true&w=majority"


module.exports = { 

    privateKey: "privateKey123",

    jwt_secret_key: "palabaJwtSecreto",
    connectDB: async () => {
        try {
            connect(url)
            console.log("Base de datos conectada")
            
            /* const resultOrders = await orderModel.aggregate([
                //pasos
                {
                    //paso 1
                    $match: {category: "watch"}
                },
                {
                    //paso 2
                    $group: {_id: "$name", totalQuantity: {$sum: "$quantity"}, totalPrice: {$sum: {$multiply: [ "$price", "$quantity" ]}}}
                }
            ]) */
/* 
            const resultOrders = await orderModel.aggregate([
                //pasos
                {
                    //paso 1
                    $match: {category: "phone"}
                },
                {
                    //paso 2
                    $group: {_id: "$name", totalQuantity: {$sum: "$quantity"}, totalPrice: {$sum: {$multiply: [ "$price", "$quantity" ]}}}
                },
                {
                    $sort: { totalQuantity: -1 }
                },
                {
                    $group: { _id: 1, orders: { $push: "$$ROOT" } }
                },
                {
                    $proyect: { 
                        "_id": 0,
                        orders: "$orders"
                    }
                },
                {
                    $merge: {  
                        into: "reportes"
                    }
                }
            ]) */

        } catch (err) {
            console.log(err)
        }
    }
}