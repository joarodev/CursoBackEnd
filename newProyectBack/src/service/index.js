//Arquitectura por capas
//Capa de servicios

const UserManagerDao = require("../manager/mongo/user.mongo");
const ProductDaoMongo = require("../manager/mongo/product.mongo");
//traer una instancia de los daos

const userService = new UserManagerDao()
const productService = new ProductDaoMongo()

//Instancia memory
const ProductDaoMemory = require("../dao/memory/product.memory");
//const productService = new ProductDaoMemory()

module.export = {userService, productService}

