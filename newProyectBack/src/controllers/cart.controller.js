const {cartService} = require("../services/index")
const { CartModel } = require("../dao/mongo/models/cart.model")
const {productService} = require("../services/index")
const { ProductModel } = require("../dao/mongo/models/product.models")
const { id_ID } = require("@faker-js/faker")


class CartController {

    get = async (req, res)=>{
        try {
            let carts = await cartService.getCarts()
            res.status(200).send(carts)
        } catch (error) {
            console.log(error)
        }
    }

    getById = async (req, res)=>{
        const {cid} = req.params
        try {
            const cart = await cartService.getCart(cid)
            if (!cart){
                return res.status(400).send({status:'error',mensaje:"Carrito no encontrado"})
            }
            console.log(cart)
            res.status(200).send({status:'ok', payload: cart})
        } catch (error) {
            console.log(error)
        }
    }
 
    create = async (req, res)=>{
        try {
            const {uid} = req.params
            let cart = await cartService.createCart(uid)
            if (!cart){
                return res.status(400).send({status:'error',mensaje:"No se pudo crear carrito"})
            }
            res.status(200).send({status:'success', payload: cart})
        } catch (error) {
            console.log(error)
        }
    }

    addProduct = async (req, res)=>{
        const {cid, pid} = req.params
        // valid product id
        const product= await productService.getProduct(pid)
        if (!product) return res.status(400).send({status:'error',message:'El producto indicado no existe'})

        if (!req.session.user?.userRegistered) return res.status(400).send({status:'userNotLogedIn',message:'Usuario no registrado'})
        const quantity = req.body.quantity | 1 

        try {
            const response = await cartService.addProduct(cid, pid, quantity) 
            if (response.status==="error"){
                return res.status(400).send(response)
            }else{
                return res.status(200).send(response)
            }       
        } catch (error) {
            console.log(error)
        }
    } 

    addProductArray = async (req, res)=>{
        const {cid} = req.params
        const {products} = req.body
        console.log(products)
        let allProductsOk= true

        for (const item of products) {
            const exist= await productValid(item.product)
            if (!exist) {allProductsOk= false
                break
            }
        }
        if (!allProductsOk) return res.status(400).send({status:'error',message:'El producto indicado no existe'})
        // All the products ids are valid 
        try {

            const response = await cartService.modifyProducts(cid, products) 
            if (response.status==="error"){
                return res.status(400).send(response)
            }else{
                return res.status(200).send(response)
            }       
        } catch (error) {
            console.log(error)
        }
    }
    async  productValid(pid) {
        exist= await productService.getProduct(pid)
        return !!exist
    } 

    deleteProduct = async (req, res)=>{
        const {cid, pid} = req.params
        try {
            const response = await cartService.deleteProduct(cid, pid) 
            if (response.status==="error"){
                return res.status(400).send(response)
            }else{
                return res.status(200).send(response)
            }       
        } catch (error) {
            console.log(error)
        }
    }

    deleteAllProducts = async (req, res)=>{
        const {cid} = req.params
        try {
            const response = await cartService.deleteAllProducts(cid)
            if (response.status==="error"){
                return res.status(400).send(response)
            }else{
                return res.status(200).send(response)
            }       
        } catch (error) {
            console.log(error)
        }
    }
    cartPurchase = async (req, res) => {
        const { cid } = req.params;
        try {
            // Obtén el carrito y verifica que exista
            const cart = await CartModel.findById(cid).populate('products.productId');
            if (!cart) {
                return res.status(404).json({ error: 'Carrito no encontrado' });
            }
                // Verifica el stock de los productos en el carrito
            const productsToUpdate = [];
            for (const product of cart.products) {
                const { productId, quantity } = product;
                // Verifica que el producto exista y tenga suficiente stock
                const existingProduct = await ProductModel.findById(productId);
                if (!existingProduct) {
                    return res.status(404).json({ error: `Producto con ID ${productId} no encontrado` });
                }
            if (existingProduct.stock >= quantity) {
                // Actualiza el stock del producto
                const updatedStock = existingProduct.stock - quantity;
                existingProduct.stock = updatedStock;
                productsToUpdate.push(existingProduct);
            } else {
                // Si el producto no tiene suficiente stock, no se agrega al proceso de compra
                return res.status(400).json({ error: `Producto con ID ${productId} no tiene suficiente stock` });
            }
            }
            // Actualiza el stock de los productos en la base de datos
            for (const product of productsToUpdate) {
                await product.save();
            }
            // Realiza cualquier otra lógica necesaria para finalizar la compra
            // ...
            // Elimina el carrito después de la compra
            await cartService.delete(cid);
            res.json({ message: 'Proceso de compra finalizado con éxito' });
        } catch (error) {
            console.error('Error al finalizar el proceso de compra:', error);
            res.status(500).json({ error: 'Error al finalizar el proceso de compra' });
        }
    };

    //generar codigos para los tikets uuidv4()

    /* {
        id_ID
        prudcutrc
        quiantiti
    } */

    crateTicket = async (req, res) => {
        const { cid } = req.params
        const cart = await cartService.getCart(cid)
        // validacion que exista cart if()
        //if(!cart) return
        
        const productNoComprado = []

        for (const item in cart.product){
            const product = item.product
            const quantity = item.quantity
            const stock = item.product.stock
        
            if(quantity >= stock){
                productNoComprado.push(product)
            }else{
                const response = productService.updateProduct(product, { quantity: stock-quantity})
            }
        }

        
        const arrayProductoComprables = cart.product.filter(product => !productNoComprado.includes(item.product._id)).reduce()
        
        
        if (productNoComprado.length > 0) {
            //quitar de mi carrito los que si se compraron
            upate()
            } else {
            await cartService.delete(cid)
        }
    
    //crear service tickets
    const tiket = await tiketService.creatreTicket({
        user: req.user.email,
        code: "", //uuidv4 -> id mongoose, numero
        products: cart.product,
        amount: cart.product.filter(product => !productNoComprado.includes(item.product._id)).reduce(),
        purchaser: req.user.mail
        
        
    })


    }

}
module.exports = new CartController()