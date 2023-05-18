const { userModel } = require("./models/user.model")

class UserManager {
    async getUsers(){
        try {
            return await userModel.find({})
        }catch(err){
            return new Error(err)
        }
    }
    async getUserById(uid){
        try{
            return await userModel.findOne({_id: uid})
        } catch(error){
            return new Error(error)
        }
    }
    async addUser(newUser){
        try {
            return await userModel.create(newUser)
        } catch (error) {
            return new Error(error)
        }
    }
    async updateUser(uid, userToRemplace){
        try {
            await userModel.updateOne({_id: uid}, userToRemplace)
        } catch (error) {
            return new Error(error)
        }
    }
    async deleteUser(uid){
        try {
            return await userModel.deleteOne({_id: uid})
        } catch (error) {
            return new Error(error)
        }
    }
}

module.exports = UserManager