const {Router} = require("express")
const { isAdmin } = require("../middlewares/auth.middlewares")
const { adminUsers, changeRole, deleteUser } = require("../controllers/admin.controller")
const passport = require("passport")

const routerAdmin = Router()

routerAdmin
.get(
    "/",
    passport.authenticate('jwt', { session: false }),
    isAdmin,
    adminUsers)
.post(
    "/user-role/:uid",
    passport.authenticate('jwt', { session: false }),
    isAdmin,
    changeRole
)
.post(
    "/user-delete/:uid",
    passport.authenticate('jwt', { session: false }),
    isAdmin,
    deleteUser
)

module.exports = routerAdmin