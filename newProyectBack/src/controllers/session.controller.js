const { generateToken } = require("../utils/generateTokenJwt")
//passport
const jwt = require("jsonwebtoken")
const { envConfig } = require("../config/config")
const { UserDto } = require("../dto/user.dto")
const { LoginUserErrorInfo, LoginUserGitHub } = require("../utils/CustomError/info")
const { userService } = require("../services")
const { sendEmailResetPassword } = require("../utils/sendmail")
const { createHash, comparePasswords, isValidPassword } = require("../utils/bcryptHash")

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
            res.redirect("/api/users/profile")
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
        const { username } = req.body
        console.log('Usuario registrado')
        res.send({status: "success", payload: username})
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

    resetpass = async (req, res, next) => {
        try {
            const {email} = req.body
            console.log(email)
            const emailUser = await userService.getEmail(email)
            console.log("email user: "+emailUser)
            if( !emailUser ){
                req.logger.http("No se encontro un email relacionado");
                req.logger.error("No se encontro un email en nuestra base de datos")
            } else {
                const token = jwt.sign({ email: email }, envConfig.JWT_SECRET_KEY, { expiresIn: "1h" });
                sendEmailResetPassword(email, token)
                req.logger.info(`Se envio un correo de recuperación a ${email}`)
                req.logger.http(`Se envio un correo de recuperación a ${email}`);
                res.send({status: "success", message: "Se envio el correo de recuperacion a: "+email})
            }
        } catch (error) {
            req.logger.http('Se produjo un error', error);
            req.logger.error('Se produjo un error', error);
            next()
            
        }
    }

    resetpassToken = async (req, res, next) => {
        try {
            const token = req.params.token;
            const email = req.email

            res.render("resetPassword",{
                token,
                email
            })
        } catch (error) {
            req.logger.http('Se produjo un error', error);
            req.logger.error('Se produjo un error', error);
        }
    }

    resetPassForm = async (req, res, next) => {
        try {
            const {email, password, confirmPassword } = req.body;
            //const email = req.email;
            console.log("el email es: "+ email)

            const user = await userService.getEmail(email);
            console.log("user: ", user)
            console.log("user email: ", user[0].email);
            console.log("user pass: ", user[0].password);
            console.log("pass: ", password);

            if (!user) {
                req.logger.error(`Error al encontrar el email en la base de datos`)
                res.logger.http(`Error al encontrar el email en la base de datos`);
            }
            //validar password
            if(password != confirmPassword){
                req.logger.error(`Las contraseñas ingresadas son distintas`)
                res.logger.http(`Las contraseñas ingresadas son distintas`);
            }

            console.log("pass: "+user[0].password)
            const isSamePassword = await comparePasswords(password, user[0].password);
            if (isSamePassword) {
                return res.logger.http(`No puedes ingresar la misma contraseña que ya tenías`);
            }

            // Actualiza la contraseña del usuario en la base de datos
            const hashedPassword = await createHash(password);
            const userId = user[0]._id
            const userPassUpdate = await userService.updateUserPassword(userId, hashedPassword)
            
            req.logger.info(`Contraseña actualizada correctamente`, userPassUpdate)
            req.logger.http("Contraseña actualizada correctamente")
            res.send({status: "success", message: "contraseña actualizada correctamente"})
        } catch (error) {
            req.logger.http('Se produjo un error', error);
            req.logger.error('Se produjo un error', error);
        }
    }

    logout = async (req, res) => {
        const userId = req.user._id
        await userService.lastConnection(userId, new Date())
        res.clearCookie('coderCookieToken')
        console.log('user logout')
        res.send("user logout")
    }

    current = (req, res) => {
        const user = req.user
        console.log(user)
        let userCurrent = new UserDto(user)
        //console.log(userCurrent)
        res.send({status: "success", payload: userCurrent})
    }
}

module.exports = new SessionController()