const {productService} = require("../services/index")
const {ProductModel} = require("../dao/mongo/models/product.models")

class ProductController {
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
            console.log(pid)
            let product = await productService.getById(pid)
            res.status(200).send({
                status: 'success',
                payload: product
            })
        } catch (error) {
            console.log(error)
        }
    }

    addProduct = async (req,res)=>{
        try {
            const newProduct = req.body
    
            let result = await productService.create(newProduct)
    
    
            res.status(200).send({
                status: 'success',
                payload: result
            })
        } catch (error) {
            console.log(error)
        }
    }

    updateProduct = async (req, res) => {

        const { pid } = req.params
        const modification = req.body

        if(!modification.title || !modification.description || !modification.price || !modification.thumbnail || !modification.code || !modification.stock || !modification.category ){
            return res.status(400).send({status:"error", mensaje: "No se han ingresado todos los datos"})
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