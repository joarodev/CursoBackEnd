const { envConfig } = require("../config/config");
const config = require("../config/configServer");

let UserDao
let ProductDao

switch (envConfig.PERSISTENCE) {
    case "production":
        
        config.connectDB()
        const ProductDaoMongo = require("../dao/mongo/product.mongo")
        const UserDaoMongo = require("../dao/mongo/user.mongo")

        UserDao = UserDaoMongo
        ProductDao = ProductDaoMongo
        
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
    ProductDao
}