const {Schema, model} = require("mongoose")
const mongoosePaginate = require ("mongoose-paginate-v2")

const collection = "carrito"

const cartSchema= new Schema({
    /* userid */
    products: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: "products"
        },
        quantity: Number,
    }]
})

cartSchema.plugin(mongoosePaginate)


const cartModel = model(collection, cartSchema);

module.exports = {
    cartModel
}