const { generateToken } = require("../config/jwt")


class SessionController {

    login = (req, res) => {
        const {email, password} = req.body  
        //validaciones

        const user = {
            first_name: "Joa",
            last_name: "ROd",
            role: "user",
            email: "jr@gmail.com"
        }
        res.send("login")
        const token = generateToken(user)


    
        res.cookie("coderCookieToken", token, {
            maxAge: 60*60*10000,
            httpOnly: true
        }).send({
            status: "success",
            token
        })
    }

    failLogin = (req, res) =>{

    }

    register = (req, res) => {
        res.send("register  ")
    }

    failRegister = (req, res) => {

    }

    resetpass = (req, res) =>{

    }

    logout = (req, res) =>{
        
    }


}

module.exports = {SessionController}