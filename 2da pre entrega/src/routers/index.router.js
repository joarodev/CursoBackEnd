const {Router}  = require ('express')
const products = require ('./products.router')
const carts = require ('./cart.router')
const { uploader } = require('../utils/multer')
/* const cookie = require("./coockies.router") */


const router = Router()

router.use("/products", products)
router.use("/carts", carts)
router.post("/upload", uploader.single("myFile"), (req, res) => {
    res.send({
        status: 'successs', 
        mensaje: 'Archivo subido con éxitos'
    })

})
/* router.use("/cookie", cookie) */


module.exports = router