import EventHandlerInterface from '../../../@shared/event-handler.interface';
import CustomerCreated1Event from '../customer-created-1.event';

export default class EnviaConsoleLog1Handler1
    implements EventHandlerInterface<CustomerCreated1Event> {
    handle(event: CustomerCreated1Event): void {
        // tslint:disable-next-line:no-console
        console.log(`Esse é o primeiro console.log do evento: CustomerCreated`);
    }
}
