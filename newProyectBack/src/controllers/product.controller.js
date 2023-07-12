const {productService} = require("../services/index")
const {ProductModel} = require("../dao/mongo/models/product.models")
const { format } = require("morgan")
const mockingService = require("../utils/Faker")
const { CustomError } = require("../utils/CustomError/CustomError")
const { ModificationProductError } = require("../utils/CustomError/info")

class ProductController {

    mockingProducts = async (req, res) => {
            try {
                const products = mockingService.generateMockProducts();
                console.log(products);
                res.send({ status: 'success', payload: products });
            } catch (error) {
                console.log(error);
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
            console.log(error)
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
            console.log(error)
        }
    }

    addProduct = async (req, res, next)=>{
        try {
            const newProduct = req.body

            if(!newProduct){
                CustomError.createError({
                    name: "Add product error",
                    cause: LoginUserGitHub({
                        title: newProduct.title
                    }),
                    message: "Product not added to cart",
                    code: EError.INVALID_TYPE_ERROR
                })
            }
    
            let result = await productService.create(newProduct)
    
    
            res.status(200).send({
                status: 'success',
                payload: result
            })
        } catch (error) {
            next(error)
        }
    }

    updateProduct = async (req, res) => {

        const { pid } = req.params
        const modification = req.body

        if(!modification.title || !modification.description || !modification.price || !modification.thumbnail || !modification.code || !modification.stock || !modification.category ){
            return res.status(400).send({status:"error", mensaje: "No se han ingresado todos los datos"})
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

        let result = await productService.update(pid, prodToRemplace)

        res.send({
            status: "success",
            payload: result,
        })
    
}

    deleteProduct = async (req, res) => {
    try {
        let { pid } = req.params;
        
        let result = await productService.delete(pid)
        res.send({
            status: "success",
            payload: result
        })
    } catch (error) {
        return {status: 'error', error}
    }
}
}

module.exports = {ProductController}