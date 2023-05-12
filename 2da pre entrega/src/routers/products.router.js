const {Router} = require('express')
const  {uploader} = require('../utils/multer')
const ProductManager = require('../manager/productsManager')
const { productModel } = require('../models/product.models')

const routerProd = Router()
const productsList = new ProductManager('./src/mockDB/products.json')
const notFound = { status: 'error', error: "Producto no encontrado" }


//mongoose---------------------------------------------------------------
routerProd.get("/", async (req, res) => {
    try {
        let products = await productModel.find()
        console.log(products)
        res.send({
            status: "success",
            payload: products
        })
    } catch (error) {
        return []
    }
})

routerProd.post("/", async (req, res) => {
    try {
        const product = req.body

        const newProduct = {
            title: product.title,
            description: product.description,
            price: product.price,
            thumbnail: product.thumbnail,
            code: product.code,
            stock: product.stock,
            category: product.category,
        }
        let result = await productModel.create(newProduct)
        res.status(200).send({result})
    } catch (error) {
        return {status: 'error', error}
    }
})

routerProd.put("/:pid", async (req, res) => {

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

        let result = await productModel.updateOne({_id: pid}, prodToRemplace)

        res.send({
            status: "success",
            payload: result,
        })
    
})

routerProd.delete("/:pid", async (req, res) => {
    try {
        let { pid } = req.params;
        
        let result = await productModel.deleteOne({_id: pid})
        res.send({
            status: "success",
            payload: result
        })
    } catch (error) {
        return {status: 'error', error}
    }
})

//mongoose---------------------------------------------------------------


/* routerProd.get("/", async (req, res) => {
    try {
        const limit = req.query.limit
        const products = await productsList.getProducts()
        res.status(200).send({ status:'success', payload: products })
    } catch (error) {
        return []
    }
}) */


routerProd.get("/:pid", async (req, res) => {
    try {
        const { pid } = req.params
        const product = await productsList.getProductById(parseInt(pid))
        !product ?
        res.status(404).send( notFound )
        :
        res.status(200).send({ status:'success', payload: product })
    } catch (error) {
        return notFound
    }
})
/* routerProd.post("/", async (req, res) => {
    try {
        const product = req.body
        const addedProduct = await productsList.addProduct(product)
        !addedProduct
        ? res.status(400).send({ error: "No se pudo añadir el producto" })
        : res.status(201).send({status:'success', payload: product})
    } catch (error) {
        return {status: 'error', error}
    }
}) */
/* routerProd.put("/:pid", async (req, res) => {
    try {
        const { pid } = req.params
        const modification = req.body
        const modifiedProduct = await productsList.updateProduct(
        parseInt(pid),
        modification
        )
        !modifiedProduct
        ? res.status(400).send({ error: `No se pudo modificar el producto` })
        : res.status(200).send({ status:'success', payload: modifiedProduct })
    } catch (error) {
        return {notFound}
    }
}) */

/* routerProd.post('/formulario', uploader.single('thumbnail'), async (req, res) => {
    try {
        const product = req.body
        const imagePath = req.file.path
        const imageName = req.file.filename
        const addedProduct = await productsList.addProduct(product, imagePath, imageName)
        !addedProduct
        ? res.status(400).send({ error: "Could not add product" })
        : res.status(201).send({status:'success', payload: addedProduct})
    } catch (error) {
        return {status: 'error', error}
    }
}) */

/* routerProd.delete("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const removedProduct = await productsList.deleteById(parseInt(pid))
        !removedProduct
        ? res.status(404).send(notFound)
        : res.status(200).send({ status:'success', message:'product removed' })
    } catch (error) {
        return {status: 'error', error}
    }
}) */

module.exports = routerProd