const { ProductManager } = require('./ProductManager')
const express = require('express')
const app = express()

const productManager = new ProductManager
const PORT = 8080;

app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
    console.log(`Corriendo en el puerto: ${PORT}`)})

app.get('/products', async (req, res) => {
    try {
        const products = await productManager.getProducts()
        const limit = req.query.limit

        limit ? res.send(products.slice(0, limit)) : res.send( products )  
    } catch (error) {
        console.log(error)
    }
});

app.get('/products/:id', async (req, res) => {
    try {
        const params = Number(req.params.id)
        const product = await productManager.getProductById(params)
        if(product){
            res.send(product)
        } else {
            res.status(404);
            res.send({ error: "Producto no encontrado" })
        }
    } catch (error) {
        console.log(error)
    }
}); 