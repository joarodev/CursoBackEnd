//Arquitectura por capas -> Conecto la persistencia de factory con el Repository creando el servicio

//factory
const { UserDao, ProductDao, CartDao } = require("../dao/factory");
//Repository
const ProductRepository = require("../repositories/product.repository");
const UserRepository = require("../repositories/user.repository");
const CartRepository = require("../repositories/cart.repository");
//Persistencias control
const userService = new UserRepository(new UserDao())
const productService = new ProductRepository(new ProductDao())
const cartService = new CartRepository(new CartDao())

module.export = {userService, productService, cartService}

