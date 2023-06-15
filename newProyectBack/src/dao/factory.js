const config = require("../config/configServer");

let UserDao
let ProductDao

switch (config.persistence) {
    case "MONGO":
        
        config.connectDB()
        const ProductDaoMongo = require("../dao/product.mongo")
        const UserDaoMongo = require("../dao/user.mongo")

        
        break;
        
        case "FILE":
        const ProductDaoMongo = require("../dao/file/product.memory")
        const UserDaoMongo = require("../dao/file/user.memory")    

            UserDao = UserDaoMongo
            ProductDao = ProductDaoMongo
            break;

    case "MEMORY":
        const ProductDaoMongo = require("../dao/memory/product.memory")
        const UserDaoMongo = require("../dao/memory/user.memory")    

            UserDao = UserDaoMongo
            ProductDao = ProductDaoMongo
    break;

    default:
        break;
}

module.exports = {
    UserDao,
    ProductDao
}