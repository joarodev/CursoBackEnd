const passport = require("passport")
const jwt = require("passport-jwt")
const objetConfig = require("../config/configServer")
const { privateKey } = require("../config/configServer")
const { UserModel } = require("../manager/mongo/models/user.model")
const { createHash, isValidPassword } = require("../utils/bcryptHash")
const GithubStrategy = require("passport-github2")

const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt

//Extractor de cookies
const cookieExtractor = (req) => {
    let token = null //inicializamos en null

    if (req && req.cookies) {
        token = req.cookies["coderCookieToken"] //Extraemos la cookie y las guardamos en token
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
    //LOGIN

    // @fix: ESTO YA ESTA IMPLEMENTADO EN LOCAL; NO HACE FALTA ACA
    // passport.use(
    //     "login",
    //     new JWTStrategy(
    //         {
    //             jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
    //             secretOrKey: privateKey,
    //             usernameField: "email",
    //         },
    //         async (username, password, done) => {
    //             const userDB = await userModel.findOne({ email: username })
    //             try {
    //                 if (!userDB) return done(null, false)

    //                 if (!isValidPassword(password, userDB))
    //                     return done(null, false)
    //                 return done(null, userDB)
    //             } catch (error) {
    //                 return done(error)
    //             }
    //         }
    //     )
    // )

    // //REGISTER
    // passport.use(
    //     "register",
    //     new JWTStrategy(
    //         {
    //             jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
    //             secretOrKey: privateKey,
    //             passReqToCallback: true,
    //             usernameField: "email",
    //         },
    //         async (req, username, password, done) => {
    //             try {
    //                 const { first_name, last_name, age } = req.body
    //                 let userDB = await userModel.findOne({ email: username })
    //                 if (userDB) return done(null, false)
    //                 let newUser = {
    //                     username,
    //                     first_name,
    //                     last_name,
    //                     email: username,
    //                     age,
    //                     password: createHash(password),
    //                 }

    //                 let result = await userModel.create(newUser)
    //                 console.log(result)
    //                 return done(null, result)
    //             } catch (error) {
    //                 console.log(error)
    //             }
    //         }
    //     )
    // )

    // @fix: ESTA ESTRATEGIA DEBERIA LLAMARSE "jwt", Y SE PODRIA USAR EN TODAS LAS RUTAS QUE SE QUIERAN PROTEGER
    passport.use(
        "jwt",
        new JWTStrategy(
            {
                jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
                secretOrKey: privateKey,
            },
            async (jwt_payload, done) => {
                try {
                    //validar usuarios
                    // @fix: EL OBJETO DEBE SER PLANO
                    const user = await UserModel.findById(
                        jwt_payload._id
                    ).lean()
                    if (!user) {
                        return done(null, false, {
                            message: "usuario no encontrado",
                        })
                    }

                    return done(null, user) // información desencriptada
                } catch (error) {
                    return done(error)
                }
            }
        )
    )

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        // @fix: EL OBJETO DEBE SER PLANO
        let user = await UserModel.findOne({ _id: id }).lean()
        done(null, user)
    })
}

//passport GITHUB
const initPassportGitHub = () => {
    passport.use(
        "github",
        new GithubStrategy(
            {
                clientID: "Iv1.1d002cb57ec835ff", //CLIENTE ID DE GITHUB
                clientSecret: "2c98e525b0dd168f8b927c90042276bde9bb9bb5", //Cliente secret de Github
                callbackURL: "http://localhost:8080/session/githubcallback", //URL de github
            },
            async (accessToken, refreshToke, profile, done) => {
                console.log("Profile", profile)
                try {
                    // @fix: EL OBJETO DEBE SER PLANO
                    let user = await UserModel.findOne({
                        email: profile._json.email,
                    }).lean()
                    if (user) return done(null, user)
                    if (!user) {
                        let newUser = {
                            username: profile.username,
                            first_name: profile.displayName,
                            email: profile._json.email,
                            password: "",
                        }
                        let result = await UserModel.create(newUser)
                        return done(null, result)
                    }
                    return done(null, user)
                } catch (error) {
                    console.log(error)
                    return done(null, false)
                }
            }
        )
    )
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        let user = await UserModel.findOne({ _id: id })
        done(null, user)
    })
}

//validar los roles de los usuarios
const authorization = (role) => {
    return async (req, res, next) => {
        console.log("role", role)
        console.log("user", req.user)

        if (!req.user)
            return res.status(401).send({ status: "error", error: "error" })
        if (req.user.role === role)
            return res.status(403).send({ status: "", error: "Not permiso" })
        next()
    }
}

//Validar si viene corrupto o no viene el token
// @fix: HACE FALTA EL OBJETO OPTIONS PARA PASAR EL session: false, Y LAS OTRAS OPCIONES
const passportAuth = (strategy, options) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, options, function (err, user, info) {
            if (err) return next(err)
            if (!user)
                return res.status(401).send({
                    status: "error",
                    error: info.messages ? info.messages : info.toString(),
                })
            req.user = user
            next()
        })(req, res, next)
    }
}

module.exports = {
    initPassportJWT,
    authorization,
    passportAuth,
    initPassportGitHub,
}
