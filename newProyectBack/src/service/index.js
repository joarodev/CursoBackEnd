//Arquitectura por capas
//Capa de servicios

//Instancia de Mongo
const UserManagerDao = require("../dao/mongo/user.mongo");
const ProductDaoMongo = require("../dao/mongo/product.mongo");

const userService = new UserManagerDao()
const productService = new ProductDaoMongo()

//Instancia memory
const ProductDaoMemory = require("../dao/memory/product.memory");
//const productService = new ProductDaoMemory()

module.export = {userService, productService}

