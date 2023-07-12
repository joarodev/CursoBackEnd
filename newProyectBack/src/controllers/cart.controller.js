const {cartService, productService, ticketService} = require("../services/index")
const { CartModel } = require("../dao/mongo/models/cart.model")
const uuid4 = require("uuid4")
const { addToCart } = require("../utils/CustomError/info")
const { EError } = require("../utils/CustomError/EErrors")

class CartController {


    get = async (req, res)=>{
        try {
            let carts = await cartService.getCarts()
            res.status(200).send(carts)
        } catch (error) {
            console.log(error)
        }
    }

    getCartById = async (req, res)=>{
        const {cid} = req.params
        try {
            const cart = await cartService.getById(cid)
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

    addProduct = async (req, res, next)=>{
        const {cid, pid} = req.params
        // valid product id
        const product= await productService.getProduct(pid)

        if (!product) return res.status(400).send({status:'error',message:'El producto indicado no existe'})

        if (!req.user) return res.status(400).send({status:'userNotLogedIn',message:'Usuario no registrado'})
        const quantity = req.body.quantity | 1 

        try {
            const response = await cartService.addProduct(cid, pid, quantity)
            if(response.status === "error"){
                CustomError.createError({
                    name: "Error add to cart",
                    cause: addToCart({
                        title: product.title
                    }),
                    message: "Error add product to cart",
                    code: EError.ADD_PRODUCT_CART
                })
            }
            res.status(200).send(response)       
        } catch (error) {
            next(error)
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
            console.log(cart)
            if (!cart) {
                return res.status(404).send({ error: 'Carrito no encontrado' });
            }
                // Verifica el stock de los productos en el carrito
            const productsNoStock = [];

            for (const item of cart.products) {
                const product = item.product
                const price = item.product.price
                const quantity = item.quantity
                const stock = item.product.stock
                const pid = item.product._id

                // Verifica que el producto exista y tenga suficiente stock
                const existingProduct = await productService.getProduct(pid);
                console.log("Producto stock"+existingProduct.stock)
                if (!existingProduct) {
                    return res
                    .status(404)
                    .send({ error: `Producto con ID ${pid} no encontrado` });
                }
                if (quantity > existingProduct.stock) {

                // Si el producto no tiene suficiente stock, no se agrega al proceso de compra
                    productsNoStock.push(pid)
                    console.log(`Producto con ID ${pid} no tiene suficiente stock`)
                    //return res.status(400).json({ error: `Producto con ID ${pid} no tiene suficiente stock` });

                } else {
                    // Actualiza el stock del producto
                    ("quantity"+quantity)
                    const updatedStock = existingProduct.stock - quantity;
                    console.log("stock update::::"+ updatedStock)
                    // Actualiza el stock de los productos en la base de datos
                    await productService.update(pid, {stock: updatedStock})
                }
            }
            // Realiza cualquier otra lógica necesaria para finalizar la compra
            const productsDisponibles = cart.products.filter((product) => !productsNoStock.includes(product.product._id));
            console.log("Productos disponibles:", productsDisponibles);
                
                if (productsNoStock.length > 0) {

                    const ticketData = await ticketService.createTicket({
                        code: uuid4(), //uuidv4
                        purchaser: req.user.email,
                        products: productsDisponibles,
                        amount: productsDisponibles.reduce((total, item) => total + (item.quantity * item.product.price), 0),
                    })
                    console.log("sin stock"+ticketData.amount)
    
                    res.send({
                        success: false,
                        message: "Algunos productos no tienen suficiente stock",
                        ticket: ticketData,
                        unavailableProducts: productsNoStock
                    })
                } else {
                    //console.log("Productos en el carrito:", cart.products);
                    /* function calculateTotal(products){
                        let total = 0;
                        for(const item of products){
                            const quantity = item.quantity;
                            const price = item.product.category;
                            console.log("quantity producto: "+ quantity)
                            console.log("precio producto: "+ price)
                            total += quantity * price;
                        }
                        console.log("el total es: "+ total)
                            return total;
                    } */

                    const amountt = productsDisponibles.reduce((total, item) => total + (item.quantity * item.product.price), 0);
                    console.log("amouunt"+ amountt)

                    const ticketData = await ticketService.createTicket({
                        code: uuid4(), //uuidv4
                        purchaser: req.user.email,
                        products: cart.products.map((item) => item.product),
                        amount: productsDisponibles.reduce((total, item) => total + (item.quantity * item.product.price), 0),
                    })
                    console.log("TicketData:", ticketData);

                    res.send({
                        success: true,
                        message: "Proceso de compra finalizado con éxito",
                        ticket: ticketData,
                    })
                    await cartService.deleteAllProducts(cid);
                }
        } catch (error) {
            console.error('Error al finalizar el proceso de compra:', error);
            res.status(500).json({ error: 'Error al finalizar el proceso de compra' });
        }
    };

}
module.exports = new CartController()