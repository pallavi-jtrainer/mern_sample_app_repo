import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

/*
--------------------------------
ADD PRODUCT TO CART
--------------------------------
*/

export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    /* check product exists */

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    /* find cart */

    let cart = await Cart.findOne({ userId });

    /* create cart if not exists */

    if (!cart) {
      cart = new Cart({
        userId,
        items: [],
      });
    }

    /* check if product already in cart */

    const itemIndex = cart.items.findIndex(
      (item) => item.productId === productId,
    );

    if (itemIndex > -1) {
      /* increase quantity */

      cart.items[itemIndex].quantity += quantity;
    } else {
      /* add new item */

      cart.items.push({
        productId,
        quantity,
      });
    }

    await cart.save();

    res.json({
      message: "Item added to cart",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add item to cart",
    });
  }
};

/*
--------------------------------
GET USER CART
--------------------------------
*/

export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.json({
        userId,
        items: [],
      });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve cart",
    });
  }
};

/*
--------------------------------
UPDATE CART ITEM QUANTITY
--------------------------------
*/

export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;

    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId === productId,
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        message: "Product not in cart",
      });
    }

    /* update quantity */

    cart.items[itemIndex].quantity = quantity;

    await cart.save();

    res.json({
      message: "Cart updated",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update cart",
    });
  }
};

/*
--------------------------------
REMOVE ITEM FROM CART
--------------------------------
*/

export const removeCartItem = async (req, res) => {
  try {
    const userId = req.user.id;

    const productId = Number(req.params.productId);

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    /* remove product */

    cart.items = cart.items.filter((item) => item.productId !== productId);

    await cart.save();

    res.json({
      message: "Item removed from cart",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to remove item",
    });
  }
};

/*
--------------------------------
CLEAR CART
--------------------------------
*/

export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    cart.items = [];

    await cart.save();

    res.json({
      message: "Cart cleared",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to clear cart",
    });
  }
};
