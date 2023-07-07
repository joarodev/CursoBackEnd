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
    passportAuth('jwt', { session: false }),
    products.getProduct)

routerProduct.post(
    "/",
    passport.authenticate("current", {session: false}),
    isAdmin,
    products.addProduct)

routerProduct.put(
    "/:pid", 
    passport.authenticate("current", {session: false}),
    isAdmin,
    products.updateProduct)

routerProduct.delete(
    "/:pid",
    passport.authenticate("current", {session: false}),
    isAdmin,
    products.deleteProduct)

module.exports = routerProduct