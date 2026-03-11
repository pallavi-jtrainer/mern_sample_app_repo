import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";
import generateOrderId from "../utils/generateOrderId.js";

/*
-----------------------------------------
1. CHECKOUT
Creates order from cart
-----------------------------------------
*/

export const checkout = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    let total = 0;
    let orderItems = [];

    for (const item of cart.items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      const price = product.price;

      total += price * item.quantity;

      orderItems.push({
        productId: product._id,
        productName: product.name,
        price: price,
        quantity: item.quantity,
      });
    }

    /* generate string order id */

    const orderId = generateOrderId();

    /* create order */

    const order = await Order.create({
      _id: orderId,
      userId,
      items: orderItems,
      totalAmount: total,
      status: "PLACED",
    });

    /* empty cart after checkout */

    cart.items = [];
    await cart.save();

    res.status(201).json({
      message: "Order placed successfully",
      orderId: order._id,
    });
  } catch (error) {
    res.status(500).json({
      message: "Checkout failed",
    });
  }
};

/*
-----------------------------------------
2. LIST ORDERS FOR CUSTOMER
-----------------------------------------
*/

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ userId });

    res.json({
      totalOrders: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve orders",
    });
  }
};

/*
-----------------------------------------
3. GET ORDER BY ORDER ID
-----------------------------------------
*/

export const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving order",
    });
  }
};

/*
-----------------------------------------
4. ADMIN: GET ALL ORDERS
-----------------------------------------
*/

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();

    res.json({
      totalOrders: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve orders",
    });
  }
};

/*
-----------------------------------------
5. ADMIN: UPDATE ORDER STATUS
-----------------------------------------
*/

export const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;

    const { status } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.status = status;

    await order.save();

    res.json({
      message: "Order status updated",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update order",
    });
  }
};
