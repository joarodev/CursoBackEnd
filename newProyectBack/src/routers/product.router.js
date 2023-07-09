const { Router } = require("express")
const {ProductController} = require("../controllers/product.controller")
const { passportAuth } = require("../jwt/passport-jwt")
const passport = require("passport")
const { isAdmin } = require("../middlewares/auth.middlewares")

const products = new ProductController()

const routerProduct = Router()

routerProduct.get(
    '/products',
    passportAuth('jwt', { session: false }),
    products.getProducts)

routerProduct.get("/:pid",
    passport.authenticate('jwt', { session: false }),
    products.getProduct)

routerProduct.post(
    "/",
    products.addProduct)

routerProduct.put(
    "/:pid",
    products.updateProduct)

routerProduct.delete(
    "/:pid",
    passport.authenticate("current", {session: false}),
    isAdmin,
    products.deleteProduct)

routerProduct.get(
    "/mockingproducts’"
)

module.exports = routerProduct