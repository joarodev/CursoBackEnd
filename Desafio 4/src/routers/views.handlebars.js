const { Router } = require("express")

const ProductManager = require('../manager/productsManager')
const productsList = new ProductManager('./src/products.json')

const router = Router()

router.get("/", (req, res)=>{
    let testName={
        name: "JOAA"
    }
    res.render(`index`, testName)
})

router.get("/chat", (req, res)=>{
    res.render("chat", {})
})

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

module.exports = router