const { ProductModel } = require("./models/product.models");

class ProductDaoMongo{
    constructor(){
        this.product = ProductModel
    }

    async getProduct(){
        try{
            return await this.product.find({})
        }catch(err){
            return new Error(err)
        }
    }
    async getProductById(pid){
        try{
            return await this.product.findOne({_id: pid})
        } catch(error){
            return new Error(error)
        }
    }
    async addProduct(newProduct){
        try {
            return await this.product.create(newProduct)
        } catch (error) {
            return new Error(error)
        }
    }
    async updateProduct(pid, prodToRemplace){
        try {
            await this.product.updateOne({_id: pid}, prodToRemplace)
        } catch (error) {
            return new Error(error)
        }
    }
    async deleteProduct(pid){
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