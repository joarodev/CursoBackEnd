const ProductManager = require("../manager/archivo/productsManager")

const productManager = new ProductManager()

products = []
const socketProduct = async (io) =>{
    const products = await productManager.getProducts()

    io.on("connection", socket =>{
        console.log("cliente conectado")
        socket.emit("products", products)

        socket.on("addProduct", data =>{
            productManager.addProduct(data)
        })

    })
}

module.exports = {socketProduct}