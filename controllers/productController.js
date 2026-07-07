const connectToCloudinary = require("../config/cloudinary");
const { cloudinary } = require("../config/cloudinary");
const productModel = require("../models/productModel");

//function for add products
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
    } = req.body;

    const imageUrls = [];
    for (let i = 1; i <= 4; i++) {
      if (req.files[`image${i}`]) {
        const result = await cloudinary.uploader.upload(
          req.files[`image${i}`][0].path,
          { folder: "products" },
        );
        imageUrls.push(result.secure_url);
      }
    }

    const newProduct = new productModel({
      name,
      description,
      price: Number(price),
      imageUrl: imageUrls,
      category,
      subCategory,
      sizes: JSON.parse(sizes),
      bestseller: bestseller === "true",
      date: Date.now(),
    });

    await newProduct.save();

    console.log("Product added successfully:", newProduct);
    for (let i = 0; i < imageUrls.length; i++) {
      console.log(`Image ${i + 1} URL:`, imageUrls[i]);
    }

    res
      .status(201)
      .json({ success: true, message: "Product added successfully" });
  } catch (error) {
    console.error("Error in adding product:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//function for list products
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("Error in listing products:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//function for removing products
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res
      .status(200)
      .json({ success: true, message: "Product removed successfully" });
  } catch (error) {
    console.error("Error in removing product:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//function for single product
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await productModel.findById(productId);
    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error("Error in fetching single product:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// function for update product
const updateProduct = async (req, res) => {
  try {
    const {
      id,
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
    } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product id is required",
      });
    }

    const updateData = {
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      sizes: JSON.parse(sizes),
      bestseller: bestseller === "true" ? true : false,
    };

    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true },
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error in updating product:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addProduct,
  listProducts,
  removeProduct,
  singleProduct,
  updateProduct,
};
