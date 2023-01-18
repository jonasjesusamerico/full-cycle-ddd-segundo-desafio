import { Sequelize } from "sequelize-typescript";
import Customer from "../../domain/entity/customer/customer";
import Order from "../../domain/entity/customer/order";
import OrderItem from "../../domain/entity/customer/order_item";
import Product from "../../domain/entity/customer/product";
import Address from "../../domain/entity/customer/value-object/address";
import CustomerModel from "../db/sequelize/model/customer.model";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderModel from "../db/sequelize/model/order.model";
import ProductModel from "../db/sequelize/model/product.model";
import CustomerRepository from "./customer.repository";

import OrderRepository from "./order.repository";
import ProductRepository from "./product.repository";

describe("Order Repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "ZIP", "City");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("1", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "i1",
      product.name,
      product.price,
      product.id,
      2
    );
    const orderRepository = new OrderRepository();
    const order = new Order("123", customer.id, [orderItem]);
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: order.id,
      customer_id: customer.id,
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          product_id: product.id,
          order_id: order.id,
        },
      ],
    });
  });

  it("should update an order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "ZIP", "City");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product1 = new Product("1", "Product 1", 10);
    await productRepository.create(product1);

    const orderItem1 = new OrderItem(
      "i1",
      product1.name,
      product1.price,
      product1.id,
      2
    );
    const orderRepository = new OrderRepository();
    const order = new Order("123", customer.id, [orderItem1]);
    await orderRepository.create(order);

    // change the item qtd and update the order item
    orderItem1.quantity = 4;
    order.updateItem(orderItem1);
    await orderRepository.update(order);

    let orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: order.id,
      customer_id: customer.id,
      total: 40,
      items: [
        {
          id: orderItem1.id,
          name: orderItem1.name,
          price: orderItem1.price,
          quantity: 4,
          product_id: product1.id,
          order_id: order.id,
        },
      ],
    });

    // add a new item
    const product2 = new Product("2", "Product 2", 20);
    await productRepository.create(product2);
    const orderItem2 = new OrderItem(
      "i2",
      product2.name,
      product2.price,
      product2.id,
      1
    );
    order.addItem(orderItem2);
    await orderRepository.update(order);

    orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: order.id,
      customer_id: customer.id,
      total: 60,
      items: [
        {
          id: orderItem1.id,
          name: orderItem1.name,
          price: orderItem1.price,
          quantity: 4,
          product_id: product1.id,
          order_id: order.id,
        },
        {
          id: orderItem2.id,
          name: orderItem2.name,
          price: orderItem2.price,
          quantity: 1,
          product_id: product2.id,
          order_id: order.id,
        },
      ],
    });
  });

  it("should find an order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "ZIP", "City");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("1", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "i1",
      product.name,
      product.price,
      product.id,
      2
    );
    const orderRepository = new OrderRepository();
    const order = new Order("o1", customer.id, [orderItem]);
    await orderRepository.create(order);

    // repository find method
    const orderResult = await orderRepository.find("o1");
    expect(order).toStrictEqual(orderResult);
  });

  it("should find all orders", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "ZIP", "City");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("1", "Product 1", 10);
    await productRepository.create(product);

    const orderItem1 = new OrderItem(
      "i1",
      product.name,
      product.price,
      product.id,
      2
    );
    const orderRepository = new OrderRepository();

    const order1 = new Order("1", customer.id, [orderItem1]);
    await orderRepository.create(order1);

    const orderItem2 = new OrderItem(
      "i2",
      product.name,
      product.price,
      product.id,
      4
    );
    const order2 = new Order("2", customer.id, [orderItem2]);
    await orderRepository.create(order2);

    const orders = await orderRepository.findAll();

    expect(orders).toHaveLength(2);
    expect(orders).toContainEqual(order1);
    expect(orders).toContainEqual(order2);
  });
});
