const { Router } = require("express")
const {getProduct, getProductId, addProduct, updateProduct, deleteProduct} = require("../controllers/product.controller")
const { passportAuth } = require("../jwt/passport-jwt")
const passport = require("passport")
const { isAdmin } = require("../middlewares/auth.middlewares")

const routerProduct = Router()

routerProduct.get(
    '/products',
    passportAuth('jwt', { session: false }),
    getProduct)

routerProduct.get("/:pid", getProductId)

routerProduct.post(
    "/",
    passport.authenticate("current", {session: false}),
    isAdmin,
    addProduct)

routerProduct.put(
    "/:pid", 
    passport.authenticate("current", {session: false}),
    isAdmin,
    updateProduct)

routerProduct.delete(
    "/:pid",
    passport.authenticate("current", {session: false}),
    isAdmin,
    deleteProduct)

module.exports = routerProduct