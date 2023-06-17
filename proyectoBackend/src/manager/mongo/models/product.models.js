const { Schema, model } = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const collection = 'products'

const productSchema = new Schema({
    title: {
        type: String,
        index: true,
    },
    description: String,
    thumbnail: String,
    price: Number,
    stock: Number,
    category: String,
    code: {
        type: String,
        unique: true,
        required: true,
    },
})

productSchema.plugin(mongoosePaginate)
const productModel = model(collection, productSchema)

module.exports = { productModel }
