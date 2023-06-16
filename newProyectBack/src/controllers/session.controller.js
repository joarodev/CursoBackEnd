const { generateToken } = require("../utils/generateTokenJwt")

class SessionController {

    login = async (req, res) => {
        if(!req.user) return res.status(401).send({status: "error", message: "invalid credential"})
        //generate token
        if(req.user.username === "adminCoder@coder.com") return role = "admin"
        let role = "user"

        req.session.user = {
            username: req.user.username,
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age
        }
        if(req.session.user.username === "adminCoder@coder.com") {
            req.session.user.role = "admin"
        } else {
            req.session.user.role = "user"
        }

        const token = generateToken(req.session.user)

        res.cookie("coderCookieToken", token, {
            maxAge: 60*60*10000,
            httpOnly: true
        }).send({
            status: "success",
            token
        })
        console.log(token)
        res.redirect("/api/product/")
    }

    loginGitHub = async (req, res)=>{
        console.log(req.user)
        req.session.user = req.user
        if(req.session.user.username === "adminCoder@coder.com") {
            req.session.user.role = "admin"
        } else {
            req.session.user.role = "user"
        }

        const token = generateToken(req.session.user)

        console.log(token)
        res.redirect("/products/products")
    }

    failLogin = async (req, res) => {
        console.log("falló la estrategia")
        res.send({ status: "Error", error: "fallo"})
    }

    register = async (req, res) => {
        console.log("Usuario registrado")
        res.send({})
    }

    failRegister =  async (req, res) => {
        console.log("falló la estrategia")
        res.redirect("/err")
    }

    resetpass = (req, res) =>{
        req.session.destroy(error =>{
            if(error){
                return res.send({status: "error", error: error})
            }
            console.log("user logout")
            res.redirect("/")
        })
    }

    logout = (req, res) =>{
        (req, res) =>{
            req.session.destroy(error =>{
                if(error){
                    return res.send({status: "error", error: error})
                }
                console.log("user logout")
                res.redirect("/")
            })
        }
    }

    current = (req, res) =>{
        res.send({user: req.user})
    }
}

module.exports = new SessionController()