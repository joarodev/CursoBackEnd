const {Schema, model} = require("mongoose")

const TicketCollection = "Tickets"

const ticketSchema = new Schema({
  code: { 
    type: String, 
    required: true, 
    unique: true 
  },
  purchase_datetime: { 
    type: Date, 
    required: true, 
    default: Date.now 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  products: {
    type: Array,
    required: true
  },
  purchaser: { 
    type: String, 
    required: true 
  },
});

const TicketModel = model(TicketCollection, ticketSchema)

module.exports = {
    TicketModel
}
