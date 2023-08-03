const mongoose = require("mongoose")
const cartDao = require("../src/dao/mongo/cart.mongo")
const Assert = require("assert")


mongoose.connect("mongodb+srv://joarodDB:JoaRodDB3333@cluster0.rmh4eh5.mongodb.net/productsApp?retryWrites=true&w=majority")
const assert = Assert.strict

describe("Testing de Carritos", ()=>{
    before(function(){
        this.cartDao = new cartDao()
    })
    beforeEach(function(){
        // mongoose.connection.collections.users.drop()
        this.timeout(15000)
    })
    //obtener todos los carritos
    it("el dao debe poder obtener todos los carritos", async function(){
        const result = await this.cartDao.get()
        console.log("Test obtener todos los carritos", result)
        assert.strictEqual(typeof result, "object")
    })
    //obtener un carrito
    it("el dao debe poder obtener uno de los carritos", async function(){
        const _id = "64c9c4b606d703c41d81f764"
        const result = await this.cartDao.getById({_id})
        console.log("Test obtener un carrito",result)
        assert.strictEqual(typeof result, "object")
    })
    //crear un carrito
    /* it("el dao debe poder crear un carrito", async function(){
        const uid = "64c46d99c237a26207169c75"
        const result = await this.cartDao.create(uid)
        console.log("Test crear carrito", result)
        assert.strictEqual(typeof result, "object")
    })
    //añadir un producto al carrito
    it("el dao debe añadir dos cantidades de un producto al carrito creado", async function(){
        const cid = "64c9c2833b8a0a8fcb9b160c"
        const pid = "6462baf96761df59fba0c7c8"
        const quantity = 2

        const result = await this.cartDao.addProduct(cid, pid, quantity)
        console.log("Test de añadir prodyucto al carrito", result)
        assert.strictEqual(typeof result, "object")
    })
    it("El dao debe poder borrar el producto del carrito", async function(){
        const cid = "64c9c2833b8a0a8fcb9b160c"
        const pid = "6462baf96761df59fba0c7c8"

        const result = await this.cartDao.deleteProduct(cid, pid)
        console.log("Test de borrar producto del carrito", result)
        assert.strictEqual(typeof result, "object")
    })
    it("El dao debe poder borrar el carrito", async function(){
        const cid = "64c9c2833b8a0a8fcb9b160c"

        const result = await this.cartDao.delete(cid)
        console.log("Test de borrar el carrito", result)
        assert.strictEqual(typeof result, "object")
    }) */
})