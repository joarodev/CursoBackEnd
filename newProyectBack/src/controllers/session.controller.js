const { generateToken } = require("../utils/generateTokenJwt")
//passport
const { createHash } = require('../utils/bcryptHash')
const { UserModel } = require('../dao/mongo/models/user.model')
const { envConfig } = require("../config/config")

class SessionController {

    login = async (req, res) => {
        if (!req.user)
            return res
                .status(401)
                .send({ status: 'error', message: 'invalid credential' })
        const user = req.user
        const token = generateToken(user)
        res.cookie('coderCookieToken', token, {
            maxAge: 1000*60*60,
            httpOnly: true,
        })
        res.redirect("/api/product/products")
    }

    loginGitHub = async (req, res) => {
        console.log(req.user)
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
    }

    register = async (req, res) => {
        console.log('Usuario registrado')
        res.send({})
    }
    failLogin = (req, res) => {
        res.clearCookie('coderCookieToken')
        console.log('user logout')
        res.redirect('/err')
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
        res.send({ user: req.user })
    }
}

module.exports = new SessionController()