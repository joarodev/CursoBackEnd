/* //Arquitectura por capas
//Capa de servicios

const UserManagerDao = require("../manager/mongo/user.mongo");
const ProductDaoMongo = require("../manager/mongo/product.mongo")
//traer una instancia de los daos

const ProductDaoMemory = require("../manager/archivo/productsManager")


const userService = new UserManagerDao()

//persistencia

//mongo
//const productService = new ProductDaoMongo()
//file
const productService = new ProductDaoMemory() */


//instancia la persistencia
const { ContactDao, ProductDao, UserDao } = require("../manager/factory")

const contactService = new ContactDao
const userService = new UserDao
const productService = new ProductDao


module.export = {userService, productService, contactService}

