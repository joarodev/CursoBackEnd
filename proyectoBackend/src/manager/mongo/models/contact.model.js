const { Schema, model} = require("mongoose")

const ContactCollection = "contact"

const ContactSchema = Schema({
    first_name: {
        type: String,
        required
    },

    last_name: {
        type: String,
        required
    },

    active: Boolean,

    phone: String
})

let ContactModel = ContactSchema

module.exports = {ContactModel}