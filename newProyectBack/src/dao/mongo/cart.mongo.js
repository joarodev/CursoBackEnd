const { cartModel } = require("../models/cart.model")

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

    async createCart(uid) {
        try {
            console.log(uid)
            let cart = await cartModel.findOne({clientId: uid})
            console.log(cart)
            if (cart){
                return cart
            }
            cart= {
                clientId: uid,
                products: [],
                quantity: 0,
            }
            res.send(cart)
            return await cartModel.create(cart)
        } catch (error) {
            return new Error(error)
        }
    }

    async addProduct(cid, pid, quantity) {
        try {
            
            const respUpdate = await cartModel.findOneAndUpdate(
            {_id: cid, "products.product": pid},
            {$inc: {"products.$.quantity": quantity}},
            {new: true}
            )

            if (respUpdate){
                res.send("Producto añadido")
            } else {
                await cartModel.findByIdAndUpdate(
                    {_id: cid},
                    {$push: {products: {product: pid, quantity}}},
                    {new: true, upsert: true}
                )
                res.send("producto añadido")
            }
        } catch (error) {
            
        }
    }

    async deleteProductCart(cid, pid) {
        try {
            const cart = await cartModel.findOneAndUpdate(
                {_id: cid},
                {$pull: {products: {product: pid}}},
                {new: true}
                );
            await cart.save()
            return {status: "succes", cart}
        } catch (error) {
            return {status: error, message: "No se elimino el producto del carrito"}
        }
    }

    async deleteManyProducts(cid) {
        try {
            const cart = await cartModel.findOneAndUpdate(
                {_id: cid},
                {$set: {products: []}},
                {new: true}
                );
            await cart.save()
            return {status: "succes", cart}
        } catch (error) {
            return {status: error, message: "Se a eliminado el carrito"}
        }
    }

}


module.exports = new CartManager