//const { database } = require ('.database.js')
const { promises } = require('fs')
const fs = promises

class ProductManager {
    constructor(products = []) {
        this.products = products
        this.lastId = 0
        this.path = './database.json'
    }

    getProducts = async () => {
        try {
            const resp = await fs.readFile(this.path, 'utf-8')
            const productos = JSON.parse(resp)
            return productos
        } catch (error) {
            console.log(error)
        }
    }

    appendProduct = () => {
        try {
            const productJSON = JSON.stringify(this.products, null, 2)
            console.log('Escribiendo en el archivo', this.path);
            fs.writeFile(this.path, productJSON, 'utf-8')
        } catch (error) {
            console.log(error)
        }
    }

    addProduct({ title, description, price, thumbnail, code, stock }) {
        const product = {
            id: ++this.lastId,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        };

        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.error("Todos los campos son obligatorios");
            return;
        }

        if (this.getProductByCode(code)) {
            console.error("Ya existe un producto con el código ingresado");
            return;
        }


        this.products.push(product);
        // console.log("Producto agregado:", product);
        // Llamar a la función appendProduct para escribir en el archivo
        this.appendProduct()
    }

    getProductById = async (id) => {
        try {
            const productos = await this.getProducts()
            const product = productos.find((p) => p.id === id);
            return product
        } catch (error) {
            console.log(error)
        }
    }

    getProductByCode= async (code) => {
        const productos = await this.getProducts();
        return productos.find((p) => p.code === code);
    }
    

    deleteProduct = async (id) => {
        try {
            const productos = await this.getProducts()

            const productToDelete = productos.find((p) => p.id === id);
            if (!productToDelete) {
                console.error("No se encontró el producto con el id ingresado");
                return;
            }

            const productIndex = productos.findIndex((p) => p.id === id);
            productos.splice(productIndex, 1);

            await fs.writeFile(this.path, JSON.stringify(productos, null, 2), 'utf-8')
            console.log("Producto eliminado:", productToDelete);
        } catch (error) {
            console.log(error)
        }
    }

    updateProduct = async (id, obj) => {
        try {
            const productos = await this.getProducts()

            const productToUpdate = productos.find(p => p.id === id);
            if (!productToUpdate) {
                console.error("No se encontró el producto con el id ingresado");
                return;
            }

            Object.assign(productToUpdate, obj);

            await fs.writeFile(this.path, JSON.stringify(productos, null, 2), 'utf-8')
            console.log("Producto actualizado:", productToUpdate);
        } catch (error) {
            console.log(error)
        }
    }
}

const nuevoProducto = new ProductManager();
module.exports = { ProductManager };

