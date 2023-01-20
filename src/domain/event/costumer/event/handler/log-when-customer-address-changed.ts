import EventHandlerInterface from '../../../@shared/event-handler.interface';
import CustomerAddressChangedEvent from '../customer-address-changed.event';

export default class LogWhenCustomerAddressChanged
    implements EventHandlerInterface<CustomerAddressChangedEvent> {
    handle(event: CustomerAddressChangedEvent): void {
        const {id, name: nome, address: endereco} = event.eventData;
        // tslint:disable-next-line:no-console
        console.log(`Endereço do cliente: ${id}, ${nome} alterado para: ${endereco}`);
    }
}
