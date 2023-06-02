const passport = require("passport")
const jwt = require("passport-jwt")
const objetConfig = require("../config/configServer")
const {privateKey} = require("../config/configServer")
const { userModel } = require("../manager/mongo/models/user.model")


const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt

//Extractor de cookies
const cookieExtractor = req =>{
    let token = null //inicializamos en null

    if(req && req.cookies){
        token = req.cookies["coderCookieToken"]  //Extraemos la cookie y las guardamos en token
    }
    return token
}

//Init de passport
/* const initPassportJWT = () => {
    passport.use("jwt", new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: privateKey
        
    }), async (jwt_payload, done)=>{
        try {

            //validar usuarios
            //done(null, false, {message: "no hay users"})
            
            return done(null, jwt_payload) // información desencriptada
        } catch (error) {
            return done(error)
        }
    }
)} */

//CURRENT
const initPassportJWT = () => {
    passport.use("current", new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: privateKey
        
    }), async (jwt_payload, done)=>{
        try {

            //validar usuarios
            const user = await userModel.findById(jwt_payload.sub)
            if(!user){
                return done(done,false,{message: "usuario no encontrado"})
            }
            
            return done(null, user) // información desencriptada
        } catch (error) {
            return done(error)
        }
    }
)}

//validar los roles de los usuarios
const authorization = role => {
    return async (req, res, next) =>{

        console.log("role", role)
        console.log("user", req.user)

        if(!req.user) return res.status(401).send ({ status: "error", error: "error" })
        if(req.user.role === role) return res.status(403).send({status: "", error: "Not permiso"})
        next()
    }
}

//Validar si viene corrupto o no viene el token
const passportAuth = strategy => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function(err, user, info){
            if(err) return next(err)
            if(!user) return res.status(401).send({status: "error", error: info.messages ? info.messages : info.toString()})
            req.user = user
            next()
        })(req, res, next)
    }
}

module.exports = {
    initPassportJWT,
    authorization,
    passportAuth
}