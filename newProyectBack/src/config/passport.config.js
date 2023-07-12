const passport = require('passport')
const passportLocal = require('passport-local')
const { createHash, isValidPassword } = require('../utils/bcryptHash')
const { UserModel } = require('../dao/mongo/models/user.model')
const { envConfig } = require('./config')
const { CustomError } = require('../utils/CustomError/CustomError')
const { generateUserErrorInfo } = require('../utils/CustomError/info')
const { EError } = require('../utils/CustomError/EErrors')
require('dotenv').config()


const LocalStrategy = passportLocal.Strategy

const initPassport = () => {
    
    //LOGIN
    passport.use(
        'login',
        new LocalStrategy(
            {
                usernameField: 'email',
            },
            async (username, password, done) => {
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
    
    //REGISTER
    passport.use(
        'register',
        new LocalStrategy(
            {
                passReqToCallback: true,
                usernameField: 'email',
            },
            async (req, username, password, done) => {
                try {
                    const { first_name, last_name, age, email } = req.body

                    if(!first_name || !last_name || !age || !email){
                        CustomError.createError({
                            name: "User creation error",
                            cause: generateUserErrorInfo({
                                first_name,
                                last_name, 
                                age, 
                                email
                            }),
                            message: "Error trying to created user",
                            code: EError.INVALID_TYPE_ERROR
                        })
                    }

                    let userDB = await UserModel.findOne({
                        email: username,
                    }).lean()
                    if (userDB) return done(null, false)
                    if (email === envConfig.ADMIN_EMAIL) {
                        role = 'admin'
                    } else {
                        role = 'user'
                    }
                    let newUser = {
                        username,
                        first_name,
                        last_name,
                        email: username,
                        age,
                        password: createHash(password),
                        role,
                    }
                    let result = await UserModel.create(newUser)
                    console.log(result)
                    return done(null, result)
                } catch (error) {
                    console.log(error)
                }

    }))

    //Guardar id de usuario en la session
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
    //Pregunta si existe el usuario
    passport.deserializeUser(async (id, done) => {
        let user = await UserModel.findOne({ _id: id }).lean()
        done(null, user)
    })
}

module.exports = {
    initPassport,
}