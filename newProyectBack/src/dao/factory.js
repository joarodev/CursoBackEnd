const config = require("../config/configServer");

let UserDao
let ProductDao

switch (config.persistence) {
    case "MONGO":
        
        config.connectDB()
        const ProductDaoMongo = require("../dao/mongo/product.mongo")
        const UserDaoMongo = require("../dao/mongo/user.mongo")

        UserDao = UserDaoMongo
        ProductDao = ProductDaoMongo
        
        break;

    case "MEMORY":
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