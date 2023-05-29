//Session
const { auth } = require("../middlewares/autentication.middleware")
const { Router } = require("express")

//passport
const passport = require("passport")
const { createHash, isValidPassword } = require("../utils/bcryptHash")
const { generateToken } = require("../config/jwt")

//passport JWT
const { passportCall } = require("../passport-jwt/passport.config")
const { authorization } = require("../passport-jwt/passport.config")
const { userModel } = require("../manager/mongo/models/user.model")


const routerSession = Router()


//SESSION I
routerSession.post("/getcookieuser", (req, res)=>{
    const {username, email} = req.body

    res.cookie(username, email, {maxAge: 100000, signed: true}).send({mensaje: "seteado"})
})

routerSession.get("/setCookie", (req, res) =>{
    res.cookie("CoderCookie", "Esta es una cookie", {maxAge: 10000}).send("cookie seteada")
})

routerSession.get("/getCookies", (req, res) =>{
    res.send(req.cookies)
})

routerSession.get("/getSignedCookies", (req, res) =>{
    res.send(req.signedCookies)
})

routerSession.get("setSignedCookie", (req, res)=> {
    res.cookie("SignedCookie", "Esta es una cookie poderosa sifrada", {maxAge: 1000000}).send("cookie seteada")
})

routerSession.delete("/deleteCookie", (req, res)=> {
    res.clearCookie("CoderCookie")
})

//SESSION II

/* ACTIVIDAD COUNTER LOGIN ADMIN */
routerSession.get("/privada", auth,(req, res) => {
    res.send(" Todo lo que está acá lo puede ver un admin logueado ")
})

//lOGIN
routerSession.post("/session", async (req, res) => {
    try {
        const {email, password} = req.body
        //validar que no esten vacios
        if(email === "" || password === "") return res.redirect("/err")

    //funcion para validar el password
    const userDB = await userModel.findOne({email, password})

    if(!userDB) return res.redirect("/err")

    req.session.user = {
        username: userDB.username,
        first_name: userDB.first_name,
        last_name: userDB.last_name,
        email: userDB.email,
        role: "admin"
    }

    const session = req.session.user
    res.render("products", {
        session
    })
    res.redirect("/products/products")
    } catch (error) {
        console.log(error)
        res.redirect("/err")
    }
})

//LOGOUT
routerSession.get("/session/logout", (req, res) =>{
    req.session.destroy(error =>{
        if(error){
            return res.send({status: "error", error: error})
        }
        res.redirect("/")
    })
})

/* REGISTER */
routerSession.post("/session/register", async (req, res) =>{
    try {
        const {username, first_name, last_name, email, password} = req.body
    
        //validar si vienen distintos de vacios 
        if(username === "" || first_name === "" || last_name === "" || email === "" || password === "") return res.redirect("/err")
        //validar si existe el mail
        const existUser = await userModel.findOne({email})
        if(existUser) return res.send({status: "error", message: "El correo ya está en uso"})
    
        const newUser = {
            username,
            first_name,
            last_name,
            email,
            password
        }
    
        let resultUser = await userModel.create(newUser)
        res.redirect("/")
    } catch (error) {
    console.log(error)
    res.redirect("/err")
    }
})

//LOGIN
/* router.post("/login", passport.authenticate("login", {failureRedirect: "/failregister",
//successRedirect: "/Rutasiestátodobien"
}), async (req, res) => {
    if(!req.user) return res.status(401).send({status: "error", message: "invalid credential"})
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email

    }
    res.send({ status: "succes", message: "User registered"})
}) */

//fail login
/* router.get("/faillogin", async (req, res) => {
    console.log("falló la estrategia")
    res.send({ status: "Error", error: "fallo"})
}) */
/* 
//register
routerSession.post("/register", passport.authenticate("register", {failureRedirect: "/failregister",
//successRedirect: "/Rutasiestátodobien"
}), async (req, res) => {
    res.send({ status: "succes", message: "User registered"})
})

// register fail
routerSession.get("/failregister", async (req, res) => {
    console.log("falló la estrategia")
    res.send({ status: "Error", error})
})
 */
/* router.post("/login", async(req, res)=>{
    const {email, password} = req.body
    //validar email password
    //validar si existen
    
    //vamos a tener una funcion para validar el password para ver como desencriptarlo
    const userDB = await userModel.findOne({email})

    if(!userDB) return res.send({ status: "error", message: "No existe ese usuario" })

    //validar password
    if(!isValidPassword(password, userDB)) return res.status(401).send({
        status: "error",
        message: "El usuario"
    })

    req.session.user = {
        first_name: userDB.first_name,
        last_name: userDB.last_name,
        email: userDB.email
    }

    res.send({
        status: "success", 
        message: "Login success"
    })
}) */

//passport JWT
/* routerSession.get("/current", passportCall("jwt"), authorization("user"), (req, res) =>{
    res.send("req.user")
})

routerSession.post("/register", async (req, res) => {
    const {first_name, last_name, email, password} = req.body
    //validar si vienen distintos de vacios y caracteres especiales
    //validar si existe mail
    const existUser = await userModel.findOne({email})
    
    if (existUser) return res.send({status: "error", message: "El email ya está en uso"})
    
    const newUser = {
        username,
        first_name,
        last_name,
        email,
        password: createHash(password)  //encriptar
    }

    let resykt

    let resultUser = await userModel.create(newUser)
    
    res.status(200).send({status: "success", message: "usuario creado correctamente"})
})

//GITHUB
routerSession.get("/github", passport.authenticate("github", {scope: ["user:email"]}))
routerSession.get("/githubCallBack", passport.authenticate("github", {failureRedirect: "/views/login"}), async(req, res)=>{
    req.session.user = req.user
    res.redirect("api/products")
})

//LOGIN CON JWS
routerSession.post("/login", async(req, res)=>{
    const {email, password} = req.body
    //validar email password
    //validar si existen
    
    //vamos a tener una funcion para validar el password para ver como desencriptarlo
    const userDB = await userModel.findOne({email})

    if(!userDB) return res.send({ status: "error", message: "No existe ese usuario" })

    //validar password
    if(!isValidPassword(password, userDB)) return res.status(401).send({
        status: "error",
        message: "El usuario"
    })

    req.session.user = {
        first_name: userDB.first_name,
        last_name: userDB.last_name,
        email: userDB.email
    }

    //passport  y passport avanzado
    const access_token = generateToken({
        first_name: "Joaqui",
        last_name: "Rodri",
        email: "f@",
        role: "user"
    })

    //acomodar
    res.cookie("coderCookieToken", access_token, {
        maxAge: 60*60,
        httpOnly: true
    }).send({
        status: "success", 
        message: "Login success",
    })
}) */

module.exports = { routerSession }