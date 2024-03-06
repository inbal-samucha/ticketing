import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { Order, OrderStatus } from "./order";

interface TicketAttrs {
  id: string;
  title: string;
  price: number;
}

export interface TicketDoc extends mongoose.Document{
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc>{
  build(attrs: TicketAttrs): TicketDoc;
  findByEvent(event: { id: string, version: number}): Promise<TicketDoc | null>;
}

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
},{
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
});
ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket({ 
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price
  });
};

ticketSchema.statics.findByEvent = (event: { id: string, version: number}) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1
  });
};

ticketSchema.methods.isReserved = async function() {
  //this === the ticket that we just called 'isReserved' on
  const existingOrder = await Order.findOne({
    ticket: this, 
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete
      ]
    }
  });

  return !!existingOrder; // !! === if existing order equal to null he will be flip to true in the first '!' and flip back to false in second '!', and if existing order equal to define he will be flip to false in the first '!' and flip back to true in second '!'
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };