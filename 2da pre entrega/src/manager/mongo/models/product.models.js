const { Schema, model } = require("mongoose")

const collection = "products"

const productSchema = new Schema({

    title: String,
    description: String,
    price: Number,
    thumbnail: String,
    code: String,
    stock: Number,
    category: String,

})

const productModel = model(collection, productSchema)

module.exports = { productModel }