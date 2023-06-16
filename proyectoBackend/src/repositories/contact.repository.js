const { ContactDto } = require("../dto/contact.dto")

class ContactRepository {
    constructor(){
        this.dao = dao1
    }

    getContact = async ()=>{
        let result = await this.dao.get()
        return result
    }
    createContact = async ()=>{
        let contactToInsert = new ContactDto(newContact)
        
    }
}

module.exports = {ContactRepository}