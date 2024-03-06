import { Listener, OrderCreatedEvent, Subjects } from "@inbaltickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const dealy = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log('Waiting this many milliseconds to proccess the job:', dealy);
    
    await expirationQueue.add({
      orderId: data.id
    }, {
      delay: dealy
    });

    msg.ack();
  }
}