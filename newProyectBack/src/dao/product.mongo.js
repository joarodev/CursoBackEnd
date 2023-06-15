const { ProductModel } = require("./models/product.models");

class ProductDaoMongo{
    constructor(){
        this.product = ProductModel
    }

    async get(){
        try{
            return await this.product.find({})
        }catch(err){
            return new Error(err)
        }
    }
    async getById(pid){
        try{
            return await this.product.findOne({_id: pid})
        } catch(error){
            return new Error(error)
        }
    }
    async create(newProduct){
        try {
            return await this.product.create(newProduct)
        } catch (error) {
            return new Error(error)
        }
    }
    async update(pid, prodToRemplace){
        try {
            await this.product.updateOne({_id: pid}, prodToRemplace)
        } catch (error) {
            return new Error(error)
        }
    }
    async delete(pid){
        try {
            return await this.product.deleteOne({_id: pid})
        } catch (error) {
            return new Error(error)
        }
    }
}

/* class Product {
    constructor(first, last){
        
    }
} */

module.exports = new ProductDaoMongo