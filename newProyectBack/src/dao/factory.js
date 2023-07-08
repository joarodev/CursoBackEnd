const { envConfig } = require("../config/config");
const config = require("../config/configServer");

let CartDao
let UserDao
let ProductDao
let TicketDao

console.log(envConfig.PERSISTENCE)

switch (envConfig.PERSISTENCE) {
    case "production":
        
        config.connectDB()
        const {ProductDaoMongo} = require("../dao/mongo/product.mongo")
        const UserDaoMongo = require("../dao/mongo/user.mongo")
        const CartDaoMongo = require("../dao/mongo/cart.mongo")
        const TicketDaoMongo = require("../dao/mongo/ticket.mongo")

        UserDao = UserDaoMongo
        ProductDao = ProductDaoMongo
        CartDao = CartDaoMongo
        TicketDao = TicketDaoMongo
    break;

    case "development":
        const ProductDaoMemory = require("../dao/memory/product.memory")
        const UserDaoMemory = require("../dao/memory/user.memory")
        /* const CartDaoMemory = require("../dao/memory/cart.memory")    
        const TicketDaoMemory = require("../dao/memory/ticket.memory")  */       

        UserDao = UserDaoMemory
        ProductDao = ProductDaoMemory
        /* CartDao = CartDaoMemory
        TicketDao = TicketDaoMemory */
    break;

    default:
        break;
}

module.exports = {
    UserDao,
    ProductDao,
    CartDao,
    TicketDao
}