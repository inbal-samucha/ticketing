import { Subjects, Publisher, PaymentCreatedEvent } from "@inbaltickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}