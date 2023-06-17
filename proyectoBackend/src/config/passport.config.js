const passport = require('passport')
const passportLocal = require('passport-local')
const { createHash, isValidPassword } = require('../utils/bcryptHash')
const { UserModel } = require('../manager/mongo/models/user.model')
const GithubStrategy = require('passport-github2')
require('dotenv').config()

const LocalStrategy = passportLocal.Strategy

const initPassport = () => {
    //Configuramos el registro
    passport.use(
        'register',
        new LocalStrategy(
            {
                passReqToCallback: true,
                usernameField: 'email',
            },
            async (req, username, password, done) => {
                try {
                    const { first_name, last_name, age } = req.body
                    // @fix: EL OBJETO DEBE SER PLANO
                    let userDB = await UserModel.findOne({
                        email: username,
                    }).lean()
                    if (userDB) return done(null, false)
                    let newUser = {
                        username,
                        first_name,
                        last_name,
                        email: username,
                        age,
                        password: createHash(password),
                    }

                    let result = await UserModel.create(newUser)
                    console.log(result)
                    return done(null, result)
                } catch (error) {
                    console.log(error)
                }
            }
        )
    )

    //Guardar id de usuario en la session
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    //Pregunta si existe el usuario
    passport.deserializeUser(async (id, done) => {
        // @fix: EL OBJETO DEBE SER PLANO
        let user = await UserModel.findOne({ _id: id }).lean()
        done(null, user)
    })

    passport.use(
        'login',
        new LocalStrategy(
            {
                usernameField: 'email',
            },
            async (username, password, done) => {
                // @fix: EL OBJETO DEBE SER PLANO
                const userDB = await UserModel.findOne({
                    email: username,
                }).lean()
                try {
                    if (!userDB) return done(null, false)

                    if (!isValidPassword(password, userDB))
                        return done(null, false)
                    return done(null, userDB)
                } catch (error) {
                    return done(error)
                }
            }
        )
    )
}

/* //passport GITHUB
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
} */

module.exports = {
    initPassport,
    //initPassportGitHub
}
