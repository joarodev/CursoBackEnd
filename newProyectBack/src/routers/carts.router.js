const { Router } = require("express");

const {get,
    getCartById,
    create,
    addProduct,
    addProductArray,
    deleteProduct,
    deleteAllProducts,
    cartPurchase} = require("../controllers/cart.controller");
const passport = require("passport");
const { isUser, isUserOrAdmin } = require("../middlewares/auth.middlewares");
const { authorization } = require("../jwt/passport-jwt");

const cartRouter = Router()

cartRouter
    //obtener carritos
    .get('/', get)
    //obtener carrito
    .get(
        '/:cid',
        passport.authenticate("jwt", { session: false }),
        getCartById)
    //crear carrito
    .post('/:uid', create)
    //añadir producto al carrito
    .put(
        '/:cid/product/:pid',
        passport.authenticate("jwt", { session: false }),
        addProduct)
    //
    .put(
        '/:cid', 
        passport.authenticate("jwt", { session: false }),
        addProductArray)
    // Borrar producto del carrito
    .delete(
        '/:cid/product/:pid', 
        passport.authenticate("jwt", { session: false }),
        deleteProduct)
    // Vaciar carrito
    .delete(
        '/:cid', 
        passport.authenticate("jwt", { session: false }),
        deleteAllProducts)

    .post(
        "/:cid/pucharse",
        passport.authenticate("jwt", { session: false }),
        authorization("admin"),
        cartPurchase)
        

module.exports = cartRouter