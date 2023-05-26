const { Router } = require("express")

const ProductManager = require('../manager/archivo/productsManager')
const productsList = new ProductManager('./src/products.json')

const router = Router()

// LOGIN ------------------------------------------------------
router.get("/login", (req, res) =>{
    res.render("login", {
        style: "index.css"
    })
})
// LOGIN ------------------------------------------------------

// REGISTRO ------------------------------------------------------
router.get("/register", (req, res) =>{
    res.render("registerForm", {
        style: "index.css"
    })
})
router.post("/register", (req, res) => {
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password
    res.send({
        name,
        email,
        password,
        mensaje: "registro con exito"
    })
})
// REGISTRO ------------------------------------------------------
module.exports = router