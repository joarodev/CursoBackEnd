const passport = require("passport")
const {Strategy, ExtractJwt} = require("passport-jwt")
const { privateKey } = require("./configServer")

const JWTStrategy = Strategy
const ExtractJWT = ExtractJwt

let cookieExtractor = (req) =>{
    let token = null
    if(req && req.cookies){
        token = req.cookies("coderCookieToken")
    }
    return token
}

const initializePassport = () =>{

    passport.use("jwt", new Strategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: privateKey
    },async (jwt_payload, done) =>{
        try {
            done(null,jwt_payload)
        } catch (error) {
            return done(error)
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async(id, done) => {
        let user = await userModel.findOne({_id: id})
        done(null, user)
    })
}


//passport GITHUB
const initPassportGitHub = () => {
    passport.use("github", new GithubStrategy({
        clientID: "Iv1.1d002cb57ec835ff",//CLIENTE ID DE GITHUB
        clientSecret: "2c98e525b0dd168f8b927c90042276bde9bb9bb5",//Cliente secret de Github
        callbackURL: "http://localhost:8080/session/githubcallback",//URL de github
    }, async (accessToken, refreshToke, profile, done)=>{
        console.log("Profile", profile)
        try {
            let user = await userModel.findOne({email: profile._json.email})
            if(user) return done(null, user)
            if(!user){
                let newUser = {
                    username: profile.username,
                    first_name: profile.displayName,
                    email: profile._json.email,
                    password: "",
                }
                let result = await userModel.create(newUser)
                return done(null, result)
            }
            return done(null, user)
        } catch (error) {
            console.log(error)
            return done(null, false)
        }
    }))
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async(id, done) => {
        let user = await userModel.findOne({_id: id})
        done(null, user)
    })
}

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
    initializePassport,
    initPassportGitHub,
    passportAuth,
    authorization

}