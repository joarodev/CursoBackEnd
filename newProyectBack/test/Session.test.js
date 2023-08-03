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

})