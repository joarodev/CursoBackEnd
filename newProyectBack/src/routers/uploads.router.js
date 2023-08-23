const {Router} = require("express")
const { authUserandAdmin } = require("../jwt/passport-jwt")
const passport = require("passport")
const { uploader } = require("../utils/multer")
const { profileUser, uploadProfileImage, uploadDocuments, uploadProdImage } = require("../controllers/user.controller")
const routerUploads = Router()

routerUploads
    .get(
        "/",
        passport.authenticate('jwt', { session: false }),
        profileUser)
    .post(
        "/documents",
        passport.authenticate('jwt', { session: false }),
        uploader.array('document'),
        uploadDocuments)
    .post(
        "/image-product",
        passport.authenticate('jwt', { session: false }),
        uploader.single('productImage'),
        uploadProdImage)
    .post(
        "/image-profile",
        passport.authenticate('jwt', { session: false }),
        uploader.single('profileImage'),
        uploadProfileImage)

module.exports = routerUploads