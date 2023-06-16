const {Router} = require("express")
const { loginView, registerView, productView, errorView } = require("../controllers/views.controller")

const routerViews = Router()

routerViews.get("/login", loginView)
routerViews.get("register", registerView)
routerViews.get("/products", productView)
routerViews.get("/error", errorView)

module.exports = routerViews