const { ContactModel } = require("./models/contact.model")

class ContactDaoMongo {
    constructor(){
        this.contactModel = ContactModel
    }

    get = async () => this.contactModel.find({})

    create = async () => this.contactModel.create()
}

module.exports = {ContactDaoMongo}