const { Router } = require("express");

const {get,
    getById,
    create,
    addProduct,
    addProductArray,
    deleteProduct,
    deleteAllProducts} = require("../controllers/cart.controller");

const cartRouter = Router()

cartRouter
    .get('/', get)
    .get('/:cid', getById)
    .post('/', create)
// Add product to Cart
    .put('/:cid/product/:pid', addProduct)
// Add product array to Cart
    .put('/:cid', addProductArray)
// delete a product in the Cart
    .delete('/:cid/product/:pid', deleteProduct)
// delete all products in the Cart
    .delete('/:cid', deleteAllProducts)

module.exports = cartRouter