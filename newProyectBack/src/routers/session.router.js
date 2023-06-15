const {Router} = require("express")
const { login, loginGitHub, failLogin, register, failRegister, resetpass, logout, current } = require("../controllers/session.controller")


const routerSession = Router()

routerSession
    .post("/login", login)

    .post("/loginGitHub", loginGitHub)

    .get("/failLogin", failLogin)

    .post("/register", register)

    .get("/failRegister", failRegister)

    .post("/resetpass", resetpass)

    .get("/logout", logout)

    .get("/current", current)


module.exports = routerSession