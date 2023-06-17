//Session
const { auth } = require('../middlewares/autentication.middleware')
const { Router } = require('express')

//passport
const passport = require('passport')
const { createHash, isValidPassword } = require('../utils/bcryptHash')

//passport JWT
const {
    passportCall,
    passportAuth,
} = require('../passport-jwt/passport.config')
//rutas que necesitan protección
const { authorization } = require('../passport-jwt/passport.config')
const { userModel } = require('../manager/mongo/models/user.model')
const session = require('express-session')
const { generateToken } = require('../utils/generateTokenJWT')

const routerSession = Router()

//SESSION II

/* ACTIVIDAD COUNTER LOGIN ADMIN */
/* routerSession.get("/privada", auth,(req, res) => {
    res.send(" Todo lo que está acá lo puede ver un admin logueado ")
}) */

//RESTAURAR CONTRASEÑA
routerSession.post('/restaurarpass', async (req, res) => {
    const { email, password } = req.body

    // Encontrar el usuario por correo electrónico
    const userDB = await userModel.findOne({ email })

    if (!userDB) {
        // Si el usuario no existe, redireccionar a una página de error
        return res
            .status(401)
            .send({ status: 'error', message: 'El usuario no existe' })
    }

    //Hasear Actualizar la contraseña del usuario
    userDB.password = createHash(password)
    await userDB.save()

    // Redireccionar al usuario a la página de login
    res.status(200).json({
        status: 'success',
        message: 'Contraseña actualizada correctamente',
    })
})

// @fix: TODAS LAS INVOCACIONES DEBEN LLEVAR session: false
//LOGIN CON PASSPORT
routerSession.post(
    '/',
    passport.authenticate('login', {
        failureRedirect: '/session/faillogin',
        session: false,
        //successRedirect: "/products/products"
    }),
    async (req, res) => {
        if (!req.user)
            return res
                .status(401)
                .send({ status: 'error', message: 'invalid credential' })
        /* if(req.user.username === "adminCoder@coder.com") return role = "admin"
    let role = "user" */
        // @fix: NOO!
        // @fix: SI USAMOS JWT YA NO HACE FALTA USAR SESSION, LO CORRECTO ES CREAR EL TOKEN Y DEVOLVERLO
        // req.session.user = {
        //     username: req.user.username,
        //     first_name: req.user.first_name,
        //     last_name: req.user.last_name,
        //     email: req.user.email,
        //     age: req.user.age,
        // }
        // if (req.session.user.username === "adminCoder@coder.com") {
        //     req.session.user.role = "admin"
        // } else {
        //     req.session.user.role = "user"
        // }
        const user = req.user
        if (user.username === 'adminCoder@coder.com') {
            user.role = 'admin'
        } else {
            user.role = 'user'
        }
        const token = generateToken(user)
        res.cookie('coderCookieToken', token, {
            maxAge: 60 * 60,
            httpOnly: true,
        })
        res.redirect('/products/products')
    }
)

//FAIL LOGIN PASSPORT
routerSession.get('/faillogin', async (req, res) => {
    console.log('falló la estrategia')
    res.send({ status: 'Error', error: 'fallo' })
})

//REGISTER CON PASSPORT
routerSession.post(
    '/register',
    passport.authenticate('register', {
        failureRedirect: '/session/failregister',
        successRedirect: '/',
        session: false,
    }),
    async (req, res) => {
        console.log('Usuario registrado')
        res.send({})
    }
)

//FAIL REGISTER CON PASSPORT
routerSession.get('/failregister', async (req, res) => {
    console.log('falló la estrategia')
    res.redirect('/err')
})

//LOGOUT
routerSession.get('/session/logout', (req, res) => {
    // @fix: ACA HAY QUE LIMPIAR LA COOKIE
    res.clearCookie('coderCookieToken')
    console.log('user logout')
    res.redirect('/')
    // req.session.destroy((error) => {

    //     if (error) {
    //         return res.send({ status: "error", error: error })
    //     }

    // })
})

//LOGIN POR GITHUB
routerSession.get(
    '/github',
    passport.authenticate('github', { scope: ['user: email'], session: false })
)
//"/github" nos redirecciona los resultados a -> "/githubcallback"
routerSession.get(
    '/githubcallback',
    passport.authenticate('github', {
        failureRedirect: '/err',
        session: false,
        //successRedirect: "/products/products"
    }),
    async (req, res) => {
        console.log(req.user)
        // @fix: YA NO USAMO SESSIONS, LO CORRECTO ES SETEAR CREAR EL TOKEN Y SETEARLO EN UNA COOKIE
        // req.session.user = req.user
        // if (req.session.user.username === "adminCoder@coder.com") {
        //     req.session.user.role = "admin"
        // } else {
        //     req.session.user.role = "user"
        // }
        const user = req.user
        if (user.username === 'adminCoder@coder.com') {
            user.role = 'admin'
        } else {
            user.role = 'user'
        }
        const token = generateToken(user)
        res.cookie('coderCookieToken', token, {
            maxAge: 60 * 60,
            httpOnly: true,
        })
        res.redirect('/products/products')
    }
)

//passport jwt - CURRENT
routerSession.get(
    '/current',
    passportAuth('jwt', { session: false }),
    (req, res) => {
        res.send({ user: req.user })
    }
)

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
