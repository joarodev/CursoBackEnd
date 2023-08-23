const {Router} = require("express")
const {getUser, createUsers, deleteUser, updateUsers, getUsers, roleUser, uploadDocuments, profileUser, uploadProdImage, uploadProfileImage} = require("../controllers/user.controller")
const { authUserandAdmin } = require("../jwt/passport-jwt")
const passport = require("passport")
const { uploader } = require("../utils/multer")
const routerUploads = require("./uploads.router")

const routerUser = Router()

routerUser
    .get("/users", passport.authenticate('jwt', { session: false }), getUsers)
    //.get("/:uid", passport.authenticate('jwt', { session: false }), getUser)
    /* .post(
        "/", 
        passport.authenticate('jwt', { session: false }),
        createUsers)
    .put(
        "/:uid", 
        passport.authenticate('jwt', { session: false }),
        updateUsers)
    .put(
        "/premium/:uid",
        passport.authenticate('jwt', { session: false }),
        roleUser) */
    .use("/profile", routerUploads)
    .delete(
        "/:uid", 
        passport.authenticate('jwt', { session: false }),
        deleteUser)

module.exports = routerUser