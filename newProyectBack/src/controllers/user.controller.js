//Arquitectura por capas
//capa de negocio
const { userModel} = require("ruta usermodel")

class UserController {

    getUser = async (req, res) => {
    
    }
    createUsers = async (req, res) => {
    }
    upgradeUsers = async (req, res) => {
        
    }
    deleteUsers = async (req, res) => {
        try{
            let{uid} = req.params


        } catch(error){
            console.log(error)
        }
    }

}

module.exports = new UserController()

