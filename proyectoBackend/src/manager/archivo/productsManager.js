const fs = require('fs')

const path = "./src/mockDB/products.json"

class ProductManager {
    constructor() {
        this.path = path
        this.products = []
        this.productCount = 0
    }
    writeFile = async data => {
        try {
            await fs.promises.writeFile(
                this.path, JSON.stringify(data, null, 2)
                )
            }catch(err) {
            console.log(err);
            }
        }
        async readFile() {
            try {
                const data = await fs.promises.readFile(this.path, 'utf-8')
                
                return JSON.parse(data)            
            } catch (error) {
                return []
            }
            
        }
    
        getProducts = async() =>{
            try {
                return await this.readFile()
            } catch (error) {
                return 'No se hay productos'
            }
        }
    
    
    addProduct = async (product) => {
        try {
            console.log("producto agregado:", product);
            let products = await this.getProducts()
            let newId
            let newCode = products.find(prod => prod.code === product.code)

            if (newCode) return console.log(`Ya hay un producto con el codigo ${newCode}`)
            products.length === 0 ? newId = 1 : newId = products[products.length - 1 ].id + 1
            if(Object.values(product).every(value => value)){
                product.status === "true" ? product.status = true : product.status = false
                const newProduct = {...product, id: newId}
                products.push(newProduct)
                await this.writeFile(products)
                return this.getProducts()
            }
            return console.log('Todos los campos son requeridos')
        } catch (error) {
            console.log(error);
        }
    }
    updateProduct = async (id, data) => {
        try {
            const productos = await this.getProducts()
            Object.assign(productos[id-1], data)
            await this.writeFile(productos)
        } catch (error) {
            console.log(error);
        }
    }
    getProductById = async (id) => {
        try {
            let products = await this.getProducts()
            const product = products.find(prod => prod.id === id)
            return product ? product : console.log('No se encuentra el producto')
        } catch (error) {
            console.log(error);
        }
    }
    deleteById = async (id) => {
        try {
            let products = await this.getProducts()
            const obj = products.filter(obj => obj.id !== id)
            await this.writeFile(obj);
            return console.log('Producto eliminado');
        } catch (error) {
            console.log(error);
        }
    }
}
module.exports = ProductManager