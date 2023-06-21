
const { login, loginGitHub, failLogin, register, failRegister, resetpass, logout, current } = require("../controllers/session.controller")
//Router
const { Router } = require('express')
//passport
const passport = require('passport')
//passport JWT
const {  passportAuth } = require("../jwt/passport-jwt")

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

    .get("/failRegister", failRegister)

    .post("/resetpass", resetpass)

    .get("/logout", logout)

    .get(
        '/current',
        passportAuth('jwt', { session: false }), current)


module.exports = routerSession