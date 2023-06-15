const {routerProduct} = require("express")
const {getProduct, getProductId, addProduct, updateProduct, deleteProduct} = require("../controllers/product.controller")

const routerProduct = Router()

routerProduct.get("/", getProduct)
routerProduct.get("/:pid", getProductId)
routerProduct.post("/", addProduct)
routerProduct.put("/:pid", updateProduct)
routerProduct.delete("/:pid", deleteProduct)

module.exports = routerProduct