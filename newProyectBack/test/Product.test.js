const mongoose = require("mongoose")
const ProductDao = require("../src/dao/mongo/product.mongo")
const Assert = require("assert")


mongoose.connect("mongodb+srv://joarodDB:JoaRodDB3333@cluster0.rmh4eh5.mongodb.net/productsApp?retryWrites=true&w=majority")
const assert = Assert.strict

describe("Testing de products", ()=>{
    before(function(){
        this.productDao = new ProductDao()
    })
    beforeEach(function(){
        // mongoose.connection.collections.users.drop()
        this.timeout(15000)
    })
    //Traer los productos
    it("El dao debe traer los productos de la base de datos", async function(){
        const result = await this.productDao.get()
        console.log("Test get:", result)
        assert.strictEqual(Array.isArray(result), true)
    })
    //traer un producto
    it('El dao debe traer un producto de la base de datos', async function(){
        const _id = "6462bac96761df59fba0c7c4"
        const result = await this.productDao.getById(_id)
        console.log("Test getById",result)
        assert.strictEqual(typeof result, "object")
    })
    //Crear un producto
    it('El dao debe crear un producto en base de datos', async function(){
        let productMock = {
            title: 'iphone test',
            description: 'iphone creado con el test mocha',
            thumbnail: '',
            price: 1,
            stock: 10,
            category: "Phone",
            code: "a17328471s",
            owner: "admin"
        }

        const result = await this.productDao.create(productMock)

        const product = await this.productDao.getById({code: result.code})
        console.log("Test create product test", product)
        assert.strictEqual(typeof product, 'object')
    })
    // modificar producto
    it('El dao debe modificar un producto correctamente de la DB', async function(){
            const _id = '6462bac96761df59fba0c7c4'
            let productUpdate = {
                title: 'iphone 7 plus'
            }
            const result = await this.productDao.update(_id, productUpdate)
            const product = await this.productDao.getById(_id)
            console.log("test modificar un producto de la base de datos", product)
            assert.strictEqual(product.title, productUpdate.title)
        })
        it('El dao debe eliminar un usuario correctamente de la DB', async function(){
                const _id = '6462bade6761df59fba0c7c6'
                const result = await this.productDao.delete(_id)
                assert.strictEqual(typeof result, 'object')
            })
})