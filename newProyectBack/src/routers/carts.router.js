const { Router } = require("express");

const {get,
    getById,
    create,
    addProduct,
    addProductArray,
    deleteProduct,
    deleteAllProducts,
    cartPurchase} = require("../controllers/cart.controller");
const passport = require("passport");
const { isUser } = require("../middlewares/auth.middlewares");

const cartRouter = Router()

cartRouter
    //obtener carritos
    .get('/', get)
    //obtener carrito
    .get('/:cid', getById)
    //crear carrito
    .post('/', create)
    //añadir producto al carrito
    .put(
        '/:cid/product/:pid',
        passport.authenticate("current", { session: false }),
        isUser,
        addProduct)
    //
    .put(
        '/:cid', 
        passport.authenticate("current", { session: false }),
        isUser,
        addProductArray)
    // Borrar producto del carrito
    .delete(
        '/:cid/product/:pid', 
        passport.authenticate("current", { session: false }),
        isUser,
        deleteProduct)
    // Vaciar carrito
    .delete(
        '/:cid', 
        passport.authenticate("current", { session: false }),
        isUser,
        deleteAllProducts)
    .post(
        "/:cid/pucharse",
        passport.authenticate("current", { session: false }),
        isUser,
        cartPurchase
        )

module.exports = cartRouter