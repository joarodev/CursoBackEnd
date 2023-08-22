class UserRepository {
    constructor(dao){
        this.dao = dao
    }
    getUsers(){
        return this.dao.get()
    }
    getUser(pid){
        return this.dao.getById(pid)
    }
    getEmail(email){
        return this.dao.getByEmail(email)
    }
    createUser(newUser){
        return this.dao.create(newUser)
    }
    updateUserPassword(uid,newPassword){
        return this.dao.updateUserPassword(uid, newPassword)
    }
    lastConnection(uid, date){
        return this.dao.lastConnection(uid, date)
    }
    updateUser(pid){
        return this.dao.update(pid)
    }
    updateRole(uid, newRole){
        return this.dao.updateRole(uid, newRole)
    }
    uploadFile(uid,documents){
        return this.dao.uploadFile(uid, documents)
    }
    deleteUser(pid){
        return this.dao.delete(pid)
    }
}

module.exports = UserRepository