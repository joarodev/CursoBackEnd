const {Router} = require("express")
const {getUser, createUsers, deleteUser, updateUsers, getUsers, roleUser, uploadDocuments, profileUser, uploadProdImage, uploadProfileImage} = require("../controllers/user.controller")
const { authUserandAdmin } = require("../jwt/passport-jwt")
const passport = require("passport")
const { uploader } = require("../utils/multer")

const routerUser = Router()

routerUser
    .get(
        "/users", 
        passport.authenticate('jwt', { session: false }),
        getUsers)
    .get(
        "/:uid", 
        passport.authenticate('jwt', { session: false }),
        getUser)
    .post(
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
        roleUser)
    .get(
        "/profile",
        passport.authenticate('jwt', { session: false }),
        profileUser)
    .post(
        "/:uid/documents",
        passport.authenticate('jwt', { session: false }),
        uploader.array('document', 5),
        uploadDocuments)
    .post(
        "/:uid/products",
        passport.authenticate('jwt', { session: false }),
        uploader.array('productImage', 5),
        uploadProdImage)
    .post(
        "/:uid/profile",
        passport.authenticate('jwt', { session: false }),
        uploader.single('profileImage', 5),
        uploadProfileImage)
    .delete(
        "/:uid", 
        passport.authenticate('jwt', { session: false }),
        deleteUser)

module.exports = routerUser