const passport = require("passport")
const passportLocal = require("passport-local")
const { createHash, isValidPassword } = require("../utils/bcryptHash")
const { userModel } = require("../manager/mongo/models/user.model")
const GithubStrategy = require ("passport-github2")
require("dotenv").config()


const LocalStrategy = passportLocal.Strategy

const initPassport = () => {
    //Configuramos el registro
    passport.use("register", new LocalStrategy({

        passReqToCallback: true,
        usernameField: "email"

    }, async (req, username, password, done) => {
        try {
            const {first_name, last_name} = req.body
            let userDB = await userModel.findOne({ email: username})
            if(userDB) return done(null, false)
            /* if(username === "adminCoder@coder.com"){
                return role = "admin"
            }
            role = "user" */
            let newUser = {
                username,
                first_name,
                last_name,
                email: username,
                //role,
                password: createHash(password)
            }

            let result = await userModel.create(newUser)
            console.log(result)
            return done(null, result)

        } catch (error) {
            console.log(error)
        }

    }))

    //Guardar id de usuario en la session
    passport.serializeUser((user, done)=>{
        try {
            if(user.email === "adminCoder@coder.com"){
                return user.role = "admin"
            }
            user.role = "user"
            done(null, user._id, user.role)
        } catch (error) {
            if(error) return done(error)
        }
    })

    //Pregunta si existe el usuario
    passport.deserializeUser(async(id, done) => {
        let user = await userModel.findOne({_id: id})
        done(null, user)
    })

    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async (username, password, done)=>{
        const userDB = await userModel.findOne({email: username})
        try {
            if(!userDB) return done(null, false)
    
            if(!isValidPassword(password, userDB)) return done(null, false)
            return done(null, userDB)
            
        } catch (error) {
            return done(error)
        }
    }))
}


//passport GITHUB
const initPassportGitHub = () => {
    passport.use("github", new GithubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,//CLIENTE ID DE GITHUB
        clientSecret: process.env.GITHUB_CLIENT_SECRET,//Cliente secret de Github
        callbackURL: process.env.GITHUB_CALLBACK_URL,//URL de github
    }, async (accessToken, refreshToke, profile, done)=>{
        try {
            let userCreate = await userModel.findOne({email: profile._json.email})
            if(!userCreate){
                let newUser = {
                    username: profile.username,
                    firts_name: profile.username,
                    last_name: profile.username,
                    email: profile._json.email,
                    password: "",
                }
                let result = await userModel.create(newUser)
                return done(null, result)
            }
            return done(null, false)
        } catch (error) {
            console.log(error)
        }
    }))
    passport.serializeUser((user, done) => {
        try {
            if(user.email === "adminCoder@coder.com"){
                return user.role = "admin"
            }
            user.role = "user"
            done(null, user)
        } catch (error) {
            if(error) return done(error)
        }
        done(null, user.id)
    })

    passport.deserializeUser(async(id, done) => {
        let user = await userModel.findOne({_id: id})
        done(null, user)
    })
}

module.exports = {
    initPassport,
    initPassportGitHub
}