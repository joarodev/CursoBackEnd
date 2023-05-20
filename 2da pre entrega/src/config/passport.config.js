const passport = require("passport")
const passportLocal = require("passport-local")
const { createHash, isValidPassword } = require("../utils/bcryptHash")
const { userModel } = require("../manager/mongo/models/user.model")

const LocalStrategy = passportLocal.Strategy

const initPassport = () => {
    //Configuramos el registro
    passport.use("register", new LocalStrategy({

        passReqToCallback: true,
        usernameField: "email"

    }, async (req, username, password) => {
        const {firts_name, last_name} = req.body

        try {
            let userDB = await userModel.findOne({ email: username})
            if(userDB) return done(null, false)
            
            let newUser = {
                firts_name,
                last_name,
                email: username,
                password: createHash(password)
            }

            let result = await userModel.create(newUser)

            return done(null, result)

        } catch (error) {
            return done("Error al obtener el usuario" + error)
        }

    }))

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

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

module.exports = {
    initPassport
}