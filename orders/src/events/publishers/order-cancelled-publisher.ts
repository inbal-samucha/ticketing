import { OrderCancelledEvent, Publisher, Subjects } from "@inbaltickets/common";


export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}