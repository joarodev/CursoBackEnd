const { Schema, model } = require("mongoose")

const collection = "products"

const productSchema = new Schema({

    title: String,
    description: String,
    thumbnail: String,
    price: Number,
    stock: Number,
    category: String,
    code: {
        type: String,
        unique: true,
        required: true,
    }
})

const productModel = model(collection, productSchema)

module.exports = { productModel }