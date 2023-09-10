const {productService} = require("../services/index")
const {ProductModel} = require("../dao/mongo/models/product.models")
const { format } = require("morgan")
const mockingService = require("../utils/Faker")
const { CustomError } = require("../utils/CustomError/CustomError")
const { ModificationProductError, AddProductError } = require("../utils/CustomError/info")
const { sendMail, sendEmail, sendEmailDeleteProduct, sendEmailCreateProduct } = require("../utils/sendmail")
const { EError } = require("../utils/CustomError/EErrors")

class ProductController {

    mockingProducts = async (req, res) => {
            try {
                const products = mockingService.generateMockProducts();
                console.log(products);
                res.status(200).send({ status: 'success', payload: products });
            } catch (error) {
                req.logger.http('Error al encontrar los productos en la base de datos', error);
                req.logger.error('Error al encontrar los productos en la base de datos', error);
            }
        }
    getProductsJson = async (req,res) => {
        try {
            let products = await productService.getProducts()
            res.status(200).send({
                status: 'success',
                payload: products
            })
        } catch (error) {
            req.logger.http('Error al encontrar los productos', error);
            req.logger.warn("Error al encontrar los productos", error);
        }
    }
    getProducts = async (req, res) => {
        try {
            const { first_name, role, username, _id, cart} = req.user
            console.log("USER ROLE", role)
            let isAdmin = false
            if(role === "admin"){
                isAdmin = true
            }
            const { page = 1 } = req.query
            const products = await ProductModel.paginate(
                {},
                { limit: 3, page: page, lean: true }
            )
            const { docs, hasPrevPage, hasNextPage, prevPage, nextPage } = products

            console.log("USER IDDDD:::", _id)
            res.render('productView', {
                status: 'success',
                userId: _id,
                userName: first_name,
                userEmail: username,
                userRole: role,
                cartId: cart,
                isAdmin,
                products: docs,
                hasPrevPage,
                hasNextPage,
                prevPage,
                nextPage,
            })
        } catch (error) {
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
            req.logger.error("Error al encontrar el producto", error);
        }
    }

    addProduct = async (req, res, next)=>{
        try {
            const {title, description, thumbnail, price, stock, code, download, category} = req.body

            const userRole = req.user.role
            if(userRole === "user"){
                req.logger.error("No tiene el rol necesario para crear un producto")
                res.status(400).send({
                    status: "error",
                    message: "Debes ser usuario premium para crear un producto"
                });
                return
            };

            if(!title || !description || !thumbnail || !price || !stock || !code || !download || !category ){
                req.logger.error("No se ingresaron todos los datos del producto")
                res.status(400).send({
                    status: "error",
                    message: "Debes ingresar todos los datos del producto a crear"
                });
                return
            };

            let {_id, username, first_name, email, role, age} = req.user
            let owner = {
                _id,
                username,
                first_name,
                email,
                age,
                role
            }
            const product = {
                title: title,
                description: description,
                thumbnail: thumbnail,
                price: price,
                stock: stock,
                code: code,
                category: category,
                download: download,
                owner: owner
            }

            const newProduct = await productService.createProduct(product)
            console.log("NUEVO PRODUCTO: ", newProduct)
            if(!newProduct){
                req.logger.error("Error al crear el producto")
                res.status(400).send({
                    status: "Error",
                    message: "Error al crear el producto"
                });
                return
            }

            console.log("PRODUCTO CREADO; ", newProduct.title, " DE ", newProduct.owner.username)
            sendEmailCreateProduct(req.user.username, newProduct.title, newProduct.owner.username)

            req.logger.info("Producto creado correctamente", newProduct)
            res.status(200).send({
                status: "success",
                message: "Producto creado correctamente",
            });

        } catch (error) {
            req.logger.error('Error al agregar un producto', error);
            next(error)
        }
    }
    
    updateProduct = async (req, res) => {
        try {
            const { pid } = req.params
            const user = req.user;
            const {title, description, thumbnail, price, stock, code, category, download} = req.body
            const product = await productService.getProduct(pid)
            if(!product){
                req.logger.error("No se ah encontrado el producto")
                res.status(404).send({
                    status: "Error",
                    message: "Error al encontrar el producto"
                });
                return
            }
            if(!title || !description || !price || !thumbnail || !code || !stock || !category || !download){
                req.logger.error("No se ah ingresado todos los datos, no se actualizó el producto")
            }
            let prodToRemplace = {
                title: title,
                description: description,
                price: price,
                thumbnail: thumbnail,
                code: code,
                stock: stock,
                category: category,
                download: download
            }
            if(user.role === "admin" || user.role === "premium" && product.username === user.username){
                let result = await productService.update(pid, prodToRemplace)
                req.logger.info("Se modifico el producto", result)
                res.status(200).send({
                    status: "success",
                    message: "Se actualizó el producto correctamente"
                })
            } else {
                req.logger.error("No tienes los permisos necesarios para realizar esta acción")
                res.status(400).send({
                    status: "Error",
                    message: "No tienes los permisos para realizar esta acción"
                });
                return
            };
        } catch (error) {
            req.logger.error('Error al actualizar producto', error);
        }
    
}

deleteProduct = async (req, res) => {
    try {
        const user = req.user;
        let { pid } = req.params;
        const product = await productService.getProduct(pid)
        console.log("Producto a eliminar: ", product, ", Creado por: ",product.owner.username)
        if(product.owner.username === user.username || user.role === "admin"){
            if(user.role !== "premium" || user.role !== "admin"){
                req.logger.error("No tienes los permisos necesarios para realizar esta acción")
                res.status(400).send({
                    status: "Error",
                    message: "No tienes la autorización para realizar esta acción"
                });
                return
            };
            if(!product){
                req.logger.error("El producto no existe")
                res.status(404).send({
                    status: "error",
                    message: "El producto que quieres eliminar no existe"
                });
                return
            };
            sendEmailDeleteProduct(product.owner.username, "Producto Eliminado", product.owner.first_name, product.title, user.username)
            let result = await productService.deleteProduct(pid)
            req.logger.info("Producto eliminado correctamente", result)
            res.send({
                status: "success",
                message: "Producto eliminado correctamente",
            });
        } else{
            req.logger.error("El producto no le pertenece a el usuario")
            res.status(400).send({
                status: "Error",
                message: "Solo puedes eliminar productos propios"
            });
            return
        }
    } catch (error) {
        req.logger.error('Error al borrar producto', error);
    }
}
deleteProductHandlebars = async (req, res) => {
    try {
        const user = req.user;
        let { pid } = req.params;
        const product = await productService.getProduct(pid)
        console.log("Producto a eliminar: ", product, ", Creado por: ",product.owner.username, " o ", product.owner)
        
        if(product.owner.username === user.username || product.owner === "admin" || user.role === "admin"){
            if(!product){
                req.logger.error("El producto no existe")
                res.status(404).send({
                    status: "error",
                    message: "El producto que quieres eliminar no existe"
                });
                return
            };
            /* sendEmailDeleteProduct(product.owner.username, "Producto Eliminado", product.owner.first_name, product.title, user.username) */
            await productService.deleteProduct(pid)
            req.logger.info("Producto eliminado correctamente")
            res.status(200).redirect("/api/product/products");
        } else{
            req.logger.error("El producto no le pertenece a el usuario")
            res.status(400).send({
                status: "Error",
                message: "Solo puedes eliminar productos propios"
            });
            return
        }
    } catch (error) {
        req.logger.error('Error al borrar producto', error);
    }
}
}

module.exports = {ProductController}