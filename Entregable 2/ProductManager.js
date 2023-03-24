const fs = require('fs');

class ProductManager {
    constructor(path) {
    this.path = path;
}

    async addProduct(product) {
        const products = await this.getProducts();
        const lastId = products.length > 0 ? products[products.length - 1].id : 0;
        const nuevoProducto = { id: lastId + 1, ...product };
        products.push(nuevoProducto);
        await this.saveProducts(products);
        return nuevoProducto;
    }

    async getProducts() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
        if (error.code === 'ENOENT') { //Indica que no se pudo encontrar el archivo o directorio
            return [];
        } else {
            return error;
        }
        }
    }

    async getProductById(id) {
        const products = await this.getProducts();
        const product = products.find((p) => p.id === id);
    if (!product) {
        throw new Error('Not found');
    }
    return product;
    }

    async updateProduct(id, update) {
        const products = await this.getProducts();
        const index = products.findIndex((p) => p.id === id);
    if (index === -1) {
        throw new Error('Producto no encontrado');
    }
    const updatedProduct = { id, ...update };
    products[index] = updatedProduct;
    await this.saveProducts(products);
    return updatedProduct;
    }

    async deleteProduct(id) {
        const products = await this.getProducts();
        const index = products.findIndex((p) => p.id === id);
    if (index === -1) {
        throw new Error('Producto no encontrado');
    }
        products.splice(index, 1);
        await this.saveProducts(products);
    }

    async saveProducts(products) {
        const data = JSON.stringify(products, null, 2);
        await fs.promises.writeFile(this.path, data);
    }
}

//TESTING DE ENTREGABLE nº2

//1-Se creará una instancia de la clase ProductManager

const Manager = new ProductManager('products.json');

//2-Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío
Manager.getProducts().then((productos) => {
    console.log("Productos:",productos)
})
.catch((error) => {
    console.error(error);
});

//3-Se llamará al método “addProduct”

Manager.addProduct({
    title: 'Producto prueba',
    description: 'Este es un producto prueba',
    price: 200,
    thumbnail: 'Sin imagen',
    code: 'abc123',
    stock: 25,
}).then(() => {
    console.log("producto agregado correctamente");
    //4-Se llamará “getProducts” y debe aparecer el producto recién agregado
    Manager.getProducts().then((productos) => {
        console.log("Productos:",productos)

        //5-Se llamará al método “getProductById” y se corroborará que devuelva el producto con el id especificado
        Manager.getProductById(1).then((product) => {
            console.log(`Producto con id ${1}:`,product)

            //6-Se llamará al método “updateProduct” y se intentará cambiar un campo de algún producto
            Manager.updateProduct(1, { 
            title: 'Producto Actualizado',
            description: 'Este es un producto prueba Actualizado',
            price: 1,
            thumbnail: 'Sin imagen',
            code: 'abc123',
            stock: 15, })
            .then(() => {
                console.log('Producto actualizado correctamente');

                //7-Creo un segundo producto para poder eliminar el primero
                Manager.addProduct({
                    title: 'Producto prueba 2',
                    description: 'Este es un producto prueba 2',
                    price: 200,
                    thumbnail: 'Sin imagen',
                    code: 'abc123',
                    stock: 30,
                }).then(() => {
                    console.log("producto agregado correctamente");
                    Manager.deleteProduct(1).then(() =>{
                        console.log("Producto eliminado correctamente");
                        //8-Chequeamos que tengamos unicamente el 2do producto
                        Manager.getProducts().then((products) => {console.log("Productos:",products)})
                    }).catch((error)=>{console.error(error)})
                })
                .catch((error) => {
                    console.error(error)
                })
            })
            .catch((error) => {
                console.error(error);
            });
        })
        .catch((error) =>{
            console.error(error)
        })
    })
    .catch((error) => {
        console.error(error);
    });
})
.catch((error) => {
    console.error(error);
});



