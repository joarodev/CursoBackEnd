const {Router} = require('express')
const  {uploader} = require('../multer')
const ProductManager = require('../manager/productsManager')

const routerProd = Router()
const productsList = new ProductManager('./src/products.json')
const notFound = { status: 'error', error: "Producto no encontrado" }


routerProd.get("/", async (req, res) => {
    try {
        const limit = req.query.limit
        const products = await productsList.getProducts()
        res.status(200).send({ status:'success', payload: products })
    } catch (error) {
        return []
    }
})
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
routerProd.post("/", async (req, res) => {
    try {
        const product = req.body
        const addedProduct = await productsList.addProduct(product)
        !addedProduct
        ? res.status(400).send({ error: "No se pudo añadir el producto" })
        : res.status(201).send({status:'success', payload: product})
    } catch (error) {
        return {status: 'error', error}
    }
})
routerProd.put("/:pid", async (req, res) => {
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
})

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

routerProd.delete("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const removedProduct = await productsList.deleteById(parseInt(pid))
        !removedProduct
        ? res.status(404).send(notFound)
        : res.status(200).send({ status:'success', message:'product removed' })
    } catch (error) {
        return {status: 'error', error}
    }
})

module.exports = routerProd