class CartRepository {
    constructor(dao){
        this.dao = dao
    }
    getCarts(){
        return this.dao.get()
    }
    getById(pid){
        return this.dao.getById(pid)
    }
    getEmail(email){
        return this.dao.getEmail(email)
    }
    createCart(newProduct){
        return this.dao.create(newProduct)
    }
    addProduct(cid, pid, quantity){
        return this.dao.addProduct(cid, pid, quantity)
    }
    updateProduct(cid, pid, quantity){
        return this.dao.update(cid, pid, quantity)
    }
    delete(cid, pid){
        return this.dao.delete(cid, pid)
    }
    deleteAllProducts(cid){
        return this.dao.delete(cid)
    }
}

module.exports = CartRepository