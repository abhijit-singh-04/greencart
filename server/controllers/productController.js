import { v2 as cloudinary } from "cloudinary";
import Product from "../models/Product.js";

// Add Product : /api/product/add
export const addProduct = async (req, res) => {
  try {
    let productData = JSON.parse(req.body.productData);

    const images = req.files;

    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );
    await Product.create({ ...productData, image: imagesUrl });
    return res.status(201).json({
      success: true,
      message: "Product Added",
    });
  } catch (error) {
    console.log("Error in api/product/add API : ", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get Product : /api/product/list
export const productList = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.log("Error in api/product/list API : ", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get single Product : /api/product/id
export const productById = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id)
      return res
        .status(500)
        .json({ success: false, message: "Please Provide Product id" });

    const product = await Product.findById({ _id: id });
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product Not Found" });
    res.status(200).json({ success: true, product });
  } catch (error) {
    console.log("Error in api/product/id API : ", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Change Product in Stock : /api/product/stock
export const changeStock = async (req, res) => {
  try {
    const { id, inStock } = req.body;

    // Not Sure on this method if error comes do check here
    const product = await Product.findByIdAndUpdate(id, { inStock });
    res.status(200).json({ success: true, message: "Stock Updated" });
  } catch (error) {
    console.log("Error in api/product/stock API : ", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};
