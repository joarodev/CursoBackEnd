const { Router } = require("express")
const {getProduct, getProductId, addProduct, updateProduct, deleteProduct} = require("../controllers/product.controller")
const { passportAuth } = require("../jwt/passport-jwt")

const routerProduct = Router()

routerProduct.get(
    '/products',
    passportAuth('jwt', { session: false }),
    getProduct)

routerProduct.get("/:pid", getProductId)

routerProduct.post("/", addProduct)

routerProduct.put("/:pid", updateProduct)

routerProduct.delete("/:pid", deleteProduct)

module.exports = routerProduct