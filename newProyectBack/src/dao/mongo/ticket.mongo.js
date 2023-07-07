const { TicketModel } = require("../mongo/models/ticket.model");

class TicketDaoMongo{
    constructor(){
        this.product = TicketModel
    }

    async get(){
        try{
            return await this.product.find({})
        }catch(err){
            return new Error(err)
        }
    }
    async getById(tid){
        try{
            return await this.product.findOne({_id: tid})
        } catch(error){
            return new Error(error)
        }
    }
    async create(newTicket){
        try {
            return await this.product.create(newTicket)
        } catch (error) {
            return new Error(error)
        }
    }
    async update(tid, ticketToRemplace){
        try {
            await this.product.updateOne({_id: tid}, ticketToRemplace)
        } catch (error) {
            return new Error(error)
        }
    }
    async delete(tid){
        try {
            return await this.product.deleteOne({_id: tid})
        } catch (error) {
            return new Error(error)
        }
    }
}

/* class Product {
    constructor(first, last){
        
    }
} */

module.exports = TicketDaoMongo