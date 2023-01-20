import EventInterface from "../../@shared/event.interface";

export default class CustomerAddressChangedEvent implements EventInterface {
  dataTimeOccurred: Date;
  eventData: {id: string, name: string, address: string};

  constructor(eventData: {id: string, name: string, address: string}) {
    this.dataTimeOccurred = new Date();
    this.eventData = eventData;
  }
}
