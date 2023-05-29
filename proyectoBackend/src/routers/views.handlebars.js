const { Router } = require("express")

const ProductManager = require('../manager/archivo/productsManager')
const productsList = new ProductManager('./src/products.json')

const routerViews = Router()

// LOGIN ------------------------------------------------------
routerViews.get("/", (req, res) =>{
    res.render("login", {
        style: "index.css"
    })
})
// LOGIN ------------------------------------------------------

// REGISTRO ------------------------------------------------------
routerViews.get("/register", (req, res) =>{
    res.render("registerForm", {
        style: "index.css"
    })
})
// REGISTRO ------------------------------------------------------

//Productos
routerViews.get("/products", (req, res) =>{
    res.render("products", {
        style: "index.css"
    })
})

//error
routerViews.get("/err", (req, res) =>{
    res.render("error", {
        style: "index.css"
    })
})

module.exports = {routerViews}