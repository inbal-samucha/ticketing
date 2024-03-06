import { Publisher, Subjects, ExpirationCompleteEvent } from "@inbaltickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}