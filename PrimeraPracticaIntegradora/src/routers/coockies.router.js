const { Router } = require("express") 
const { auth } = require("../middlewares/autentication.middleware")

const routerCookie = Router()

//session---------------------------------------------------------
routerCookie.get("/privada", auth, (res, req) => {
    //pruebas.router.js
})
//session---------------------------------------------------------

routerCookie.get("/Logout", auth, (res, req) => {
    //destruir las cookies
})
routerCookie.get("/", (req, res) =>{

    res.cookie("CoderCookie", "")

    res.render("cookies", )
})