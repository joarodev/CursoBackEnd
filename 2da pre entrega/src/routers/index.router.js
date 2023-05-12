const {Router}  = require ('express')
const products = require ('./products.router')
const carts = require ('./cart.router')
const cookie = require("./coockies.router")


const router = Router()

router.use("/products", products)
router.use("/carts", carts)
router.use("/cookie", cookie)


module.exports = router