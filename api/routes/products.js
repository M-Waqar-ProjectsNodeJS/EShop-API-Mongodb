const express = require("express");
const Product = require("../models/product");
const multer = require("multer");
// File types which is allowed to upload
const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};
const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    let isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("Invalid image type in the request");
    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/");
  },
  filename: function (req, file, cb) {
    let name = `${Date.now()}_${file.originalname}`;
    cb(null, name);
  },
});

const upload = multer({
  storage: multerStorage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const productList = await Product.find();
    res.status(200).json(productList);
  } catch (error) {
    next(error);
  }
});

router.get("/:productId", async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({
        message: "Product with id not found.",
      });
    }
  } catch (error) {
    next(error);
  }
});

router.post("/", upload.single("productImage"), async (req, res, next) => {
  try {
    const file = req.file;
    if (!file)
      return res.status(400).json({ message: "Product image is required." });

    const filename = file.filename;
    const imageUrl = `${req.protocol}://${req.get("host")}/${
      file.destination
    }${filename}`;
    console.log(imageUrl);
    let newProduct = new Product({
      name: req.body.name,
      price: req.body.price,
      productImage: imageUrl,
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
});

router.delete("/", async (req, res, next) => {
  try {
    let product = await Product.findById(req.body.id);
    if (product) {
      await product.delete();
      res.status(200).json({
        message: "Product deleted successfully.",
      });
    } else {
      res.status(404).json({
        message: "Product not found.",
      });
    }
  } catch (error) {
    next(error);
  }
});

router.put("/", async (req, res, next) => {
  try {
    let product = await Product.findById(req.body.id);
    if (product) {
      product.name = req.body.name;
      product.price = req.body.price;
      await product.save();
      res.status(200).json(product);
    } else {
      res.status(404).json({
        message: "Product with id not found.",
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
