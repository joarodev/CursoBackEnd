//Arquitectura por capas -> Conecto la persistencia de factory con el Repository creando el servicio

//factory
const { UserDao, ProductDao } = require("../dao/factory");
//Repository
const ProductRepository = require("../repositories/product.repository");
const UserRepository = require("../repositories/user.repository");

//Persistencias control
const userService = new UserRepository(new UserDao())
const productService = new ProductRepository(new ProductDao())

module.export = {userService, productService}

