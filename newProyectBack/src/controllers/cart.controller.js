const {cartService, productService, ticketService, userService} = require("../services/index")
const uuid4 = require("uuid4")
const { addToCart } = require("../utils/CustomError/info")
const { EError } = require("../utils/CustomError/EErrors")

class CartController {
    userCart = async (req, res) => {
        try {
            //const { uid } = req.params
            const { cart, first_name, last_name} = req.user
            const cartUser = await cartService.getById(cart)
                console.log("Cart user:::::",cartUser)
            if(!req.user){
                req.logger.error("No se encontró el usuario")
                res.status(404).send({
                    status: "Error",
                    message: "No se encontró el usuario"
                });
                return
            }
            if (!cart) {
                req.logger.error("El usuario no tiene un carrito asignado.");
                res.status(404).send({
                    status: "Error",
                    message: "El usuario no tiene un carrito asignado."
                });
                return;
            };

            const productsCart = cartUser.products.map(item => ({
                product: item.product,
                quantity: item.quantity,
                total: item.quantity * item.product.price,
            }));

            const totalCompra = productsCart.reduce((total, product) => total + product.total, 0);


            console.log("PRODUCTS CART:::::::",productsCart)
            res.status(200).render("userCart", {
                name: first_name+" "+last_name,
                products: productsCart,
                total: totalCompra,
                cartId: cart
            })
        } catch (error) {
            req.logger.error("Error al obtener el carrito", error)
        }
    }

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
            const user = userService.getUser(uid)
            if(!user){
                req.logger.error("No se encontró el usuario")
                res.status(404).send({
                    status: "Error",
                    message: "No se encontro el usuario para generar un carrito de compra"
                });
                return
            }
            let cart = await cartService.createCart(uid)
            if (!cart){
                req.logger.error("No se creó el carrito")
                res.status(400).send({
                    status:'error',
                    mensaje:"Error al crear el carrito"
                });
                return
            }
            
            req.logger.info("Se creo el carrito")
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
        if(!user){
            req.logger.error("No se encontró el usuario")
            res.status(400).send({
                status: "Error",
                message: "Necesita loguearse para realizar esta acción"
            });
            return
        };
        if (!product){
            req.logger.error("el producto no existe")
            res.status(404).send({
                status: "Error",
                message: "El producto no existe o no tiene stock"
            });
            return
        };
        if(user.role === 'premium' && product.owner.username === user.username) {
            req.logger.info("No puedes agregar tu propio producto al carrito")
            res.status(400).send({
                status: "Error",
                message: "No puedes agregar tu propio producto al carrito"
            });
            return
        };
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
                req.logger.error("Error al obtener el carrito")
                res.status(404).send({
                    status: "Error",
                    error: 'Carrito no encontrado'
                });
            };
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
                    req.logger.error("Producto no encontrado")
                    res.status(404).send({
                        status: "Error",
                        message: `Un producto no se encuentra en nuestra base de datos, id: ${pid}`
                    });
                    return
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
                    console.log()
                    if(!newTicket){
                        req.logger.error("No se generó el ticket de compra")
                        res.status(400).send({
                            status: "Error",
                            message: "Error al generar el ticket de compra"
                        });
                        return
                    };

                    req.logger.info('Proceso de compra finalizada con exito, los productos que están a falta de stock son: ', productsNoStock);
                    res.status(200).send({
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
                    req.logger.info('Proceso de compra finalizada con exito', ticketData);
                    const newTicket = await ticketService.createTicket(ticketData)
                    if(!newTicket){
                        req.logger.error("No se generó el ticket de compra")
                        res.status(400).send({
                            status: "Error",
                            message: "Error al generar el ticket de compra"
                        });
                        return
                    }
                    await cartService.deleteAllProducts(cid);
                    req.logger.info("Se generó el ticket correctamente")
                    res.status(200).send({
                        success: "ok",
                        message: "Compra realizada con exito",
                        ticket: newTicket,
                    })
            }
        } catch (error) {
            req.logger.error('Error al finalizar la compra', error);
            res.status(500).send({
                error: 'Error al finalizar el proceso de compra' });
        }
    }
}

module.exports = new CartController()