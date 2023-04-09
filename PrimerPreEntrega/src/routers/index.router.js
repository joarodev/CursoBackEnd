const {Router}  = require ('express')
const products = require ('./products.router.js')
const carts = require ('./cart.router.js')

const router = Router()

router.use("/products", products)
router.use("/cart", carts)


module.exports = router