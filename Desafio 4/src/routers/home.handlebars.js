const { Router } = require("express")

const ProductManager = require('../manager/productsManager')
const productsList = new ProductManager('./src/products.json')

const router = Router()

router.get("/", (req, res)=>{
    res.render(`home`, { products: productsList.getProducts() })
})

module.exports = router