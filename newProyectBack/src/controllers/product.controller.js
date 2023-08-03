const {productService} = require("../services/index")
const {ProductModel} = require("../dao/mongo/models/product.models")
const { format } = require("morgan")
const mockingService = require("../utils/Faker")
const { CustomError } = require("../utils/CustomError/CustomError")
const { ModificationProductError } = require("../utils/CustomError/info")
const { sendMail, sendEmail } = require("../utils/sendmail")

class ProductController {

    mockingProducts = async (req, res) => {
            try {
                const products = mockingService.generateMockProducts();
                console.log(products);
                res.send({ status: 'success', payload: products });
            } catch (error) {
                req.logger.http('Error al encontrar los productos en la base de datos', error);
                req.logger.error('Error al encontrar los productos en la base de datos', error);
            }
        }
    
    
    getProducts = async (req, res) => {
        try {
            const { page = 1 } = req.query
            const products = await ProductModel.paginate(
                {},
                { limit: 3, page: page, lean: true }
            )
            const { docs, hasPrevPage, hasNextPage, prevPage, nextPage } = products
            const { first_name, role, email } = req.user
            res.render('productView', {
                status: 'success',
                userName: first_name,
                userEmail: email,
                userRole: role,
                products: docs,
                hasPrevPage,
                hasNextPage,
                prevPage,
                nextPage,
            })
        } catch (error) {
            req.logger.http('Error al encontrar los productos', error);
            req.logger.error('Error al encontrar los productos', error);
        }
}

    getProduct = async (req,res)=>{
        try {
            const {pid} = req.params
            //console.log(pid)
            let product = await productService.getProduct(pid)
            res.status(200).send({
                status: 'success',
                payload: product
            })
        } catch (error) {
            req.logger.http('Error al encontrar el producto', error);
            req.logger.warn("Error al encontrar el producto", error);
        }
    }

    addProduct = async (req, res, next)=>{
        try {
            const {title, description, thumbnail, price, stock, code} = req.body
            console.log(req.user)
            const userRole = req.user.role

            if(userRole === "user"){
                req.logger.error("No tiene el rol necesario para crear un producto")
            }

            
            if(!title || !description || !thumbnail || !price || !stock || !code){
                CustomError.createError({
                    name: "Add product error",
                    cause: LoginUserGitHub({
                        title: title
                    }),
                    message: "Product not added to cart",
                    code: EError.INVALID_TYPE_ERROR
                })
            }
            
            let owner = "admin"
            if(userRole === "premium"){
                owner = req.user.username
            }
            const newProduct = {
                title: title,
                description: description,
                thumbnail: thumbnail,
                price: price,
                stock: stock,
                code: code,
                owner: owner
            }
            console.log("New Producto es---------------------:", newProduct)

            console.log(`El nuevo producto es ${newProduct.title} y fue creado por ${owner}`)
            let result = await productService.createProduct(newProduct)
            let subjet = "Nuevo Producto Creado"
            let html = `<h1> Producto ${newProduct.title} creado con exito</h1><br>
                        <h3>Create by: ${owner}</h3>`
            sendEmail("joaquinrodriguez0012@gmail.com", subjet, html)
            console.log("Producto final-----------",result)
    
            req.logger.info("Producto creado correctamente")
            res.send({ message: "success", payload: result })
        } catch (error) {
            req.logger.http('Error al agregar un producto', error);
            req.logger.error('Error al agregar un producto', error);
            next(error)
        }
    }

    updateProduct = async (req, res) => {
        try {
            const { pid } = req.params
            const modification = req.body

            const product = productService.getProduct(pid)
            console.log("Product update: ", product)

            if(!product){
                req.logger.error("No se ah encontrado el producto")
                req.logger.http("No se ah encontrado el producto")
            }

            if(!modification.title || !modification.description || !modification.price || !modification.thumbnail || !modification.code || !modification.stock || !modification.category ){
                req.logger.error("No se ah ingresado todos los datos, no se creó el producto")
                req.logger.http("No se ah ingresado todos los datos, no se creó el producto")
            }

            if(!!modification.title || !modification.description || !modification.price || !modification.thumbnail || !modification.code || !modification.stock || !modification.category ){
                CustomError.createError({
                    name: "Add product error",
                    cause: ModificationProductError({
                        title: modification.title,
                        description: modification.description,
                        price: modification.price,
                        Code: !modification.code,
                        Stock: modification.stock,
                        category: modification.category,
                    }),
                    message: "Error login user",
                    code: EError.INVALID_TYPE_ERROR
                })
            }

            let prodToRemplace = {
                title: modification.title,
                description: modification.description,
                price: modification.price,
                thumbnail: modification.thumbnail,
                code: modification.code,
                stock: modification.stock,
                category: modification.category
            }

            const user = req.user;

            if(user.role === "premium" && product.owner !== user.email){
                req.logger.error("No tienes los permisos necesarios para realizar esta acción")
                res.logger.htpp("No tienes los permisos necesarios para realizar esta acción")
            }

            let result = await productService.update(pid, prodToRemplace)

            req.logger.info("Se modifico el producto")
            res.send({
                status: "success",
                message: "Se modifico el producto",
                payload: result,
            })
            
        } catch (error) {
            req.logger.http('Error al actualizar producto', error);
            req.logger.error('Error al actualizar producto', error);
        }
    
}

    deleteProduct = async (req, res) => {
    try {
        let { pid } = req.params;
        const product = await productService.getProduct(pid)
        console.log(product)

        if(!product){
            req.logger.error("El producto no existe")
            res.logger.htpp("El producto no existe")
        }

        const user = req.user;

        if(user.role === "premium" && product.owner !== user.email){
            req.logger.error("No tienes los permisos necesarios para realizar esta acción")
            res.logger.htpp("No tienes los permisos necesarios para realizar esta acción")
        }

        let result = await productService.delete(pid)
        req.logger.info("Producto eliminado correctamente")
        res.send({
            status: "success",
            message: "Producto eliminado correctamente",
            payload: result
        })
    } catch (error) {
        req.logger.http('Error al borrar producto', error);
        req.logger.error('Error al borrar producto', error);
        return {status: 'error', error}
    }
}
}

module.exports = {ProductController}