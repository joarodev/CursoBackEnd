const { envConfig } = require("../config/config");
const config = require("../config/configServer");

let CartDao
let UserDao
let ProductDao

switch (envConfig.PERSISTENCE) {
    case "production":
        
        config.connectDB()
        const ProductDaoMongo = require("../dao/mongo/product.mongo")
        const UserDaoMongo = require("../dao/mongo/user.mongo")
        const CartDaoMongo = require("../dao/mongo/cart.mongo")

        UserDao = UserDaoMongo
        ProductDao = ProductDaoMongo
        CartDao = CartDaoMongo
        
        break;

    case "development":
        const ProductDaoMemory = require("../dao/memory/product.memory")
        const UserDaoMemory = require("../dao/memory/user.memory")    

        UserDao = UserDaoMemory
        ProductDao = ProductDaoMemory
    break;

    default:
        break;
}

module.exports = {
    UserDao,
    ProductDao,
    CartDao
}