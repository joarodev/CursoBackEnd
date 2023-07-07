const {cartService, productService, ticketService} = require("../services/index")
const { CartModel } = require("../dao/mongo/models/cart.model")
const { id_ID } = require("@faker-js/faker")
const uuid4 = require("uuid4")

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
        try {
            const { cid } = req.params;
            // Obtén el carrito y verifica que exista
            const cart = await cartService.getById(cid);
            if (!cart) {
                return res.status(404).json({ error: 'Carrito no encontrado' });
            }
                // Verifica el stock de los productos en el carrito
            const productsNoStock = [];

            for (const item of cart.products) {
                const product = item.product
                const quantity = item.quantity
                const stock = item.product.stock
                const pid = item.product._id

                // Verifica que el producto exista y tenga suficiente stock
                const existingProduct = await productService.getById(pid);
                if (!existingProduct) {
                    return res.status(404).json({ error: `Producto con ID ${pid} no encontrado` });
                }
                if (quantity > existingProduct.stock) {

                // Si el producto no tiene suficiente stock, no se agrega al proceso de compra
                    productsNoStock.push(pid)
                    console.log(`Producto con ID ${pid} no tiene suficiente stock`)
                    //return res.status(400).json({ error: `Producto con ID ${pid} no tiene suficiente stock` });

                } else {
                    // Actualiza el stock del producto
                    const updatedStock = existingProduct.stock - quantity;
                    // Actualiza el stock de los productos en la base de datos
                    await productService.update(pid, {stock: updatedStock})
                }
            }

            // Realiza cualquier otra lógica necesaria para finalizar la compra

            cart.products = cart.products.filter((product) => !productNoPucharse.includes(product._id))

            if (productsNoStock.length > 0) {
                
                const ticketData = await ticketService.createTicket({
                    code: uuid4(), //uuidv4
                    amount: calculateTotal,
                    purchaser: req.user.email,
                    products: cart.pro
                })
                await ticketService.createTicket(ticketData)
                
            } else {
                await cartService.delete(cid);
            }
            
            // Elimina el carrito después de la compra
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
        
        const productNoPucharse = []

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
    const ticket = await ticketService.creatreTicket({
        user: req.user.email,
        code: uuid4(), //uuidv4 -> id mongoose, numero
        products: cart.product,
        amount: cart.product.filter(product => !productNoComprado.includes(item.product._id)).reduce(),
        purchaser: req.user.mail
        
        
    })


    }

}
module.exports = new CartController()