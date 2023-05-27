const {Schema, model} = require('mongoose')
const mongoosePaginate = require("mongoose-paginate-v2")

const collection = 'usuarios'

const userSchema = new Schema({
    username: String,
    first_name: {
        type: String,
        index: true
    },
    last_name: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: String,
    role: {
        type: String,
        enum: "user"
    }
})

userSchema.plugin(mongoosePaginate)
const userModel = model(collection, userSchema)

module.exports = {
    userModel
}
