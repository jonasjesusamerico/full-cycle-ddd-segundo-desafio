import Order from "../../domain/entity/customer/order";
import OrderRepositoryInterface from "../../domain/entity/customer/order-repository.interface";
import OrderItem from "../../domain/entity/customer/order_item";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderModel from "../db/sequelize/model/order.model";


export default class Repository implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {
    const sequelize = OrderModel.sequelize;
    await sequelize.transaction(async (t) => {
      await OrderItemModel.destroy({
        where: { order_id: entity.id },
        transaction: t,
      });
      const items = entity.items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        product_id: item.productId,
        quantity: item.quantity,
        order_id: entity.id,
      }));
      await OrderItemModel.bulkCreate(items, { transaction: t });
      await OrderModel.update(
        { total: entity.total() },
        { where: { id: entity.id }, transaction: t }
      );
    });
  }

  async find(id: string): Promise<Order> {
    const orderModel = await OrderModel.findOne({
      where: { id: id },
      include: [{ model: OrderItemModel }],
    });

    const orderItems = orderModel.items.map(
      (orderItem) =>
        new OrderItem(
          orderItem.id,
          orderItem.name,
          orderItem.price / orderItem.quantity,
          orderItem.product_id,
          orderItem.quantity
        )
    );

    const order = new Order(orderModel.id, orderModel.customer_id, orderItems);
    return order;
  }

  async findAll(): Promise<Order[]> {
    const ordersModel = await OrderModel.findAll({
      include: [{ model: OrderItemModel }],
    });
    const orders = ordersModel.map((orderModel) => {
      const orderItems = orderModel.items.map(
        (orderItem) =>
          new OrderItem(
            orderItem.id,
            orderItem.name,
            orderItem.price / orderItem.quantity,
            orderItem.product_id,
            orderItem.quantity
          )
      );
      const order = new Order(
        orderModel.id,
        orderModel.customer_id,
        orderItems
      );
      return order;
    });
    return orders;
  }
}
