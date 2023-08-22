
const { login, loginGitHub, failLogin, register, failRegister, resetpass, resetpassToken,resetPassForm, logout, current } = require("../controllers/session.controller")
//Router
const { Router } = require('express')
//passport
const passport = require('passport')
//passport JWT
const {  passportAuth } = require("../jwt/passport-jwt")
const { CustomError } = require("../utils/CustomError/CustomError")
const { generateUserErrorInfo } = require("../utils/CustomError/info")
const { EError } = require("../utils/CustomError/EErrors")
const resetPassStrategy = require("../middlewares/resetPassStategy")

const routerSession = Router()

routerSession
    .post(
        "/login",
        passport.authenticate('login', {
            failureRedirect: '/session/faillogin',
            session: false,
        }), login)

    .get(
        "/loginGitHub",
        passport.authenticate('github', {
            failureRedirect: '/err',
            session: false,
        }), loginGitHub)

    .get("/failLogin", failLogin)

    .post(
        '/register',
        passport.authenticate('register', {
            failureRedirect: '/session/failregister',
            successRedirect: '/login',
            session: false,
        }), register)
    
    /* .post("/register", async (req, res, next)=>{
        try {
            const {first_name, last_name, email} = req.body

            if(!first_name || !last_name|| !email){
                CustomError.createError({
                    name: "User creation error",
                    cause: generateUserErrorInfo({
                        first_name,
                        last_name,
                        email
                    }),
                    message: `error typing to created user`,
                    code: EError.INVALID_TYPE_ERROR
                })
            }
        } catch (error) {
            next()
            console.log(error)
        }
    }) */

    .get("/failRegister", failRegister)

    .post("/reset-password", resetpass)

    .get("/reset-password/:token",
    resetPassStrategy,
    resetpassToken)

    .post("/reset-password-form", resetPassForm)

    .get(
        "/logout",
        passport.authenticate('jwt', { session: false }),
        logout)

    .get(
        '/current',
        passportAuth('jwt', { session: false }), current)


module.exports = routerSession