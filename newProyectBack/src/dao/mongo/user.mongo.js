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
    async delete(uid){
        try {
            return await this.userModel.findOneAndDelete({_id: uid})
        } catch (error) {
            return new Error(error)
        }
    }
}

module.exports = UserManagerDao