import CustomerAddressChangedEvent from "../costumer/event/customer-address-changed.event";
import CustomerCreated1Event from "../costumer/event/customer-created-1.event";
import CustomerCreated2Event from "../costumer/event/customer-created-2.event";
import LogWhenCustomerAddressChanged from "../costumer/event/handler/log-when-customer-address-changed";
import EnviaConsoleLogHandler1 from "../costumer/event/handler/log-when-customer-created-1";
import EnviaConsoleLogHandler2 from "../costumer/event/handler/log-when-customer-created-2";
import EventDispatcher from "./event-dispatcher";


describe("Domain events tests", () => {
  enum eventName {
    CustomerCreated1Event = 'CustomerCreated1Event',
    CustomerCreated2Event = 'CustomerCreated2Event',
    CustomerAddressChangedEvent = 'CustomerAddressChangedEvent'
  }
  
  it("should notify all event handlers", () => {
    const eventDispatcher = new EventDispatcher();

    const eventHandlerCustomerCreated1 = new EnviaConsoleLogHandler1();
    const eventHandlerCustomerCreated2 = new EnviaConsoleLogHandler2();
    const eventHandlerCustomerAddressChanged2 = new LogWhenCustomerAddressChanged();

    const spyEventHandler1 = jest.spyOn(eventHandlerCustomerCreated1, "handle");
    const spyEventHandler2 = jest.spyOn(eventHandlerCustomerCreated2, "handle");
    const spyEventHandler3 = jest.spyOn(eventHandlerCustomerAddressChanged2, "handle");

    eventDispatcher.register(eventName.CustomerCreated1Event, eventHandlerCustomerCreated1);
    eventDispatcher.register(eventName.CustomerCreated2Event, eventHandlerCustomerCreated2);
    eventDispatcher.register(eventName.CustomerAddressChangedEvent, eventHandlerCustomerAddressChanged2);

    expect(eventDispatcher.getEventHandlers[eventName.CustomerCreated1Event][0]).toMatchObject(eventHandlerCustomerCreated1);
    expect(eventDispatcher.getEventHandlers[eventName.CustomerCreated2Event][0]).toMatchObject(eventHandlerCustomerCreated2);
    expect(eventDispatcher.getEventHandlers[eventName.CustomerAddressChangedEvent][0]).toMatchObject(eventHandlerCustomerAddressChanged2);

    const customerCreated1Event = new CustomerCreated1Event(null);
    const customerCreated2Event = new CustomerCreated2Event(null);
    const customerAddressChangedEvent = new CustomerAddressChangedEvent({
      name: 'Jocando Nascimento',
      address: 'Av. Zacarias, 2345',
      id: '109478'
    });

    eventDispatcher.notify(customerCreated1Event);
    eventDispatcher.notify(customerCreated2Event);
    eventDispatcher.notify(customerAddressChangedEvent);

    expect(spyEventHandler1).toHaveBeenCalled();
    expect(spyEventHandler2).toHaveBeenCalled();
    expect(spyEventHandler3).toHaveBeenCalled();
  });

  it("should unregister all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandlerCustomerCreated1 = new EnviaConsoleLogHandler1();
    const eventHandlerCustomerCreated2 = new EnviaConsoleLogHandler2();
    const eventHandlerCustomerAddressChanged2 = new LogWhenCustomerAddressChanged();

    eventDispatcher.register(eventName.CustomerCreated1Event, eventHandlerCustomerCreated1);
    eventDispatcher.register(eventName.CustomerCreated2Event, eventHandlerCustomerCreated2);
    eventDispatcher.register(eventName.CustomerAddressChangedEvent, eventHandlerCustomerAddressChanged2);

    expect(eventDispatcher.getEventHandlers[eventName.CustomerCreated1Event]).toMatchObject(eventHandlerCustomerCreated1);
    expect(eventDispatcher.getEventHandlers[eventName.CustomerCreated2Event]).toMatchObject(eventHandlerCustomerCreated2);
    expect(eventDispatcher.getEventHandlers[eventName.CustomerAddressChangedEvent]).toMatchObject(eventHandlerCustomerAddressChanged2);

    eventDispatcher.unregisterAll();

    expect(eventDispatcher.getEventHandlers[eventName.CustomerCreated1Event]).toBeUndefined();
    expect(eventDispatcher.getEventHandlers[eventName.CustomerCreated2Event]).toBeUndefined();
    expect(eventDispatcher.getEventHandlers[eventName.CustomerAddressChangedEvent]).toBeUndefined();
  });

  it("should unregister an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandlerCustomerCreated1 = new EnviaConsoleLogHandler1();
    const eventHandlerCustomerCreated2 = new EnviaConsoleLogHandler2();
    const eventHandlerCustomerAddressChanged2 = new LogWhenCustomerAddressChanged();

    eventDispatcher.register(eventName.CustomerCreated1Event, eventHandlerCustomerCreated1);
    eventDispatcher.register(eventName.CustomerCreated2Event, eventHandlerCustomerCreated2);
    eventDispatcher.register(eventName.CustomerAddressChangedEvent, eventHandlerCustomerAddressChanged2);

    expect(eventDispatcher.getEventHandlers[eventName.CustomerCreated1Event][0]).toMatchObject(eventHandlerCustomerCreated1);
    expect(eventDispatcher.getEventHandlers[eventName.CustomerCreated2Event][0]).toMatchObject(eventHandlerCustomerCreated2);
    expect(eventDispatcher.getEventHandlers[eventName.CustomerAddressChangedEvent][0]).toMatchObject(eventHandlerCustomerAddressChanged2);

    eventDispatcher.unregister(eventName.CustomerCreated1Event, eventHandlerCustomerCreated1);
    eventDispatcher.unregister(eventName.CustomerCreated2Event, eventHandlerCustomerCreated2);
    eventDispatcher.unregister(eventName.CustomerAddressChangedEvent, eventHandlerCustomerAddressChanged2);

    expect(eventDispatcher.getEventHandlers[eventName.CustomerCreated1Event]).toBeDefined();
    expect(eventDispatcher.getEventHandlers[eventName.CustomerCreated1Event].length).toBe(0);

    expect(eventDispatcher.getEventHandlers[eventName.CustomerCreated2Event]).toBeDefined();
    expect(eventDispatcher.getEventHandlers[eventName.CustomerCreated2Event].length).toBe(0);

    expect(eventDispatcher.getEventHandlers[eventName.CustomerAddressChangedEvent]).toBeDefined();
    expect(eventDispatcher.getEventHandlers[eventName.CustomerAddressChangedEvent].length).toBe(0);
  });



  it("should register an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandlerCustomerCreated1 = new EnviaConsoleLogHandler1();
    const eventHandlerCustomerCreated2 = new EnviaConsoleLogHandler2();
    const eventHandlerCustomerAddressChanged2 = new LogWhenCustomerAddressChanged();

    eventDispatcher.register(eventName.CustomerCreated1Event, eventHandlerCustomerCreated1);
    eventDispatcher.register(eventName.CustomerCreated2Event, eventHandlerCustomerCreated2);
    eventDispatcher.register(eventName.CustomerAddressChangedEvent, eventHandlerCustomerAddressChanged2);

    expect(eventDispatcher.getEventHandlers[eventName.CustomerCreated1Event]).toBeDefined();
    expect(eventDispatcher.getEventHandlers[eventName.CustomerCreated1Event].length).toBe(1);
    expect(eventDispatcher.getEventHandlers[eventName.CustomerCreated1Event][0]).toMatchObject(eventHandlerCustomerCreated1);

    expect(eventDispatcher.getEventHandlers[eventName.CustomerCreated2Event]).toBeDefined();
    expect(eventDispatcher.getEventHandlers[eventName.CustomerCreated2Event].length).toBe(1);
    expect(eventDispatcher.getEventHandlers[eventName.CustomerCreated2Event][0]).toMatchObject(eventHandlerCustomerCreated2);

    expect(eventDispatcher.getEventHandlers[eventName.CustomerAddressChangedEvent]).toBeDefined();
    expect(eventDispatcher.getEventHandlers[eventName.CustomerAddressChangedEvent].length).toBe(1);
    expect(eventDispatcher.getEventHandlers[eventName.CustomerAddressChangedEvent][0]).toMatchObject(eventHandlerCustomerAddressChanged2);
  });
  


});
