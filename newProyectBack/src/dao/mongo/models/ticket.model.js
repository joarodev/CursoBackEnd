const {Schema, model} = require("mongoose")

const TicketCollection = "Tickets"

const Schema = mongoose.Schema;

const ticketSchema = new Schema({
  code: { type: String, required: true, unique: true },
  purchase_datetime: { type: Date, required: true, default: Date.now },
  amount: { type: Number, required: true },
  purchaser: { type: String, required: true },
});

const TicketModel = model(TicketCollection, ticketSchema)

module.exports = {
    TicketModel
}
