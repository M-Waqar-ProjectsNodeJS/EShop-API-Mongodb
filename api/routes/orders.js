const express = require("express");
const Order = require("../models/order");
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const orderList = await Order.find().populate("product", "name");
    res.status(200).json(orderList);
  } catch (error) {
    next(error);
  }
});

router.get("/:orderId", async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId).populate("product");
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({
        message: "Oder with id not found.",
      });
    }
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    let order = new Order({
      quantity: req.body.quantity,
      product: req.body.product,
    });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
});

router.delete("/", async (req, res, next) => {
  try {
    let order = await Order.findById(req.body.id);
    if (order) {
      await order.delete();
      res.status(200).json({
        message: "Order deleted successfully.",
      });
    } else {
      res.status(404).json({
        message: "Order not found.",
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
