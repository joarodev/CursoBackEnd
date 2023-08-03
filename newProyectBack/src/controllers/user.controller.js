const { userService } = require("../services")
class UserController {

    getUsers = async (req, res) => {
        try {
            let users = await userService.getUsers()
            res.send({
                success: "success", 
                payload: users
            })
        } catch (error) {
            req.logger.error("no se encontraron usuarios")
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
            const {body} = req.body
            console.log(error)
            let result = await userService.createUser(body)
            res.logger.info("Usuario creado correctamente", result)
        } catch (error) {
            res.logger.error("No se ah podido crear el usuario, el error fue ", error)
        }
    }
    updateUsers = async (req, res) => {
        try{
            let {uid} = req.params
            let body = req.body
            const result = await userService.updateUser(uid,body)
            req.logger.info("Usuario actualizado correctamente", result)
        } catch(error){
            console.log(error)
        }
    }
    roleUser = async (req, res, next) => {
        try {
            const {uid} = req.params;
            const newRole = req.body.role;

            if (newRole !== 'user' && newRole !== 'premium') {
                req.logger.error("El rol debe ser `premium` o `User`")
            }

            const user = await userService.getUser(uid);

            if (!user) {
                req.logger.error("Error al encontrar el usuario en la base de datos")
            }

            const newUserRole = await userService.updateRole(uid, newRole)
            console.log(newUserRole)

            req.logger.info('Rol del usuario actualizado correctamente.', newUserRole);
        } catch (error) {
            req.logger.error('Error al cambiar el rol del usuario:', error);
        }
    };
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

