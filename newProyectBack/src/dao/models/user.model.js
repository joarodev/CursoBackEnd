const {model, mongoose} = require('mongoose')
const mongoosePaginate = require("mongoose-paginate-v2")

const Schema = mongoose.Schema

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
        lowercase: true, 
        unique: true, 
        required: [true, "can't be blank"],
        match: [/\S+@\S+\.\S+/, 'is invalid'], 
        index: true},
    age: { type: Number, required: true },
    password: { type: String, required: true },
    cart: { type: Schema.Types.ObjectId, ref: 'carritos' },
    role: { type: String, default: 'user' },
})

userSchema.plugin(mongoosePaginate)
const UserModel = model(collection, userSchema)

module.exports = {
    UserModel
}
