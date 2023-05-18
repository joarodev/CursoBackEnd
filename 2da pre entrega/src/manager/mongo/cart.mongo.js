const { cartModel } = require("./models/cart.model")

class CartManager {

    async getCartById(cid){
        try {
            return await cartModel.findOne({_id: cid})
        }catch(err){
            return new Error(err)
        }
    }

    async getCarts() {

        try {
            return await cartModel.find({})
        } catch (error) {
            return new Error(error)
        }
    }

    async createCart(userId) {
        try {
            // first verify if there is a cart for the user
            console.log(userId)
            let cart = await cartModel.findOne({clientId: userId})
            console.log(cart)
            if (cart){
                // I already have a cart
                return cart
            }
            cart= {
                clientId: userId,
                products: []
            }
            return await cartModel.create(cart)
        } catch (error) {
            return new Error(error)
        }
    }

    async addProduct(cid, pid, quantity) {
        const cart= await cartModel.findById(cid)
        if (!cart){
            return {status: "error", message: "Carrito no encontrado"}
        }
        const productIndex = cart.products.findIndex(prod =>prod.product._id.toString()===pid)
        console.log(productIndex)
        if (productIndex===-1){
            // the product isn´t in the cart. Add it
            console.log('agrego')
            cart.products.push({product: pid, quantity})

        } else {
            // the product already exists in the cart
            console.log("actualizo")
            cart.products[productIndex].quantity+= quantity
        }

        // save the updated cart
        await cart.save()

        return {status: "succes", cart}

    }


}


module.exports = new CartManager