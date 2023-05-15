const { productModel } = require("./models/product.models");

class ProductManagerMongo{
    async getProduct(){
        try{
            return await productModel.find({})
        }catch(err){
            return new Error(err)
        }
    }
    async getProductById(pid){
        try{
            return await productModel.findOne({_id: pid})
        } catch(error){
            return new Error(error)
        }
    }
    async addProduct(newProduct){
        try {
            return await productModel.create(newProduct)
        } catch (error) {
            return new Error(error)
        }
    }
    async updateProduct(pid, prodToRemplace){
        try {
            await productModel.updateOne({_id: pid}, prodToRemplace)
        } catch (error) {
            return new Error(error)
        }
    }
    async deleteProduct(pid){
        try {
            return await productModel.deleteOne({_id: pid})
        } catch (error) {
            return new Error(error)
        }
    }
}

module.exports = new ProductManagerMongo