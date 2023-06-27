//Session
const { auth } = require('../middlewares/autentication.middleware')
const { Router } = require('express')
//passport
const passport = require('passport')
const { createHash, isValidPassword } = require('../utils/bcryptHash')


//passport JWT
const { passportCall, passportAuth } = require("../passport-jwt/passport.config")
//rutas que necesitan protección
const { authorization } = require('../passport-jwt/passport.config')
const { UserModel } = require('../manager/mongo/models/user.model')
const session = require('express-session')
const { generateToken } = require('../utils/generateTokenJWT')


const routerSession = Router()

//RESTAURAR CONTRASEÑA
routerSession.post('/restaurarpass', async (req, res) => {
    const { email, password } = req.body

    // Encontrar el usuario por correo electrónico
    const userDB = await UserModel.findOne({ email })

    if (!userDB) {
      // Si el usuario no existe, redireccionar a una página de error
        return res.status(401).send({status: 'error', message: 'El usuario no existe'})
    }    

    //Hasear Actualizar la contraseña del usuario
    userDB.password = createHash(password)
    await userDB.save()

    // Redireccionar al usuario a la página de login
    res.status(200).json({status: 'success', message:'Contraseña actualizada correctamente'});
})


//LOGIN CON PASSPORT
routerSession.post(
    '/',
    passport.authenticate('login', {
        failureRedirect: '/session/faillogin',
        session: false,
    }),
    async (req, res) => {
        if (!req.user)
            return res
                .status(401)
                .send({ status: 'error', message: 'invalid credential' })
    const user = req.user
        if (user.username === 'adminCoder@coder.com') {
            user.role = 'admin'
        } else {
            user.role = 'user'
        }
        const token = generateToken(user)
        res.cookie('coderCookieToken', token, {
            maxAge: 1000*60*60,
            httpOnly: true,
        })
        res.redirect('/products/products')
})

//FAIL LOGIN PASSPORT
routerSession.get('/session/logout', (req, res) => {
    res.clearCookie('coderCookieToken')
    console.log('user logout')
    res.redirect('/')
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
routerSession.get("/failregister", async (req, res) => {
    console.log("falló la estrategia")
    res.redirect("/err")
})

/* //LOGOUT
routerSession.get("/session/logout", (req, res) =>{
    req.session.destroy(error =>{
        if(error){
            return res.send({status: "error", error: error})
        }
        console.log("user logout")
        res.redirect("/")
    })
}) */


//LOGIN POR GITHUB

routerSession.get(
    '/github',
    passport.authenticate('github', { scope: ['user: email'], session: false })
)

routerSession.get(
    '/githubcallback',
    passport.authenticate('github', {
        failureRedirect: '/err',
        session: false,
    }),
    async (req, res) => {
        console.log(req.user)
        const user = req.user
        if (user.username === "adminCoder@coder.com") {
            user.role = 'admin'
        } else {
            user.role = 'user'
        }
        const token = generateToken(user)
        res.cookie('coderCookieToken', token, {
            maxAge: 10000*60*60,
            httpOnly: true,
        })
        res.redirect('/products/products')
    })


//passport jwt - CURRENT
routerSession.get(
    '/current',
    passportAuth('jwt', { session: false }),
    (req, res) => {
        res.send({ user: req.user })
    }
)

module.exports = { routerSession }