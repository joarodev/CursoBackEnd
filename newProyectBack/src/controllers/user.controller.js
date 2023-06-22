//Arquitectura por capas
//capa de negocio
const { UserModel} = require("../dao/mongo/models/user.model")

class UserController {

    getUsers = async (req, res) => {
        try {
            
            res.send("getUsers")
        } catch (error) {
            
        }
    }
    getUser = async (req, res) => {
        try{
            let{uid} = req.params
            let user = await productService.getUser(uid)
            res.send({
                success: "success", 
                payload: user
            })
        } catch(error){
            console.log(error)
        }
    }
    createUsers = async (req, res) => {
        try {
            const {body} = req
            console.log(error)
            let result = await userService.createUser(body)
            res.send({})
        } catch (error) {
            
        }
    }
    updateUsers = async (req, res) => {
        try{
            let{uid} = req.params
            res.send("updateUser")
        } catch(error){
            console.log(error)
        }
    }
    deleteUser = async (req, res) => {
        try{
            let{uid} = req.params
            res.send("deleteUser")
        } catch(error){
            console.log(error)
        }
    }
}

module.exports = new UserController()

