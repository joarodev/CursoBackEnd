const { userService } = require("../services")
const { uploader } = require("../utils/multer")
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
            console.log(error)
        }
    }
    getUser = async (req, res) => {
        try{
            let { uid } = req.params
            let user = await userService.getUser(uid)
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
            const { uid } = req.params;

    // Verificar si los documentos necesarios están cargados antes de actualizar a premium
        const documentsUploaded = await userService.checkDocs(uid);
        if (documentsUploaded) {
            // Actualizar al usuario a premium
            const updatedUser = await userService.updateRole(uid);

            if (!updatedUser) {
                return res.status(404).send({ status: 'error', message: 'No se encontró el usuario' });
            }

            req.logger.info('Usuario actualizado a premium');
            return res.status(200).send({ status: 'success', message: 'Usuario actualizado a premium' });
        } else {
            return res.status(400).send({ status: 'error', message: 'Cargue los documentos requeridos antes de actualizar a premium' });
        }
        } catch (error) {
            req.logger.error('Error al cambiar el rol del usuario:', error);
        }
    };

    profileUser = async (req, res) => {
        try {
            const {first_name, _id, role, email} = req.user

            res.render('myProfile', { 
                id: _id,
                name: first_name,
                role: role,
                email: email
            });
        } catch (error) {
            console.log(error)
            req.logger.error('Error al cargar el perfil', error);
        }
    }

    uploadDocuments = async (req, res) =>{
        const { uid } = req.params
        const { document } = req.files;
        console.log("uploadedFiles desde controller: ----", document)
        console.log(document)
        
        const user = userService.getUser(uid)
        if(!user){
            req.logger.error("No se encontró el usuario")
        }
        console.log(user)

        if(!document){
            req.logger.error("No se subio el documento")
        }

        const userDocFiles = userService.uploadFileDocument(user._id, document)

        //validación para doc
        if(!userDocFiles)(
            req.logger.error("error al subir el archivo"),
            res.status(404).send({status: "error", message: "No se cargaron los archivos"})
        )
        
        req.logger.info("Documentos subidos exitosamente")
        return res.status(200).send({status: "success", message: "Documentos subidos exitosamente"})
    }

    uploadProdImage = async(req, res) => {
        try {
            res.status(200).send({
                status: "success",
                message: "Imagen de producto subido correctamente"
            })
        } catch(error) {
            console.log("Error al subir imagen del producto",error)
            req.logger.error("Error al subir la imagen del producto")
        }
    }
    uploadProfileImage = async(req, res) => {
        try {

            const fileImage = req.file
            console.log("Archivo por controlador", fileImage)

            if(!fileImage){
                req.logger.error("Error al enviar el archivo")
                console.log("Error al enviar el archivo")
            }

            res.status(200).send({
                status: "success",
                message: "Imagen de perfil subida correctamente", fileImage
            })
        } catch (error) {
            console.log("Error al subir la imagen de perfil",error)
            req.logger.error("Error al subir la imagen de perfil")
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

