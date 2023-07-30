const { CartModel } = require("../mongo/models/cart.model")

class CartDaoMongo {

    async get(){
        try {
            return await CartModel.find({})
        } catch (error) {
            return new Error(error)
        }
    }

    async getById(cid){
        try {
            return await CartModel.findOne({_id: cid})
            .populate("products.product")
            .lean()
        }catch(err){
            return new Error(err)
        }
    }

    async getEmail(userEmail) {
        try {
            return await CartModel.findOne({clientId: userEmail})
        } catch (error) {
            return new Error(error)
        }
    }

    async create(uid) {
        try {
            // first verify if there is a cart for the user
            const cart= {
                clientId: uid,
                products: []
            }
            return await CartModel.create(cart)

        } catch (error) {
            return new Error(error)
        }
    }

    async addProduct(cid, pid, quantity) {
        try {
            let cart = await CartModel.findOne({_id: cid})
            console.log(cart)
            if (!cart) return {status: "Error", message: "Carrito no encontrado"}

            const productIndex = cart.products.findIndex(prod =>prod.product._id.toString()===pid)

            if (productIndex === -1) {
                cart.products.push({product: pid, quantity})
            } else {
                cart.products[productIndex].quantity += quantity
            }
            await cart.save()
            return {status: "succes", message: "Producto agregado correctamente", productsQty:cart.products.length}
            
        } catch (error) {
            return new Error(error)
        }
    }

    async update(cid, pid, quantity) {
        try {
            
            const respUpdate = await CartModel.findOneAndUpdate(
            {_id: cid, "products.product": pid},
            {$inc: {"products.$.quantity": quantity}},
            {new: true}
            )

            if (respUpdate){
                res.send("Producto añadido")
            } else {
                await CartModel.findByIdAndUpdate(
                    {_id: cid},
                    {$push: {products: {product: pid, quantity}}},
                    {new: true, upsert: true}
                )
                req.logger.info("")
            }
        } catch (error) {
            
        }
    }

    async updateProductsCart(cid, productsNoStock){
        try {
            let cart = await CartModel.findById({_id: cid})
            console.log(cart)
            console.log("PNS DESDE MONGO: ",productsNoStock)
            if (!cart){
                console.log("Problema al encontrar el carrito")
            }
            cart.products = productsNoStock;
            await cart.save();
            console.log("carrito actualizado correctamente")
            return cart
        } catch (error) {
            console.log(error)
        }
    }

    async deleteProduct(cid, pid) {
        try {
            const cart = await CartModel.findOneAndUpdate(
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

    async delete(cid) {
        try {
            const cart = await CartModel.findOneAndUpdate(
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


module.exports = CartDaoMongo