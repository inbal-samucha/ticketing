import { Publisher, Subjects, TicketUpdatedEvent } from '@inbaltickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdted = Subjects.TicketUpdted;
}