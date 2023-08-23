const { UserModel } = require("./models/user.model")

class UserManagerDao {
    constructor(){
        this.userModel = UserModel
    }

    async get(){
        try {
            return await this.userModel.find({})
        }catch(err){
            return new Error(err)
        }
    }
    async getById(uid){
        try{
            return await this.userModel.find({_id: uid})
        } catch(error){
            return new Error(error)
        }
    }
    async getByEmail(email){
        try {
            const user = await this.userModel.find({email: email})
            return user
        } catch (error) {
            return new Error(error)
        }
    }
    async create(newUser){
        try {
            return await this.userModel.create(newUser)
        } catch (error) {
            return new Error(error)
        }
    }
    async update(uid, userToRemplace){
        try {
            await this.userModel.findOneAndupdate({_id: uid}, userToRemplace)
        } catch (error) {
            return new Error(error)
        }
    }
    async updateRole(uid, newRole){
        try {
            const user = await this.userModel.findById({_id: uid})
            if(!user){
                throw new Error("Usuario no encontrado")
            }
            user.role = newRole;
            await user.save();
            return user
        } catch (error) {
            return new Error(error)
        }
    }
    updateUserPassword = async (userId, newPassword) => {
        try {
            const user = await this.userModel.findById({_id: userId});
            if (!user) {
            throw new Error('Usuario no encontrado');
            }
            user.password = newPassword;
            await user.save();
            return user;
        } catch (error) {
            console.error('Error al actualizar la contraseña del usuario:', error);
            throw error;
        }
    }
    lastConnection = async (userId, Date) => {
        try {
            const user = await this.userModel.findById({_id: userId});
            if (!user) {
                throw new Error('Usuario no encontrado');
            }

            user.last_connection = Date;

            await user.save();
            return user;
            
        } catch (error) {
            console.error('Error al actualizar la contraseña del usuario:', error);
            throw error;
        }
    }
    uploadFileDocument = async(userID, documents) => {
        const user = await this.userModel.findById({_id: userID});

        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        // Actualizar el estado del usuario con los documentos cargados
       /*  if (profileImage) {
            user.profileImage = profileImage[0].path;
        }
        if (productImage) {
            user.productImage = productImage[0].path;
        } */
        if (documents) {
            for (const doc of documents) {
                user.documents.push({
                    name: doc.originalname,
                    reference: doc.path,
                });
            }
        }
        await user.save();
        return user.documents;
    }

    checkDocs = async(userID) => {
        const user = await this.userModel.findById(userID);

        if (!user) {
            return false;
        }

        // Verificar la presencia de documentos requeridos
        const requiredDocuments = ['Identificación', 'Comprobante de domicilio', 'Comprobante de estado de cuenta'];
        const uploadedDocumentNames = user.documents.map(doc => doc.name);
        const allRequiredDocumentsUploaded = requiredDocuments.every(doc => uploadedDocumentNames.includes(doc));

        return allRequiredDocumentsUploaded;


        //editar



    }

    async delete(uid){
        try {
            return await this.userModel.findOneAndDelete({_id: uid})
        } catch (error) {
            return new Error(error)
        }
    }
}

module.exports = UserManagerDao