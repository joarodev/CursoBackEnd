const {Router}  = require ('express')
const { routerViews } = require('./views.handlebars')
const {routerProd} = require ('./products.router')
const {routerCart} = require ('./cart.router')
const {routerUser} = require("./user.router")
const { routerSession } = require("./session.router")
const { uploader } = require('../utils/multer')
const {routAvanzado} = require("../routers/routAvanzado")

//Router avanzado
const {UserRouter} = require("./user.router")


const router = Router()

//Router avanzado
router.use("/usersRouter", UserRouter.getRouter())

router.use("/routAvanzado", routAvanzado)
router.use("/", routerViews)
router.use("/products", routerProd)
router.use("/carts", routerCart)
router.use("/users", routerUser)
router.use("/session", routerSession)
router.post("/upload", uploader.single("myFile"), (req, res) => {
    res.send({
        status: 'successs', 
        mensaje: 'Archivo subido con éxitos'
    })
})


module.exports = router