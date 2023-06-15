const {Router} = require("express")
const { uploader } = require("../utils/multer")
//Routes
const routerProduct = require("./product.router")
const routerSession = require("./session.router")
const routerUser = require("./user.router")
const routerViews = require("./views.routrer")


const routerIndex = Router()

routerIndex.use("/api/product", routerProduct)
routerIndex.use("/api/session", routerSession)
routerIndex.use("/api/user", routerUser)
routerIndex.use("/", routerViews)

routerIndex.post("/upload", uploader.single("myFile"), (req, res) =>{
    res.send({
        status: "success",
        message: "Archivo subido correctamente"
    })
})

module.exports = routerIndex