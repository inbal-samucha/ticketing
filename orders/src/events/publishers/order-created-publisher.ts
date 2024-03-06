import { OrderCreatedEvent, Publisher, Subjects } from "@inbaltickets/common";


export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}