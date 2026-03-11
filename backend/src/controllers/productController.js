import Product from "../models/Product.js";

/*
--------------------------------
CREATE PRODUCT (ADMIN)
--------------------------------
*/

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, image } = req.body;

    const lastProduct = await Product.findOne().sort({ _id: -1 });
    let newId = 2001;

    if (!lastProduct) {
      return res.status(500).json({
        message:
          "Empty Products Data. Please add a product with _id 2001 first.",
      });
    }
    newId = lastProduct ? lastProduct._id + 1 : 1;

    const product = await Product.create({
      _id: newId,
      name,
      description,
      price,
      stock,
      image,
    });

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create product",
    });
  }
};

/*
--------------------------------
GET ALL PRODUCTS
Public (Guest/Customer/Admin)
--------------------------------
*/
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true });

    res.json({
      totalProducts: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve products",
    });
  }
};

/*
--------------------------------
GET PRODUCT BY ID
--------------------------------
*/
export const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving product",
    });
  }
};

/*
--------------------------------
UPDATE PRODUCT (ADMIN)
--------------------------------
*/
export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      req.body,
      { new: true },
    );

    if (!updatedProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Product updated successfully",
      updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update product",
    });
  }
};

/*
--------------------------------
DELETE PRODUCT (ADMIN)
--------------------------------
*/
export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete product",
    });
  }
};

/*
--------------------------------
ACTIVATE / DEACTIVATE PRODUCT
(ADMIN)
--------------------------------
*/
export const toggleProductStatus = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    product.isActive = !product.isActive;

    await product.save();

    res.json({
      message: "Product status updated",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update product status",
    });
  }
};
