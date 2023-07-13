const { generateToken } = require("../utils/generateTokenJwt")
//passport
const { createHash } = require('../utils/bcryptHash')
const { UserModel } = require('../dao/mongo/models/user.model')
const { envConfig } = require("../config/config")
const { UserDto } = require("../dto/user.dto")
const { LoginUserErrorInfo, LoginUserGitHub } = require("../utils/CustomError/info")

class SessionController {

    login = async (req, res, next) => {
        try {
            if(!req.user){
                CustomError.createError({
                    name: "Login error",
                    cause: LoginUserErrorInfo(),
                    message: "Error login user",
                    code: EError.INVALID_TYPE_ERROR
                })
            }
            const user = req.user
            const token = generateToken(user)
            res.cookie('coderCookieToken', token, {
                maxAge: 1000*60*60,
                httpOnly: true,
            })
            /* res.status(200).send({ status: "SUCCESS" }) */
            res.redirect("/api/product/products")
        } catch (error) {
            next(error)
        }
    }

    loginGitHub = async (req, res, next) => {
        try {
            console.log(req.user)
    
            if(!req.user){
                CustomError.createError({
                    name: "Login error",
                    cause: LoginUserGitHub(),
                    message: "Error login user",
                    code: EError.INVALID_TYPE_ERROR
                })
            }
    
            const user = req.user
            if (user.username === envConfig.ADMIN_EMAIL) {
                user.role = 'admin'
            } else {
                user.role = 'user'
            }
            const token = generateToken(user)
            res.cookie('coderCookieToken', token, {
                maxAge: 10000*60*60,
                httpOnly: true,
            })
            res.redirect('/api/product/products')
        } catch (error) {
            next(error)
        }
    }

    register = async (req, res) => {
        console.log('Usuario registrado')
        res.send({})
    }
    failLogin = (req, res) => {
        res.clearCookie('coderCookieToken')
        console.log('user logout')
        res.redirect('/')
    }


    failRegister =  async (req, res) => {
        console.log("falló la estrategia")
        res.redirect("/err")
    }

    resetpass = async (req, res) => {
        const { email, password } = req.body
    
        // Encontrar el usuario por correo electrónico
        const userDB = await UserModel.findOne({ email })
    
        if (!userDB) {
          // Si el usuario no existe, redireccionar a una página de error
            return res.status(401).send({status: 'error', message: 'El usuario no existe'})
        }    
    
        //Hasear Actualizar la contraseña del usuario
        userDB.password = createHash(password)
        await userDB.save()
    
        // Redireccionar al usuario a la página de login
        res.status(200).json({status: 'success', message:'Contraseña actualizada correctamente'});
    }

    logout = (req, res) => {
        res.clearCookie('coderCookieToken')
        console.log('user logout')
        res.redirect('/login')
    }

    current = (req, res) => {
        const user = req.user
        console.log(user)
        let userCurrent = new UserDto(user)
        //console.log(userCurrent)
        res.send({status: "Succes", userCurrent})
    }
}

module.exports = new SessionController()