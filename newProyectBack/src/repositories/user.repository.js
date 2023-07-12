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
    createUser(newUser){
        return this.dao.create(newUser)
    }
    updateUser(pid){
        return this.dao.update(pid)
    }
    deleteUser(pid){
        return this.dao.delete(pid)
    }
}

module.exports = UserRepository