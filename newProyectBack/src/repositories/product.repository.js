class ProductRepository {
    constructor(dao){
        console.log(dao)
        this.dao = dao
    }
    getProducts(){
        return this.dao.get()
    }
    getById(pid){
        console.log("Repository"+pid)
        return this.dao.getById(pid)
    }
    createProduct(newProduct){
        return this.dao.create(newProduct)
    }
    updateProduct(pid){
        return this.dao.update(pid)
    }
    deleteProduct(pid){
        return this.dao.delete(pid)
    }
}

module.exports = ProductRepository