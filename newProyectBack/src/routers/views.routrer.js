const {Router} = require("express")
//const { loginView, registerView, productView, errorView } = require("../controllers/views.controller")

const routerViews = Router()

routerViews.get("/login", (req, res) =>{
    res.render("loginView", {
        style: "index.css"
    })
})
routerViews.get("/register", (req, res) =>{
    res.render("registerView", {
        style: "index.css"
    })
})
routerViews.get("/api/product/products", (req, res) =>{
    res.render("productView", {
        style: "index.css"
    })
})
routerViews.get("/error", (req, res) =>{
    res.render("errorView", {
        style: "index.css"
    })
})
routerViews.get("/reset-password", (req, res) => {
    res.render("reqEmail")
})
routerViews.get("/create-product", (req, res) => {
    res.render("createProd")
})

/* routerViews.get("/reset-password:token", (req, res) => {
    res.render("resetPassword")
}) */

module.exports = routerViews