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
            req.logger.http('Error al ver los carritos', error);
            req.logger.error('Error al ver los carritos', error);
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
            req.logger.http('Error al encontrar el carrito', error);
            req.logger.error('Error al encontrar el carrito', error);
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
            req.logger.http('Error al crear carrito', error);
            req.logger.error('Error al crear carrito', error);
        }
    }

    addProduct = async (req, res, next)=>{
        const {cid, pid} = req.params
        // valid product id
        const product= await productService.getProduct(pid)

        const user = req.user;

        if (!product){
            req.logger.warn("el producto no existe, prueba con otro id")
            req.logger.http("el producto no existe, prueba con otro id")
        }

        if (!user) return res.status(400).send({status:'userNotLogedIn',message:'Usuario no registrado'})

        if (user.role === 'premium' && product.owner === user.email) {
            req.logger.info("No puedes agregar tu propio producto al carrito")
          }

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
            req.logger.http('Error al añadir el producto', error);
            req.logger.error('Error al añadir el producto', error);
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
            req.logger.http('Error al borrar el producto del carrito', error);
            req.logger.error('Error al borrar el producto del carrito', error);
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
            req.logger.http('Error al borrar el carrito', error);
            req.logger.error('Error al borrar el carrito', error);
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
                console.log("ITEM QUANTITY: ", quantity)
                // Verifica que el producto exista y tenga suficiente stock
                const existingProduct = await productService.getProduct(pid);
                console.log("Producto stock  "+existingProduct.stock)
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
                    const updatedStock = existingProduct.stock - quantity;
                    console.log("stock update:  "+ updatedStock)
                    // Actualiza el stock de los productos en la base de datos
                    await productService.update(pid, {stock: updatedStock})
                }
            }

            const productsDisponibles = cart.products.filter((product) => !productsNoStock.includes(product.product._id));
            console.log("Productos disponibles:", productsDisponibles);

                if (productsNoStock.length > 0) {

                    console.log("Productos sin stock:  --------", productsNoStock)
                    await cartService.updateProductsCart(cid, productsNoStock)
                    console.log("PRODUCTS NOT STOCK-------------", productsNoStock)

                    const ticketData = {
                        code: uuid4(), //uuidv4
                        purchaser: req.user.email,
                        products: productsDisponibles,
                        amount: productsDisponibles.reduce((total, item) => total + (item.quantity * item.product.price), 0),
                    }
                    const newTicket = await ticketService.createTicket(ticketData)
                    req.logger.http('Proceso de compra finalizada con exito, los productos que están a falta de stock son: ', productsNoStock);
                    req.logger.info('Proceso de compra finalizada con exito, los productos que están a falta de stock son: ', productsNoStock);
                    res.send({
                        success: "ok",
                        message: "Algunos productos no tienen suficiente stock",
                        ticket: newTicket,
                        unavailableProducts: productsNoStock
                    })

                } else {
                    const amountt = productsDisponibles.reduce((total, item) => total + (item.quantity * item.product.price), 0);
                    console.log("amouunt"+ amountt)
                    const ticketData = {
                        code: uuid4(),
                        purchaser: req.user.email,
                        products: productsDisponibles,
                        amount: productsDisponibles.reduce((total, item) => total + (item.quantity * item.product.price), 0),
                    }
                    console.log("TicketData:", ticketData);

                    req.logger.http('Proceso de compra finalizada con exito', ticketData);
                    req.logger.info('Proceso de compra finalizada con exito', ticketData);
                    const newTicket = await ticketService.createTicket(ticketData)
                    await cartService.deleteAllProducts(cid);
                    res.send({
                        success: "ok",
                        message: "Compra realizada con exito",
                        ticket: ticketData,
                    })
            }
        } catch (error) {
            req.logger.http('Error al finalizar la compra', error);
            req.logger.error('Error al finalizar la compra', error);
            res.status(500).send({ error: 'Error al finalizar el proceso de compra' });
        }
    }
}

module.exports = new CartController()