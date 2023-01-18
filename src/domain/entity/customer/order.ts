import OrderItem from "./order_item";

export default class Order {
  private _id: string;
  private _customerId: string;
  private _items: OrderItem[] = [];
  private _total: number;

  constructor(id: string, customerId: string, items: OrderItem[]) {
    this._id = id;
    this._customerId = customerId;
    this._items = items;
    this.validate();
    this._total = this.total();
  }

  updateItem(orderItem: OrderItem): void {
    this._items = this._items.map((item) =>
      item.id === orderItem.id ? orderItem : item
    );
    this.validate();
    this._total = this.total();
  }

  addItem(orderItem: OrderItem): void {
    this._items.push(orderItem);
    this.validate();
    this._total = this.total();
  }

  get id(): string {
    return this._id;
  }

  get customerId(): string {
    return this._customerId;
  }

  get items(): OrderItem[] {
    return this._items;
  }

  set items(items: OrderItem[]) {
    this._items = items;
  }

  validate(): boolean {
    if (this._id.length === 0) {
      throw new Error("Id is required");
    }
    if (this._customerId.length === 0) {
      throw new Error("Customer Id is required");
    }
    if (this._items.length === 0) {
      throw new Error("Item qtd must be greater than 0");
    }
    if (this._items.some((item) => item.quantity <= 0)) {
      throw new Error("Item quantity must be greater than 0");
    }
    return true;
  }

  total(): number {
    return this._items.reduce((acc, item) => acc + item.price, 0);
  }
}
