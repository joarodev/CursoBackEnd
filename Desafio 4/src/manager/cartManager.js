const fs = require('fs')

class CartManager {
    constructor(doc) {
        this.doc = doc;
    }

    exists(doc) {
        try {
            if (!fs.existsSync(doc)) {
                throw new Error("El documento no existe");
            } else {
                return true;
            }
        } catch (error) {
            console.log(`Error al leer el documento ${error.message}`);
        }
    }

    readFile = async (doc) => {
        try {
            const data = await fs.promises.readFile(doc);
            return JSON.parse(data);
        } catch (error) {
            console.log(`Error reading the file: ${error.message}`)
        }
    }

    writeFile = async (data) => {
        try {
            await fs.promises.writeFile(
                this.doc, JSON.stringify(data, null, 2)
                )
            }catch(err) {
            console.log(err);
            }
        }

    createCart = async () => {
        try {
            if (!this.exists(this.doc)) {
                let cartsArray = []
                const cart = {
                    id: this.#idGen(),
                    products: [],
                };
                cartsArray.push(cart)
                await this.writeFile(cartsArray)
                console.log(`Se generó el id: ${cart.id}`)
                return cart.id
            } else {
                if (this.readFile(this.doc)) {
                const cartsArray = await this.readFile(this.doc)
                if (cartsArray.length === 0 || !cartsArray) {
                    const cart = {
                        id: this.#idGen(),
                        products: [],
                    };
                    cartsArray.push(cart);
                } else {
                    const cart = {
                        id: this.#idGen(cartsArray),
                        products: [],
                    };
                    cartsArray.push(cart);
                }
                await this.writeFile(cartsArray);
                console.log(`Se generó el id: ${cart.id}`);
                return carts;
            }
        }
        } catch (error) {
        console.log(`Error ${error.message}`);
        }
    }

    getCartById = async (id) => {
        try {
            if(this.exists(this.doc)){
                let carts = await this.readFile(this.doc)
                const cart = carts.find(item => item.id === id)
                return cart ? cart : console.log('El producto no existe')
        }
        return console.log('la db no existe')
        } catch (error) {
            console.log(error);
        }
    }

    addToCart = async (cid, pid) => {
        try {
            if(this.exists(this.doc)) {
                const carts = await this.readFile(this.doc)
                const cart = carts.find(item => item.id === cid)
                console.log(cart);
            if(cart) {
                const addProduct = cart.products.find(item => item.id === pid)
                if(addProduct) {
                    addProduct.quantity++
                }else{
                    cart.products.push({id: pid, quantity: 1 })
                }
                await this.writeFile(carts)
                return cart
            }
            throw new Error(`No se a podido añadir al carrito ${cid}`)
        }
        } catch (error) {
            console.log(error);
        }
    }

    #idGen(productsArray = []) {
        const id =
        productsArray.length === 0
            ? 1
            : productsArray[productsArray.length - 1].id + 1;
        return id;
    }
}

module.exports = CartManager